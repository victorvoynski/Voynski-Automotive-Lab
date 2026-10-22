/* Sends a form to Netlify Forms without leaving the page, then shows the thank-you state. */
function netlifySubmit(form, box, beforeSend) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (beforeSend && beforeSend() === false) return;
    const err = form.querySelector(".form-err");
    if (err) err.hidden = true;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
      .then(r => { if (!r.ok) throw new Error(r.status); box.classList.add("sent"); box.scrollIntoView({ behavior: "smooth", block: "center" }); })
      .catch(() => { if (err) err.hidden = false; })
      .finally(() => { btn.disabled = false; });
  });
}
