import { escapeHtml } from "./html.js";

export class Dom {
  static setText(id, text) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text || "";
    }
  }

  static setCssVar(name, value) {
    if (value) {
      document.documentElement.style.setProperty(name, value);
    }
  }

  static renderFatalError(message) {
    const main = document.querySelector("main");
    if (!main) return;

    main.innerHTML = `
      <section class="section-shell not-found">
        <p class="eyebrow">Error</p>
        <h1>${escapeHtml(message)}</h1>
      </section>
    `;
  }
}
