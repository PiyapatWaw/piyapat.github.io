import { escapeAttribute, escapeHtml } from "../utils/html.js";

export class ProjectRenderer {
  constructor({ mediaRenderer, imageLoadingController, revealController }) {
    this.mediaRenderer = mediaRenderer;
    this.imageLoadingController = imageLoadingController;
    this.revealController = revealController;
  }

  renderList(projects, filter = "all") {
    const grid = document.getElementById("project-grid");
    if (!grid) return;

    const visibleProjects = filter === "all"
      ? projects
      : projects.filter((project) => project.category === filter);

    grid.innerHTML = visibleProjects.map((project) => `
      <article class="project-card">
        <a class="project-media-link" href="projects/detail.html?id=${encodeURIComponent(project.id)}" aria-label="Open ${escapeAttribute(project.title)} project details">
          ${this.mediaRenderer.renderProjectMedia(project)}
        </a>
        <div class="project-card-body">
          <div class="project-meta">
            <span>${escapeHtml(project.category)}</span>
            <span>${escapeHtml(project.year)}</span>
          </div>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.overview)}</p>
          <div class="tag-list">
            ${project.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>
          <a class="text-link" href="projects/detail.html?id=${encodeURIComponent(project.id)}">View details</a>
        </div>
      </article>
    `).join("");

    this.imageLoadingController.setup(grid);
  }

  setupTabs(projects) {
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".tab-button").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        this.renderList(projects, button.dataset.filter);
        this.revealController.setup();
      });
    });
  }
}
