export class ImageLoadingController {
  setup(root) {
    if (!root) return;

    root.querySelectorAll(".project-media img, .gallery-item img").forEach((img) => {
      const frame = img.closest(".project-media, .gallery-item");

      img.addEventListener("load", () => this.markLoaded(frame, img));
      img.addEventListener("error", () => this.markError(frame, img));

      if (img.complete) {
        if (img.naturalWidth > 0) {
          this.markLoaded(frame, img);
        } else {
          this.markError(frame, img);
        }
      }
    });
  }

  markLoaded(frame, img) {
    frame?.classList.remove("media-loading", "media-error");
    frame?.classList.add("media-loaded");
    this.applyLoadedImageDimensions(frame, img);
  }

  markError(frame, img) {
    const fallbackSrc = img.dataset.fallbackSrc;
    if (fallbackSrc && !img.dataset.fallbackUsed && img.currentSrc !== fallbackSrc) {
      img.dataset.fallbackUsed = "true";
      img.src = fallbackSrc;
      return;
    }

    frame?.classList.remove("media-loading");
    frame?.classList.add("media-error");
    img.classList.add("is-hidden");
  }

  applyLoadedImageDimensions(frame, img) {
    if (!frame || !frame.classList.contains("media-contain")) return;
    if (!img.naturalWidth || !img.naturalHeight) return;

    frame.style.setProperty("--media-source-aspect-ratio", `${img.naturalWidth} / ${img.naturalHeight}`);
    frame.classList.remove("media-portrait", "media-square", "media-landscape");
    frame.classList.add(this.mediaOrientationClass({
      width: img.naturalWidth,
      height: img.naturalHeight
    }));
  }

  mediaOrientationClass(dimensions) {
    if (!dimensions) return "";

    const ratio = dimensions.width / dimensions.height;
    if (ratio < 0.85) return "media-portrait";
    if (ratio > 1.15) return "media-landscape";
    return "media-square";
  }
}
