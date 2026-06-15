(() => {
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      toggle.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", open);
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
    ".section, .hero-stats, .timeline-item, .paper, .oss-card, .book-card, .award-card, .edu-card, .patent-card, .model-card"
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
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i * 0.03, 0.3)}s`;
    observer.observe(el);
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = document.querySelector(".site-header").offsetHeight + 16;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: "smooth",
        });
      }
    });
  });

  const feed = document.getElementById("twitter-feed");
  if (feed) {
    setTimeout(() => {
      if (!feed.querySelector("iframe")) {
        feed.innerHTML = `
          <div style="padding:32px;text-align:center;color:var(--muted)">
            <p style="margin-bottom:12px">X feed could not be loaded.</p>
            <a href="https://x.com/HarveenChadha" target="_blank" rel="noreferrer"
               style="color:var(--accent);font-weight:600;text-decoration:none">
              Follow @HarveenChadha on X &rarr;
            </a>
          </div>`;
      }
    }, 8000);
  }
})();
