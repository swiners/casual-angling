// Casual Angling — a personal record of good fishing spots around Melbourne.
// Built-in spots come from spots.js; spots you add, and your marks/notes, live in localStorage
// in this browser only. Export/Import moves them between devices or to a mate.
(() => {
  const CFG = window.CASUAL_ANGLING_CONFIG || {};
  const STORE = 'troutHud.v1'; // original key kept so marks saved in v1 carry over
  const $ = id => document.getElementById(id);
  const isMobile = () => !matchMedia('(min-width: 821px)').matches;

  // Escape anything user-supplied (or imported) before it goes near innerHTML.
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Colours only ever come from spots.js or our own palette, but check the shape before putting one in a style attribute.
  const col = c => (/^#[0-9a-f]{3,8}$/i.test(c) ? c : '#235f47');
  const fmt = m => (m >= 60 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m` : `${m}m`);
  const today = () => new Date().toISOString().slice(0, 10);

  // ---------- Persistence ----------
  const saved = (() => { try { return JSON.parse(localStorage.getItem(STORE) || '{}'); } catch { return {}; } })();
  const validBudget = b => Number.isInteger(b) && b >= 30 && b <= 180 && b % 15 === 0;
  const state = {
    budget: validBudget(saved.budget) ? saved.budget : null,   // null = any distance
    mode: saved.mode === 'all' ? 'all' : 'groups',
    rings: saved.showRange === true,                           // drive-range outline is opt-in
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

  // ---------- Drive times ----------
  // From the prebuilt OSRM grid (drive-grid.js), bilinear between cells. null if off-road/sea/out of range.
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
  // Last-resort estimate: crow-flies × 1.3 road factor at ~80 km/h, +10 min to get out of town.
  const kmBetween = (a1, o1, a2, o2) => { const R = 6371, rad = d => d * Math.PI / 180; const a = Math.sin(rad(a2 - a1) / 2) ** 2 + Math.cos(rad(a1)) * Math.cos(rad(a2)) * Math.sin(rad(o2 - o1) / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(a)); };
  const estimateDrive = (lat, lng) => Math.max(5, Math.round((kmBetween(HOME.lat, HOME.lng, lat, lng) * 1.3 / 80 * 60 + 10) / 5) * 5);

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
      const g = gridDrive(c.lat, c.lng);
      return { ...c, custom: true, water: w, drive: c.drive ?? g ?? estimateDrive(c.lat, c.lng), driveEstimated: c.drive == null && g == null, src: 'mine' };
    });
    spots = [...WATERS.flatMap(w => w.spots.map(s => ({ ...s, drive: G?.spots?.[s.id] ?? s.drive, water: waters.find(x => x.id === w.id) }))), ...mine];
  }

  // ---------- Layout helpers ----------
  // Room to keep clear when fitting the map: desktop has side panels; mobile has the sheet along the bottom.
  const sheetPx = () => ($('sheet').getBoundingClientRect().height || 0);
  const fitPad = () => (isMobile()
    ? { left: 28, top: 72, right: 28, bottom: Math.round(sheetPx()) + 24 }
    : { left: 392, top: 60, right: 60, bottom: 60 });
  // How far to nudge the map down so a selected pin sits in the visible area above the mobile detail sheet.
  const detailOffset = () => (isMobile() ? Math.round(($('detail').getBoundingClientRect().height || innerHeight * .6) / 2) : 0);

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

  // Quiet basemap so the pins read: no shops, cafés or transit clutter.
  const MAP_STYLE = [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  ];

  async function googleEngine(el) {
    await loadGoogle(CFG.googleMapsKey);
    const { Map, OverlayView } = await google.maps.importLibrary('maps');
    // HTML markers via OverlayView: no Map ID needed, so the style array above applies.
    class HtmlMarker extends OverlayView {
      constructor(pos, node, clickable) { super(); this.pos = pos; this.node = node; if (clickable) OverlayView.preventMapHitsAndGesturesFrom(node); }
      onAdd() { this.getPanes()[this.node.dataset.pane || 'overlayMouseTarget'].appendChild(this.node); }
      draw() { const p = this.getProjection()?.fromLatLngToDivPixel(new google.maps.LatLng(this.pos)); if (p) { this.node.style.left = `${p.x}px`; this.node.style.top = `${p.y}px`; } }
      onRemove() { this.node.remove(); }
    }
    const mobile = isMobile();
    const map = new Map(el, {
      center: { lat: -37.55, lng: 145.45 }, zoom: 9, styles: MAP_STYLE,
      disableDefaultUI: true, zoomControl: !mobile, streetViewControl: !mobile, scaleControl: !mobile,
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
        wrap.className = 'mkr'; wrap.style.zIndex = z; wrap.appendChild(node);
        if (!onClick) wrap.style.pointerEvents = 'none';
        const m = new HtmlMarker({ lat, lng }, wrap, !!onClick);
        if (onClick) node.addEventListener('click', e => { e.stopPropagation(); onClick(); });
        m.setMap(map);
        return { remove: () => m.setMap(null), move: (a, b) => { m.pos = { lat: a, lng: b }; m.draw(); } };
      },
      panTo(lat, lng, zoom, offY = 0) {
        if (zoom && map.getZoom() < zoom) map.setZoom(zoom);
        map.panTo({ lat, lng });
        if (offY) map.panBy(0, offY);
      },
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
    if (!isMobile()) L.control.zoom({ position: 'bottomright' }).addTo(map);
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
        const wrap = document.createElement('div');
        wrap.className = 'mkr'; wrap.appendChild(node);
        if (!onClick) wrap.style.pointerEvents = 'none';
        // Zero-size icon anchored at the point; .mk centres its child on it (same as the Google engine).
        const m = L.marker([lat, lng], { icon: L.divIcon({ html: wrap, className: '', iconSize: [0, 0] }), zIndexOffset: z * 100, keyboard: false, interactive: !!onClick }).addTo(map);
        if (onClick) m.on('click', e => { L.DomEvent.stopPropagation(e); onClick(); });
        return { remove: () => map.removeLayer(m), move: (a, b) => m.setLatLng([a, b]) };
      },
      panTo(lat, lng, zoom, offY = 0) {
        const z = Math.max(map.getZoom(), zoom || 0);
        const target = offY ? map.unproject(map.project([lat, lng], z).add([0, -offY]), z) : L.latLng(lat, lng);
        map.flyTo(target, z, { duration: .6 });
      },
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
    n.style.setProperty('--c', col(s.water.colour));
    n.setAttribute('role', 'button');
    n.setAttribute('aria-label', `${s.name}, ${fmt(s.drive)} drive`);
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
        pins.set(s.id, { node, handle: engine.addMarker(s.lat, s.lng, node, () => select(s.id, true), 2) });
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
      const fin = [a, b, d, e].filter(isFinite);
      const centreIn = fin.reduce((x, y) => x + y, 0) / Math.max(1, fin.length) <= T;
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
      engine.setShapes([60, 120, 180].map(t => ({ loops: contour(t), colour: '#235f47', weight: 1.5 })));
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
  let ovT; const overlaySoon = () => { clearTimeout(ovT); ovT = setTimeout(drawOverlay, 120); };

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
  const visible = () => spots.filter(s => matches(s) && inBudget(s));

  // ---------- Render ----------
  function renderPins() {
    for (const s of spots) {
      const p = pins.get(s.id); if (!p) continue;
      const m = state.marks[s.id] || {};
      p.node.className = ['pin', m.want && !m.fished && 'want', m.fished && 'fished', state.active === s.id && 'active'].filter(Boolean).join(' ');
      p.node.parentElement && (p.node.parentElement.style.display = matches(s) && inBudget(s) ? '' : 'none');
    }
  }
  function renderList() {
    document.querySelectorAll('.seg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === state.mode));
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', state.filters[b.dataset.filter]));
    const shown = visible();
    const nW = new Set(shown.map(s => s.water.id)).size;
    $('listMeta').textContent = `${nW} water${nW === 1 ? '' : 's'}${state.q ? ` matching “${state.q}”` : ''}`;

    const list = $('list');
    list.textContent = '';
    const row = s => {
      const m = state.marks[s.id] || {};
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `row${state.active === s.id ? ' active' : ''}`;
      b.innerHTML = `${state.mode === 'all' ? `<span class="sw" style="background:${col(s.water.colour)}"></span>` : ''}<span class="nm">${esc(s.name)}</span><span class="mk">${m.want ? '★' : ''}${m.fished ? '✓' : ''}</span><span class="t">${s.driveEstimated ? '~' : ''}${fmt(s.drive)}</span>`;
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
        h.innerHTML = `<span class="dot" style="background:${col(w.colour)}"></span><b>${esc(w.name)}</b><small>${esc(w.region || '')}</small>`;
        list.appendChild(h);
        ws.forEach(s => list.appendChild(row(s)));
      });
    }
    if (!list.children.length) {
      // Offer the nearest longer drive that actually has something, as a one-tap fix.
      const next = state.budget && [...Array(12)].map((_, i) => 30 + 15 * i).find(t => t > state.budget && drive.countAt(t) > 0);
      const box = document.createElement('div'); box.className = 'empty';
      const p = document.createElement('div');
      p.textContent = state.budget ? `Nothing within ${fmt(state.budget)}.` : 'No spots match. Clear the search or filters.';
      box.appendChild(p);
      if (next) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'btn small';
        b.textContent = `Try ${fmt(next)} (${drive.countAt(next)} spots)`;
        b.onclick = () => { drive.set(next); applyBudget(next, true); };
        box.appendChild(b);
      }
      list.appendChild(box);
    }
  }
  function render() { drive.refresh(); renderPins(); renderList(); }

  // ---------- Toasts ----------
  function toast(msg, action) {
    const t = document.createElement('div'); t.className = 'toast';
    const s = document.createElement('span'); s.textContent = msg; t.appendChild(s);
    if (action) { const b = document.createElement('button'); b.type = 'button'; b.textContent = action.label; b.onclick = () => { action.run(); t.remove(); }; t.appendChild(b); }
    $('toasts').appendChild(t);
    setTimeout(() => t.remove(), action ? 6000 : 3000);
  }

  // Where a spot came from, how sure we are of the pin, and links to check. Only http(s) URLs are linked.
  const safeUrl = u => (typeof u === 'string' && /^https?:\/\/[^\s"'<>]+$/.test(u) ? u : null);
  const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return 'link'; } };
  const CONF = { high: 'Pin checked against OpenStreetMap', medium: 'Pin is close, not exact', low: 'Pin is a rough guess' };
  function sourceBlock(s) {
    const links = [...new Set([...(s.links || []), ...(s.water.sources || [])])].map(safeUrl).filter(Boolean).slice(0, 6);
    const bits = [];
    if (s.src && SOURCES[s.src]) bits.push(`Source: ${esc(SOURCES[s.src])}`);
    if (s.conf && CONF[s.conf]) bits.push(esc(CONF[s.conf]));
    const linkHtml = links.length ? `<div class="src-links">${links.map(u => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(host(u))} ↗</a>`).join('')}</div>` : '';
    return bits.length || linkHtml ? `<div class="fine">${bits.join(' · ')}${linkHtml}</div>` : '';
  }

  // ---------- Detail panel ----------
  const HOT = ['upstream only', 'day visits only', '4WD'];
  const blankMark = () => ({ want: false, fished: false, note: '', last: '' });
  function openDetail() { $('detail').hidden = false; document.body.classList.add('detail-open'); }
  function select(id, pan) {
    const s = spots.find(x => x.id === id);
    if (!s) return;
    if (state.adding) stopAdding();
    state.active = id; state.editingId = null;
    const m = state.marks[id] || {};
    const dir = `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}&travelmode=driving`;
    const d = $('detail');
    d.innerHTML = `
      <div class="detail-top">
        <div class="titles">
          <div class="kicker"><span class="dot" style="background:${col(s.water.colour)}"></span>${esc(s.water.name)}${s.water.region ? ` · ${esc(s.water.region)}` : ''}</div>
          <h2>${esc(s.name)}</h2>
          <div class="sub">${s.driveEstimated ? '~' : '≈ '}${fmt(s.drive)} drive from ${esc(HOME.name)}${s.driveEstimated ? ' (rough)' : ''}</div>
        </div>
        <button type="button" class="icon-btn" data-act="close" aria-label="Close">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <div class="detail-body">
        <div class="pair">
          <button type="button" class="pill" data-act="want" aria-pressed="${!!m.want}">★ Want to go</button>
          <button type="button" class="pill" data-act="fished" aria-pressed="${!!m.fished}">✓ Fished</button>
        </div>
        ${s.note || s.tags?.length ? `<div><h3>Access notes</h3>${s.note ? `<p>${esc(s.note)}</p>` : ''}${s.tags?.length ? `<div class="tags">${s.tags.map(t => `<span class="tag${HOT.includes(t) ? ' hot' : ''}">${esc(t)}</span>`).join('')}</div>` : ''}</div>` : ''}
        <div>
          <h3>What worked${m.last ? ` · last fished ${esc(new Date(m.last).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }))}` : ''}</h3>
          <textarea id="noteBox" placeholder="Flies, lures, flows, where the fish held…">${esc(m.note || '')}</textarea>
          <div class="saved" id="savedTick">Saved ✓</div>
          <label class="field" style="margin-top:10px"><span>Last fished</span><input type="date" id="lastBox" value="${esc(m.last || '')}" max="${today()}"></label>
        </div>
        ${s.water.blurb ? `<div><h3>About the water</h3><p style="color:var(--dim)">${esc(s.water.blurb)}</p></div>` : ''}
        <div class="verify"><b>Check before you go</b>Confirm public access on <a href="https://mapshare.vic.gov.au/mapsharevic/" target="_blank" rel="noopener">MapShareVic</a> and the current rules on the <a href="https://vfa.vic.gov.au" target="_blank" rel="noopener">VFA site</a>. Pin locations and drive times are approximate.</div>
        ${s.custom ? '<div class="edit-row"><button type="button" class="btn small" data-act="edit">Edit spot</button><button type="button" class="btn small danger" data-act="delete">Delete</button></div>' : ''}
        ${sourceBlock(s)}
      </div>
      <div class="detail-foot">
        <a class="btn primary wide" href="${dir}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l18-8-8 18-2-8-8-2z"/></svg>
          Directions
        </a>
      </div>`;
    openDetail();
    if (pan) requestAnimationFrame(() => engine.panTo(s.lat, s.lng, 11, detailOffset()));
    d.onclick = e => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (!act) return;
      const mk = state.marks[id] ||= blankMark();
      if (act === 'close') return closeDetail();
      if (act === 'want') mk.want = !mk.want;
      if (act === 'fished') { mk.fished = !mk.fished; if (mk.fished && !mk.last) mk.last = today(); }
      if (act === 'edit') return openForm(s);
      if (act === 'delete') return deleteSpot(s);
      persist(); select(id, false);
    };
    let savedT;
    $('noteBox').oninput = e => {
      (state.marks[id] ||= blankMark()).note = e.target.value.slice(0, 2000); persist();
      const t = $('savedTick'); t.classList.add('on'); clearTimeout(savedT); savedT = setTimeout(() => t.classList.remove('on'), 1200);
    };
    $('lastBox').onchange = e => { const v = e.target.value; (state.marks[id] ||= blankMark()).last = /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : ''; persist(); select(id, false); };
    renderPins(); renderList();
  }
  function closeDetail() {
    $('detail').hidden = true; document.body.classList.remove('detail-open');
    state.active = null; state.editingId = null; renderPins(); renderList();
  }
  // Delete with Undo instead of a confirm() dialog.
  function deleteSpot(s) {
    const spot = state.custom.find(c => c.id === s.id), mark = state.marks[s.id];
    state.custom = state.custom.filter(c => c.id !== s.id); delete state.marks[s.id];
    persist(); rebuild(); syncPins(); closeDetail(); render();
    toast(`Deleted “${s.name}”`, { label: 'Undo', run: () => { state.custom.push(spot); if (mark) state.marks[s.id] = mark; persist(); rebuild(); syncPins(); render(); select(s.id, true); } });
  }

  // ---------- Add / edit a spot ----------
  let draftHandle = null;
  function setAddMsg(html) { $('addMsg').innerHTML = html; }
  function startAdding({ locate = false } = {}) {
    closeDetail(); sheet.set('peek');
    state.adding = true; state.draft = null;
    $('addBanner').hidden = false; document.body.classList.add('adding');
    setAddMsg('Tap the map to drop a pin');
    if (locate) locateMe();
  }
  function stopAdding() { state.adding = false; $('addBanner').hidden = true; document.body.classList.remove('adding'); }
  function clearDraft() { draftHandle?.remove(); draftHandle = null; state.draft = null; }
  function locateMe() {
    if (!navigator.geolocation) return setAddMsg('Location isn’t available here. Tap the map instead.');
    setAddMsg('<span class="spin" aria-hidden="true"></span>Finding you…');
    navigator.geolocation.getCurrentPosition(
      p => { const { latitude: a, longitude: o, accuracy } = p.coords; placeDraft(a, o); engine.panTo(a, o, 13, detailOffset()); toast(`Pinned your location (±${Math.round(accuracy)} m)`); },
      err => setAddMsg(`Couldn’t get your location (${esc(err.message)}). Tap the map instead.`),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });
  }

  function placeDraft(lat, lng) {
    state.draft = { lat, lng };
    if (draftHandle) draftHandle.move(lat, lng);
    else { const n = document.createElement('div'); n.className = 'draft-pin'; draftHandle = engine.addMarker(lat, lng, n, null, 9); }
    stopAdding();
    if (!state.editingId) openForm(null);
    else { const c = $('coords'); if (c) c.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`; }
    requestAnimationFrame(() => engine.panTo(lat, lng, null, detailOffset()));   // keep the new pin visible above the form
  }

  // Suggest a water name from the nearest known spot (within 3 km), so saving at the river is one field.
  function nearestWater(lat, lng) {
    let best = null, bd = 3;
    for (const s of spots) { const d = kmBetween(lat, lng, s.lat, s.lng); if (d < bd) { bd = d; best = s.water.name; } }
    return best || '';
  }

  function openForm(existing) {
    state.editingId = existing?.id || null;
    if (existing) state.draft = { lat: existing.lat, lng: existing.lng };
    const src = existing ? state.custom.find(c => c.id === existing.id) : { waterName: nearestWater(state.draft.lat, state.draft.lng) };
    const { lat, lng } = state.draft;
    const waterOpts = [...new Set(waters.map(w => w.name))].map(n => `<option value="${esc(n)}"></option>`).join('');
    const d = $('detail');
    d.innerHTML = `
      <div class="detail-top">
        <div class="titles"><div class="kicker">${existing ? 'Edit spot' : 'New spot'}</div><h2>${existing ? 'Edit your spot' : 'Save this spot'}</h2></div>
        <button type="button" class="icon-btn" data-act="cancel" aria-label="Cancel">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <form id="spotForm" class="detail-body" novalidate>
        <label class="field"><span>Name</span><input name="name" required maxlength="80" value="${esc(src.name || '')}" placeholder="e.g. Deep bend below the bridge" enterkeyhint="done"></label>
        <label class="field"><span>Water</span><input name="waterName" list="waterList" maxlength="60" value="${esc(src.waterName || '')}" placeholder="River, beach or bay"><datalist id="waterList">${waterOpts}</datalist></label>
        <label class="field"><span>Access notes</span><textarea name="note" maxlength="1000" placeholder="Where to park, which way to walk, gates…">${esc(src.note || '')}</textarea></label>
        <details class="more"${existing ? ' open' : ''}>
          <summary>More details</summary>
          <div class="inner">
            <div class="field-row">
              <label class="field"><span>Type</span><select name="kind">${Object.entries(KINDS).map(([k, v]) => `<option value="${k}"${(src.kind || 'river') === k ? ' selected' : ''}>${v}</option>`).join('')}</select></label>
              <label class="field"><span>Drive (min)</span><input name="drive" type="number" inputmode="numeric" min="5" max="900" step="5" value="${src.drive ?? ''}" placeholder="~${gridDrive(lat, lng) ?? estimateDrive(lat, lng)}"></label>
            </div>
            <label class="field"><span>Tags (comma separated)</span><input name="tags" maxlength="200" value="${esc((src.tags || []).join(', '))}" placeholder="fly, parking, beach, night"></label>
          </div>
        </details>
        <div class="fine">Pin at <span id="coords">${lat.toFixed(4)}, ${lng.toFixed(4)}</span> · <button type="button" class="link-btn" data-act="move">Move pin</button></div>
      </form>
      <div class="detail-foot">
        <button type="button" class="btn" data-act="cancel">Cancel</button>
        <button type="submit" form="spotForm" class="btn primary wide">${existing ? 'Save changes' : 'Save spot'}</button>
      </div>`;
    openDetail();
    d.onclick = e => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'cancel') { clearDraft(); existing ? select(existing.id, false) : closeDetail(); }
      if (act === 'move') { state.adding = true; $('addBanner').hidden = false; document.body.classList.add('adding'); setAddMsg('Tap the map to move the pin'); }
    };
    $('spotForm').onsubmit = e => {
      e.preventDefault();
      const f = new FormData(e.target);
      const spot = cleanSpot({
        id: existing?.id, lat: state.draft.lat, lng: state.draft.lng,
        name: f.get('name'), waterName: f.get('waterName'), kind: f.get('kind'),
        drive: f.get('drive'), note: f.get('note'), tags: String(f.get('tags') || '').split(','),
      });
      if (!spot) { const n = e.target.querySelector('[name=name]'); n.focus(); n.placeholder = 'Give it a name first'; return; }
      state.custom = existing ? state.custom.map(c => (c.id === spot.id ? spot : c)) : [...state.custom, spot];
      persist(); clearDraft(); rebuild();
      if (existing) { pins.get(spot.id)?.handle.remove(); pins.delete(spot.id); } // re-create so colour/label update
      syncPins(); render(); select(spot.id, true);
      toast(existing ? 'Changes saved' : `Saved “${spot.name}”`);
    };
    if (!isMobile()) setTimeout(() => d.querySelector('input[name=name]')?.focus(), 0);
  }

  // ---------- Export / import ----------
  function exportBook() {
    const blob = new Blob([JSON.stringify({ app: 'casual-angling', version: 2, exported: new Date().toISOString(), custom: state.custom, marks: state.marks }, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `casual-angling-${today()}.json` });
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  async function importBook(file) {
    try {
      if (file.size > 2_000_000) throw new Error('file too large');
      const data = JSON.parse(await file.text());
      const incoming = (Array.isArray(data.custom) ? data.custom : []).map(cleanSpot).filter(Boolean);
      const byId = new Map(state.custom.map(c => [c.id, c]));
      incoming.forEach(c => byId.set(c.id, c));
      state.custom = [...byId.values()];
      Object.assign(state.marks, migrateMarks(data.marks && typeof data.marks === 'object' ? data.marks : {}));
      persist(); rebuild(); syncPins(); render();
      toast(`Imported ${incoming.length} spot${incoming.length === 1 ? '' : 's'} and your marks`);
    } catch (err) {
      toast(`Couldn’t import that file: ${err.message}`);
    }
  }

  // ---------- Season (approximate rule — verify with VFA) ----------
  // Vic rivers & streams: closed from the Tuesday after King's Birthday (2nd Mon in June) until the first
  // Saturday in September (2026: closed 9 Jun, reopened Sat 5 Sep — VFA).
  function season(d = new Date()) {
    const y = d.getFullYear(), j1 = new Date(y, 5, 1);
    const kb = new Date(y, 5, 1 + ((8 - j1.getDay()) % 7) + 7);
    const close = new Date(y, 5, kb.getDate() + 1);
    const open = new Date(y, 8, 1 + ((6 - new Date(y, 8, 1).getDay() + 7) % 7));
    return { isOpen: d < close || d >= open, open };
  }

  // ---------- Mobile bottom sheet: peek / half / full ----------
  const sheet = (() => {
    const el = $('sheet'), grab = $('grab');
    let snap = 'peek';
    // Peek shows the drive slider; half shows the list; full leaves just the top bar visible.
    const heights = () => {
      const stageH = document.querySelector('.stage').clientHeight;
      const peek = $('drive').offsetTop + $('drive').offsetHeight + 2;
      return { peek, half: Math.max(peek + 120, Math.round(stageH * .52)), full: stageH - 12 };
    };
    function apply(h) {
      document.documentElement.style.setProperty('--sheet-h', `${Math.round(h)}px`);
    }
    function set(name) {
      if (!isMobile()) return;
      snap = name; apply(heights()[name]);
      el.classList.toggle('full', name === 'full');
      document.body.classList.toggle('sheet-full', name === 'full');
    }
    // Drag from the handle or the slider header; snap to the nearest height (biased by direction).
    let startY = 0, startH = 0, lastY = 0, dragging = false;
    const onDown = e => {
      if (!isMobile() || e.target.closest('.drive-slider')) return;
      dragging = true; startY = lastY = e.clientY; startH = el.getBoundingClientRect().height;
      el.classList.add('dragging'); e.currentTarget.setPointerCapture?.(e.pointerId);
    };
    const onMove = e => {
      if (!dragging) return;
      lastY = e.clientY;
      const hs = heights(); apply(Math.min(hs.full, Math.max(hs.peek, startH - (e.clientY - startY))));
    };
    const onUp = e => {
      if (!dragging) return;
      dragging = false; el.classList.remove('dragging');
      const moved = startY - lastY, hs = heights(), h = el.getBoundingClientRect().height;
      if (Math.abs(moved) < 6 && e.currentTarget === grab) return set(snap === 'peek' ? 'half' : 'peek');   // tap on handle
      const order = ['peek', 'half', 'full'];
      let best = order.reduce((a, b) => (Math.abs(hs[b] - h) < Math.abs(hs[a] - h) ? b : a));
      if (Math.abs(moved) > 40 && best === snap) best = order[Math.max(0, Math.min(2, order.indexOf(snap) + (moved > 0 ? 1 : -1)))];
      set(best);
    };
    [grab, el.querySelector('.drive-hd')].forEach(t => {
      t.addEventListener('pointerdown', onDown);
      t.addEventListener('pointermove', onMove);
      t.addEventListener('pointerup', onUp);
      t.addEventListener('pointercancel', onUp);
    });
    grab.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(snap === 'peek' ? 'half' : snap === 'half' ? 'full' : 'peek'); } });
    addEventListener('resize', () => { if (isMobile()) set(snap); });
    return { set, get: () => snap };
  })();

  // ---------- Drive slider ----------
  function applyBudget(l, fit) {
    state.budget = l; persist(); renderPins(); renderList(); drawOverlay();
    const vis = visible();
    if (fit && vis.length && engine) engine.fit([[HOME.lat, HOME.lng], ...vis.map(s => [s.lat, s.lng])]);
  }
  rebuild();
  const drive = initDriveSlider({
    el: $('drive'), value: state.budget,
    getTimes: () => spots.filter(matches).map(s => ({ min: s.drive, colour: col(s.water.colour) })),
    onInput(l) { state.budget = l; renderPins(); overlaySoon(); },   // cheap path while dragging
    onChange(l) { applyBudget(l, true); },
  });

  // ---------- Boot ----------
  let engine;
  (async () => {
    sheet.set('peek');
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

    // Map type: segmented on desktop; behind one layers button on mobile.
    const mt = $('maptype');
    engine.types.forEach(([k, label], i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'radio'); b.textContent = label; b.setAttribute('aria-checked', i === 0);
      b.onclick = () => { engine.setType(k); mt.querySelectorAll('button').forEach(x => x.setAttribute('aria-checked', x === b)); $('maptypeWrap').classList.remove('open'); $('layersBtn').setAttribute('aria-expanded', 'false'); };
      mt.appendChild(b);
    });

    const home = document.createElement('div'); home.className = 'home-pin'; home.title = `Home · ${HOME.name}`;
    engine.addMarker(HOME.lat, HOME.lng, home, null, 3);
    syncPins();
    const vis = visible();
    engine.fit([[HOME.lat, HOME.lng], ...(vis.length ? vis : spots).map(s => [s.lat, s.lng])]);
    engine.onClick((lat, lng) => {
      if (state.adding) return placeDraft(lat, lng);
      if (isMobile() && !$('detail').hidden && !state.editingId && !state.draft) closeDetail();
    });
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
  $('search').oninput = e => { state.q = e.target.value.trim().toLowerCase(); render(); if (state.q && sheet.get() === 'peek') sheet.set('half'); };
  $('ringsToggle').onclick = () => { state.rings = !state.rings; persist(); $('ringsToggle').setAttribute('aria-pressed', state.rings); drawOverlay(); };
  document.querySelectorAll('.seg button').forEach(b => b.onclick = () => { state.mode = b.dataset.mode; persist(); renderList(); });
  document.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => { state.filters[b.dataset.filter] = !state.filters[b.dataset.filter]; render(); });
  $('collapse').onclick = () => { const c = $('sheet').classList.toggle('collapsed'); $('collapse').setAttribute('aria-expanded', !c); };
  $('layersBtn').onclick = () => { const o = $('maptypeWrap').classList.toggle('open'); $('layersBtn').setAttribute('aria-expanded', o); };
  $('addBtn').onclick = () => startAdding();
  $('fab').onclick = () => startAdding({ locate: true });   // at the river: grab location straight away
  $('cancelAdd').onclick = () => { stopAdding(); if (!state.editingId) clearDraft(); };
  $('useLoc').onclick = locateMe;
  $('exportBtn').onclick = exportBook;
  $('importFile').onchange = e => { const f = e.target.files[0]; if (f) importBook(f); e.target.value = ''; };
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('search').focus(); }
    if (e.key === 'Escape') { if (state.adding) stopAdding(); else if (!$('detail').hidden) { clearDraft(); closeDetail(); } }
  });
})();
