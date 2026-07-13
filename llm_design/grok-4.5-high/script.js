(() => {
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      toggle.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const targets = document.querySelectorAll(
    ".section, .metric, .contrib, .model, .tl-item, .paper, .accept, .patent, .oss, .book, .award"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
  );

  targets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i * 0.025, 0.25)}s`;
    observer.observe(el);
  });

  // Animated metric counters
  const metrics = document.querySelectorAll(".metric-val[data-count]");
  const metricObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseInt(el.getAttribute("data-count"), 10);
        const duration = 900;
        const start = performance.now();

        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = String(Math.round(end * eased));
          if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        metricObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  metrics.forEach((el) => metricObserver.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const header = document.querySelector(".site-header");
      const offset = (header ? header.offsetHeight : 0) + 12;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: "smooth",
      });
    });
  });
})();
