import { DataService } from "../assets/scripts/data/DataService.js";
import { MediaRenderer } from "../assets/scripts/renderers/MediaRenderer.js";
import { AssetUrlService } from "../assets/scripts/services/AssetUrlService.js";
import { ImageLoadingController } from "../assets/scripts/ui/ImageLoadingController.js";
import { RevealController } from "../assets/scripts/ui/RevealController.js";
import { escapeAttribute, escapeHtml } from "../assets/scripts/utils/html.js";

const sharedData = new DataService("../data/");
const gameData = new DataService("data/");
const assetUrls = new AssetUrlService("../");
const images = new ImageLoadingController();
const reveal = new RevealController();
const media = new MediaRenderer(assetUrls);

document.addEventListener("DOMContentLoaded", () => start().catch(renderError));

async function start() {
  const config = await gameData.loadJson("resume.json");
  if (document.body.dataset.page === "detail") {
    await renderProjectPage(config);
  } else {
    await renderHomePage(config);
  }
  reveal.setup();
}

async function loadProjects(config) {
  const shared = await sharedData.loadJson("projects.json");
  const byId = new Map([...shared, ...config.projects.additional].map((project) => [project.id, project]));
  return config.projects.order.map((id) => byId.get(id)).filter(Boolean);
}

async function renderHomePage(config) {
  const [sharedProfile, experience, projects] = await Promise.all([
    sharedData.loadJson("profile.json"),
    sharedData.loadJson("experience.json"),
    loadProjects(config)
  ]);
  const profile = { ...sharedProfile, ...config.profile };

  document.getElementById("main-nav").innerHTML = [
    ["#about", "About"], ["#skills", "Skills"], ["#experience", "Experience"],
    ["#portfolio", "Projects"], ["#research", "Research"], ["#education", "Education"], ["#contact", "Contact"]
  ].map(([href, label]) => `<a href="${href}">${label}</a>`).join("");
  setText("hero-title", profile.name);
  setText("hero-name", profile.title);
  setText("hero-tagline", profile.tagline);
  setText("hero-research-interests", profile.researchInterests);
  setText("about-text", profile.about);
  setText("contact-cta", profile.contactCta);
  renderProfileImage(profile);
  renderStats(profile.stats);
  renderProfileInfo(profile);
  renderSkills(profile.skills);
  renderExperience(experience, config.experienceHighlights);
  renderFilters(projects, config.projects.filters);
  renderResearch(config.research);
  renderEducation(config.education || sharedProfile.education);
  renderContact(sharedProfile.contact);
}

function renderProfileImage(profile) {
  const image = document.getElementById("profile-image");
  if (!profile.profileImage) return;
  image.src = assetUrls.assetPath(profile.profileImage);
  image.addEventListener("load", () => image.classList.remove("is-hidden"));
}

function renderStats(stats) {
  document.getElementById("hero-stats").innerHTML = stats.map((item) =>
    `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`
  ).join("");
}

function renderProfileInfo(profile) {
  const education = profile.education || {};
  const items = [
    ["Education", education.degree || "Bachelor of Science"],
    ["University", education.university],
    ["Languages", (profile.languages || []).join(" · ")],
    ["Direction", profile.direction]
  ];
  document.getElementById("profile-info").innerHTML = items.map(([label, value]) =>
    `<div class="info-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`
  ).join("");
}

function renderSkills(groups) {
  document.getElementById("skills-grid").innerHTML = Object.entries(groups).map(([name, skills]) => `
    <article class="skill-card"><h3>${escapeHtml(name)}</h3><div class="tag-list">
      ${skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}
    </div></article>`).join("");
}

