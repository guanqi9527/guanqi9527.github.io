/**
 * Site-level enhancements
 * - Reading progress on article pages.
 * - Honors prefers-reduced-motion.
 * - No global canvas/effect loop.
 */
(() => {
  'use strict';

  const initReadingProgress = () => {
    if (!document.querySelector('#article-container')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    bar.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'width:0',
      'height:3px',
      'background:linear-gradient(90deg,#667eea,#764ba2)',
      'z-index:10000',
      'pointer-events:none',
      'transition:width .1s linear'
    ].join(';');
    document.body.appendChild(bar);

    let ticking = false;
    const update = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        bar.style.width = `${max > 0 ? (doc.scrollTop / max) * 100 : 0}%`;
        ticking = false;
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  };

  const init = () => initReadingProgress();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
