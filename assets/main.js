/* Voynski Automotive Lab: shared behaviour for every page */

// Contact details and sister sites live here so every page shows the same thing.
// TODO: check the Instagram handle with Victor.
const CONTACT = { email: "hello@voynskiautomotivelab.com", instagram: "voynskiautomotivelab" };
// TODO: put the live Brand Lab address here once it has one.
const LABS = { brand: "#" };

const page = document.body.dataset.page;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const t = (k, fallback) => fallback || k;
const lang = "en";

/* ---------- Header, menu, footer ---------- */
const NAV = [
  ["index.html", "home", "Home"],
  ["services.html", "services", "Services"],
  ["about.html", "about", "About"],
  ["contact.html", "contact", "Contact"],
];
const navLinks = NAV.map(([href, key, label], i) => `<a href="${href}"${page === key ? ' class="active"' : ""}><span>0${i + 1}</span>${label}</a>`).join("");
const logo = `<a href="index.html" class="logo" aria-label="Voynski Automotive Lab home"><span class="logo-mark" aria-hidden="true"><i></i><i></i><i></i></span><span><b>VOYNSKI</b><small>AUTOMOTIVE LAB</small></span></a>`;

document.body.insertAdjacentHTML("afterbegin", `
<header class="site-header">
  <div class="wrap">
    ${logo}
    <div class="nav">
      <nav class="nav-links">${navLinks}</nav>
      <a href="book.html" class="btn btn-small">Book now</a>
      <button class="burger" aria-label="Menu"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mobile-menu">${navLinks}<a href="book.html" class="btn">Book now <span class="arr">→</span></a></div>`);

document.body.insertAdjacentHTML("beforeend", `
<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div>${logo}<p style="color:var(--muted);max-width:340px;margin-top:22px">Professional automotive photography for enthusiasts, collectors and brands.</p></div>
      <div><h4>PAGES</h4>${NAV.map(([h, , l]) => `<a href="${h}">${l}</a>`).join("")}<a href="book.html">Book now</a></div>
      <div><h4>CONTACT</h4><a href="mailto:${CONTACT.email}">${CONTACT.email}</a><a href="https://instagram.com/${CONTACT.instagram}" target="_blank" rel="noopener">Instagram ↗</a></div>
      <div><h4>VOYNSKI LABS</h4><a href="index.html">Automotive Lab</a><a href="${LABS.brand}" target="_blank" rel="noopener">Brand Lab ↗</a><a aria-disabled="true" style="opacity:.4;pointer-events:none">Wood Lab · soon</a></div>
    </div>
    <div class="foot-big" aria-hidden="true">Automotive Lab</div>
    <div class="foot-bottom"><span>© ${new Date().getFullYear()} Voynski Automotive Lab · Part of Voynski Labs</span><span>Sofia, Bulgaria</span></div>
  </div>
</footer>
<div class="pass" aria-hidden="true"><i></i><i></i></div>
<div class="hud" aria-hidden="true">
  <div class="spd"><b id="hudSpd">0</b><small>KM/H</small></div>
  <div class="gear"><b id="hudGear">N</b><small>GEAR</small></div>
  <div class="rpm"><div class="leds" id="hudLeds">${"<i></i>".repeat(12)}</div><div class="lap" id="hudLap">LAP 00:00.000</div></div>
</div>`);

// Fill contact placeholders written in page markup.
document.querySelectorAll("[data-c]").forEach(el => {
  const k = el.dataset.c;
  if (k === "email") { el.textContent = CONTACT.email; if (el.tagName === "A") el.href = "mailto:" + CONTACT.email; }
  if (k === "instagram") { el.textContent = "@" + CONTACT.instagram; }
  if (k === "instagram" || k === "instagram-link") { if (el.tagName === "A") el.href = "https://instagram.com/" + CONTACT.instagram; }
  if (k === "brand" && el.tagName === "A") el.href = LABS.brand;
});

const header = document.querySelector(".site-header");
document.querySelector(".burger").addEventListener("click", () => document.body.classList.toggle("menu-open"));
document.querySelectorAll(".mobile-menu a").forEach(a => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

/* ---------- HUD: your scroll speed as a dashboard ---------- */
const hud = document.querySelector(".hud");
const spdEl = document.getElementById("hudSpd"), gearEl = document.getElementById("hudGear");
const leds = [...document.querySelectorAll("#hudLeds i")], lapEl = document.getElementById("hudLap");
const t0 = performance.now();
let lastY = scrollY, lastT = performance.now(), speed = 0, shown = 0;
window.scrollSpeed = 0; // read by the hero speed lines

function frame(now) {
  const dt = Math.max(16, now - lastT);
  const dy = Math.abs(scrollY - lastY);
  const inst = Math.min(340, (dy / dt) * 60);  // pixels per ms → a believable km/h
  speed += (inst - speed) * (inst > speed ? 0.35 : 0.06);
  lastY = scrollY; lastT = now;
  window.scrollSpeed = speed;
  shown += (speed - shown) * 0.2;
  const kmh = Math.round(shown);
  spdEl.textContent = kmh;
  gearEl.textContent = kmh < 3 ? "N" : Math.min(8, 1 + Math.floor(kmh / 42));
  const rev = kmh < 3 ? 0 : ((kmh % 42) / 42) * 12 + (kmh > 300 ? 12 : 0);
  leds.forEach((l, i) => { l.className = i < rev ? (i < 5 ? "g" : i < 9 ? "r" : "p") : ""; });
  const ms = now - t0, m = Math.floor(ms / 60000), s = Math.floor(ms / 1000) % 60, x = Math.floor(ms % 1000);
  lapEl.textContent = `LAP ${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(x).padStart(3, "0")}`;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

let prevY = scrollY;
function onScroll() {
  const y = scrollY;
  header.classList.toggle("solid", y > 30);
  header.classList.toggle("hide", y > 500 && y > prevY && !document.body.classList.contains("menu-open"));
  hud.classList.toggle("on", y > innerHeight * 0.6);
  prevY = y;
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".rv, .wipe").forEach(el => io.observe(el));

/* ---------- Videos play only while on screen ---------- */
const vio = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) e.target.play().catch(() => {}); else e.target.pause();
}), { threshold: 0.25 });
document.querySelectorAll("video[data-auto]").forEach(v => vio.observe(v));

/* ---------- Page transition: a red car passing ---------- */
const pass = document.querySelector(".pass");
let passed = false;
try { passed = !!sessionStorage.getItem("val-pass"); } catch (e) {}
if (!reduced && passed) {
  pass.classList.add("in");
  setTimeout(() => pass.classList.remove("in"), 800);
}
try { sessionStorage.removeItem("val-pass"); } catch (e) {}
document.addEventListener("click", e => {
  const a = e.target.closest("a");
  if (!a || reduced || e.metaKey || e.ctrlKey || a.target === "_blank") return;
  const href = a.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
  e.preventDefault();
  try { sessionStorage.setItem("val-pass", "1"); } catch (err) {}
  pass.classList.remove("in"); pass.classList.add("out");
  setTimeout(() => { location.href = href; }, 520);
});
addEventListener("pageshow", e => { if (e.persisted) pass.classList.remove("out"); });

/* ---------- FAQ: one open at a time ---------- */
document.querySelectorAll(".faq details").forEach(d => d.addEventListener("toggle", () => {
  if (d.open) document.querySelectorAll(".faq details").forEach(o => { if (o !== d) o.open = false; });
}));

// Pages without the start lights are ready straight away.
if (!document.querySelector(".lights")) document.body.classList.add("ready");
