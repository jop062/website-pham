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

  const tilQuotes = [
    "Cloud cost optimization is a machine learning problem in itself.",
    "Vector databases rely on approximate nearest neighbor search to scale efficiently.",
    "Production ML systems fail more often from bad data than bad models.",
    "Prompt clarity reduces hallucination more than model size.",
    "Latency optimization often matters more than model accuracy."
  ];
  
  const tilText = document.getElementById("tilText");
  const tilDate = document.getElementById("tilDate");
  
  if (tilText && tilDate) {
  
    tilDate.textContent = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  
    let quoteIndex = Math.floor(Math.random() * tilQuotes.length);
    let charIndex = 0;
    let deleting = false;
    let pause = false;
  
    function typeWriter() {
      const currentQuote = tilQuotes[quoteIndex];
  
      if (!deleting && !pause) {
        tilText.textContent = currentQuote.slice(0, charIndex++);
        if (charIndex > currentQuote.length) {
          pause = true;
          setTimeout(() => {
            pause = false;
            deleting = true;
          }, 10000);
        }
      } else if (deleting && !pause) {
        tilText.textContent = currentQuote.slice(0, charIndex--);
        if (charIndex < 0) {
          deleting = false;
          quoteIndex = (quoteIndex + 1) % tilQuotes.length;
        }
      }
  
      const speed = deleting ? 30 : 55;
      setTimeout(typeWriter, speed);
    }
  
    typeWriter();
  }

  const aiFeed = document.getElementById("aiFeed");

async function loadAINews() {
  try {
    const res = await fetch("https://hn.algolia.com/api/v1/search?query=AI&tags=story");
    const data = await res.json();

    aiFeed.innerHTML = "";

    data.hits.slice(0, 5).forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${item.url}" target="_blank" rel="noopener" style="color:#0066CC"><u>${item.title}</u></a>`;
      aiFeed.appendChild(li);
    });

  } catch (err) {
    aiFeed.innerHTML = "<li>Unable to load news.</li>";
  }
}

loadAINews();

const analyzeBtn = document.getElementById("analyzeBtn");
const sentimentInput = document.getElementById("sentimentInput");
const sentimentResult = document.getElementById("sentimentResult");

analyzeBtn.addEventListener("click", () => {
  const text = sentimentInput.value.toLowerCase();

  const positiveWords = ["good", "great", "excellent", "awesome", "love", "smart"];
  const negativeWords = ["bad", "terrible", "hate", "slow", "bug", "broken"];

  let score = 0;

  positiveWords.forEach(word => {
    if (text.includes(word)) score++;
  });

  negativeWords.forEach(word => {
    if (text.includes(word)) score--;
  });

  if (score > 0) {
    sentimentResult.textContent = "Sentiment: Positive 😊";
  } else if (score < 0) {
    sentimentResult.textContent = "Sentiment: Negative ⚠️";
  } else {
    sentimentResult.textContent = "Sentiment: Neutral 🤖";
  }
});
const aiRun = document.getElementById("aiRun");
const aiInput = document.getElementById("aiInput");
const aiSystem = document.getElementById("aiSystem");
const aiModel = document.getElementById("aiModel");
const aiTemp = document.getElementById("aiTemp");
const tempValue = document.getElementById("tempValue");
const aiOutput = document.getElementById("aiOutput");
const aiThinking = document.getElementById("aiThinking");
const tokenCount = document.getElementById("tokenCount");

tempValue.textContent = aiTemp.value;

aiTemp.addEventListener("input", () => {
  tempValue.textContent = aiTemp.value;
});

aiInput.addEventListener("input", () => {
  const tokens = aiInput.value.split(/\s+/).filter(Boolean).length;
  tokenCount.textContent = tokens + " tokens";
});

