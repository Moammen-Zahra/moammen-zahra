if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);
document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);
  const entrance = document.getElementById("entrance");

  if (!entrance) return;

  /* LOCK SCROLL DURING ENTRANCE */
  document.documentElement.classList.add("entrance-lock");
  document.body.classList.add("entrance-lock");

  const preventScroll = (event) => {
    event.preventDefault();
  };

  window.addEventListener("wheel", preventScroll, {
    passive: false
  });

  window.addEventListener("touchmove", preventScroll, {
    passive: false
  });

  /* ENTRANCE TIMELINE */
  setTimeout(() => {

    /* Reveal actual portfolio / blur transition */
    document.body.classList.add("entrance-finished");

    /* Start hiding entrance */
    entrance.classList.add("hide");

    /* WAIT UNTIL FADE IS COMPLETELY FINISHED */
    setTimeout(() => {

      /* UNLOCK SCROLL EXACTLY AFTER FADE */
      document.documentElement.classList.remove("entrance-lock");
      document.body.classList.remove("entrance-lock");

      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);

      /* REMOVE ENTRANCE */
      if (entrance && entrance.parentNode) {
        entrance.remove();
      }

    }, 100);

  }, 4300);

  /* SAFETY CLEANUP */
  window.addEventListener("pagehide", () => {
    document.documentElement.classList.remove("entrance-lock");
    document.body.classList.remove("entrance-lock");

    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);
  });
});
/* Moamen Zahra — Portfolio interactions */

(function () {
  "use strict";

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const stored = localStorage.getItem("mz-theme");
  if (stored) root.setAttribute("data-theme", stored);

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("mz-theme", next);
  });

  /* ---------- Sticky nav shrink ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  const setMenu = (open) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.classList.toggle("open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  menuToggle.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) setMenu(false);
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((l) =>
              l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
            );
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }
})();
const fontFiles = [
  {
    name: "OCR A Std",
    file: "./fonts/OCRAStd.otf"
  },
  {
    name: "Apple Chancery",
    file: "./fonts/Apple Chancery.ttf"
  },
  {
    name: "Chalkduster",
    file: "./fonts/Chalkduster.ttf"
  }
];

async function loadFonts() {
  for (const font of fontFiles) {
    try {
      const loadedFont = new FontFace(
        font.name,
        `url("${font.file}")`
      );

      await loadedFont.load();
      document.fonts.add(loadedFont);

      console.log(`${font.name} loaded successfully`);
    } catch (error) {
      console.error(`${font.name} failed to load:`, error);
    }
  }

  startAnimation();
}

loadFonts();

document.addEventListener("DOMContentLoaded", () => {
  const name = document.getElementById("animated-name");

  if (!name) return;

  const fonts = [
    '"OCR A Std"',
    '"Apple Chancery"',
    '"Chalkduster"',
    'Arial, sans-serif',
    'Georgia, serif'
  ];

  const words = ["Moamen", "Zahra"];
  const typingSpeed = 100;
  const pause = 700;

  const wait = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

  async function typeName(font) {
    name.style.fontFamily = font;
    name.innerHTML = "";

    for (let w = 0; w < words.length; w++) {
      const line = document.createElement("span");
      line.className = "name-line";
      name.appendChild(line);

      for (let i = 0; i < words[w].length; i++) {
        line.textContent = words[w].slice(0, i + 1);
        await wait(typingSpeed);
      }

      if (w === 1) {
        line.innerHTML += '<span class="accent">.</span>';
      }
    }
  }

  async function eraseName() {
    name.innerHTML = "";
  }

  async function startAnimation() {
    for (let i = 0; i < fonts.length; i++) {
      await typeName(fonts[i]);
      await wait(pause);

      if (i < fonts.length - 1) {
        await eraseName();
        await wait(250);
      }
    }
  }

  /*
    WAIT FOR ENTRANCE TO FINISH
    Entrance:
    4300ms = starts fading
    1800ms = fade duration
  */
  setTimeout(() => {
    startAnimation();
  }, 4500);
});
