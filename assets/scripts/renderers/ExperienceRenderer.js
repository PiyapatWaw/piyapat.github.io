import { escapeHtml } from "../utils/html.js";

export class ExperienceRenderer {
  render(experience) {
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
}
