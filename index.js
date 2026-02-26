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

// =======================
// ===== Slideshow =======
// =======================

const slides = [
  {
    src: "images/tritonBall.jpeg",
    caption: "UCSD Triton Ball Sports Analytics Club – Built models and analytics for UCSD sports teams."
  },
  {
    src: "images/CCCAAWomen-568.jpg",
    caption: "Playing tennis"
  },
  {
    src: "images/IMG_4723.jpg",
    caption: "Fishing in Minnesota"
  }
];

const slideImage = document.getElementById("slideImage");
const slideCaption = document.getElementById("slideCaption");
const slideDots = document.getElementById("slideDots");

let currentSlide = 0;
let slideInterval;

// Create dots dynamically
function renderDots() {
  slideDots.innerHTML = "";
  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    if (index === currentSlide) dot.classList.add("active");
    dot.addEventListener("click", () => {
      goToSlide(index);
      resetAutoSlide();
    });
    slideDots.appendChild(dot);
  });
}

function updateSlide() {
  slideImage.style.opacity = 0;

  setTimeout(() => {
    slideImage.src = slides[currentSlide].src;
    slideCaption.textContent = slides[currentSlide].caption;
    slideImage.style.opacity = 1;
    renderDots();
  }, 200);
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateSlide();
}

function prevSlide() {
  currentSlide =
    (currentSlide - 1 + slides.length) % slides.length;
  updateSlide();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlide();
}

function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
  clearInterval(slideInterval);
  startAutoSlide();
}

// Hook up buttons
document.getElementById("nextSlide")?.addEventListener("click", () => {
  nextSlide();
  resetAutoSlide();
});

document.getElementById("prevSlide")?.addEventListener("click", () => {
  prevSlide();
  resetAutoSlide();
});

// Initialize
updateSlide();

startAutoSlide();

// =============================
// ===== Sidebar Collapse =======
// =============================
const sidebarCollapse = document.getElementById("sidebarCollapse");
const sidebar = document.querySelector(".sidebar");

if (sidebarCollapse && sidebar) {
  // Restore saved state
  if (localStorage.getItem("sidebar_collapsed") === "true") {
    sidebar.classList.add("collapsed");
  }

  sidebarCollapse.addEventListener("click", () => {
    const isCollapsed = sidebar.classList.toggle("collapsed");
    localStorage.setItem("sidebar_collapsed", isCollapsed);

    // Update content margin directly since CSS sibling selector 
    // won't reach across the layout
    const content = document.querySelector(".content");
    if (content) {
      content.style.marginLeft = isCollapsed ? "82px" : "calc(240px + 18px)";
    }
  });
}
// =============================
// ===== Floating AI Chat =======
// =============================
const chatFab = document.getElementById("chatFab");
const chatPanel = document.getElementById("chatPanel");
const chatClose = document.getElementById("chatClose");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const chatMessages = document.getElementById("chatMessages");

