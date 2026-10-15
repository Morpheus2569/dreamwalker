/* Optional media configuration. Leave empty until real, captioned footage is ready. */
const DREAMWALKER_WELCOME = {
  video: '',       // e.g. 'assets/welcome.mp4'
  captions: '',    // e.g. 'assets/welcome-en.vtt'
  transcript: ''   // Exact spoken words, as plain text.
};

(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [...document.querySelectorAll('.journey-scene')];
  let pausedByVisitor = false;
  function renderMotion() {
    const running = !reducedMotion.matches && !pausedByVisitor && !document.hidden;
    scenes.forEach(scene => {
      scene.dataset.motion = running ? 'running' : 'still';
      const button = scene.querySelector('.motion-toggle');
      button.hidden = reducedMotion.matches;
      button.textContent = running ? 'Pause motion' : 'Play motion';
      button.setAttribute('aria-label', running ? 'Pause landscape animation' : 'Play landscape animation');
    });
  }
  scenes.forEach(scene => scene.querySelector('.motion-toggle').addEventListener('click', () => {
    pausedByVisitor = !pausedByVisitor;
    renderMotion();
  }));
  reducedMotion.addEventListener('change', renderMotion);
  document.addEventListener('visibilitychange', renderMotion);
  renderMotion();

  const section = document.querySelector('#welcome-video');
  // A complete set of actual footage, captions, and transcript is needed to show it.
  if (!section || !DREAMWALKER_WELCOME.video || !DREAMWALKER_WELCOME.captions || !DREAMWALKER_WELCOME.transcript.trim()) return;
  const video = section.querySelector('video');
  video.src = DREAMWALKER_WELCOME.video;
  video.querySelector('track').src = DREAMWALKER_WELCOME.captions;
  section.querySelector('#welcome-transcript').textContent = DREAMWALKER_WELCOME.transcript;
  video.addEventListener('error', () => {
    video.hidden = true;
    section.querySelector('#video-error').hidden = false;
    section.querySelector('details').open = true;
  });
  section.hidden = false;
})();
