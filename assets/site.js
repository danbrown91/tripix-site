const header = document.querySelector('[data-header]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopStory = window.matchMedia('(min-width: 981px)');

function updateHeader() {
  if (header) header.classList.toggle('scrolled', window.scrollY > 16);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
}

/* Gentle parallax for the three standalone product images only. */
const parallaxEls = [...document.querySelectorAll('[data-parallax]')];
let parallaxTicking = false;
function updateParallax() {
  if (reduceMotion || window.innerWidth <= 980) {
    parallaxEls.forEach((el) => { el.style.transform = ''; });
    return;
  }
  const vh = window.innerHeight;
  parallaxEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const rate = Math.min(Number(el.dataset.parallax || 0.02), 0.022);
    let delta = (rect.top + rect.height / 2 - vh / 2) * rate;
    delta = Math.max(-12, Math.min(12, delta));
    el.style.transform = `translate3d(0, ${delta}px, 0)`;
  });
}
function requestParallax() {
  if (parallaxTicking) return;
  parallaxTicking = true;
  requestAnimationFrame(() => {
    updateParallax();
    parallaxTicking = false;
  });
}
if (!reduceMotion) {
  window.addEventListener('scroll', requestParallax, { passive: true });
  window.addEventListener('resize', requestParallax, { passive: true });
  requestParallax();
}

/* Desktop sticky story. CSS owns sticky positioning; JS only changes state.
   Using viewport-centre distance avoids browser-specific IntersectionObserver
   timing around sticky descendants. */
const story = document.querySelector('[data-scroll-story]');
const storySteps = story ? [...story.querySelectorAll('[data-story-step]')] : [];
const storyScreens = story ? [...story.querySelectorAll('[data-story-screen]')] : [];
let storyTicking = false;

function setStoryActive(key) {
  storySteps.forEach((step) => step.classList.toggle('active', step.dataset.storyStep === key));
  storyScreens.forEach((screen) => screen.classList.toggle('active', screen.dataset.storyScreen === key));
}

function updateStory() {
  if (!story || !storySteps.length || !desktopStory.matches || reduceMotion) return;
  const targetY = window.innerHeight * 0.5;
  let best = storySteps[0];
  let bestDistance = Infinity;
  storySteps.forEach((step) => {
    const r = step.getBoundingClientRect();
    const centre = r.top + r.height / 2;
    const d = Math.abs(centre - targetY);
    if (d < bestDistance) {
      bestDistance = d;
      best = step;
    }
  });
  setStoryActive(best.dataset.storyStep);
}
function requestStory() {
  if (storyTicking) return;
  storyTicking = true;
  requestAnimationFrame(() => {
    updateStory();
    storyTicking = false;
  });
}

if (story && storySteps.length) {
  setStoryActive(storySteps[0].dataset.storyStep);
  if (!reduceMotion) {
    window.addEventListener('scroll', requestStory, { passive: true });
    window.addEventListener('resize', requestStory, { passive: true });
    if (desktopStory.addEventListener) desktopStory.addEventListener('change', requestStory);
    requestStory();
  }
}

/* V11 mobile navigation */
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (menuButton && mobileMenu) {
  function closeMobileMenu() {
    menuButton.classList.remove('open');
    mobileMenu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }

  menuButton.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', isOpen);
    menuButton.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('click', (event) => {
    if (!mobileMenu.classList.contains('open')) return;
    if (mobileMenu.contains(event.target) || menuButton.contains(event.target)) return;
    closeMobileMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) closeMobileMenu();
  });
}
