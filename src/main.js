const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-nav');
function closeMenu() {
  menu?.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Menüyü aç');
}
menuButton?.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 961px)').addEventListener('change', closeMenu);
document.querySelectorAll('[data-missing-contact]').forEach(button => {
  button.addEventListener('click', () => document.querySelector('#contact-dialog').showModal());
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
});
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    let count = 0;
    document.querySelectorAll('[data-photo]').forEach(item => {
      item.hidden = button.dataset.filter !== 'all' && item.dataset.category !== button.dataset.filter;
      if (!item.hidden) count++;
    });
    document.querySelector('#filter-status').textContent = `${count} görsel gösteriliyor.`;
  });
});
document.querySelectorAll('[data-photo]').forEach(button => {
  button.addEventListener('click', () => {
    const dialog = document.querySelector('#lightbox');
    const img = dialog.querySelector('img');
    img.src = button.dataset.photo;
    img.alt = button.dataset.alt;
    dialog.querySelector('p').textContent = button.dataset.title;
    dialog.showModal();
  });
});
// Sayfa kaydırıldıkça bölümleri yumuşakça görünür yap; JS yoksa içerik zaten görünür.
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const targets = document.querySelectorAll('.section-heading, .service-card, .step, .showcase, .gallery-item, .about-layout > *, .region-layout > *');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  targets.forEach((target, i) => {
    target.classList.add('reveal');
    target.style.transitionDelay = `${(i % 4) * 70}ms`;
    observer.observe(target);
  });
  document.documentElement.classList.add('js-reveal');
}
