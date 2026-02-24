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

  console.log("Supabase ready");


  // =============================
  // ===== Safe Element Grab =====
  // =============================

  const get = (id) => document.getElementById(id);

  const resumeBtn = get("resumeBtn");
  const resumeModal = get("resumeModal");
  const resumeClose = get("resumeClose");
  const resumeForm = get("resumeForm");
  const otpSection = get("otpSection");
  const otpStatus = get("otpStatus");
  const verifyCodeBtn = get("verifyCodeBtn");
  const yearEl = get("year");
  const themePill = get("themePill");
  const sidebarToggle = get("sidebarToggle");
  const sidebarNav = get("sidebarNav");

  const RESUME_BUCKET = "resumes";
  const RESUME_PATH = "Resume-JonathanPham.docx (4).pdf";
  const SIGNED_URL_TTL_SECONDS = 60;

  let lastEmail = "";


  // =============================
  // ===== Year ==================
  // =============================

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  // =============================
  // ===== Modal Logic ===========
  // =============================

  function openModal() {
    if (!resumeModal) return;
    resumeModal.style.display = "flex";
  }

  function closeModal() {
    if (!resumeModal) return;
    resumeModal.style.display = "none";

    if (resumeForm) resumeForm.reset();
    if (otpSection) otpSection.style.display = "none";
    if (otpStatus) otpStatus.textContent = "";
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
  // ===== Send OTP ==============
  // =============================

  if (resumeForm) {
    resumeForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = resumeForm.email?.value?.trim();
      if (!email) return;

      if (otpStatus) otpStatus.textContent = "Sending code...";
      lastEmail = email;

      try {
        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error) {
          if (otpStatus) otpStatus.textContent = error.message;
          return;
        }

        if (otpStatus) otpStatus.textContent = "Code sent. Check your email.";
        if (otpSection) otpSection.style.display = "block";

      } catch (err) {
        if (otpStatus) otpStatus.textContent = "Failed to send code.";
        console.error(err);
      }
    });
  }


  // =============================
  // ===== Verify OTP ============
  // =============================

  if (verifyCodeBtn) {
    verifyCodeBtn.addEventListener("click", async () => {

      const otp = resumeForm?.otp?.value?.trim();
      if (!lastEmail || !otp || otp.length !== 6) {
        if (otpStatus) otpStatus.textContent = "Enter the 6-digit code.";
        return;
      }

      if (otpStatus) otpStatus.textContent = "Verifying code...";

      try {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email: lastEmail,
          token: otp,
          type: "email",
        });

        if (verifyError) {
          if (otpStatus) otpStatus.textContent = verifyError.message;
          return;
        }

        const { data, error: signError } = await supabase
          .storage
          .from(RESUME_BUCKET)
          .createSignedUrl(RESUME_PATH, SIGNED_URL_TTL_SECONDS);

        if (signError || !data?.signedUrl) {
          if (otpStatus) otpStatus.textContent = "Could not open resume.";
          return;
        }

        window.open(data.signedUrl, "_blank", "noopener");

        await supabase.auth.signOut();
        closeModal();

      } catch (err) {
        if (otpStatus) otpStatus.textContent = "Verification failed.";
        console.error(err);
      }
    });
  }


  // =============================
  // ===== Theme =================
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

    if (themePill) {
      themePill.textContent = isLight
        ? "PST Light Mode"
        : "PST Dark Mode";
    }
  }

  setThemeByPST();
  setInterval(setThemeByPST, 60000);


  // =============================
  // ===== Sidebar ===============
  // =============================

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

});
