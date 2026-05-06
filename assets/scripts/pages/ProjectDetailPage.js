import { Dom } from "../utils/dom.js";

export class ProjectDetailPage {
  constructor({
    dataService,
    projectRepository,
    siteConfigRenderer,
    projectDetailRenderer,
    revealController
  }) {
    this.dataService = dataService;
    this.projectRepository = projectRepository;
    this.siteConfigRenderer = siteConfigRenderer;
    this.projectDetailRenderer = projectDetailRenderer;
    this.revealController = revealController;
  }

  async start() {
    try {
      const id = new URLSearchParams(window.location.search).get("id");
      const [site, projectResult] = await Promise.all([
        this.dataService.loadJson("site.json"),
        this.projectRepository.findWithDetail(id)
      ]);

      this.siteConfigRenderer.render(site);

      if (!projectResult.project) {
        this.projectDetailRenderer.renderNotFound(id);
        this.revealController.setup();
        return;
      }

      this.projectDetailRenderer.render(projectResult.project);
      this.revealController.setup();
    } catch (error) {
      Dom.renderFatalError("Project data could not be loaded. Please check data/projects.json and the referenced project detail file.");
      console.error(error);
    }
  }
}
