import { escapeAttribute, escapeHtml } from "../utils/html.js";

export class MediaRenderer {
  constructor(assetUrlService) {
    this.assetUrlService = assetUrlService;
  }

  renderProjectMedia(project, { large = false } = {}) {
    const mediaStyle = this.buildMediaStyle(project, large);
    const detailFallbackFit = project.mediaSizing?.detailFit || project.mediaSizing?.thumbnailFit || "contain";
    let fitClass = "";

    if (large && detailFallbackFit === "contain") {
      fitClass = "media-contain";
    } else if (!large && project.mediaSizing?.thumbnailFit === "contain") {
      fitClass = "project-media-contain";
    }

    const loading = large ? "eager" : "lazy";
    return `
      <div class="project-media ${large ? "large" : ""} ${fitClass} media-loading"${mediaStyle}>
        <img class="media-image" src="${this.assetUrlService.assetPath(project.thumbnail)}" alt="${escapeAttribute(project.title)} thumbnail" loading="${loading}" decoding="async">
        <div class="media-placeholder" aria-hidden="true">
          <span>${escapeHtml(project.title)}</span>
        </div>
      </div>
    `;
  }

  renderDetailHeroMedia(project) {
    const featured = project.featuredMedia;
    if (!featured) {
      return this.renderProjectMedia(project, { large: true });
    }

    const path = featured.path || featured.url || "";
    if (this.assetUrlService.isPlayableVideoPath(path)) {
      return `
        <div class="media-card hero-media-card">
          <div class="video-frame hero-video-frame">
            <video controls playsinline preload="none">
              <source src="${this.assetUrlService.assetPath(path)}" type="${this.assetUrlService.videoMimeType(path)}">
            </video>
          </div>
        </div>
      `;
    }

    return this.renderStandaloneMedia(project.title, path, {
      large: true,
      fit: featured.fit,
      media: featured
    });
  }

  renderMediaItem(projectTitle, item) {
    const path = item.path || item.url || "";
    const playableVideo = this.assetUrlService.isPlayableVideoPath(path);
    const externalEmbed = this.assetUrlService.embedUrl(path);

    if (externalEmbed) {
      return `
        <div class="video-frame">
          <iframe
            src="${escapeAttribute(externalEmbed)}"
            title="${escapeAttribute(`${projectTitle} ${item.title || "video"}`)}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
      `;
    }

    if (playableVideo) {
      return `
        <div class="media-card">
          <p class="media-card-title">${escapeHtml(item.title || "Demo Video")}</p>
          <div class="video-frame">
            <video controls preload="none">
              <source src="${this.assetUrlService.assetPath(path)}" type="${this.assetUrlService.videoMimeType(path)}">
            </video>
          </div>
        </div>
      `;
    }

    return `
      <a class="resource-link" href="${this.assetUrlService.assetPath(path)}" target="_blank" rel="noreferrer">
        <span>${escapeHtml(item.title || "Project File")}</span>
        <strong>${escapeHtml(path.split("/").pop())}</strong>
      </a>
    `;
  }

  renderStandaloneMedia(title, path, { large = false, fit = "cover", media = {} } = {}) {
    const fitClass = fit === "contain" ? "media-contain" : "";
    const mediaStyle = this.buildSourceMediaStyle(path, fit, media);

    return `
      <div class="project-media ${large ? "large" : ""} ${fitClass} media-loading"${mediaStyle}>
        <img class="media-image" src="${this.assetUrlService.assetPath(path)}" alt="${escapeAttribute(title)} media" loading="eager" decoding="async">
        <div class="media-placeholder" aria-hidden="true">
          <span>${escapeHtml(title)}</span>
        </div>
      </div>
    `;
  }

  buildMediaStyle(project, large) {
    const sizing = project.mediaSizing || {};
    const style = [];

    if (!large && sizing.cardAspectRatio) style.push(`--media-aspect-ratio:${sizing.cardAspectRatio}`);
    if (large && sizing.detailMinHeight) style.push(`--media-min-height:${sizing.detailMinHeight}`);
    if (sizing.thumbnailPosition) style.push(`--media-object-position:${sizing.thumbnailPosition}`);
    if (!large && sizing.thumbnailPadding) style.push(`--media-image-padding:${sizing.thumbnailPadding}`);

    return style.length ? ` style="${style.join(";")}"` : "";
  }

  buildSourceMediaStyle(path, fit, media = {}) {
    if (fit !== "contain") return "";

    const dimensions = this.parseMediaDimensions(path, media);
    if (!dimensions) return "";

    return ` style="--media-source-aspect-ratio:${dimensions.width} / ${dimensions.height}"`;
  }

  parseMediaDimensions(path, media = {}) {
    if (media.width && media.height) {
      return {
        width: Number(media.width),
        height: Number(media.height)
      };
    }

    try {
      const url = new URL(path, window.location.href);
      const width = Number(url.searchParams.get("width"));
      const height = Number(url.searchParams.get("height"));
      if (!width || !height) return null;
      return { width, height };
    } catch {
      return null;
    }
  }
}
