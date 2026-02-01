(function() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
    document.body.classList.toggle('no-scroll', links.classList.contains('open'));
  });

  // Close menu when a link is clicked (useful for one-page nav)
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.classList.remove('open');
        document.body.classList.remove('no-scroll');
      }
    });
  });

  // Close when clicking or touching outside the menu
  const closeOnOutside = (e) => {
    if (!links.contains(e.target) && !toggle.contains(e.target) && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
  };
  document.addEventListener('click', closeOnOutside);
  document.addEventListener('pointerdown', closeOnOutside);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
  });
})();