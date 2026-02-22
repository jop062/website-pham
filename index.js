const year = document.getElementById("year");
year.textContent = new Date().getFullYear();

const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "Close" : "Menu";
});

document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const note = document.getElementById("formNote");
  note.textContent =
    "Thanks! This demo form doesn’t send yet. Tell me what platform you want (Netlify, Vercel, Formspree) and I’ll wire it up.";
});