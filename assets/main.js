const DATA_ROOT = document.body.dataset.page === "detail" ? "../data/" : "data/";
const SITE_ROOT = document.body.dataset.page === "detail" ? "../" : "";

const state = {
  projects: []
};

document.addEventListener("DOMContentLoaded", () => {
  setupReveal();

  if (document.body.dataset.page === "detail") {
    initProjectDetail();
  } else {
    initHome();
  }
});

async function loadJson(file) {
  const response = await fetch(`${DATA_ROOT}${file}`);
  if (!response.ok) {
    throw new Error(`Could not load ${file}`);
  }
  return response.json();
}

async function initHome() {
  try {
    const [profile, experience, projects] = await Promise.all([
      loadJson("profile.json"),
      loadJson("experience.json"),
      loadJson("projects.json")
    ]);

    state.projects = projects;
    renderProfile(profile);
    renderExperience(experience);
    renderProjects(projects);
    setupPortfolioTabs(projects);
    setupReveal();
  } catch (error) {
    renderFatalError("Portfolio data could not be loaded. Please check the JSON files.");
    console.error(error);
  }
}

async function initProjectDetail() {
  try {
    const projects = await loadJson("projects.json");
    state.projects = projects;
    const id = new URLSearchParams(window.location.search).get("id");
    const project = projects.find((item) => item.id === id);

    if (!project) {
      renderProjectNotFound(id);
      setupReveal();
      return;
    }

    renderProjectDetail(project, projects);
    setupReveal();
  } catch (error) {
    renderFatalError("Project data could not be loaded. Please check data/projects.json.");
    console.error(error);
  }
}