const JONATHAN_CONTEXT = `
You are a friendly AI assistant embedded on Jonathan Pham's personal portfolio website.
You answer questions about Jonathan in a warm, professional, and natural tone — always in full sentences.
Never say "I don't know" — use only the facts below. If something isn't covered, say Jonathan hasn't shared that detail yet.

FACTS ABOUT JONATHAN PHAM:
- Full name: Jonathan Pham
- Currently a student at the University of California, San Diego (UCSD), located in La Jolla, California
- Major: Data Analytics
- Seeking internships for Summer 2026
- Email: jop062@ucsd.edu
- Phone: (858) 280-1309
- LinkedIn: linkedin.com/in/jonathan-pham-9ab3942a6
- GitHub: github.com/jop062

EXPERIENCE:
- Data Insight Intern at THORPETO INC. (Summer 2025): analyzed operational data, built reporting workflows, delivered insights for process and marketing improvements
- UC San Diego student projects: ML and analytics using Python, Pandas, scikit-learn; SQL reporting and data cleaning; team-based work

PROJECTS:
- LLM Assistant Prototype: Built a Retrieval-Augmented Generation (RAG) assistant using Python, Embeddings, FAISS. Indexes custom documents, retrieves context via vector search, generates grounded responses. Includes latency tracking and retrieval evaluation. GitHub: github.com/jop062/llm-rag-assistant
- Analytics Dashboard: Interactive dashboard tracking revenue, customer growth, and churn using SQL and Pandas. Automated KPI calculations for a simulated SaaS business. GitHub: github.com/jop062/analytics-kpi-dashboard
- Automation Scripts: Python and Bash scripts that standardize workflows and reduce manual steps

SKILLS:
Python, SQL, Java, C++, Pandas, scikit-learn, Git, Linux, APIs, Data Visualization, Stata, R, React, Embeddings, FAISS, RAG, Bash

LEADERSHIP:
- AI Club Project Lead at UCSD: led a 6-person team building a retrieval-based AI assistant, defined architecture and milestones, presented to faculty and industry mentors
- Sports Analytics Member at UCSD Analytics Group: data modeling projects, forecasting competitions

PERSONAL INTERESTS:
- Tennis, fishing, strategy games like Tetris
- Passionate about building scalable, production-ready ML systems
- Philosophy: clarity over complexity, systems over scripts, measurable performance over hype

Only answer questions about Jonathan. If asked about anything unrelated, politely redirect the conversation back to Jonathan.
`;

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `chat-msg chat-msg--${type}`;
  div.innerHTML = `<span>${text}</span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = "";
  addMessage(text, "user");

  const typingEl = addMessage("Thinking...", "typing");

  // Simulate a short delay for realism
  await new Promise(r => setTimeout(r, 800));

  const reply = getSmartReply(text);
  typingEl.remove();
  addMessage(reply, "ai");
}

function getSmartReply(question) {
  const q = question.toLowerCase();

  // College / Education
  if (q.match(/college|university|school|ucsd|study|studying|major|degree|education/)) {
    return "Jonathan currently attends the University of California, San Diego (UCSD), located in La Jolla, California. He is studying Data Analytics and is expected to graduate in 2027.";
  }

  // Location
  if (q.match(/where.*live|where.*from|location|city|san diego|la jolla/)) {
    return "Jonathan is based in San Diego, California — home to UCSD where he currently studies Data Analytics.";
  }

  // Internship / Job
  if (q.match(/intern|job|hire|hiring|available|open to|work|employ|opportunit/)) {
    return "Jonathan is actively seeking internships for Summer 2026! He's open to roles in data analytics, machine learning, software engineering, and AI. You can reach him at jop062@ucsd.edu or through the Contact section.";
  }

  // Experience
  if (q.match(/experience|work history|worked|thorpeto|past job/)) {
    return "Jonathan interned at THORPETO INC. during Summer 2025 as a Data Insight Intern, where he analyzed operational data, built reporting workflows, and delivered actionable insights for marketing and process improvements.";
  }

  // Projects
  if (q.match(/project|built|build|rag|llm|dashboard|automation|portfolio/)) {
    return "Jonathan has built several impressive projects! His standout work includes an LLM RAG Assistant (using Python, FAISS, and embeddings), an Analytics KPI Dashboard (SQL + Pandas), and various automation scripts. You can find them on his GitHub at github.com/jop062.";
  }

  // Skills
  if (q.match(/skill|know|language|tech|stack|python|sql|tools|code|coding|program/)) {
    return "Jonathan is skilled in Python, SQL, Java, C++, Pandas, scikit-learn, Git, Linux, R, React, FAISS, RAG, Embeddings, Bash, Stata, and data visualization. He's particularly strong in data analytics and machine learning workflows.";
  }

  // Leadership
  if (q.match(/lead|leadership|club|team|ai club|sports analytics/)) {
    return "Jonathan served as AI Club Project Lead at UCSD, where he led a 6-person team building a retrieval-based AI assistant. He also participated in the UCSD Sports Analytics Group, contributing to data modeling and forecasting competitions.";
  }

  // Contact
  if (q.match(/contact|email|phone|reach|linkedin|github|social/)) {
    return "You can reach Jonathan at jop062@ucsd.edu or by phone at (858) 280-1309. He's also on LinkedIn at linkedin.com/in/jonathan-pham-9ab3942a6 and GitHub at github.com/jop062.";
  }

  // Hobbies / Personal
  if (q.match(/hobby|hobbies|interest|fun|outside|personal|tennis|fish|tetris|sport/)) {
    return "Outside of tech, Jonathan enjoys playing tennis, fishing, and playing strategy games like Tetris. He sees these as disciplines that reinforce focus, iteration, and competitive thinking — qualities he also brings to his engineering work.";
  }

  // Name / Who
  if (q.match(/who|name|jonathan|tell me about/)) {
    return "Jonathan Pham is a Data Analytics student at UC San Diego with a passion for building practical AI and data-driven systems. He's interned at THORPETO INC., led AI projects on campus, and is actively seeking Summer 2026 internships.";
  }

  // Resume
  if (q.match(/resume|cv|download/)) {
    return "You can request Jonathan's resume by clicking the Resume button in the sidebar! It'll ask for your email so Jonathan knows who's viewing it.";
  }

  // Fallback
  return "That's a great question! Jonathan hasn't shared that specific detail yet. Feel free to reach out to him directly at jop062@ucsd.edu — he'd love to connect!";
}
// Toggle chat open/close
chatFab?.addEventListener("click", () => {
  const isOpen = chatPanel.classList.toggle("is-open");
  chatPanel.setAttribute("aria-hidden", String(!isOpen));
  if (isOpen) chatInput.focus();
});

chatClose?.addEventListener("click", () => {
  chatPanel.classList.remove("is-open");
  chatPanel.setAttribute("aria-hidden", "true");
});

// Send on button click or Enter
chatSend?.addEventListener("click", sendMessage);
chatInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

//}); // closes DOMContentLoaded
});
