import { Dom } from "../utils/dom.js";
import { escapeAttribute, escapeHtml } from "../utils/html.js";

export class ProjectDetailRenderer {
  constructor({ mediaRenderer, assetUrlService, imageLoadingController, revealController }) {
    this.mediaRenderer = mediaRenderer;
    this.assetUrlService = assetUrlService;
    this.imageLoadingController = imageLoadingController;
    this.revealController = revealController;
  }

  render(project) {
    document.title = `${project.title} | Piyapat Wawseengam`;
    Dom.setText("detail-category", `${project.category} / ${project.year}`);
    Dom.setText("detail-title", project.title);
    Dom.setText("detail-overview", project.overview);
    Dom.setText("detail-overview-body", project.overview);
    Dom.setText("detail-role", project.role);

    this.renderTags(project);
    this.renderTechStack(project);
    this.renderHeroMedia(project);
    this.renderSections(project);
    window.requestAnimationFrame(() => {
      this.renderGallery(project);
      this.renderVideo(project);
      this.renderLinks(project);
      this.revealController.setup();
    });
  }

  renderTags(project) {
    const tags = document.getElementById("detail-tags");
    if (!tags) return;

    tags.innerHTML = project.tags
      .map((tag) => `<span>${escapeHtml(tag)}</span>`)
      .join("");
  }

  renderTechStack(project) {
    const techStack = document.getElementById("detail-tech");
    if (!techStack) return;

    techStack.innerHTML = project.techStack
      .map((tech) => `<span>${escapeHtml(tech)}</span>`)
      .join("");
  }

  renderHeroMedia(project) {
    const media = document.getElementById("detail-media");
    if (!media) return;

    media.innerHTML = this.mediaRenderer.renderDetailHeroMedia(project);
    this.imageLoadingController.setup(media);
  }

  renderSections(project) {
    const wrap = document.getElementById("detail-sections-wrap");
    const container = document.getElementById("detail-sections");
    if (!wrap || !container) return;

    if (!project.sections || !project.sections.length) {
      wrap.classList.add("is-hidden");
      return;
    }

    container.innerHTML = project.sections.map((section) => `
      <article class="detail-section-card">
        <h3>${escapeHtml(section.title)}</h3>
        <p>${escapeHtml(section.body)}</p>
      </article>
    `).join("");
  }

  renderGallery(project) {
    const gallery = document.getElementById("detail-gallery");
    if (!gallery) return;

    const images = project.gallery && project.gallery.length ? project.gallery : [project.thumbnail];
    gallery.innerHTML = images.map((image, index) => `
      <div class="gallery-item media-loading">
        <img
          class="media-image"
          src="${this.assetUrlService.assetPath(image)}"
          alt="${escapeHtml(project.title)} screenshot ${index + 1}"
          loading="lazy"
          decoding="async"
          data-fallback-src="${escapeAttribute(this.assetUrlService.assetPath(project.thumbnail))}">
        <div class="media-placeholder" aria-hidden="true">
          <span>${escapeHtml(project.title)}</span>
        </div>
      </div>
    `).join("");

    this.imageLoadingController.setup(gallery);
  }

  renderVideo(project) {
    const section = document.getElementById("detail-video-section");
    const frame = document.getElementById("detail-video");
    if (!section || !frame) return;

    const videos = Array.isArray(project.videos) ? project.videos : [];
    const legacyVideo = project.video ? [{ title: "Video", path: project.video }] : [];
    const items = videos.length ? videos : legacyVideo;

    if (!items.length) {
      section.classList.add("is-hidden");
      return;
    }

    frame.innerHTML = items.map((item) => this.mediaRenderer.renderMediaItem(project.title, item)).join("");
  }

  renderLinks(project) {
    const wrap = document.getElementById("detail-links-wrap");
    const links = document.getElementById("detail-links");
    if (!wrap || !links) return;

    if (!project.links || !project.links.length) {
      wrap.classList.add("is-hidden");
      return;
    }

    links.innerHTML = project.links.map((link) => `
      <a class="resource-link" href="${escapeAttribute(link.url)}" target="_blank" rel="noreferrer">
        <span>${escapeHtml(link.label)}</span>
        <strong>${escapeHtml(link.url)}</strong>
      </a>
    `).join("");
  }

  renderNotFound(id) {
    const main = document.getElementById("project-detail");
    if (!main) return;

    main.innerHTML = `
      <section class="section-shell not-found reveal">
        <p class="eyebrow">Project Not Found</p>
        <h1>No project matches "${escapeHtml(id || "missing id")}".</h1>
        <p>The project may have been renamed or removed from data/projects.json.</p>
        <a class="button primary" href="../index.html#portfolio">Back to portfolio</a>
      </section>
    `;
  }
}
