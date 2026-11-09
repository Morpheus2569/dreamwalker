/* DreamWalker — the dream layer (Nov 9, 2026).
   Progressive enhancement only: with JS off, reduced motion, or any
   failure here, the page is fully visible and functional.
   Duties: lift the arrival veil, stagger the hero in, reveal sections
   on scroll, fill the hero moon as the visitor descends, and light
   the moon-phase journey strip phase by phase. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  root.classList.add('dream-js');

  /* --- The arrival: veil lifts, hero rises --- */
  const veil = document.createElement('div');
  veil.className = 'dream-veil';
  veil.setAttribute('aria-hidden', 'true');
  document.body.appendChild(veil);
  const lift = () => {
    root.classList.add('dream-in');
    veil.classList.add('lifted');
    setTimeout(() => veil.remove(), 1700);
  };
  if (reduced.matches) {
    veil.remove();
    root.classList.add('dream-in');
  } else if (document.readyState === 'complete') {
    requestAnimationFrame(lift);
  } else {
    window.addEventListener('load', () => requestAnimationFrame(lift), { once: true });
    setTimeout(() => { if (document.body.contains(veil)) lift(); }, 2500); /* never trap a visitor behind the veil */
  }

  /* --- Scroll reveals --- */
  const revealEls = [...document.querySelectorAll('.reveal')];
  if (reduced.matches || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('revealed'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  /* --- The moon fills as you descend (homepage signature) --- */
  const moonStop = document.querySelector('#dream-moonfill-stop');
  const phases = [...document.querySelectorAll('.moon-phase')];
  let ticking = false;
  function onScroll() {
    const max = document.body.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (moonStop) moonStop.setAttribute('offset', (0.04 + p * 0.96).toFixed(3));
    const litCount = Math.floor(p * (phases.length + 0.6));
    phases.forEach((ph, i) => ph.classList.toggle('lit', i < litCount));
    ticking = false;
  }
  if (phases.length && reduced.matches) phases.forEach(ph => ph.classList.add('lit'));
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
})();
