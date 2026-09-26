(() => {
  const toggle = document.querySelector('.mobile-menu');
  const menu = document.getElementById('site-menu');
  if (toggle && menu) {
    const close = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', event => { if (event.target.closest('a')) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.classList.contains('is-open')) { close(); toggle.focus(); } });
    document.addEventListener('click', event => { if (!event.target.closest('.topnav')) close(); });
    matchMedia('(min-width:1001px)').addEventListener('change', close);
  }
  const returnLink = document.getElementById('returnSign');
  if (returnLink) {
    try {
      const saved = localStorage.getItem('ys_sign');
      const choice = Array.from(document.querySelectorAll('[data-sign-link]')).find(link => link.dataset.signLink === saved);
      if (choice) { returnLink.href = choice.href; returnLink.textContent = 'Horoskopi im: ' + choice.dataset.signName + ' →'; returnLink.hidden = false; }
    } catch (_) { /* Preferences are optional when storage is unavailable. */ }
  }
})();
