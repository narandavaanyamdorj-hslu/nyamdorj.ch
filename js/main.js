document.getElementById("year").textContent = new Date().getFullYear();

const feed = document.getElementById("journal-feed");

if (feed && typeof JOURNAL !== "undefined") {
  feed.innerHTML = JOURNAL.map(item => `
    <article class="entry">
      <time class="entry-date">${item.date}</time>
      <div class="entry-body">
        ${item.title ? `<h3>${item.title}</h3>` : ""}
        <p>${item.text}</p>
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