function renderExperience(jobs, overrides) {
  document.getElementById("experience-list").innerHTML = jobs.map((job) => {
    const baseHighlights = Array.isArray(job.highlights) ? job.highlights : (job.highlights?.["game-ai"] || []);
    const highlights = overrides[job.company] || baseHighlights;
    return `<article class="timeline-item"><div class="timeline-marker" aria-hidden="true"></div><div>
      <p class="timeline-period">${escapeHtml(job.period)}</p><h3>${escapeHtml(job.role)}</h3>
      <p class="company">${escapeHtml(job.company)}</p><ul>${highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div></article>`;
  }).join("");
}

function renderFilters(projects, filters) {
  const tabs = document.getElementById("portfolio-tabs");
  tabs.innerHTML = filters.map((filter, index) => `<button class="tab-button${index ? "" : " active"}" type="button" data-filter="${escapeAttribute(filter.id)}" role="tab" aria-selected="${index ? "false" : "true"}">${escapeHtml(filter.label)}</button>`).join("");
  const show = (filter) => {
    const visible = filter.id === "all" ? projects : projects.filter((project) => filter.categories.includes(project.category));
    document.getElementById("project-grid").innerHTML = visible.map(projectCard).join("");
    images.setup(document.getElementById("project-grid"));
    reveal.setup();
  };
  show(filters[0]);
  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    tabs.querySelectorAll("button").forEach((item) => { item.classList.toggle("active", item === button); item.setAttribute("aria-selected", String(item === button)); });
    show(filters.find((filter) => filter.id === button.dataset.filter) || filters[0]);
  });
}

function projectCard(project) {
  const href = `project.html?id=${encodeURIComponent(project.id)}`;
  return `<article class="project-card"><a class="project-media-link" href="${href}" aria-label="Open ${escapeAttribute(project.title)} project details">${media.renderProjectMedia(project)}</a>
    <div class="project-card-body"><div class="project-meta"><span>${escapeHtml(project.category)}</span><span>${escapeHtml(project.year)}</span></div>
    <h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.overview)}</p><div class="tag-list">${project.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
    <a class="text-link" href="${href}">View details</a></div></article>`;
}

function renderResearch(research) {
  ["primary", "secondary"].forEach((priority) => {
    const target = document.getElementById(`${priority}-research-interests`);
    const interests = research.interests.filter((item) => item.priority === priority);
    target.innerHTML = interests.map((item) => `<article class="research-card research-card--${priority}"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`).join("");
  });
  setText("research-statement", research.statement);
  setText("research-project-title", research.direction.title);
  setText("research-question", research.direction.question);
  setText("research-supporting-statement", research.direction.supportingStatement);
  document.getElementById("research-flow").innerHTML = research.direction.steps.map((step, index) => `<span class="flow-step">${escapeHtml(step)}</span>${index < research.direction.steps.length - 1 ? '<span class="flow-arrow" aria-hidden="true">→</span>' : ""}`).join("");
  renderTags("research-approaches", research.direction.approaches);
  renderTags("research-evaluation", research.direction.evaluation);
}

function renderEducation(education) {
  const degree = education.major ? `${education.degree}, ${education.major}` : education.degree;
  document.getElementById("education-summary").innerHTML = `<h3>${escapeHtml(degree)}</h3><p>${escapeHtml(education.university)}</p><dl class="education-facts"><div><dt>Period</dt><dd>${escapeHtml(education.year)}</dd></div><div><dt>GPA</dt><dd>${escapeHtml(education.gpa)}</dd></div></dl>`;
  document.getElementById("coursework-list").innerHTML = (education.coursework || []).map((course) => `<li>${escapeHtml(course.name)} <strong>${escapeHtml(course.grade)}</strong></li>`).join("");
}

function renderContact(contact) {
  const linkedinUrl = contact.linkedin.startsWith("http") ? contact.linkedin : `https://www.linkedin.com/${contact.linkedin}`;
  const items = [["Email", contact.email, `mailto:${contact.email}`], ["Phone", contact.phone, `tel:${contact.phone}`], ["LinkedIn", contact.linkedin, linkedinUrl]];
  document.getElementById("contact-list").innerHTML = items.map(([label, value, href]) => `<a class="contact-item" href="${escapeAttribute(href)}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></a>`).join("");
}

