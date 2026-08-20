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

/* Chrome-safe desktop story switching. Sticky positioning is CSS-only;
   JavaScript merely picks whichever text step is closest to the viewport
   centre and activates the matching phone screen. */
const story = document.querySelector('[data-scroll-story]');
const storySteps = story ? [...story.querySelectorAll('[data-story-step]')] : [];
const storyScreens = story ? [...story.querySelectorAll('[data-story-screen]')] : [];

function updateStory() {
  if (!story || window.innerWidth <= 980 || reduceMotion || !storySteps.length) return;
  const centre = window.innerHeight * 0.5;
  let activeIndex = 0;
  let bestDistance = Infinity;

  storySteps.forEach((step, index) => {
    const rect = step.getBoundingClientRect();
    const stepCentre = rect.top + rect.height / 2;
    const distance = Math.abs(stepCentre - centre);
    if (distance < bestDistance) {
      bestDistance = distance;
      activeIndex = index;
    }
  });

  storySteps.forEach((step, index) => step.classList.toggle('active', index === activeIndex));
  const key = storySteps[activeIndex]?.dataset.storyStep;
  storyScreens.forEach(screen => screen.classList.toggle('active', screen.dataset.storyScreen === key));
}

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
    updateStory();
    ticking = false;
  });
  ticking = true;
}

if (!reduceMotion) {
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  requestUpdate();
}
