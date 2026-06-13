// ---------- Mobile nav ----------
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

// ---------- FAQ accordion ----------
document.querySelectorAll(".faq-q").forEach((btn) => {
  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".faq-q").forEach(b => b.setAttribute("aria-expanded", "false"));
    btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
  });
});

// ---------- Countdown to the wedding ----------
// Wedding morning: 14 August 2026, 10:00 (local time)
const WEDDING = new Date(2026, 7, 14, 10, 0, 0);
const cdEls = {
  days: document.querySelector('[data-cd="days"]'),
  hours: document.querySelector('[data-cd="hours"]'),
  mins: document.querySelector('[data-cd="mins"]'),
  secs: document.querySelector('[data-cd="secs"]'),
};
const cdBox = document.getElementById("countdown");
const cdNote = document.getElementById("cd-note");

function pad(n){ return String(n).padStart(2, "0"); }

function tickCountdown(){
  if (!cdEls.days) return;
  const diff = WEDDING - new Date();
  if (diff <= 0){
    if (cdBox) cdBox.hidden = true;
    if (cdNote) cdNote.hidden = false;
    return;
  }
  const s = Math.floor(diff / 1000);
  cdEls.days.textContent  = Math.floor(s / 86400);
  cdEls.hours.textContent = pad(Math.floor((s % 86400) / 3600));
  cdEls.mins.textContent  = pad(Math.floor((s % 3600) / 60));
  cdEls.secs.textContent  = pad(s % 60);
}
tickCountdown();
setInterval(tickCountdown, 1000);

// ---------- Reveal on scroll ----------
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveals = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  reveals.forEach(el => el.classList.add("in"));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
}

// ---------- Wishes wall ----------
const wall = document.getElementById("wish-wall");
const nameInput = document.getElementById("wish-name");
const msgInput = document.getElementById("wish-msg");
const addBtn = document.getElementById("wish-add");
const sendBtn = document.getElementById("wish-send");
const wishHint = document.getElementById("wish-hint");

// A couple of sample wishes so the wall never looks empty
const seedWishes = [
  { name: "Aunty Niluka", msg: "Wishing you both a lifetime of love, laughter and many happy years ahead." },
  { name: "The Fernando family", msg: "So happy for you two! Can't wait to celebrate under the trees." },
];

function addWishCard({ name, msg }){
  if (!wall) return;
  const card = document.createElement("div");
  card.className = "wish-card";
  const p = document.createElement("p");
  p.textContent = "“" + msg + "”";          // textContent = safe, no HTML injection
  const by = document.createElement("p");
  by.className = "wish-by";
  by.textContent = "— " + (name || "A guest");
  card.appendChild(p);
  card.appendChild(by);
  wall.prepend(card);
}

seedWishes.forEach(addWishCard);

function readWish(){
  const name = (nameInput?.value || "").trim();
  const msg = (msgInput?.value || "").trim();
  return { name, msg };
}

if (addBtn){
  addBtn.addEventListener("click", () => {
    const { name, msg } = readWish();
    if (!msg){ if (wishHint) wishHint.textContent = "Add a short message first 🌿"; return; }
    addWishCard({ name, msg });
    if (wishHint) wishHint.textContent = "Added to the wall — thank you!";
    if (msgInput) msgInput.value = "";
  });
}

if (sendBtn){
  sendBtn.addEventListener("click", () => {
    const { name, msg } = readWish();
    if (!msg){ if (wishHint) wishHint.textContent = "Write a wish, then send it 🌿"; return; }
    const num = sendBtn.getAttribute("data-wa");
    const text = encodeURIComponent(`Wishes for Kasuni & Hasitha — from ${name || "a guest"}:\n${msg}`);
    window.open(`https://wa.me/${num}?text=${text}`, "_blank", "noopener");
    if (wishHint) wishHint.textContent = "Opening WhatsApp to send your wish…";
  });
}

// ---------- Footer year-safe: nothing needed ----------
