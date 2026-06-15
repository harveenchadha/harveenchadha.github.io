fetch("./manifest.json")
  .then((r) => r.json())
  .then(({ papers }) => {
    const container = document.getElementById("papers-container");
    if (!papers.length) {
      container.innerHTML = "<p>No publications yet.</p>";
      return;
    }

    container.innerHTML = papers
      .map((p) => {
        const links = [
          p.pdf ? `<a href="${p.pdf}" target="_blank" rel="noreferrer">PDF</a>` : "",
          p.code ? `<a href="${p.code}" target="_blank" rel="noreferrer">Code</a>` : "",
          p.slides ? `<a href="${p.slides}" target="_blank" rel="noreferrer">Slides</a>` : "",
        ]
          .filter(Boolean)
          .join("");

        return `
          <article class="paper">
            <div class="paper-info">
              <h3>${p.title}</h3>
              <p class="paper-authors">${p.authors}</p>
              ${p.venue || p.year ? `<p class="paper-venue">${[p.venue, p.year].filter(Boolean).join(", ")}</p>` : ""}
              ${p.abstract ? `<p style="color:var(--muted);font-size:0.9rem;margin-top:8px;line-height:1.6">${p.abstract}</p>` : ""}
            </div>
            ${links ? `<div class="paper-links">${links}</div>` : ""}
          </article>`;
      })
      .join("");
  })
  .catch(() => {
    document.getElementById("papers-container").innerHTML =
      "<p>Could not load publications.</p>";
  });
