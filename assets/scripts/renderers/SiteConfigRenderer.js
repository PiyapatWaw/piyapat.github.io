import { Dom } from "../utils/dom.js";
import { escapeAttribute, escapeHtml } from "../utils/html.js";

export class SiteConfigRenderer {
  constructor({ page, detailNavPrefix = "../" }) {
    this.page = page;
    this.detailNavPrefix = detailNavPrefix;
  }

  render(site) {
    if (!site) return;

    this.renderMeta(site.meta);
    this.renderNavigation(site.navigation);
    this.renderHomeCopy(site.home);
    this.renderDetailCopy(site.detail);
    this.renderMediaSizing(site.mediaSizing);
  }

  renderMeta(meta) {
    if (!meta) return;

    if (meta.title && this.page === "home") {
      document.title = meta.title;
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && meta.description) {
      metaDescription.setAttribute("content", meta.description);
    }
  }

  renderNavigation(navigation) {
    if (!navigation) return;

    Dom.setText("brand-label", navigation.brand);
    this.renderNav("main-nav", navigation.items || []);
    this.renderNav("detail-nav", navigation.items || [], this.detailNavPrefix);
  }

  renderHomeCopy(home) {
    if (!home) return;

    Dom.setText("hero-primary-cta", home.ctaPrimary);
    Dom.setText("hero-secondary-cta", home.ctaSecondary);
    Dom.setText("about-heading", home.sections?.about);
    Dom.setText("skills-heading", home.sections?.skills);
    Dom.setText("experience-heading", home.sections?.experience);
    Dom.setText("portfolio-heading", home.sections?.portfolio);
    Dom.setText("contact-heading", home.sections?.contact);
    Dom.setText("filter-all", home.portfolioFilters?.all);
    Dom.setText("filter-game", home.portfolioFilters?.game);
    Dom.setText("filter-web", home.portfolioFilters?.web);
  }

  renderDetailCopy(detail) {
    if (!detail) return;

    Dom.setText("detail-back-link", detail.backLabel);
    Dom.setText("detail-overview-label", detail.headings?.overview);
    Dom.setText("detail-role-label", detail.headings?.role);
    Dom.setText("detail-tech-label", detail.headings?.techStack);
    Dom.setText("detail-highlights-label", detail.headings?.highlights);
    Dom.setText("detail-highlights-title", detail.headings?.highlightsTitle);
    Dom.setText("detail-gallery-label", detail.headings?.gallery);
    Dom.setText("detail-gallery-title", detail.headings?.galleryTitle);
    Dom.setText("detail-media-label", detail.headings?.media);
    Dom.setText("detail-media-title", detail.headings?.mediaTitle);
    Dom.setText("detail-links-label", detail.headings?.links);
    Dom.setText("detail-links-title", detail.headings?.linksTitle);
  }

  renderMediaSizing(mediaSizing) {
    if (!mediaSizing) return;

    Dom.setCssVar("--project-card-aspect-ratio", mediaSizing.projectCardAspectRatio);
    Dom.setCssVar("--detail-hero-min-height", mediaSizing.detailHeroMinHeight);
    Dom.setCssVar("--gallery-aspect-ratio", mediaSizing.galleryAspectRatio);
    Dom.setCssVar("--profile-image-position", mediaSizing.profileImagePosition);
  }

  renderNav(targetId, items, prefix = "") {
    const nav = document.getElementById(targetId);
    if (!nav) return;

    nav.innerHTML = items.map((item) => `
      <a href="${prefix}${escapeAttribute(item.href)}">${escapeHtml(item.label)}</a>
    `).join("");
  }
}
