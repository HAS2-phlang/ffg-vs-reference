// Page-wide scroll motion for the v2 home page: a progress bar, and blocks that rise in (staggered) as they enter.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.addEventListener('DOMContentLoaded', function () {
    var root = document.documentElement;
    root.classList.add('mo-on');

    var bar = document.createElement('div');
    bar.className = 'mo-bar';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var ticking = false;
    function progress() {
      var h = root.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
      ticking = false;
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }, { passive: true });
    progress();

    // Blocks to animate: headings, paragraphs, cards and photos inside each section, except the hero and
    // sections that run their own animation.
    var sel = 'h2, h3, p, li, article, figure, .card, [class*="card"], [class*="tile"], [class*="step"]';
    var items = [];
    document.querySelectorAll('body > section').forEach(function (sec) {
      if (sec.id === 'top' || sec.hasAttribute('data-own-motion')) return;
      var seen = 0;
      sec.querySelectorAll(sel).forEach(function (el) {
        if (el.closest('.mo-item') || el.closest('[data-own-motion]')) return;
        if (el.getBoundingClientRect().height < 8) return;
        el.classList.add('mo-item');
        el.style.setProperty('--mo-d', Math.min(seen % 6, 5) * 0.07 + 's');
        seen++;
        items.push(el);
        var img = el.tagName === 'FIGURE' || el.tagName === 'ARTICLE' ? el.querySelector('img') : null;
        if (img && img.parentElement) img.parentElement.classList.add('mo-img');
      });
    });
    if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('mo-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('mo-in');
        var p = e.target.querySelector('.mo-img'); if (p) p.classList.add('mo-in');
        if (e.target.classList.contains('mo-img')) e.target.classList.add('mo-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
    document.querySelectorAll('.mo-img').forEach(function (el) { if (!el.classList.contains('mo-item')) io.observe(el); });
  });
})();
