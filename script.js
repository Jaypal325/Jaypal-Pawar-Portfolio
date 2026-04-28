// ===== THEME TOGGLE =====
const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");
const icon = document.querySelector(".toggle-icon");
const saved = localStorage.getItem("theme");

function applyTheme(t) {
  if (t === "light") { root.dataset.theme = "light"; icon.textContent = "☾"; }
  else { delete root.dataset.theme; icon.textContent = "☀"; }
  toggle.setAttribute("aria-label", t === "light" ? "Switch to dark" : "Switch to light");
}
applyTheme(saved || "dark");
toggle.addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  localStorage.setItem("theme", next);
  applyTheme(next);
});

// ===== SCROLL REVEAL =====
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
document.querySelectorAll(".reveal").forEach(el => obs.observe(el));

// ===== ROLE ROTATOR (TYPEWRITER) =====
const roles = ["Python Developer", "Gen AI Developer", "Backend Engineer", "API Architect", "Automation Engineer"];
const roleEl = document.getElementById("role-text");
let roleIdx = 0, charIdx = 0, isDeleting = false;

function typeRole() {
  const current = roles[roleIdx];
  if (!isDeleting) {
    roleEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeRole, 2000); // pause at full text
      return;
    }
    setTimeout(typeRole, 80);
  } else {
    roleEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(typeRole, 400); // pause before next word
      return;
    }
    setTimeout(typeRole, 40);
  }
}
typeRole();

// ===== FAQ ACCORDION =====
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const wasActive = item.classList.contains("active");
    document.querySelectorAll(".faq-item.active").forEach(o => o.classList.remove("active"));
    if (!wasActive) item.classList.add("active");
  });
});

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll("section[id], .section-block[id]");
const navIcons = document.querySelectorAll(".nav-icon");
window.addEventListener("scroll", () => {
  const y = window.scrollY + 200;
  let matched = false;
  sections.forEach(s => {
    if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
      navIcons.forEach(l => {
        l.classList.toggle("active", l.getAttribute("href") === `#${s.id}`);
      });
      matched = true;
    }
  });
  // If at top of page, highlight home
  if (!matched && window.scrollY < 100) {
    navIcons.forEach(l => {
      l.classList.toggle("active", l.getAttribute("href") === "#home");
    });
  }
});

// ===== COUNTING ANIMATION =====
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const counters = e.target.querySelectorAll(".count-up");
      const duration = 2000;
      counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        const start = performance.now();
        const updateCount = (currentTime) => {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic, mapped smoothly to avoid final jump
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.min(Math.floor(easeProgress * (target + 1)), target);
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = target;
          }
        };
        requestAnimationFrame(updateCount);
      });
      countObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

const metricsSection = document.querySelector(".metrics");
if (metricsSection) {
  countObs.observe(metricsSection);
}
