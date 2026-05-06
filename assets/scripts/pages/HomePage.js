import { Dom } from "../utils/dom.js";

export class HomePage {
  constructor({
    dataService,
    projectRepository,
    siteConfigRenderer,
    profileRenderer,
    experienceRenderer,
    projectRenderer,
    revealController
  }) {
    this.dataService = dataService;
    this.projectRepository = projectRepository;
    this.siteConfigRenderer = siteConfigRenderer;
    this.profileRenderer = profileRenderer;
    this.experienceRenderer = experienceRenderer;
    this.projectRenderer = projectRenderer;
    this.revealController = revealController;
  }

  async start() {
    try {
      const [site, profile, experience, projects] = await Promise.all([
        this.dataService.loadJson("site.json"),
        this.dataService.loadJson("profile.json"),
        this.dataService.loadJson("experience.json"),
        this.projectRepository.list()
      ]);

      this.siteConfigRenderer.render(site);
      this.profileRenderer.render(profile);
      this.experienceRenderer.render(experience);
      this.projectRenderer.renderList(projects);
      this.projectRenderer.setupTabs(projects);
      this.revealController.setup();
    } catch (error) {
      Dom.renderFatalError("Portfolio data could not be loaded. Please check the JSON files.");
      console.error(error);
    }
  }
}
