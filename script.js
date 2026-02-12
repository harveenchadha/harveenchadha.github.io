const sections = document.querySelectorAll(".section, .hero-card");

const reveal = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(reveal, {
  threshold: 0.12,
});

sections.forEach((section) => {
  section.classList.add("reveal");
  observer.observe(section);
});
