const header = document.querySelector('[data-header]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateHeader() {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 16);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* V6 deliberately removes the scroll-state switching used by the old
   sticky story. The story is now normal document flow; only the gentle
   product parallax remains on roomy desktop layouts. */
const parallax = [...document.querySelectorAll('[data-parallax]')];
let ticking = false;

function updateParallax() {
  if (reduceMotion || window.innerWidth <= 1100) {
    parallax.forEach(el => { el.style.transform = ''; });
    return;
  }
  const vh = window.innerHeight;
  parallax.forEach(el => {
    const rect = el.getBoundingClientRect();
    const rate = Math.min(Number(el.dataset.parallax || 0.02), 0.025);
    let delta = (rect.top + rect.height / 2 - vh / 2) * rate;
    delta = Math.max(-16, Math.min(16, delta));
    el.style.transform = `translate3d(0, ${delta}px, 0)`;
  });
}

function requestUpdate() {
  if (ticking) return;
  requestAnimationFrame(() => {
    updateParallax();
    ticking = false;
  });
  ticking = true;
}

if (!reduceMotion) {
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  requestUpdate();
}