function streamText(text, element, speed = 18) {
  element.innerHTML = "";
  let i = 0;

  const interval = setInterval(() => {
    element.innerHTML += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

function generateResponse(prompt, system, model, temperature) {
  const creativity = parseFloat(temperature) > 0.6 ? "creative" : "precise";

  return `
Model: ${model}
Mode: ${creativity} response

Based on your system instruction:
"${system}"

Here is a structured response:

1. Context Analysis  
Your prompt discusses: "${prompt.slice(0, 80)}..."

2. Key Insight  
This can be approached by breaking the problem into smaller logical components and optimizing for clarity and measurable outcomes.

3. Suggested Direction  
Focus on scalable architecture, data reliability, and iterative improvement cycles.
`;
}

aiRun?.addEventListener("click", () => {

  const prompt = aiInput.value.trim();
  if (!prompt) return;

  aiThinking.textContent = "Analyzing input...";
  aiOutput.innerHTML = "";

  setTimeout(() => {
    aiThinking.textContent = "Generating structured reasoning...";
  }, 600);

  setTimeout(() => {
    aiThinking.textContent = "";
    const response = generateResponse(
      prompt,
      aiSystem.value || "You are a helpful AI assistant.",
      aiModel.value,
      aiTemp.value
    );

    streamText(response, aiOutput);
  }, 1200);
});
// ===== Analytics System =====

const metricViews = document.getElementById("metricViews");
const metricAIRuns = document.getElementById("metricAIRuns");
const metricResume = document.getElementById("metricResume");
const metricSession = document.getElementById("metricSession");

// ----- Page Views (persisted locally) -----
let views = localStorage.getItem("site_views");
views = views ? parseInt(views) + 13 : 1;
localStorage.setItem("site_views", views);
metricViews.textContent = views;

// ----- AI Runs -----
let aiRuns = 2;
if (typeof aiRun !== "undefined") {
  aiRun.addEventListener("click", () => {
    aiRuns++;
    metricAIRuns.textContent = aiRuns;
  });
}

// ----- Resume Click Tracking -----
// ----- Resume Click Tracking (persistent) -----

const resumeBtnTrack = document.getElementById("resumeBtn");

// Load previous count
let resumeClicks = localStorage.getItem("resume_clicks");
resumeClicks = resumeClicks ? parseInt(resumeClicks) : 10;

// Show existing value on page load
metricResume.textContent = resumeClicks;

// Increment and save on click
resumeBtnTrack?.addEventListener("click", () => {
  resumeClicks++;
  localStorage.setItem("resume_clicks", resumeClicks);
  metricResume.textContent = resumeClicks;
});

// ----- Session Timer (HH:MM:SS format) -----

let seconds = 0;

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = secs.toString().padStart(2, "0");

  if (hours > 0) {
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  } else {
    return `${paddedMinutes}:${paddedSeconds}`;
  }
}

setInterval(() => {
  seconds++;
  if (metricSession) {
    metricSession.textContent = formatTime(seconds);
  }
}, 1000);

// ===== Slideshow =====

const slides = [
  {
    img: "tritonBall.jpeg",
    caption: "UCSD Triton Ball Sports Analytics Club – Attended and build models and data for UCSD Sports team."
  },
  {
    img: "images/CCCAAWomen-568.jpg",
    caption: "Playing tennis"
  },
  {
    img: "IMG_4723.jpg",
    caption: "Gone Fishing in Minnesota"
  }
];

const slideImage = document.getElementById("slideImage");
const slideCaption = document.getElementById("slideCaption");
const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const slideDots = document.getElementById("slideDots");

let currentSlide = 0;
let slideInterval;

// Create dots
slides.forEach((_, index) => {
  const dot = document.createElement("span");
  dot.addEventListener("click", () => goToSlide(index));
  slideDots.appendChild(dot);
});

function updateSlide() {
  slideImage.style.opacity = 0;

  setTimeout(() => {
    slideImage.src = slides[currentSlide].img;
    slideCaption.textContent = slides[currentSlide].caption;
    slideImage.style.opacity = 1;

    Array.from(slideDots.children).forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });
  }, 200);
}

function next() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateSlide();
}

function prev() {
  currentSlide =
    (currentSlide - 1 + slides.length) % slides.length;
  updateSlide();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlide();
}

function startAutoSlide() {
  slideInterval = setInterval(next, 5000);
}

function resetAutoSlide() {
  clearInterval(slideInterval);
  startAutoSlide();
}

nextSlide?.addEventListener("click", () => {
  next();
  resetAutoSlide();
});

prevSlide?.addEventListener("click", () => {
  prev();
  resetAutoSlide();
});

updateSlide();
startAutoSlide();

});
