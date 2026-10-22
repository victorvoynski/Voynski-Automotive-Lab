/* Home page: start lights, hero speed lines, paddock gallery */

/* ---------- Start lights: five reds, then lights out ---------- */
(() => {
  const el = document.querySelector(".lights");
  if (!el) return;
  let seen = false;
  try { seen = !!sessionStorage.getItem("val-lights"); } catch (e) {}
  const finish = () => {
    document.body.classList.add("ready");
    el.classList.add("go");
    setTimeout(() => el.remove(), 800);
  };
  if (seen || reduced) { el.remove(); document.body.classList.add("ready"); return; }
  try { sessionStorage.setItem("val-lights", "1"); } catch (e) {}
  const pods = [...el.querySelectorAll(".pod")];
  let i = 0, done = false;
  const skip = () => { if (done) return; done = true; finish(); };
  el.addEventListener("click", skip);
  const tick = setInterval(() => {
    if (done) return clearInterval(tick);
    if (i < pods.length) { pods[i++].classList.add("on"); return; }
    clearInterval(tick);
    setTimeout(() => {
      if (done) return;
      pods.forEach(p => p.classList.remove("on"));
      el.classList.add("done");
      setTimeout(skip, 650);
    }, 300 + Math.random() * 400);
  }, 380);
})();

/* ---------- Hero speed lines: faster when you scroll ---------- */
(() => {
  const cv = document.getElementById("speedLines");
  if (!cv || reduced) return;
  const ctx = cv.getContext("2d");
  let w, h, dpr, lines = [], visible = true;
  const resize = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lines = Array.from({ length: Math.round(w / 18) }, () => spawn(true));
  };
  const spawn = anywhere => ({
    x: anywhere ? Math.random() * w : w + Math.random() * 200,
    y: Math.random() * h,
    len: 60 + Math.random() * 260,
    v: 6 + Math.random() * 14,
    a: .04 + Math.random() * .14,
    red: Math.random() < .12,
  });
  addEventListener("resize", resize);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(cv);
  resize();
  const draw = () => {
    if (visible) {
      ctx.clearRect(0, 0, w, h);
      const boost = 1 + (window.scrollSpeed || 0) / 25;
      for (const l of lines) {
        l.x -= l.v * boost;
        if (l.x + l.len * boost < 0) Object.assign(l, spawn(false));
        const len = l.len * Math.min(4, boost);
        const g = ctx.createLinearGradient(l.x, 0, l.x + len, 0);
        const c = l.red ? "255,31,31" : "244,244,242";
        g.addColorStop(0, `rgba(${c},0)`); g.addColorStop(.3, `rgba(${c},${l.a})`); g.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = g; ctx.fillRect(l.x, l.y, len, l.red ? 2 : 1);
      }
    }
    requestAnimationFrame(draw);
  };
  draw();
})();

/* ---------- Paddock: vertical scroll drives a horizontal gallery ---------- */
(() => {
  const sec = document.querySelector(".paddock");
  if (!sec) return;
  const track = sec.querySelector(".track"), bar = sec.querySelector(".p-progress i"), flag = sec.querySelector(".p-progress span");
  const num = sec.querySelector(".counter b"), frames = [...track.children];
  const pinned = () => innerWidth > 700 && !reduced;
  let dist = 0;
  const size = () => {
    if (!pinned()) { sec.style.height = ""; track.style.transform = ""; track.style.overflowX = "auto"; return; }
    track.style.overflowX = "";
    dist = Math.max(0, track.scrollWidth - innerWidth + 80);
    sec.style.height = innerHeight + dist + "px";
  };
  const update = () => {
    if (!pinned()) return;
    const r = sec.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (sec.offsetHeight - innerHeight || 1)));
    track.style.transform = `translate3d(${-p * dist}px,0,0)`;
    bar.style.width = p * 100 + "%"; flag.style.left = p * 100 + "%";
    num.textContent = String(Math.min(frames.length, 1 + Math.floor(p * frames.length))).padStart(2, "0");
    // Each photo drifts inside its frame a little, like panning the camera.
    frames.forEach(f => {
      const fr = f.getBoundingClientRect();
      const c = (fr.left + fr.width / 2 - innerWidth / 2) / innerWidth;
      f.firstElementChild.style.transform = `scale(1.15) translateX(${c * -6}%)`;
    });
  };
  addEventListener("resize", () => { size(); update(); });
  addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  addEventListener("load", () => { size(); update(); });
  size(); update();
})();
