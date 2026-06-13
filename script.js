const year = document.querySelector("#current-year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const loadingScreen = document.querySelector("#loading-screen");

let startupSoundPlayed = false;

const playStartupSound = async () => {
  if (startupSoundPlayed) {
    return true;
  }

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return false;
  }

  const context = new AudioContext();
  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch {
      return false;
    }
  }

  if (context.state !== "running") {
    return false;
  }

  startupSoundPlayed = true;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.04);
  master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.7);
  master.connect(context.destination);

  [392, 523.25, 659.25].forEach((frequency, index) => {
    const start = context.currentTime + index * 0.12;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.22, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(start);
    oscillator.stop(start + 0.24);
  });

  return true;
};

if (loadingScreen) {
  document.body.classList.add("loading-active");
  playStartupSound();

  const closeLoader = () => {
    loadingScreen.classList.add("is-hidden");
    document.body.classList.remove("loading-active");
    window.setTimeout(() => {
      loadingScreen.hidden = true;
    }, 380);
  };

  window.setTimeout(closeLoader, 1000);
}

["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
  window.addEventListener(eventName, playStartupSound, { once: true, passive: true });
});

const navLinks = [...document.querySelectorAll(".floating-nav a")];
const sectionSelectors = [...new Set(navLinks.map((link) => link.getAttribute("href")))];
const sections = sectionSelectors
  .map((selector) => document.querySelector(selector))
  .filter(Boolean)
  .sort((a, b) => a.getBoundingClientRect().top + window.scrollY - (b.getBoundingClientRect().top + window.scrollY));

const setActiveLink = () => {
  const offset = window.innerHeight * 0.32;
  let activeId = "home";

  sections.forEach((section) => {
    const top = section.getBoundingClientRect().top;
    if (top <= offset) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

setActiveLink();
window.addEventListener("scroll", setActiveLink, { passive: true });
