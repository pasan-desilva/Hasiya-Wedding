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
// Wedding morning: Thursday 13 August 2026, 9:00 am (local time)
const WEDDING = new Date(2026, 7, 13, 9, 0, 0);
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

// ---------- Wishes (submitted to the couple's Google Form) ----------
const nameInput  = document.getElementById("wish-name");
const msgInput   = document.getElementById("wish-msg");
const submitBtn  = document.getElementById("wish-submit");
const waBtn      = document.getElementById("wish-wa");
const wishHint   = document.getElementById("wish-hint");
const wishThanks = document.getElementById("wish-thanks");

// Google Form endpoint + field IDs (from the pre-filled link)
const FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLScnpPR2oSNrJdstGzW4In7_GTzNr3xSWXInKJtKBwnrbG3eXA/formResponse";
const FIELD_NAME = "entry.1024464145";
const FIELD_WISH = "entry.230512055";

function readWish(){
  return {
    name: (nameInput?.value || "").trim(),
    msg:  (msgInput?.value || "").trim(),
  };
}

function showThanks(name, msg){
  if (!wishThanks) return;
  wishThanks.hidden = false;
  wishThanks.innerHTML = "";

  const head = document.createElement("p");
  head.className = "thanks-head";
  head.textContent = "Thank you" + (name ? ", " + name : "") + " — your wish is on its way to us. 🌿";

  const card = document.createElement("div");
  card.className = "wish-card";
  const p = document.createElement("p");
  p.textContent = "“" + msg + "”";          // textContent = safe, no HTML injection
  const by = document.createElement("p");
  by.className = "wish-by";
  by.textContent = "— " + (name || "A guest");
  card.appendChild(p);
  card.appendChild(by);

  wishThanks.appendChild(head);
  wishThanks.appendChild(card);
}

if (submitBtn){
  submitBtn.addEventListener("click", () => {
    const { name, msg } = readWish();
    if (!msg){ if (wishHint) wishHint.textContent = "Write a short message first 🌿"; return; }

    submitBtn.disabled = true;
    if (wishHint) wishHint.textContent = "Sending…";

    const body = new URLSearchParams();
    body.append(FIELD_NAME, name);
    body.append(FIELD_WISH, msg);

    // Google Forms accepts a cross-origin POST; the response is opaque (no-cors),
    // so we optimistically confirm once the request has gone out.
    const finish = () => {
      if (wishHint) wishHint.textContent = "";
      showThanks(name, msg);
      if (nameInput) nameInput.value = "";
      if (msgInput) msgInput.value = "";
      submitBtn.disabled = false;
    };
    fetch(FORM_ACTION, { method: "POST", mode: "no-cors", body })
      .then(finish)
      .catch(finish);
  });
}

if (waBtn){
  waBtn.addEventListener("click", () => {
    const { name, msg } = readWish();
    if (!msg){ if (wishHint) wishHint.textContent = "Write a wish, then send it 🌿"; return; }
    const num = waBtn.getAttribute("data-wa");
    const text = encodeURIComponent(`Wishes for Hasanthika & Hasitha — from ${name || "a guest"}:\n${msg}`);
    window.open(`https://wa.me/${num}?text=${text}`, "_blank", "noopener");
    if (wishHint) wishHint.textContent = "Opening WhatsApp…";
  });
}
