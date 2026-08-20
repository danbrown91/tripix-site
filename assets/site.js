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

// Stable desktop scroll story. Instead of allowing several IntersectionObserver
// callbacks to compete, choose the copy block whose centre is nearest the
// viewport centre. The sticky treatment is deliberately desktop-only.
const storySteps = [...document.querySelectorAll('[data-story-step]')];
const storyScreens = [...document.querySelectorAll('[data-story-screen]')];
const storySection = document.querySelector('[data-scroll-story]');
let activeStoryName = storySteps[0]?.dataset.storyStep || null;

function activateStory(name) {
  if (!name || name === activeStoryName) return;
  activeStoryName = name;
  storySteps.forEach(step => step.classList.toggle('active', step.dataset.storyStep === name));
  storyScreens.forEach(screen => screen.classList.toggle('active', screen.dataset.storyScreen === name));
}

function updateStory() {
  if (!storySection || !storySteps.length || window.innerWidth <= 900) return;
  const sectionRect = storySection.getBoundingClientRect();
  const viewportCentre = window.innerHeight * 0.5;
  if (sectionRect.bottom < 0 || sectionRect.top > window.innerHeight) return;

  let nearest = storySteps[0];
  let nearestDistance = Infinity;
  storySteps.forEach(step => {
    const rect = step.getBoundingClientRect();
    const centre = rect.top + rect.height / 2;
    const distance = Math.abs(centre - viewportCentre);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = step;
    }
  });
  activateStory(nearest.dataset.storyStep);
}

// Ensure the initial screen/classes are synchronized even before scrolling.
if (activeStoryName) {
  storySteps.forEach(step => step.classList.toggle('active', step.dataset.storyStep === activeStoryName));
  storyScreens.forEach(screen => screen.classList.toggle('active', screen.dataset.storyScreen === activeStoryName));
}

let scrollTicking = false;
function requestScrollUpdates() {
  if (scrollTicking) return;
  requestAnimationFrame(() => {
    updateStory();
    updateParallax();
    scrollTicking = false;
  });
  scrollTicking = true;
}

const parallax = [...document.querySelectorAll('[data-parallax]')];
function updateParallax() {
  if (reduceMotion || window.innerWidth <= 900) {
    parallax.forEach(el => { el.style.transform = ''; });
    return;
  }
  const vh = window.innerHeight;
  parallax.forEach(el => {
    const rect = el.getBoundingClientRect();
    const rate = Number(el.dataset.parallax || 0.02);
    let delta = (rect.top + rect.height / 2 - vh / 2) * rate;
    delta = Math.max(-28, Math.min(28, delta));
    el.style.transform = `translate3d(0, ${delta}px, 0)`;
  });
}

if (!reduceMotion) {
  window.addEventListener('scroll', requestScrollUpdates, { passive: true });
  window.addEventListener('resize', requestScrollUpdates, { passive: true });
  requestScrollUpdates();
} else {
  updateStory();
}