function renderProfile(profile) {
  setText("hero-title", profile.title);
  setText("hero-name", profile.name);
  setText("hero-tagline", profile.tagline);
  setText("about-text", profile.about);
  setText("footer-name", profile.name);

  const profileImage = document.getElementById("profile-image");
  if (profileImage) {
    profileImage.src = profile.profileImage || "assets/images/profile.png";
    profileImage.alt = `${profile.name} portrait`;
    profileImage.addEventListener("error", () => {
      profileImage.classList.add("is-hidden");
    });
  }

  const cvButton = document.querySelector(".hero-actions .ghost");
  if (cvButton && profile.resume) {
    cvButton.href = profile.resume;
  }

  const stats = document.getElementById("hero-stats");
  if (stats) {
    stats.innerHTML = [
      statItem("", "Software Developer"),
      statItem("Education", profile.education.degree),
      statItem("Languages", profile.languages.join(" / "))
    ].join("");
  }

  const info = document.getElementById("profile-info");
  if (info) {
    info.innerHTML = [
      infoItem("University", profile.education.university),
      infoItem("Degree", profile.education.degree),
      infoItem("Year", profile.education.year),
      infoItem("GPA", profile.education.gpa),
      infoItem("Languages", profile.languages.join(", "))
    ].join("");
  }

  const skillsGrid = document.getElementById("skills-grid");
  if (skillsGrid) {
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

  const contactList = document.getElementById("contact-list");
  if (contactList) {
    const linkedInUrl = `https://www.linkedin.com/${profile.contact.linkedin}`;
    contactList.innerHTML = [
      contactItem("Email", profile.contact.email, `mailto:${profile.contact.email}`),
      contactItem("Phone", profile.contact.phone, `tel:${profile.contact.phone}`),
      contactItem("LinkedIn", profile.contact.linkedin, linkedInUrl)
    ].join("");
  }
}

function renderExperience(experience) {
  const list = document.getElementById("experience-list");
  if (!list) return;

  list.innerHTML = experience.map((job) => `
    <article class="timeline-item">
      <div class="timeline-marker" aria-hidden="true"></div>
      <div>
        <p class="timeline-period">${escapeHtml(job.period)}</p>
        <h3>${escapeHtml(job.role)}</h3>
        <p class="company">${escapeHtml(job.company)}</p>
        <ul>
          ${job.highlights.map((highlight) => `<li>${escapeHtml(highlight)}</li>`).join("")}
        </ul>
      </div>
    </article>
  `).join("");
}

function renderProjects(projects, filter = "all") {
  const grid = document.getElementById("project-grid");
  if (!grid) return;

  const visibleProjects = filter === "all"
    ? projects
    : projects.filter((project) => project.category === filter);

  grid.innerHTML = visibleProjects.map((project) => `
    <article class="project-card">
      ${renderProjectMedia(project)}
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
}

function setupPortfolioTabs(projects) {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderProjects(projects, button.dataset.filter);
      setupReveal();
    });
  });
}

function renderProjectDetail(project, projects) {
  document.title = `${project.title} | Piyapat Wawseengam`;
  setText("detail-category", `${project.category} / ${project.year}`);
  setText("detail-title", project.title);
  setText("detail-overview", project.overview);
  setText("detail-overview-body", project.overview);
  setText("detail-role", project.role);

  document.getElementById("detail-tags").innerHTML = project.tags
    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
    .join("");

  document.getElementById("detail-tech").innerHTML = project.techStack
    .map((tech) => `<span>${escapeHtml(tech)}</span>`)
    .join("");

  const media = document.getElementById("detail-media");
  media.innerHTML = renderProjectMedia(project, true);

  renderGallery(project);
  renderVideo(project);
  renderNextProject(project, projects);
}

function renderGallery(project) {
  const gallery = document.getElementById("detail-gallery");
  if (!gallery) return;

  const images = project.gallery && project.gallery.length ? project.gallery : [project.thumbnail];
  gallery.innerHTML = images.map((image, index) => `
    <div class="gallery-item">
      <img src="${assetPath(image)}" alt="${escapeHtml(project.title)} screenshot ${index + 1}" loading="lazy">
      <div class="media-placeholder" aria-hidden="true">
        <span>${escapeHtml(project.title)}</span>
      </div>
    </div>
  `).join("");

  gallery.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => img.classList.add("is-hidden"));
  });
}

function renderVideo(project) {
  const section = document.getElementById("detail-video-section");
  const frame = document.getElementById("detail-video");
  if (!section || !frame) return;

  if (!project.video) {
    section.classList.add("is-hidden");
    return;
  }

  frame.innerHTML = `
    <iframe
      src="${escapeAttribute(project.video)}"
      title="${escapeAttribute(project.title)} video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;
}

function renderNextProject(project, projects) {
  const nextLink = document.getElementById("next-project");
  if (!nextLink) return;

  const currentIndex = projects.findIndex((item) => item.id === project.id);
  const next = projects[(currentIndex + 1) % projects.length];
  nextLink.href = `detail.html?id=${encodeURIComponent(next.id)}`;
  nextLink.innerHTML = `
    <span>Next Project</span>
    <strong>${escapeHtml(next.title)}</strong>
  `;
}

function renderProjectNotFound(id) {
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

function renderProjectMedia(project, large = false) {
  return `
    <div class="project-media ${large ? "large" : ""}">
      <img src="${assetPath(project.thumbnail)}" alt="${escapeAttribute(project.title)} thumbnail" loading="lazy" onerror="this.classList.add('is-hidden')">
      <div class="media-placeholder" aria-hidden="true">
        <span>${escapeHtml(project.title)}</span>
      </div>
    </div>
  `;
}

function setupReveal() {
  const revealItems = document.querySelectorAll(".reveal, .project-card, .timeline-item, .skill-card, .gallery-item");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => observer.observe(item));
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text || "";
  }
}

function assetPath(path) {
  if (!path || /^(https?:)?\/\//.test(path)) return path || "";
  return `${SITE_ROOT}${path}`;
}

function statItem(label, value) {
  return `
    <div>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function infoItem(label, value) {
  return `
    <div class="info-item">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function contactItem(label, value, href) {
  return `
    <a class="contact-item" href="${escapeAttribute(href)}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </a>
  `;
}

function renderFatalError(message) {
  const main = document.querySelector("main");
  if (!main) return;
  main.innerHTML = `
    <section class="section-shell not-found">
      <p class="eyebrow">Error</p>
      <h1>${escapeHtml(message)}</h1>
    </section>
  `;
}

function toTitleCase(value) {
  return value.replace(/(^|\s|-)\S/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
