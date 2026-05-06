import { Dom } from "../utils/dom.js";
import { toTitleCase } from "../utils/format.js";
import { escapeAttribute, escapeHtml } from "../utils/html.js";

export class ProfileRenderer {
  constructor(assetUrlService) {
    this.assetUrlService = assetUrlService;
  }

  render(profile) {
    Dom.setText("hero-title", profile.title);
    Dom.setText("hero-name", profile.name);
    Dom.setText("hero-tagline", profile.tagline);
    Dom.setText("about-text", profile.about);
    Dom.setText("footer-name", profile.name);

    this.renderProfileImage(profile);
    this.renderResumeButton(profile);
    this.renderStats(profile);
    this.renderInfo(profile);
    this.renderSkills(profile);
    this.renderContact(profile);
  }

  renderProfileImage(profile) {
    const profileImage = document.getElementById("profile-image");
    if (!profileImage) return;

    const profileSource = this.assetUrlService.assetPath(profile.profileImage);
    profileImage.alt = `${profile.name} portrait`;
    profileImage.classList.add("is-hidden");
    profileImage.removeAttribute("src");
    profileImage.addEventListener("load", () => {
      profileImage.classList.remove("is-hidden");
    });
    profileImage.addEventListener("error", () => {
      profileImage.classList.add("is-hidden");
    });

    if (profileSource) {
      profileImage.src = profileSource;
    }
  }

  renderResumeButton(profile) {
    const cvButton = document.querySelector(".hero-actions .ghost");
    if (!cvButton) return;

    if (profile.resume) {
      cvButton.href = this.assetUrlService.assetPath(profile.resume);
      cvButton.target = "_blank";
      cvButton.rel = "noreferrer";
      cvButton.classList.remove("is-hidden");
      return;
    }

    cvButton.classList.add("is-hidden");
    cvButton.removeAttribute("href");
    cvButton.removeAttribute("target");
    cvButton.removeAttribute("rel");
  }

  renderStats(profile) {
    const stats = document.getElementById("hero-stats");
    if (!stats) return;

    stats.innerHTML = [
      this.statItem("", "Software Developer"),
      this.statItem("Education", profile.education.degree),
      this.statItem("Languages", profile.languages.join(" / "))
    ].join("");
  }

  renderInfo(profile) {
    const info = document.getElementById("profile-info");
    if (!info) return;

    info.innerHTML = [
      this.infoItem("University", profile.education.university),
      this.infoItem("Degree", profile.education.degree),
      this.infoItem("Year", profile.education.year),
      this.infoItem("GPA", profile.education.gpa),
      this.infoItem("Languages", profile.languages.join(", "))
    ].join("");
  }

  renderSkills(profile) {
    const skillsGrid = document.getElementById("skills-grid");
    if (!skillsGrid) return;

    skillsGrid.innerHTML = Object.entries(profile.skills)
      .map(([group, skills]) => `
        <article class="skill-card">
          <h3>${escapeHtml(toTitleCase(group))}</h3>
          <div class="tag-list">
            ${skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}
          </div>
        </article>
      `)
      .join("");
  }

  renderContact(profile) {
    const contactList = document.getElementById("contact-list");
    if (!contactList) return;

    const linkedInUrl = `https://www.linkedin.com/${profile.contact.linkedin}`;
    contactList.innerHTML = [
      this.contactItem("Email", profile.contact.email, `mailto:${profile.contact.email}`),
      this.contactItem("Phone", profile.contact.phone, `tel:${profile.contact.phone}`),
      this.contactItem("LinkedIn", profile.contact.linkedin, linkedInUrl)
    ].join("");
  }

  statItem(label, value) {
    return `
      <div>
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `;
  }

  infoItem(label, value) {
    return `
      <div class="info-item">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `;
  }

  contactItem(label, value, href) {
    return `
      <a class="contact-item" href="${escapeAttribute(href)}">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </a>
    `;
  }
}
