(function () {
  var designs = [
    { id: "claude", label: "Claude Opus 4", path: "/" },
    { id: "glm-5.2", label: "GLM 5.2", path: "/llm_design/glm-5.2/" },
    { id: "grok-4.5-high", label: "Grok 4.5 High", path: "/llm_design/grok-4.5-high/" },
  ];

  var currentPath = window.location.pathname;
  var current = designs.find(function (d) {
    if (d.path === "/") return currentPath === "/" || currentPath === "/index.html";
    return currentPath.startsWith(d.path);
  }) || designs[0];

  var container = document.createElement("div");
  container.className = "design-switcher";

  var btn = document.createElement("button");
  btn.className = "ds-toggle";
  btn.setAttribute("aria-label", "Switch website design");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M3 12h18"/><circle cx="12" cy="12" r="10"/></svg>' +
    '<span class="ds-current">Design: <strong>' + current.label + "</strong></span>";

  var dropdown = document.createElement("div");
  dropdown.className = "ds-dropdown";
  dropdown.setAttribute("role", "listbox");

  var header = document.createElement("div");
  header.className = "ds-header";
  header.textContent = "Website designed by";
  dropdown.appendChild(header);

  designs.forEach(function (d) {
    var item = document.createElement("a");
    item.className = "ds-item" + (d.id === current.id ? " ds-active" : "");
    item.href = d.path;
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", d.id === current.id ? "true" : "false");
    item.innerHTML =
      "<span>" + d.label + "</span>" +
      (d.id === current.id ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' : "");
    dropdown.appendChild(item);
  });

  container.appendChild(btn);
  container.appendChild(dropdown);
  document.body.appendChild(container);

  btn.addEventListener("click", function () {
    var expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    dropdown.classList.toggle("ds-open");
  });

  document.addEventListener("click", function (e) {
    if (!container.contains(e.target)) {
      btn.setAttribute("aria-expanded", "false");
      dropdown.classList.remove("ds-open");
    }
  });
})();
