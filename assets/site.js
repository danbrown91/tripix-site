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

// Apple-style feature story: keep the product image pinned while its screen
// changes as each block of copy reaches the centre of the viewport.
const storySteps = [...document.querySelectorAll('[data-story-step]')];
const storyScreens = [...document.querySelectorAll('[data-story-screen]')];

function activateStory(name) {
  storySteps.forEach(step => step.classList.toggle('active', step.dataset.storyStep === name));
  storyScreens.forEach(screen => screen.classList.toggle('active', screen.dataset.storyScreen === name));
}

if (storySteps.length) {
  const storyObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) activateStory(visible.target.dataset.storyStep);
  }, {
    rootMargin: '-32% 0px -32% 0px',
    threshold: [0, .1, .25, .5, .75, 1]
  });
  storySteps.forEach(step => storyObserver.observe(step));
}

if (!reduceMotion) {
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  let ticking = false;

  const updateParallax = () => {
    const vh = window.innerHeight;
    parallax.forEach(el => {
      const rect = el.getBoundingClientRect();
      const rate = Number(el.dataset.parallax || 0.03);
      const delta = (rect.top + rect.height / 2 - vh / 2) * rate;
      el.style.transform = `translate3d(0, ${delta}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
}
