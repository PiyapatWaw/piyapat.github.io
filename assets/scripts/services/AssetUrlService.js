export class AssetUrlService {
  constructor(siteRoot = "") {
    this.siteRoot = siteRoot;
  }

  assetPath(path) {
    if (!path) return "";

    const oneDriveContent = this.oneDriveContentUrl(path);
    if (oneDriveContent) return oneDriveContent;
    if (/^(https?:)?\/\//.test(path)) return path;
    return `${this.siteRoot}${path}`;
  }

  isPlayableVideoPath(path) {
    return /\.(mp4|webm|ogg)(\?|#|$)/i.test(path) || /^https:\/\/1drv\.ms\/v\//.test(path);
  }

  embedUrl(path) {
    try {
      const url = new URL(path);
      const hostname = url.hostname.replace(/^www\./, "");

      if (hostname === "youtu.be") {
        const id = url.pathname.split("/").filter(Boolean)[0];
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }

      if (hostname === "youtube.com" && url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }

      if (hostname === "youtube.com" && url.pathname.startsWith("/embed/")) {
        return path;
      }

      if (hostname === "player.vimeo.com") {
        return path;
      }
    } catch {
      return "";
    }

    return "";
  }

  videoMimeType(path) {
    if (/\.webm(\?|#|$)/i.test(path)) return "video/webm";
    if (/\.ogg(\?|#|$)/i.test(path)) return "video/ogg";
    return "video/mp4";
  }

  oneDriveContentUrl(path) {
    if (!/^https:\/\/(1drv\.ms|onedrive\.live\.com)\//.test(path)) return "";
    if (/^https:\/\/1drv\.ms\/v\//.test(path)) {
      return this.appendQueryParam(path, "download", "1");
    }
    if (/^https:\/\/onedrive\.live\.com\/embed\?/.test(path)) {
      return path.replace("https://onedrive.live.com/embed?", "https://onedrive.live.com/download?");
    }
    if (/^https:\/\/onedrive\.live\.com\/download\?/.test(path)) {
      return path;
    }
    return this.appendQueryParam(path, "download", "1");
  }

  appendQueryParam(url, key, value) {
    if (new RegExp(`[?&]${key}=`).test(url)) return url;

    const [base, hash = ""] = url.split("#");
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}${encodeURIComponent(key)}=${encodeURIComponent(value)}${hash ? `#${hash}` : ""}`;
  }
}
