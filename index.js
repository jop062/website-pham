// Tell CSS that JS is running
document.documentElement.classList.add("js");

window.addEventListener("DOMContentLoaded", () => {

  // =============================
  // ===== Supabase Setup ========
  // =============================

  const SUPABASE_URL = "https://gsvombqvcmdolkdnkxtl.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_IkoPhEXCuKhTcuYIuFbM5A_lyuij7y1";

  if (!window.supabase) {
    console.error("Supabase library not loaded.");
    return;
  }

  const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  console.log("Supabase client ready:", supabase);


  // =============================
  // ===== Resume Modal ==========
  // =============================

  const resumeBtn = document.getElementById("resumeBtn");
  const resumeModal = document.getElementById("resumeModal");
  const resumeClose = document.getElementById("resumeClose");
  const resumeForm = document.getElementById("resumeForm");
  const otpSection = document.getElementById("otpSection");
  const otpStatus = document.getElementById("otpStatus");
  const verifyCodeBtn = document.getElementById("verifyCodeBtn");

  const RESUME_BUCKET = "resumes";
  const RESUME_PATH = "Resume-JonathanPham.pdf";
  const SIGNED_URL_TTL_SECONDS = 60;

  let lastEmail = "";

  function openModal() {
    resumeModal.style.display = "flex";
  }

  function closeModal() {
    resumeModal.style.display = "none";
    resumeForm.reset();
    otpSection.style.display = "none";
    otpStatus.textContent = "";
  }

  resumeBtn?.addEventListener("click", openModal);
  resumeClose?.addEventListener("click", closeModal);
  resumeModal?.addEventListener("click", (e) => {
    if (e.target === resumeModal) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });


  // =============================
  // ===== Send OTP ==============
  // =============================

  resumeForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = resumeForm.email.value.trim();
    if (!email) return;

    otpStatus.textContent = "Sending code...";
    lastEmail = email;

    const { error } = await supabase.auth.signInWithOtp({
      email
    });

    if (error) {
      otpStatus.textContent = error.message;
      return;
    }

    otpStatus.textContent = "Code sent. Check your email.";
    otpSection.style.display = "block";
  });


  // =============================
  // ===== Verify OTP ============
  // =============================

  verifyCodeBtn?.addEventListener("click", async () => {

    const otp = (resumeForm.otp.value || "").trim();
    if (!lastEmail || otp.length !== 6) {
      otpStatus.textContent = "Enter the 6-digit code.";
      return;
    }

    otpStatus.textContent = "Verifying code...";

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: lastEmail,
      token: otp,
      type: "email",
    });

    if (verifyError) {
      otpStatus.textContent = verifyError.message;
      return;
    }

    const { data, error: signError } = await supabase
      .storage
      .from(RESUME_BUCKET)
      .createSignedUrl(RESUME_PATH, SIGNED_URL_TTL_SECONDS);

    if (signError || !data?.signedUrl) {
      otpStatus.textContent = signError?.message || "Could not open resume.";
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener");

    await supabase.auth.signOut();
    closeModal();
  });


  // =============================
  // ===== Year ==================
  // =============================

  document.getElementById("year").textContent =
    new Date().getFullYear();


  // =============================
  // ===== Auto Theme ============
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
      pill.textContent = isLight ? "PST Light Mode" : "PST Dark Mode";
    }
  }

  setThemeByPST();
  setInterval(setThemeByPST, 60000);


  // =============================
  // ===== Sidebar ===============
  // =============================

  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarNav = document.getElementById("sidebarNav");

  sidebarToggle?.addEventListener("click", () => {
    const open = sidebarNav.classList.toggle("is-open");
    sidebarToggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (sidebarNav.classList.contains("is-open")) {
        sidebarNav.classList.remove("is-open");
        sidebarToggle?.setAttribute("aria-expanded", "false");
      }
    });
  });


  // =============================
  // ===== Scroll Highlight ======
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
    navLinks.forEach(a =>
      a.classList.toggle("active", a.getAttribute("href") === `#${id}`)
    );
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


  // =============================
  // ===== Reveal Animation ======
  // =============================

  const revealEls = document.querySelectorAll(".reveal");

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => io.observe(el));

});
