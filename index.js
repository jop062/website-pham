// ===== Year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Auto Theme Based on PST =====
// Light: 7am–6pm PST, Dark: otherwise
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
  if (pill) pill.textContent = isLight ? "PST Light Mode" : "PST Dark Mode";
}
setThemeByPST();

// Optional: keep it correct if someone leaves the page open
setInterval(setThemeByPST, 60 * 1000);

// ===== Mobile sidebar toggle =====
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarNav = document.getElementById("sidebarNav");

if (sidebarToggle && sidebarNav) {
  sidebarToggle.addEventListener("click", () => {
    const open = sidebarNav.classList.toggle("is-open");
    sidebarToggle.setAttribute("aria-expanded", String(open));
  });
}

// Close mobile nav after click
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (sidebarNav && sidebarNav.classList.contains("is-open")) {
      sidebarNav.classList.remove("is-open");
      sidebarToggle?.setAttribute("aria-expanded", "false");
    }
  });
});

// ===== Active section highlight =====
const navLinks = Array.from(document.querySelectorAll(".nav-link")).filter(
  (el) => el.tagName.toLowerCase() === "a"
);

const sectionIds = navLinks
  .map((a) => a.getAttribute("href"))
  .filter((href) => href && href.startsWith("#"))
  .map((href) => href.slice(1));

const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function setActiveLink(id) {
  navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
}

window.addEventListener("scroll", () => {
  const offset = 160;
  let current = sections[0]?.id || "";

  for (const sec of sections) {
    const top = sec.getBoundingClientRect().top;
    if (top - offset <= 0) current = sec.id;
  }

  if (current) setActiveLink(current);
});

// Set on load
if (sections[0]) setActiveLink(sections[0].id);

// ===== Animated reveal (IntersectionObserver) =====
const revealEls = document.querySelectorAll(".reveal");

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

// ===== Resume Modal + Email gate (Formspree) =====
const resumeBtn = document.getElementById("resumeBtn");
const resumeModal = document.getElementById("resumeModal");
const resumeClose = document.getElementById("resumeClose");
const resumeForm = document.getElementById("resumeForm");

// Put your resume file name here:
const RESUME_FILE = "Resume-JonathanPham.docx (4).pdf";

// IMPORTANT: Replace this with a *separate* Formspree endpoint if you want resume views separate from contact messages.
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

resumeBtn?.addEventListener("click", openModal);
resumeClose?.addEventListener("click", closeModal);

// Close when clicking outside
resumeModal?.addEventListener("click", (e) => {
  if (e.target === resumeModal) closeModal();
});

// ESC closes modal
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

resumeForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = resumeForm.email.value.trim();
  if (!email) return;

  // Send email to Formspree
  try {
    await fetch(FORMSPREE_RESUME_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        type: "resume_view",
        email,
        timestamp: new Date().toISOString(),
        page: window.location.href,
      }),
    });
  } catch (err) {
    // Even if tracking fails, still allow resume
    console.warn("Resume tracking failed:", err);
  }

  // Open resume
  window.open(RESUME_FILE, "_blank", "noopener");

  // Cleanup
  resumeForm.reset();
  closeModal();
});
