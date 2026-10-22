/* Booking page: session choice, calendar and live summary */
(() => {
  const form = document.getElementById("bookForm");
  const services = [...form.querySelectorAll('input[name="service"]')];
  const summary = document.getElementById("summary");

  // Prefill from links like book.html?s=rolling
  const s = new URLSearchParams(location.search).get("s");
  if (services.some(x => x.dataset.k === s)) services.forEach(x => { x.checked = x.dataset.k === s; });

  /* Calendar: from tomorrow up to ~3 months ahead */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const first = new Date(today); first.setDate(first.getDate() + 1);
  const last = new Date(today); last.setDate(last.getDate() + 90);
  let view = new Date(first.getFullYear(), first.getMonth(), 1);
  let picked = null;
  const grid = document.getElementById("calGrid"), monthEl = document.getElementById("calMonth");
  const prev = document.getElementById("calPrev"), next = document.getElementById("calNext");
  const locale = "en-GB";

  function drawCal() {
    const y = view.getFullYear(), m = view.getMonth();
    monthEl.textContent = view.toLocaleDateString(locale, { month: "long", year: "numeric" });
    const dows = [...Array(7)].map((_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: "short" }));
    let html = dows.map(d => `<span class="dow">${d}</span>`).join("");
    const lead = (new Date(y, m, 1).getDay() + 6) % 7;
    html += "<span></span>".repeat(lead);
    const days = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= days; d++) {
      const dt = new Date(y, m, d);
      const off = dt < first || dt > last;
      const sel = picked && dt.getTime() === picked.getTime();
      html += `<button type="button" data-d="${d}"${off ? " disabled" : ""}${sel ? ' class="sel"' : ""}>${d}</button>`;
    }
    grid.innerHTML = html;
    prev.disabled = y === first.getFullYear() && m === first.getMonth();
    next.disabled = new Date(y, m + 1, 1) > last;
  }
  grid.addEventListener("click", e => {
    const b = e.target.closest("button[data-d]");
    if (!b || b.disabled) return;
    picked = new Date(view.getFullYear(), view.getMonth(), +b.dataset.d);
    document.getElementById("dateErr").hidden = true;
    drawCal(); update();
  });
  prev.addEventListener("click", () => { view.setMonth(view.getMonth() - 1); drawCal(); });
  next.addEventListener("click", () => { view.setMonth(view.getMonth() + 1); drawCal(); });

  function update() {
    const svc = services.find(x => x.checked);
    const isEvent = svc.dataset.k === "events";
    document.getElementById("dateTitle").textContent = isEvent ? "Event day" : "Preferred day";
    document.getElementById("fDate").value = picked ? `${picked.getFullYear()}-${String(picked.getMonth() + 1).padStart(2, "0")}-${String(picked.getDate()).padStart(2, "0")}` : "";
    const car = form.car.value.trim();
    const when = picked ? picked.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" }) : "no day picked yet";
    summary.innerHTML = `<b>${svc.value}</b>${car ? " · " + car.replace(/[<>&]/g, "") : ""}<br>${when} · ${form.time.value}`;
  }
  form.addEventListener("change", update);
  form.car.addEventListener("input", update);
  drawCal(); update();

  netlifySubmit(form, document.getElementById("bookBox"), () => {
    if (!picked) { document.getElementById("dateErr").hidden = false; grid.scrollIntoView({ behavior: "smooth", block: "center" }); return false; }
    update();
  });
})();
