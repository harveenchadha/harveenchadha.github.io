fetch("./manifest.json")
  .then((r) => r.json())
  .then(({ articles }) => {
    const container = document.getElementById("articles-container");
    if (!articles.length) return;

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    script.onload = () => {
      articles.forEach((article) => {
        fetch(article.file)
          .then((r) => r.text())
          .then((md) => {
            const el = document.createElement("article");
            el.className = "paper";
            el.innerHTML = `
              <div class="paper-info">
                <h3>${article.title}</h3>
                <p class="paper-venue">${article.date} · ${article.venue}</p>
                <div style="color:var(--muted);margin-top:12px;line-height:1.7">${marked.parse(md)}</div>
              </div>`;
            container.appendChild(el);
          });
      });
    };
    document.head.appendChild(script);
  });
