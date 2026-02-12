const list = document.getElementById("articles");

const renderEmpty = () => {
  list.innerHTML = `
    <article class="panel">
      <h3>No articles yet</h3>
      <p>Add your first markdown file and update the manifest to publish it.</p>
    </article>
  `;
};

const renderArticle = (article, html) => {
  const wrapper = document.createElement("article");
  wrapper.className = "list-item";

  const left = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = article.title;

  const meta = document.createElement("p");
  meta.textContent = `${article.date}${article.venue ? " · " + article.venue : ""}`;

  left.appendChild(title);
  left.appendChild(meta);

  const preview = document.createElement("div");
  preview.className = "article-preview";
  preview.innerHTML = html;

  wrapper.appendChild(left);
  wrapper.appendChild(preview);

  list.appendChild(wrapper);
};

const fetchMarkdown = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.text();
};

const loadArticles = async () => {
  try {
    const response = await fetch("./manifest.json");
    if (!response.ok) {
      renderEmpty();
      return;
    }

    const data = await response.json();
    if (!Array.isArray(data.articles) || data.articles.length === 0) {
      renderEmpty();
      return;
    }

    list.innerHTML = "";

    for (const article of data.articles) {
      const markdown = await fetchMarkdown(`./${article.file}`);
      const html = marked.parse(markdown);
      renderArticle(article, html);
    }
  } catch (error) {
    renderEmpty();
  }
};

loadArticles();
