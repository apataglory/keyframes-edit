/* KEYFRAMES | Site interactions and JSON-powered content */
document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "×" : "☰";
    });
  }

  fetch("data.json")
    .then(response => {
      if (!response.ok) throw new Error("Could not load data.json");
      return response.json();
    })
    .then(data => {
      renderProjects(data.projects || []);
      renderTutorials(data.tutorials || []);
    })
    .catch(error => {
      document.querySelectorAll("#featured-projects,#all-projects,#tutorial-list").forEach(el => {
        el.innerHTML = '<p class="loading-note">Content could not load. Check that data.json is in the website root and the site is being served over HTTP.</p>';
      });
      console.error(error);
    });
});

function safeExternalLink(url) {
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : "#";
  } catch {
    return "#";
  }
}

function createProjectCard(project, index) {
  const card = document.createElement("article");
  card.className = "project-card";
  const link = document.createElement("a");
  link.href = safeExternalLink(project.url || "#");
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `Open ${project.title || "project"} video`);
  const visual = document.createElement("div");
  visual.className = "project-visual";
  const number = document.createElement("span");
  number.className = "project-number";
  number.textContent = `KF / ${String(index + 1).padStart(2, "0")}`;
  const symbol = document.createElement("span");
  symbol.className = "project-symbol";
  symbol.textContent = project.symbol || "KF";
  const open = document.createElement("span");
  open.className = "project-open";
  open.textContent = "↗";
  visual.append(number, symbol, open);
  link.append(visual);
  const info = document.createElement("div");
  info.className = "project-info";
  const meta = document.createElement("span");
  meta.className = "project-meta";
  meta.textContent = project.category || "Creative project";
  const title = document.createElement("h3");
  title.textContent = project.title || "Untitled project";
  const description = document.createElement("p");
  description.textContent = project.description || "";
  info.append(meta, title, description);
  card.append(link, info);
  return card;
}

function renderProjects(projects) {
  const featured = document.getElementById("featured-projects");
  const all = document.getElementById("all-projects");
  const featuredItems = projects.filter(project => project.featured);
  if (featured) {
    featured.replaceChildren();
    (featuredItems.length ? featuredItems : projects.slice(0, 3)).forEach((p, i) => featured.append(createProjectCard(p, i)));
    if (!projects.length) featured.innerHTML = '<p class="loading-note">Add projects to data.json to display your work here.</p>';
  }
  if (all) {
    all.replaceChildren();
    projects.forEach((p, i) => all.append(createProjectCard(p, i)));
    if (!projects.length) all.innerHTML = '<p class="loading-note">Add projects to data.json to display your work here.</p>';
  }
  const count = document.getElementById("project-count");
  if (count) count.textContent = `${String(projects.length).padStart(2, "0")} PROJECTS`;
}

function renderTutorials(tutorials) {
  const list = document.getElementById("tutorial-list");
  if (!list) return;
  list.replaceChildren();
  tutorials.forEach((tutorial, index) => {
    const item = document.createElement("article");
    item.className = "tutorial-item";
    const number = document.createElement("span");
    number.className = "tutorial-index";
    number.textContent = String(index + 1).padStart(2, "0");
    const copy = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = tutorial.title || "Untitled tutorial";
    const description = document.createElement("p");
    description.textContent = tutorial.description || "";
    copy.append(title, description);
    const link = document.createElement("a");
    link.href = safeExternalLink(tutorial.url || "#");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `Watch ${tutorial.title || "tutorial"}`);
    link.textContent = "↗";
    item.append(number, copy, link);
    list.append(item);
  });
  if (!tutorials.length) list.innerHTML = '<p class="loading-note">Add tutorials to data.json to display them here.</p>';
}
