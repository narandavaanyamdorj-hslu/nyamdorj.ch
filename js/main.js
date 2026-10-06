const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const feed = document.getElementById("journal-feed");

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function render(posts) {
  feed.innerHTML = posts.map(item => `
    <article class="entry">
      <time class="entry-date">${escapeHtml(item.date || "")}</time>
      <div class="entry-body">
        ${item.title ? `<h3>${escapeHtml(item.title)}</h3>` : ""}
        <p>${escapeHtml(item.text || "")}</p>
      </div>
    </article>
  `).join("");

  // Sanftes Einblenden beim Scrollen
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const entries = feed.querySelectorAll(".entry");
  if (reduce || !("IntersectionObserver" in window)) {
    entries.forEach(e => e.classList.add("in"));
  } else {
    const io = new IntersectionObserver((rows, obs) => {
      rows.forEach(row => {
        if (row.isIntersecting) { row.target.classList.add("in"); obs.unobserve(row.target); }
      });
    }, { threshold: 0.2 });
    entries.forEach(e => io.observe(e));
  }
}

async function loadJournal() {
  if (!feed) return;
  try {
    const res = await fetch("data/posts.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const posts = Array.isArray(data) ? data : (data.posts || []);
    render(posts);
  } catch (err) {
    feed.innerHTML = '<p style="color:var(--ink-faint)">Die Posts konnten gerade nicht geladen werden.</p>';
    console.error("Journal laden fehlgeschlagen:", err);
  }
}

loadJournal();
