const list = document.getElementById("papers");

const renderEmpty = () => {
  list.innerHTML = `
    <article class="panel">
      <h3>No papers yet</h3>
      <p>Add your first entry in papers/manifest.json to publish it.</p>
    </article>
  `;
};

const renderPaper = (paper) => {
  const wrapper = document.createElement("article");
  wrapper.className = "list-item";

  const left = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = paper.title;

  const meta = document.createElement("p");
  meta.textContent = `${paper.authors} · ${paper.venue} · ${paper.year}`;

  left.appendChild(title);
  left.appendChild(meta);

  const abstract = document.createElement("p");
  abstract.className = "paper-abstract";
  abstract.textContent = paper.abstract;

  const actions = document.createElement("div");
  actions.className = "list-actions";

  if (paper.pdf) {
    const pdf = document.createElement("a");
    pdf.href = paper.pdf;
    pdf.target = "_blank";
    pdf.rel = "noreferrer";
    pdf.textContent = "PDF";
    actions.appendChild(pdf);
  }

  if (paper.code) {
    const code = document.createElement("a");
    code.href = paper.code;
    code.target = "_blank";
    code.rel = "noreferrer";
    code.textContent = "Code";
    actions.appendChild(code);
  }

  if (paper.slides) {
    const slides = document.createElement("a");
    slides.href = paper.slides;
    slides.target = "_blank";
    slides.rel = "noreferrer";
    slides.textContent = "Slides";
    actions.appendChild(slides);
  }

  wrapper.appendChild(left);
  wrapper.appendChild(abstract);
  wrapper.appendChild(actions);

  list.appendChild(wrapper);
};

const loadPapers = async () => {
  try {
    const response = await fetch("./manifest.json");
    if (!response.ok) {
      renderEmpty();
      return;
    }

    const data = await response.json();
    if (!Array.isArray(data.papers) || data.papers.length === 0) {
      renderEmpty();
      return;
    }

    list.innerHTML = "";
    data.papers.forEach(renderPaper);
  } catch (error) {
    renderEmpty();
  }
};

loadPapers();
