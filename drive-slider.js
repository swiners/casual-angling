// Drive-time slider with a dot strip: one dot per spot above a snapping track, so you can see where
// spots cluster as you drag. A native <input type=range> sits underneath for keyboard and screen readers;
// a pointer layer on top gives drag-anywhere and tap-to-jump (which iOS range inputs can't do).
// DOM is built with createElement/textContent only; water colours only ever go into a CSS custom property.
function initDriveSlider({ el, getTimes, value = null, onInput = () => {}, onChange = () => {},
                           min = 30, max = 180, step = 15, bin = 5 }) {
  const q = s => el.querySelector(s);
  const input = q('.drive-input'), slider = q('.drive-slider'), strip = q('.drive-strip'),
        thumb = q('.drive-thumb'), ticks = q('.drive-ticks'), labels = q('.drive-labels'),
        pre = q('.drive-pre'), val = q('.drive-val'), nEl = q('.drive-n'), unit = q('.drive-unit'),
        countEl = q('.drive-count'), delta = q('.drive-delta');
  const ANY = max + step, stops = [];
  for (let v = min; v <= ANY; v += step) stops.push(v);
  Object.assign(input, { min, max: ANY, step });

  const frac = v => (v - min) / (ANY - min);
  const snap = v => Math.min(ANY, Math.max(min, min + Math.round((v - min) / step) * step));
  const lim = v => (v >= ANY ? null : v);
  const short = m => { const h = Math.floor(m / 60), r = m % 60; return h ? `${h}h${r ? ` ${r}m` : ''}` : `${r}m`; };
  const spoken = m => { const h = Math.floor(m / 60), r = m % 60, p = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
    return [h && p(h, 'hour'), r && p(r, 'minute')].filter(Boolean).join(' '); };
  const tickLbl = m => (m >= ANY ? 'Any' : m % 60 ? (m < 60 ? `${m}m` : `${Math.floor(m / 60)}h${m % 60}`) : `${m / 60}h`);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  let times = [], cur = value == null ? ANY : snap(value), committed = cur, dragging = false, dTimer;
  const countAt = v => (v >= ANY ? times.length : times.filter(t => t.min <= v).length);

  // Static ticks (every step) and labels (every 30 min, plus Any).
  const tickEls = stops.map(v => { const i = document.createElement('i'); i.style.setProperty('--x', frac(v)); ticks.append(i); return i; });
  const labelEls = stops.filter(v => v === ANY || v % 30 === 0).map(v => {
    const s = document.createElement('span'); s.textContent = tickLbl(v); s.dataset.v = v;
    s.style.setProperty('--x', frac(v)); labels.append(s); return s;
  });

  // Rebuild the dot strip. Spots are binned in 5-min buckets (upper edge inclusive) and each dot sits at the
  // bucket centre, so a dot is always on the correct side of any 15-min cut line.
  function refresh() {
    times = (getTimes() || []).filter(t => Number.isFinite(t.min));
    const buckets = new Map();
    for (const t of times) {
      const b = t.min > max ? 'any' : Math.max(0, Math.ceil((t.min - min) / bin));
      (buckets.get(b) || buckets.set(b, []).get(b)).push(t);
    }
    const H = 34, D = 7, frag = document.createDocumentFragment();
    const sep = document.createElement('i'); sep.className = 'sep'; sep.style.setProperty('--x', frac(max + step / 2)); frag.append(sep);
    for (const [b, list] of buckets) {
      const x = b === 'any' ? 1 : frac(min + bin * b - bin / 2);
      const pitch = list.length > 4 ? (H - D) / (list.length - 1) : D + 1;
      list.sort((a, c) => String(a.colour).localeCompare(String(c.colour))).forEach((t, k) => {
        const i = document.createElement('i');
        i.style.setProperty('--x', x); i.style.setProperty('--c', t.colour || '#235f47');
        i.style.bottom = `${k * pitch}px`; frag.append(i);
      });
    }
    strip.replaceChildren(frag);
    stops.forEach((v, j) => tickEls[j].classList.toggle('jump', j > 0 && countAt(v) > countAt(stops[j - 1])));
    paint();
  }

  function paint() {
    const n = countAt(cur), any = cur >= ANY;
    slider.style.setProperty('--p', frac(cur));
    input.value = cur;
    pre.hidden = any;
    val.textContent = any ? 'Any distance' : short(cur);
    val.classList.toggle('is-any', any);
    nEl.textContent = n; unit.textContent = n === 1 ? 'spot' : 'spots';
    countEl.classList.toggle('is-zero', !n);
    input.setAttribute('aria-valuetext', `${any ? 'Any distance' : spoken(cur)}, ${n} ${n === 1 ? 'spot' : 'spots'}`);
    labelEls.forEach(s => s.classList.toggle('on', +s.dataset.v === cur));
  }

  // Only fires when the snapped step actually changes (≤12 times across a full drag).
  function setVal(v, haptic) {
    v = snap(v); if (v === cur) return;
    const before = countAt(cur); cur = v; paint();
    const d = countAt(v) - before;
    if (d) {
      delta.textContent = `${d > 0 ? '+' : '−'}${Math.abs(d)}`;
      delta.className = `drive-delta is-on${d < 0 ? ' is-minus' : ''}`;
      clearTimeout(dTimer); dTimer = setTimeout(() => delta.classList.remove('is-on'), 900);
      if (haptic) try { navigator.vibrate?.(8); } catch { /* not supported */ }
    }
    if (!reduce.matches && thumb.animate) thumb.animate([{ scale: d ? 1.22 : 1.1 }, { scale: dragging ? 1.1 : 1 }], { duration: d ? 200 : 120, easing: 'ease-out' });
    onInput(lim(v));
  }
  const commit = () => { if (cur !== committed) { committed = cur; onChange(lim(cur)); } };

  const fromX = x => {
    const r = slider.getBoundingClientRect(), t = thumb.offsetWidth || 28;
    const f = Math.max(0, Math.min(1, (x - r.left - t / 2) / (r.width - t)));
    return min + Math.round(f * (stops.length - 1)) * step;
  };
  slider.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    dragging = true; slider.setPointerCapture(e.pointerId);
    el.classList.add('is-dragging'); setVal(fromX(e.clientX), true);
  });
  slider.addEventListener('pointermove', e => { if (dragging) setVal(fromX(e.clientX), true); });
  const end = () => { if (!dragging) return; dragging = false; el.classList.remove('is-dragging'); commit(); };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => slider.addEventListener(ev, end));

  // Keyboard / assistive tech go through the native input.
  input.addEventListener('input', () => setVal(+input.value, false));
  input.addEventListener('change', commit);
  input.addEventListener('keydown', e => {   // PageUp/PageDown: jump to the next step where the count changes
    if (e.key !== 'PageUp' && e.key !== 'PageDown') return;
    e.preventDefault();
    const up = e.key === 'PageUp', n = countAt(cur);
    const seq = up ? stops.filter(v => v > cur) : stops.filter(v => v < cur).reverse();
    const target = seq.find(v => (up ? countAt(v) > n : countAt(v) < n)) ?? seq.at(-1);
    if (target != null) { setVal(target, false); commit(); }
  });

  refresh();
  return {
    refresh,
    get: () => lim(cur),
    countAt: m => countAt(m == null ? ANY : m),
    set(m) { cur = committed = m == null ? ANY : snap(m); paint(); },
  };
}
