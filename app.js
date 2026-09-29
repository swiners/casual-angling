// Casual Angling — a personal record of good fishing spots around Melbourne.
// Built-in spots come from spots.js; spots you add, and your marks/notes, live in localStorage
// in this browser only. Export/Import moves them between devices or to a mate.
(() => {
  const CFG = window.CASUAL_ANGLING_CONFIG || {};
  const STORE = 'troutHud.v1'; // original key kept so marks saved in v1 carry over
  const $ = id => document.getElementById(id);

  // Escape anything user-supplied (or imported) before it goes near innerHTML.
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = m => (m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m` : `${m}m`);
  const today = () => new Date().toISOString().slice(0, 10);

  const RANGES = [75, 90, 120, 150];  // one-tap drive limits, minutes

  // ---------- Persistence ----------
  const saved = (() => { try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch { return {}; } })();
  const state = {
    budget: RANGES.includes(saved.budget) ? saved.budget : null,  // null = any distance
    mode: saved.mode === 'all' ? 'all' : 'groups',
    rings: saved.showRange === true,   // drive-range overlay is opt-in (new key, so older 'on' settings reset)
    filters: { want: false, fished: false },
    q: '',
    marks: migrateMarks(saved.marks || {}),
    custom: Array.isArray(saved.custom) ? saved.custom.map(cleanSpot).filter(Boolean) : [],
    active: null,
    adding: false, draft: null, editingId: null,
  };
  const persist = () => localStorage.setItem(STORE, JSON.stringify({
    budget: state.budget, mode: state.mode, showRange: state.rings, marks: state.marks, custom: state.custom,
  }));

  function clampInt(v, lo, hi, dflt) { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : dflt; }

  // v1 stored { status: 'want'|'fished', note }. v2 keeps want/fished as independent flags.
  function migrateMarks(m) {
    const out = {};
    for (const [id, v] of Object.entries(m)) {
      if (!v || typeof v !== 'object') continue;
      out[id] = {
        want: v.want === true || v.status === 'want',
        fished: v.fished === true || v.status === 'fished',
        note: typeof v.note === 'string' ? v.note.slice(0, 2000) : '',
        last: /^\d{4}-\d{2}-\d{2}$/.test(v.last || '') ? v.last : '',
      };
    }
    return out;
  }

  // Validate a user-added or imported spot. Anything malformed is dropped, never rendered raw.
  function cleanSpot(s) {
    if (!s || typeof s !== 'object') return null;
    const lat = Number(s.lat), lng = Number(s.lng);
    const name = typeof s.name === 'string' ? s.name.trim().slice(0, 80) : '';
    if (!name || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
    return {
      id: typeof s.id === 'string' && /^u-[a-z0-9]+$/.test(s.id) ? s.id : `u-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      name, lat, lng,
      waterName: typeof s.waterName === 'string' ? s.waterName.trim().slice(0, 60) : '',
      kind: KINDS[s.kind] ? s.kind : 'river',
      drive: s.drive === '' || s.drive == null ? null : clampInt(s.drive, 5, 900, null),
      note: typeof s.note === 'string' ? s.note.slice(0, 1000) : '',
      tags: Array.isArray(s.tags) ? s.tags.filter(t => typeof t === 'string').map(t => t.trim().slice(0, 30)).filter(Boolean).slice(0, 10) : [],
    };
  }

  const KINDS = { river: 'River / stream', lake: 'Lake / reservoir', beach: 'Beach / surf', bay: 'Bay / pier', estuary: 'Estuary' };
  const CUSTOM_COLOURS = ['#0f766e', '#b45309', '#7c3aed', '#be123c', '#0369a1', '#4d7c0f'];

  // Rough drive estimate for spots without one: crow-flies × 1.3 road factor at ~80 km/h, +10 min to get out of town.
  // Drive time from the prebuilt OSRM grid (drive-grid.js), bilinear between cells. null if off-road/sea/out of range.
  const G = window.DRIVE_GRID;
  function sampleGrid(lat, lng) {
    if (!G || lat > G.north || lat < G.south || lng < G.west || lng > G.east) return null;
    const r = (G.north - lat) / ((G.north - G.south) / (G.rows - 1));
    const c = (lng - G.west) / ((G.east - G.west) / (G.cols - 1));
    const r0 = Math.min(G.rows - 2, Math.floor(r)), c0 = Math.min(G.cols - 2, Math.floor(c)), fr = r - r0, fc = c - c0;
    const v = (i, j) => G.data[(r0 + i) * G.cols + (c0 + j)];
    const a = v(0, 0), b = v(0, 1), d = v(1, 0), e = v(1, 1);
    if (a < 0 || b < 0 || d < 0 || e < 0) {
      const ok = [a, b, d, e].filter(x => x >= 0);   // coast/bush edge: fall back to the valid corners
      return ok.length ? ok.reduce((x, y) => x + y) / ok.length : null;
    }
    return (a * (1 - fc) + b * fc) * (1 - fr) + (d * (1 - fc) + e * fc) * fr;
  }
  const gridDrive = (lat, lng) => { const m = sampleGrid(lat, lng); return m == null ? null : Math.round(m / 5) * 5; };

  function estimateDrive(lat, lng) {
    const R = 6371, rad = d => d * Math.PI / 180;
    const a = Math.sin(rad(lat - HOME.lat) / 2) ** 2 + Math.cos(rad(HOME.lat)) * Math.cos(rad(lat)) * Math.sin(rad(lng - HOME.lng) / 2) ** 2;
    const km = 2 * R * Math.asin(Math.sqrt(a));
    return Math.max(5, Math.round((km * 1.3 / 80 * 60 + 10) / 5) * 5);
  }

  // ---------- Build the spot index (built-in + yours) ----------
  let waters = [], spots = [];
  function rebuild() {
    waters = WATERS.map(w => ({ ...w, builtIn: true }));
    let ci = 0;
    const byName = new Map(waters.map(w => [w.name.toLowerCase(), w]));
    const mine = state.custom.map(c => {
      const key = (c.waterName || 'My spots').toLowerCase();
      let w = byName.get(key);
      if (!w) {
        w = { id: `cw-${key.replace(/[^a-z0-9]+/g, '-')}`, name: c.waterName || 'My spots', region: KINDS[c.kind], colour: CUSTOM_COLOURS[ci++ % CUSTOM_COLOURS.length], blurb: '', spots: [] };
        byName.set(key, w); waters.push(w);
      }
      return { ...c, custom: true, water: w, drive: c.drive ?? gridDrive(c.lat, c.lng) ?? estimateDrive(c.lat, c.lng), driveEstimated: c.drive == null && gridDrive(c.lat, c.lng) == null, src: 'mine' };
    });
    spots = [...WATERS.flatMap(w => w.spots.map(s => ({ ...s, drive: G?.spots?.[s.id] ?? s.drive, water: waters.find(x => x.id === w.id) }))), ...mine];
  }

  // Room to leave around the pins when fitting: desktop has the list on the left, mobile has it along the bottom.
  const fitPad = () => innerWidth > 820 ? { left: 370, top: 80, right: 40, bottom: 40 } : { left: 20, top: 110, right: 20, bottom: Math.round(innerHeight * 0.42) };

  // ---------- Map engines ----------
  // Both engines expose the same small surface so the rest of the app doesn't care which is live.
  function loadGoogle(key) {
    return new Promise((resolve, reject) => {
      window.__caGoogleReady = resolve;
      // Called by Google if the key is invalid or the referrer isn't allowed.
      window.gm_authFailure = () => { sessionStorage.setItem('ca.googleFailed', '1'); location.reload(); };
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&callback=__caGoogleReady`;
      s.async = true; s.onerror = () => reject(new Error('Google Maps script failed to load'));
      document.head.appendChild(s);
    });
  }

  async function googleEngine(el) {
    await loadGoogle(CFG.googleMapsKey);
    const { Map } = await google.maps.importLibrary('maps');
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');
    const map = new Map(el, {
      center: { lat: -37.55, lng: 145.45 }, zoom: 9, mapId: CFG.mapId || 'DEMO_MAP_ID',
      disableDefaultUI: true, zoomControl: true, streetViewControl: true, scaleControl: true,
      zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
      streetViewControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
      gestureHandling: 'greedy', clickableIcons: false, mapTypeId: 'roadmap',
    });
    return {
      name: 'google',
      types: [['roadmap', 'Map'], ['hybrid', 'Satellite'], ['terrain', 'Terrain']],
      setType: t => map.setMapTypeId(t),
      addMarker(lat, lng, node, onClick, z = 1) {
        const wrap = document.createElement('div');
        wrap.style.transform = 'translateY(50%)'; // advanced markers anchor bottom-centre; centre the dot on the point
        wrap.appendChild(node);
        const m = new AdvancedMarkerElement({ map, position: { lat, lng }, content: wrap, zIndex: z });
        if (onClick) node.addEventListener('click', e => { e.stopPropagation(); onClick(); });
        return { remove: () => { m.map = null; }, move: (a, b) => { m.position = { lat: a, lng: b }; } };
      },
      panTo(lat, lng, zoom) { map.panTo({ lat, lng }); if (zoom && map.getZoom() < zoom) map.setZoom(zoom); },
      fit(points) {
        const b = new google.maps.LatLngBounds(); points.forEach(([a, c]) => b.extend({ lat: a, lng: c }));
        map.fitBounds(b, fitPad());
      },
      onClick: cb => map.addListener('click', e => cb(e.latLng.lat(), e.latLng.lng())),
      // Vector shapes: each shape is { loops: [[[lat,lng]…]…], fill?: bool, colour, weight }
      setShapes(shapes) {
        (this._shapes || []).forEach(x => x.setMap(null));
        this._shapes = shapes.flatMap(sh => {
          const paths = sh.loops.map(l => l.map(([lat, lng]) => ({ lat, lng })));
          return sh.fill
            ? [new google.maps.Polygon({ paths, map, clickable: false, strokeColor: sh.colour, strokeWeight: sh.weight, strokeOpacity: .9, fillColor: sh.colour, fillOpacity: .1 })]
            : paths.map(path => new google.maps.Polyline({ path, map, clickable: false, strokeColor: sh.colour, strokeWeight: sh.weight, strokeOpacity: .75 }));
        });
      },
    };
  }

  function leafletEngine(el) {
    const map = L.map(el, { zoomControl: false }).setView([-37.55, 145.45], 9);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    const esri = p => `https://server.arcgisonline.com/ArcGIS/rest/services/${p}/MapServer/tile/{z}/{y}/{x}`;
    const layers = {
      map: L.tileLayer(esri('World_Topo_Map'), { maxZoom: 18, attribution: 'Tiles © Esri' }),
      sat: L.layerGroup([L.tileLayer(esri('World_Imagery'), { maxZoom: 18, attribution: 'Imagery © Esri, Maxar' }), L.tileLayer(esri('Reference/World_Boundaries_and_Places'), { maxZoom: 18 })]),
      topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: '© OpenStreetMap, SRTM · © OpenTopoMap (CC-BY-SA)' }),
    };
    let current = layers.map.addTo(map);
    return {
      name: 'leaflet',
      types: [['map', 'Map'], ['sat', 'Satellite'], ['topo', 'Terrain']],
      setType(t) { map.removeLayer(current); current = layers[t].addTo(map); },
      addMarker(lat, lng, node, onClick, z = 1) {
        const sz = { 'home-pin': 16, 'draft-pin': 18 }[node.className] || 14; // node isn't in the DOM yet, so size by class
        const m = L.marker([lat, lng], { icon: L.divIcon({ html: node, className: '', iconSize: [sz, sz] }), riseOnHover: true, zIndexOffset: z * 10, keyboard: false }).addTo(map);
        if (onClick) m.on('click', e => { L.DomEvent.stopPropagation(e); onClick(); });
        return { remove: () => map.removeLayer(m), move: (a, b) => m.setLatLng([a, b]) };
      },
      panTo(lat, lng, zoom) { map.flyTo([lat, lng], Math.max(map.getZoom(), zoom || 0), { duration: .7 }); },
      fit(points) { const p = fitPad(); map.fitBounds(points, { paddingTopLeft: [p.left, p.top], paddingBottomRight: [p.right, p.bottom] }); },
      onClick: cb => map.on('click', e => cb(e.latlng.lat, e.latlng.lng)),
      setShapes(shapes) {
        (this._shapes || []).forEach(x => x.remove());
        this._shapes = shapes.map(sh => sh.fill
          ? L.polygon(sh.loops, { interactive: false, color: sh.colour, weight: sh.weight, opacity: .9, fillColor: sh.colour, fillOpacity: .1, fillRule: 'evenodd' }).addTo(map)
          : L.polyline(sh.loops, { interactive: false, color: sh.colour, weight: sh.weight, opacity: .75 }).addTo(map));
      },
    };
  }

  // ---------- Pins ----------
  const pins = new Map(); // spot id -> { node, handle }
  function pinNode(s) {
    const n = document.createElement('div');
    n.className = 'pin';
    n.style.setProperty('--c', s.water.colour);
    const l = document.createElement('span');
    l.className = 'lbl';
    l.textContent = `${s.name} · ${fmt(s.drive)}`; // textContent: names can be user-supplied
    n.appendChild(l);
    return n;
  }
  function syncPins() {
    const live = new Set(spots.map(s => s.id));
    for (const [id, p] of pins) if (!live.has(id)) { p.handle.remove(); pins.delete(id); }
    for (const s of spots) {
      if (!pins.has(s.id)) {
        const node = pinNode(s);
        pins.set(s.id, { node, handle: engine.addMarker(s.lat, s.lng, node, () => select(s.id, false), 2) });
      }
    }
  }

  // ---------- Drive-range overlay (vector) ----------
  // Marching squares over the drive grid gives the line where drive time == T; loops are then
  // smoothed (Chaikin) so the ~6 km grid reads as a clean outline instead of blocks.
  const contourCache = new Map();
  function contour(T) {
    if (contourCache.has(T)) return contourCache.get(T);
    const R = G.rows + 2, C = G.cols + 2;              // pad with "unreachable" so every loop closes
    const val = (r, c) => { if (r < 1 || c < 1 || r > G.rows || c > G.cols) return Infinity; const v = G.data[(r - 1) * G.cols + (c - 1)]; return v < 0 ? Infinity : v; };
    const lerp = (va, vb) => (isFinite(va) && isFinite(vb) && va !== vb ? Math.min(1, Math.max(0, (T - va) / (vb - va))) : .5);
    const segs = [];
    for (let r = 0; r < R - 1; r++) for (let c = 0; c < C - 1; c++) {
      const a = val(r, c), b = val(r, c + 1), d = val(r + 1, c + 1), e = val(r + 1, c);
      const idx = (a <= T ? 8 : 0) | (b <= T ? 4 : 0) | (d <= T ? 2 : 0) | (e <= T ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const top = [r, c + lerp(a, b)], right = [r + lerp(b, d), c + 1], bottom = [r + 1, c + lerp(e, d)], left = [r + lerp(a, e), c];
      const centreIn = [a, b, d, e].filter(isFinite).reduce((x, y) => x + y, 0) / Math.max(1, [a, b, d, e].filter(isFinite).length) <= T;
      const table = { 1: [[left, bottom]], 2: [[bottom, right]], 3: [[left, right]], 4: [[top, right]], 6: [[top, bottom]], 7: [[left, top]],
        8: [[left, top]], 9: [[top, bottom]], 11: [[top, right]], 12: [[left, right]], 13: [[bottom, right]], 14: [[left, bottom]],
        5: centreIn ? [[left, top], [bottom, right]] : [[left, bottom], [top, right]],
        10: centreIn ? [[left, bottom], [top, right]] : [[left, top], [bottom, right]] };
      segs.push(...table[idx]);
    }
    // Join segments end-to-end into closed loops.
    const key = p => `${p[0].toFixed(4)},${p[1].toFixed(4)}`;
    const at = new Map();
    segs.forEach((sg, i) => sg.forEach(p => { const k = key(p); (at.get(k) || at.set(k, []).get(k)).push(i); }));
    const used = new Uint8Array(segs.length), loops = [];
    for (let i = 0; i < segs.length; i++) {
      if (used[i]) continue;
      used[i] = 1;
      const loop = [segs[i][0], segs[i][1]];
      for (;;) {
        const tail = loop[loop.length - 1], next = (at.get(key(tail)) || []).find(j => !used[j]);
        if (next == null) break;
        used[next] = 1;
        const [p0, p1] = segs[next];
        loop.push(key(p0) === key(tail) ? p1 : p0);
      }
      if (loop.length >= 8) loops.push(loop);         // drop specks
    }
    const toLatLng = ([r, c]) => [G.north - (r - 1) * (G.north - G.south) / (G.rows - 1), G.west + (c - 1) * (G.east - G.west) / (G.cols - 1)];
    const chaikin = pts => { let q = pts; for (let k = 0; k < 3; k++) { const o = []; for (let i = 0; i < q.length; i++) { const A = q[i], B = q[(i + 1) % q.length]; o.push([A[0] * .75 + B[0] * .25, A[1] * .75 + B[1] * .25], [A[0] * .25 + B[0] * .75, A[1] * .25 + B[1] * .75]); } q = o; } return q; };
    let out = loops.map(l => chaikin(l).map(toLatLng));
    // Google fills by winding direction, so make outer rings and holes wind opposite ways (by nesting depth).
    const inside = (pt, poly) => { let x = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [yi, xi] = poly[i], [yj, xj] = poly[j]; if ((yi > pt[0]) !== (yj > pt[0]) && pt[1] < (xj - xi) * (pt[0] - yi) / (yj - yi) + xi) x = !x; } return x; };
    const area = l => l.reduce((acc, p, i) => { const q = l[(i + 1) % l.length]; return acc + (p[1] * q[0] - q[1] * p[0]); }, 0);
    out = out.map(l => { const depth = out.filter(o => o !== l && inside(l[0], o)).length; return (area(l) > 0) === (depth % 2 === 0) ? l : l.slice().reverse(); });
    contourCache.set(T, out);
    return out;
  }
  let ringLabels = [];
  function drawOverlay() {
    if (!engine?.setShapes || !G) return;
    ringLabels.forEach(h => h.remove()); ringLabels = [];
    if (!state.rings) return engine.setShapes([]);
    if (state.budget) {
      engine.setShapes([{ loops: contour(state.budget), fill: true, colour: '#235f47', weight: 2 }]);
    } else {
      // "Any": thin hour lines with labels along a ray towards the north-east spots.
      const hours = [60, 120, 180];
      engine.setShapes(hours.map(t => ({ loops: contour(t), colour: '#235f47', weight: 1.5 })));
      const brg = 55 * Math.PI / 180; let prev = 0;
      for (let km = 1; km < 400; km++) {
        const lat = HOME.lat + km / 111 * Math.cos(brg), lng = HOME.lng + km / (111 * Math.cos(HOME.lat * Math.PI / 180)) * Math.sin(brg);
        const v = sampleGrid(lat, lng); if (v == null) continue;
        const h = Math.floor(v / 60);
        if (h > prev && h <= 3) { const n = document.createElement('div'); n.className = 'ring-lbl'; n.textContent = `${h} h`; ringLabels.push(engine.addMarker(lat, lng, n, null, 1)); }
        prev = Math.max(prev, h);
      }
    }
  }

  // ---------- Filtering ----------
  const inBudget = (s, lim = state.budget) => lim == null || s.drive <= lim;
  function matches(s) {
    const m = state.marks[s.id] || {};
    if (state.filters.want && !m.want) return false;
    if (state.filters.fished && !m.fished) return false;
    if (!state.q) return true;
    const hay = `${s.name} ${s.water.name} ${s.water.region || ''} ${(s.tags || []).join(' ')} ${s.note || ''} ${m.note || ''}`.toLowerCase();
    return hay.includes(state.q);
  }

  // ---------- Render ----------
  function render() {
    // Range picker: each option shows how many spots (after search/filters) it would include.
    document.querySelectorAll('[data-range]').forEach(b => {
      const lim = b.dataset.range === 'any' ? null : +b.dataset.range;
      b.setAttribute('aria-pressed', lim === state.budget);
      b.querySelector('.n').textContent = spots.filter(s => matches(s) && inBudget(s, lim)).length;
    });
    document.querySelectorAll('.seg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === state.mode));
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', state.filters[b.dataset.filter]));

    const shown = spots.filter(s => matches(s) && inBudget(s));
    const nW = new Set(shown.map(s => s.water.id)).size;
    $('listMeta').textContent = `${shown.length} spot${shown.length === 1 ? '' : 's'} ${state.budget ? `within ${fmt(state.budget)}` : 'at any distance'} · ${nW} water${nW === 1 ? '' : 's'}`;

    for (const s of spots) {
      const p = pins.get(s.id); if (!p) continue;
      const m = state.marks[s.id] || {};
      p.node.className = ['pin', m.want && 'want', m.fished && 'fished', state.active === s.id && 'active'].filter(Boolean).join(' ');
      p.node.style.display = matches(s) && inBudget(s) ? '' : 'none';
    }

    const list = $('list');
    list.textContent = '';
    const row = s => {
      const m = state.marks[s.id] || {};
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `row${state.active === s.id ? ' active' : ''}`;
      b.innerHTML = `${state.mode === 'all' ? `<span class="sw" style="background:${s.water.colour}"></span>` : ''}<span class="nm">${esc(s.name)}</span><span class="mk">${m.want ? '★' : ''}${m.fished ? '✓' : ''}</span><span class="t">${s.driveEstimated ? '~' : ''}${fmt(s.drive)}</span>`;
      b.onclick = () => select(s.id, true);
      return b;
    };
    if (state.mode === 'all') {
      shown.slice().sort((a, b) => a.drive - b.drive).forEach(s => list.appendChild(row(s)));
    } else {
      waters.forEach(w => {
        const ws = shown.filter(s => s.water === w).sort((a, b) => a.drive - b.drive);
        if (!ws.length) return;
        const h = document.createElement('div');
        h.className = 'group';
        h.innerHTML = `<span class="dot" style="background:${w.colour}"></span><b>${esc(w.name)}</b><small>${esc(w.region || '')}</small>`;
        list.appendChild(h);
        ws.forEach(s => list.appendChild(row(s)));
      });
    }
    if (!list.children.length) list.innerHTML = `<div class="empty">${state.budget ? `Nothing within ${fmt(state.budget)} yet. Try a longer drive.` : 'No spots match. Clear the search or filters.'}</div>`;
  }

  // ---------- Detail panel ----------
  const HOT = ['upstream only', 'day visits only', '4WD'];
  function select(id, pan) {
    const s = spots.find(x => x.id === id);
    if (!s) return;
    if (state.adding) stopAdding();
    state.active = id; state.editingId = null;
    if (pan) engine.panTo(s.lat, s.lng, 12);
    const m = state.marks[id] || {};
    const dir = `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}&travelmode=driving`;
    const d = $('detail');
    d.innerHTML = `
      <button type="button" class="icon-btn x" data-act="close" aria-label="Close">✕</button>
      <div class="label">${s.custom ? 'Your spot' : 'Selected spot'}</div>
      <div>
        <div class="kicker" style="color:${s.water.colour}">${esc(s.water.name)}${s.water.region ? ` · ${esc(s.water.region)}` : ''}</div>
        <h2>${esc(s.name)}</h2>
        <div class="sub">${s.driveEstimated ? '~' : '≈ '}${fmt(s.drive)} drive from ${esc(HOME.name)}${s.driveEstimated ? ' (rough)' : ''}</div>
      </div>
      <div class="pair">
        <button type="button" class="pill" data-act="want" aria-pressed="${!!m.want}">★ Want to go</button>
        <button type="button" class="pill" data-act="fished" aria-pressed="${!!m.fished}">✓ Fished</button>
      </div>
      ${s.note || s.tags?.length ? `<div><h3>Access notes</h3>${s.note ? `<p>${esc(s.note)}</p>` : ''}${s.tags?.length ? `<div class="tags" style="margin-top:8px">${s.tags.map(t => `<span class="tag${HOT.includes(t) ? ' hot' : ''}">${esc(t)}</span>`).join('')}</div>` : ''}</div>` : ''}
      ${s.water.blurb ? `<div><h3>About the water</h3><p class="fine" style="color:var(--dim)">${esc(s.water.blurb)}</p></div>` : ''}
      <div>
        <h3>What worked · last fished ${m.last ? esc(new Date(m.last).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })) : '—'}</h3>
        <textarea id="noteBox" placeholder="Flies, lures, flows, where the fish held…">${esc(m.note || '')}</textarea>
        <label class="field" style="margin-top:8px"><span>Last fished</span><input type="date" id="lastBox" value="${esc(m.last || '')}" max="${today()}"></label>
      </div>
      <div class="actions">
        <a class="btn primary" href="${dir}" target="_blank" rel="noopener">Directions</a>
        <a class="btn" href="https://mapshare.vic.gov.au/mapsharevic/" target="_blank" rel="noopener">MapShareVic</a>
        ${s.custom ? '<button type="button" class="btn" data-act="edit">Edit</button><button type="button" class="btn danger" data-act="delete">Delete</button>' : ''}
      </div>
      <div class="verify"><b>Check before you go</b>Check public access on MapShareVic and the current rules on the VFA site. Pin locations and drive times are approximate.</div>
      ${s.src && SOURCES[s.src] ? `<div class="fine">Source: ${esc(SOURCES[s.src])}</div>` : ''}`;
    d.hidden = false;
    d.onclick = e => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (!act) return;
      const mk = state.marks[id] ||= { want: false, fished: false, note: '', last: '' };
      if (act === 'close') return closeDetail();
      if (act === 'want') mk.want = !mk.want;
      if (act === 'fished') { mk.fished = !mk.fished; if (mk.fished && !mk.last) mk.last = today(); }
      if (act === 'edit') return openForm(s);
      if (act === 'delete') {
        if (!confirm(`Delete “${s.name}” from your book?`)) return;
        state.custom = state.custom.filter(c => c.id !== id); delete state.marks[id];
        persist(); rebuild(); syncPins(); closeDetail(); return;
      }
      persist(); select(id, false);
    };
    $('noteBox').oninput = e => { (state.marks[id] ||= { want: false, fished: false, note: '', last: '' }).note = e.target.value.slice(0, 2000); persist(); };
    $('lastBox').onchange = e => { const v = e.target.value; (state.marks[id] ||= { want: false, fished: false, note: '', last: '' }).last = /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : ''; persist(); select(id, false); };
    render();
  }
  function closeDetail() { $('detail').hidden = true; state.active = null; state.editingId = null; render(); }

  // ---------- Add / edit a spot ----------
  let draftHandle = null;
  function startAdding() {
    closeDetail();
    state.adding = true; state.draft = null;
    $('addBanner').hidden = false;
    document.querySelector('.stage').classList.add('adding');
  }
  function stopAdding() {
    state.adding = false;
    $('addBanner').hidden = true;
    document.querySelector('.stage').classList.remove('adding');
  }
  function clearDraft() { draftHandle?.remove(); draftHandle = null; state.draft = null; }

  function placeDraft(lat, lng) {
    state.draft = { lat, lng };
    if (draftHandle) draftHandle.move(lat, lng);
    else { const n = document.createElement('div'); n.className = 'draft-pin'; draftHandle = engine.addMarker(lat, lng, n, null, 9); }
    stopAdding();
    if (!state.editingId) openForm(null);
    else { const c = $('coords'); if (c) c.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`; }
  }

  function openForm(existing) {
    state.editingId = existing?.id || null;
    if (existing) state.draft = { lat: existing.lat, lng: existing.lng };
    const src = existing ? state.custom.find(c => c.id === existing.id) : {};
    const { lat, lng } = state.draft;
    const waterOpts = [...new Set(waters.map(w => w.name))].map(n => `<option value="${esc(n)}"></option>`).join('');
    const d = $('detail');
    d.innerHTML = `
      <button type="button" class="icon-btn x" data-act="cancel" aria-label="Cancel">✕</button>
      <div class="label">${existing ? 'Edit spot' : 'New spot'}</div>
      <h2 style="margin:0">${existing ? 'Edit your spot' : 'Add a spot'}</h2>
      <form id="spotForm" style="display:grid;gap:12px">
        <label class="field"><span>Name *</span><input name="name" required maxlength="80" value="${esc(src.name || '')}" placeholder="e.g. Mordialloc Pier"></label>
        <label class="field"><span>Water / group</span><input name="waterName" list="waterList" maxlength="60" value="${esc(src.waterName || '')}" placeholder="River, beach or bay name"><datalist id="waterList">${waterOpts}</datalist></label>
        <div class="field-row">
          <label class="field"><span>Type</span><select name="kind">${Object.entries(KINDS).map(([k, v]) => `<option value="${k}"${(src.kind || 'river') === k ? ' selected' : ''}>${v}</option>`).join('')}</select></label>
          <label class="field"><span>Drive (min)</span><input name="drive" type="number" min="5" max="900" step="5" value="${src.drive ?? ''}" placeholder="~${gridDrive(lat, lng) ?? estimateDrive(lat, lng)}"></label>
        </div>
        <label class="field"><span>Access notes</span><textarea name="note" maxlength="1000" placeholder="Where to park, which way to walk, gates…">${esc(src.note || '')}</textarea></label>
        <label class="field"><span>Tags (comma separated)</span><input name="tags" maxlength="200" value="${esc((src.tags || []).join(', '))}" placeholder="fly, parking, beach, night"></label>
        <div class="fine">Pin: <span id="coords">${lat.toFixed(4)}, ${lng.toFixed(4)}</span> · <button type="button" class="link-btn" data-act="move">Move pin</button></div>
        <div class="actions"><button type="submit" class="btn primary">${existing ? 'Save changes' : 'Save spot'}</button><button type="button" class="btn" data-act="cancel">Cancel</button></div>
      </form>`;
    d.hidden = false;
    d.onclick = e => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'cancel') { clearDraft(); existing ? select(existing.id, false) : closeDetail(); }
      if (act === 'move') { state.adding = true; $('addBanner').hidden = false; document.querySelector('.stage').classList.add('adding'); }
    };
    $('spotForm').onsubmit = e => {
      e.preventDefault();
      const f = new FormData(e.target);
      const spot = cleanSpot({
        id: existing?.id, lat: state.draft.lat, lng: state.draft.lng,
        name: f.get('name'), waterName: f.get('waterName'), kind: f.get('kind'),
        drive: f.get('drive'), note: f.get('note'), tags: String(f.get('tags') || '').split(','),
      });
      if (!spot) return;
      state.custom = existing ? state.custom.map(c => (c.id === spot.id ? spot : c)) : [...state.custom, spot];
      persist(); clearDraft(); rebuild();
      if (existing) { pins.get(spot.id)?.handle.remove(); pins.delete(spot.id); } // re-create so colour/label update
      syncPins(); select(spot.id, true);
    };
    setTimeout(() => d.querySelector('input[name=name]')?.focus(), 0);
  }

  // ---------- Export / import ----------
  function exportBook() {
    const blob = new Blob([JSON.stringify({ app: 'casual-angling', version: 2, exported: new Date().toISOString(), custom: state.custom, marks: state.marks }, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `casual-angling-${today()}.json` });
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  async function importBook(file) {
    try {
      if (file.size > 2_000_000) throw new Error('File too large');
      const data = JSON.parse(await file.text());
      const incoming = (Array.isArray(data.custom) ? data.custom : []).map(cleanSpot).filter(Boolean);
      const byId = new Map(state.custom.map(c => [c.id, c]));
      incoming.forEach(c => byId.set(c.id, c));
      state.custom = [...byId.values()];
      Object.assign(state.marks, migrateMarks(data.marks && typeof data.marks === 'object' ? data.marks : {}));
      persist(); rebuild(); syncPins(); render();
      alert(`Imported ${incoming.length} spot(s) and your marks.`);
    } catch (err) {
      alert(`Couldn't import that file: ${err.message}`);
    }
  }

  // ---------- Season (approximate rule — verify with VFA) ----------
  // Vic rivers & streams: closed from the Tuesday after King's Birthday (2nd Mon in June) to the Saturday nearest 1 Sept.
  function season(d = new Date()) {
    const y = d.getFullYear(), j1 = new Date(y, 5, 1);
    const kb = new Date(y, 5, 1 + ((8 - j1.getDay()) % 7) + 7);
    const close = new Date(y, 5, kb.getDate() + 1);
    const off = (6 - new Date(y, 8, 1).getDay() + 7) % 7;
    const open = new Date(y, 8, 1 + (off > 3 ? off - 7 : off));
    return { isOpen: d < close || d >= open, open };
  }

  // ---------- Boot ----------
  let engine;
  (async () => {
    rebuild();
    const note = $('engineNote');
    const googleFailed = sessionStorage.getItem('ca.googleFailed');
    if (CFG.googleMapsKey && !googleFailed) {
      try { engine = await googleEngine($('map')); }
      catch (err) { console.warn(err); }
    }
    if (!engine) {
      engine = leafletEngine($('map'));
      note.hidden = false;
      note.innerHTML = googleFailed
        ? 'Google Maps rejected the key. Check its referrer restrictions, then <a href="#" id="retryG">retry</a>.'
        : 'Using free map tiles. Add a key to <code>config.js</code> to switch to Google Maps.';
      $('retryG')?.addEventListener('click', e => { e.preventDefault(); sessionStorage.removeItem('ca.googleFailed'); location.reload(); });
    }

    // Map type toggle
    const mt = $('maptype');
    engine.types.forEach(([k, label], i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'radio'); b.textContent = label; b.setAttribute('aria-checked', i === 0);
      b.onclick = () => { engine.setType(k); mt.querySelectorAll('button').forEach(x => x.setAttribute('aria-checked', x === b)); };
      mt.appendChild(b);
    });

    const home = document.createElement('div'); home.className = 'home-pin'; home.title = `Home · ${HOME.name}`;
    engine.addMarker(HOME.lat, HOME.lng, home, null, 3);
    syncPins();
    engine.fit([[HOME.lat, HOME.lng], ...spots.map(s => [s.lat, s.lng])]);
    engine.onClick((lat, lng) => { if (state.adding) placeDraft(lat, lng); });
    $('homeName').textContent = HOME.name;
    $('ringsToggle').setAttribute('aria-pressed', state.rings);
    if (!G) $('ringsToggle').hidden = true;
    drawOverlay();

    const ss = season();
    $('seasonDot').style.background = ss.isOpen ? '#2f9e5b' : '#c2412d';
    $('seasonTxt').textContent = ss.isOpen ? 'Trout season (rivers): open, closes in June' : `Trout season (rivers): closed until ~${ss.open.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}`;
    render();
  })();

  // ---------- Wire up controls ----------
  $('search').oninput = e => { state.q = e.target.value.trim().toLowerCase(); render(); };
  // Picking a range hides everything further away, then zooms to what's left.
  document.querySelectorAll('[data-range]').forEach(b => b.onclick = () => {
    state.budget = b.dataset.range === 'any' ? null : +b.dataset.range;
    persist(); render(); drawOverlay();
    const vis = spots.filter(s => matches(s) && inBudget(s));
    if (vis.length) engine.fit([[HOME.lat, HOME.lng], ...vis.map(s => [s.lat, s.lng])]);
  });
  $('ringsToggle').onclick = () => { state.rings = !state.rings; persist(); $('ringsToggle').setAttribute('aria-pressed', state.rings); drawOverlay(); };
  document.querySelectorAll('.seg button').forEach(b => b.onclick = () => { state.mode = b.dataset.mode; persist(); render(); });
  document.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => { state.filters[b.dataset.filter] = !state.filters[b.dataset.filter]; render(); });
  $('collapse').onclick = () => { const c = $('listCard').classList.toggle('collapsed'); $('collapse').setAttribute('aria-expanded', !c); };
  $('addBtn').onclick = startAdding;
  $('cancelAdd').onclick = () => { stopAdding(); if (!state.draft) clearDraft(); };
  $('useLoc').onclick = () => {
    if (!navigator.geolocation) return alert('Location is not available in this browser.');
    navigator.geolocation.getCurrentPosition(
      p => { placeDraft(p.coords.latitude, p.coords.longitude); engine.panTo(p.coords.latitude, p.coords.longitude, 13); },
      err => alert(`Couldn't get your location: ${err.message}`),
      { enableHighAccuracy: true, timeout: 10000 });
  };
  $('exportBtn').onclick = exportBook;
  $('importFile').onchange = e => { const f = e.target.files[0]; if (f) importBook(f); e.target.value = ''; };
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('search').focus(); }
    if (e.key === 'Escape') { if (state.adding) { stopAdding(); } else if (!$('detail').hidden) { clearDraft(); closeDetail(); } }
  });
})();
