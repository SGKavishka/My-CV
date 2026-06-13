const year = document.querySelector("#current-year");
if (year) {
  year.textContent = new Date().getFullYear();
}

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
