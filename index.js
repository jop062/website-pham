// =============================
// ===== Wait for DOM ==========
// =============================
document.addEventListener("DOMContentLoaded", () => {

  // =============================
  // ===== Year ==================
  // =============================
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // =============================
  // ===== Auto Theme (PST) ======
  // =============================
  function setThemeByPST() {
    const now = new Date();
    const pstHour = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "numeric",
      hour12: false,
    }).format(now);

    const hour = parseInt(pstHour, 10);
    const isLight = hour >= 7 && hour < 18;

    document.body.classList.toggle("dark", !isLight);

    const pill = document.getElementById("themePill");
    if (pill) {
      pill.textContent = isLight
        ? "PST Light Mode"
        : "PST Dark Mode";
    }
  }

  setThemeByPST();
  setInterval(setThemeByPST, 60000);

  // =============================
  // ===== Sidebar Toggle ========
  // =============================
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarNav = document.getElementById("sidebarNav");

  if (sidebarToggle && sidebarNav) {
    sidebarToggle.addEventListener("click", () => {
      const open = sidebarNav.classList.toggle("is-open");
      sidebarToggle.setAttribute("aria-expanded", String(open));
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (sidebarNav.classList.contains("is-open")) {
          sidebarNav.classList.remove("is-open");
          sidebarToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // =============================
  // ===== Active Section =========
  // =============================
  const navLinks = Array.from(
    document.querySelectorAll(".nav-link")
  ).filter(el => el.tagName.toLowerCase() === "a");

  const sections = navLinks
    .map(a => a.getAttribute("href"))
    .filter(href => href?.startsWith("#"))
    .map(id => document.getElementById(id.slice(1)))
    .filter(Boolean);

  function setActiveLink(id) {
    navLinks.forEach(a => {
      const match = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("active", match);
    });
  }

  window.addEventListener("scroll", () => {
    const offset = 160;
    let current = sections[0]?.id || "";

    for (const sec of sections) {
      if (sec.getBoundingClientRect().top - offset <= 0) {
        current = sec.id;
      }
    }

    if (current) setActiveLink(current);
  });

  if (sections[0]) setActiveLink(sections[0].id);

  // =============================
  // ===== Reveal Animation ======
  // =============================
  const revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => io.observe(el));
  }

  // =============================
  // ===== Resume Modal ==========
  // =============================
  const resumeBtn = document.getElementById("resumeBtn");
  const resumeModal = document.getElementById("resumeModal");
  const resumeClose = document.getElementById("resumeClose");
  const resumeForm = document.getElementById("resumeForm");

  // Make sure this EXACTLY matches your file name
  const RESUME_FILE = "Resume-JonathanPham.docx (4).pdf";

  // Your Formspree endpoint
  const FORMSPREE_RESUME_ENDPOINT = "https://formspree.io/f/xjgepvyz";

  function openModal() {
    if (!resumeModal) return;
    resumeModal.style.display = "flex";
    resumeModal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!resumeModal) return;
    resumeModal.style.display = "none";
    resumeModal.setAttribute("aria-hidden", "true");
  }

  if (resumeBtn) resumeBtn.addEventListener("click", openModal);
  if (resumeClose) resumeClose.addEventListener("click", closeModal);

  if (resumeModal) {
    resumeModal.addEventListener("click", (e) => {
      if (e.target === resumeModal) closeModal();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // =============================
  // ===== Resume Submit =========
  // =============================
  if (resumeForm) {
    resumeForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = resumeForm.email.value.trim();
      if (!email) return;

      try {
        await fetch(FORMSPREE_RESUME_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            type: "resume_view",
            email,
            timestamp: new Date().toISOString(),
            page: window.location.href
          }),
        });
      } catch (err) {
        console.warn("Tracking failed:", err);
      }

      // Always open resume
      window.open(RESUME_FILE, "_blank", "noopener");

      resumeForm.reset();
      closeModal();
    });
  }

});
