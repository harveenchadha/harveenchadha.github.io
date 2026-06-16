(() => {
  "use strict";

  /* ============================================================
     Year stamp
     ============================================================ */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ============================================================
     Mobile menu toggle
     ============================================================ */
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

  /* ============================================================
     Smooth scroll with sticky header offset
     ============================================================ */
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

  /* ============================================================
     Scroll progress bar
     ============================================================ */
  const progressEl = document.querySelector(".scroll-progress span");
  const updateProgress = () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    progressEl.style.width = pct + "%";
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ============================================================
     Custom cursor (desktop only)
     ============================================================ */
  const cursor = document.querySelector(".cursor");
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");

  if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    let rx = mx,
      ry = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    // Ring follows with easing
    const animateRing = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Magnetic / interactive targets
    const interactive = "a, button, .filter-btn, [data-magnetic], .stat, .paper, .model-card, .oss-card, .award-card, .patent-card";
    document.querySelectorAll(interactive).forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
    });

    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1";
    });
  }

  /* ============================================================
     Magnetic buttons
     ============================================================ */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 18;
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${(x / rect.width) * strength}px, ${
          (y / rect.height) * strength
        }px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ============================================================
     IntersectionObserver — reveal animations
     ============================================================ */
  const targets = document.querySelectorAll(
    ".section, .hero-stats, .timeline-item, .paper, .oss-card, .book-card, .award-card, .patent-card, .model-card, .resp-item"
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
    el.style.transitionDelay = `${Math.min(i * 0.04, 0.4)}s`;
    observer.observe(el);
  });

  /* ============================================================
     Animated counters (hero stats)
     ============================================================ */
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();
    const numEl = el.querySelector(".stat-num");

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(target * eased);
      numEl.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-counter]").forEach((el) => statObserver.observe(el));

  /* ============================================================
     Publication filters
     ============================================================ */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const papers = document.querySelectorAll(".paper");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const filter = btn.dataset.filter;
      papers.forEach((paper) => {
        const year = paper.dataset.year;
        const venue = paper.dataset.venue;
        const show =
          filter === "all" ||
          filter === year ||
          (filter === "interspeech" && venue === "interspeech");
        paper.style.transition = "opacity 0.3s, transform 0.3s, max-height 0.4s, padding 0.4s";
        if (show) {
          paper.style.display = "";
          paper.style.opacity = "1";
          paper.style.transform = "translateX(0)";
          paper.style.maxHeight = "500px";
          paper.style.padding = "28px 0";
          paper.style.margin = "0";
        } else {
          paper.style.opacity = "0";
          paper.style.transform = "translateX(-10px)";
          paper.style.maxHeight = "0";
          paper.style.padding = "0";
          paper.style.margin = "0";
          paper.style.overflow = "hidden";
          setTimeout(() => {
            if (paper.style.opacity === "0") paper.style.display = "none";
          }, 350);
        }
      });
    });
  });

  /* ============================================================
     Scrollspy — side rail + section indicator
     ============================================================ */
  const railLinks = document.querySelectorAll(".rail-list a");
  const sections = [
    { id: "top", el: document.getElementById("top") },
    { id: "about", el: document.getElementById("about") },
    { id: "sarvam", el: document.getElementById("sarvam") },
    { id: "experience", el: document.getElementById("experience") },
    { id: "research", el: document.getElementById("research") },
    { id: "patents", el: document.getElementById("patents") },
    { id: "open-source", el: document.getElementById("open-source") },
    { id: "recognition", el: document.getElementById("recognition") },
  ].filter((s) => s.el);

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id === "top" ? "top" : entry.target.id;
          railLinks.forEach((link) => {
            link.classList.toggle("is-active", link.dataset.rail === id);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: "-20% 0px -50% 0px" }
  );
  sections.forEach((s) => spyObserver.observe(s.el));

  /* ============================================================
     Parallax-ish hero name tilt (subtle)
     ============================================================ */
  const heroName = document.querySelector(".hero-name");
  if (heroName && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const hero = document.querySelector(".hero");
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroName.style.transform = `translate3d(${x * 14}px, ${y * 10}px, 0)`;
    });
    hero.addEventListener("mouseleave", () => {
      heroName.style.transform = "translate3d(0, 0, 0)";
    });
    heroName.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
  }

  /* ============================================================
     Keyboard: Esc closes mobile menu
     ============================================================ */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks && navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();
