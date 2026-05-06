import { DataService } from "../data/DataService.js";
import { ProjectRepository } from "../data/ProjectRepository.js";
import { HomePage } from "../pages/HomePage.js";
import { ProjectDetailPage } from "../pages/ProjectDetailPage.js";
import { ExperienceRenderer } from "../renderers/ExperienceRenderer.js";
import { MediaRenderer } from "../renderers/MediaRenderer.js";
import { ProfileRenderer } from "../renderers/ProfileRenderer.js";
import { ProjectDetailRenderer } from "../renderers/ProjectDetailRenderer.js";
import { ProjectRenderer } from "../renderers/ProjectRenderer.js";
import { SiteConfigRenderer } from "../renderers/SiteConfigRenderer.js";
import { AssetUrlService } from "../services/AssetUrlService.js";
import { ImageLoadingController } from "../ui/ImageLoadingController.js";
import { RevealController } from "../ui/RevealController.js";

export class PortfolioApp {
  constructor(context) {
    this.context = context;
    this.dataService = new DataService(context.dataRoot);
    this.projectRepository = new ProjectRepository(this.dataService);
    this.assetUrlService = new AssetUrlService(context.siteRoot);
    this.imageLoadingController = new ImageLoadingController();
    this.revealController = new RevealController();
    this.mediaRenderer = new MediaRenderer(this.assetUrlService);
  }

  start() {
    this.revealController.setup();
    return this.createPage().start();
  }

  createPage() {
    const siteConfigRenderer = new SiteConfigRenderer({
      page: this.context.page,
      detailNavPrefix: "../"
    });

    if (this.context.page === "detail") {
      return new ProjectDetailPage({
        dataService: this.dataService,
        projectRepository: this.projectRepository,
        siteConfigRenderer,
        projectDetailRenderer: new ProjectDetailRenderer({
          mediaRenderer: this.mediaRenderer,
          assetUrlService: this.assetUrlService,
          imageLoadingController: this.imageLoadingController,
          revealController: this.revealController
        }),
        revealController: this.revealController
      });
    }

    return new HomePage({
      dataService: this.dataService,
      projectRepository: this.projectRepository,
      siteConfigRenderer,
      profileRenderer: new ProfileRenderer(this.assetUrlService),
      experienceRenderer: new ExperienceRenderer(),
      projectRenderer: new ProjectRenderer({
        mediaRenderer: this.mediaRenderer,
        imageLoadingController: this.imageLoadingController,
        revealController: this.revealController
      }),
      revealController: this.revealController
    });
  }
}