async function renderProjectPage(config) {
  const projects = await loadProjects(config);
  const id = new URLSearchParams(location.search).get("id");
  const summary = projects.find((project) => project.id === id);
  if (!summary) throw new Error("Project not found.");
  const detail = summary.localDetail ? await gameData.loadJson(summary.detailFile) : await sharedData.loadJson(summary.detailFile);
  const project = { ...summary, ...detail };
  document.title = `${project.title} | Piyapat Wawseengam`;
  document.getElementById("detail-nav").innerHTML = '<a href="./">Game & AI Home</a><a href="./#portfolio">Projects</a>';
  setText("detail-category", `${project.category} · ${project.year}`);
  setText("detail-title", project.title);
  setText("detail-overview", project.overview);
  setText("detail-overview-body", project.overview);
  setText("detail-role", project.role || "Project contributor");
  renderTags("detail-tags", project.tags || []);
  renderTags("detail-tech", project.techStack || project.tags || []);
  document.getElementById("detail-media").innerHTML = media.renderDetailHeroMedia(project);
  document.getElementById("detail-sections").innerHTML = (project.sections || []).map((section) => `<article class="detail-section-card"><h3>${escapeHtml(section.title)}</h3><p>${escapeHtml(section.body)}</p></article>`).join("");
  renderArchitecture(project.architecture || []);
  renderGallery(project);
  renderVideos(project);
  renderLinks(project.links || []);
  images.setup(document.getElementById("project-detail"));
}

function renderArchitecture(steps) {
  const wrap = document.getElementById("detail-architecture-wrap");
  if (!steps.length) return;
  wrap.classList.remove("is-hidden");
  document.getElementById("detail-architecture").innerHTML = steps.map((step, index) => `<span class="flow-step">${escapeHtml(step)}</span>${index < steps.length - 1 ? '<span class="flow-arrow" aria-hidden="true">→</span>' : ""}`).join("");
}

function renderGallery(project) {
  const gallery = project.gallery || [];
  const wrap = document.getElementById("detail-gallery-wrap");
  if (!gallery.length) { wrap.classList.add("is-hidden"); return; }
  document.getElementById("detail-gallery").innerHTML = gallery.map((item, index) => {
    const source = typeof item === "string" ? item : (item.path || item.url);
    return `<figure class="gallery-item media-loading"><img src="${escapeAttribute(assetUrls.assetPath(source))}" alt="${escapeAttribute(`${project.title} screenshot ${index + 1}`)}" loading="lazy" decoding="async"></figure>`;
  }).join("");
}

function renderVideos(project) {
  const videos = project.videos || [];
  const wrap = document.getElementById("detail-video-section");
  if (!videos.length) { wrap.classList.add("is-hidden"); return; }
  document.getElementById("detail-video").innerHTML = videos.map((item) => media.renderMediaItem(project.title, item)).join("");
}

function renderLinks(links) {
  const wrap = document.getElementById("detail-links-wrap");
  if (!links.length) { wrap.classList.add("is-hidden"); return; }
  document.getElementById("detail-links").innerHTML = links.map((link) => `<a class="resource-link" href="${escapeAttribute(link.url)}" target="_blank" rel="noreferrer"><span>${escapeHtml(link.label)}</span><strong>${escapeHtml(link.url)}</strong></a>`).join("");
}

function renderTags(id, values) {
  document.getElementById(id).innerHTML = values.map((value) => `<span>${escapeHtml(value)}</span>`).join("");
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value || "";
}

function renderError(error) {
  console.error(error);
  const main = document.querySelector("main");
  if (main) main.innerHTML = `<section class="section-shell not-found"><p class="eyebrow">Unable to load</p><h1>Portfolio data unavailable.</h1><p>${escapeHtml(error.message)}</p><a class="back-link" href="./">Back to Game & AI portfolio</a></section>`;
}
