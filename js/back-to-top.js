(function() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  function toggle() {
    const show = window.scrollY > 200;
    btn.classList.toggle('show', show);
    btn.setAttribute('aria-hidden', String(!show));
  }

  window.addEventListener('scroll', toggle, { passive: true });
  // initial state
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    btn.blur();
  });

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
})();