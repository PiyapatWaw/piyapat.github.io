export class ProjectRepository {
  constructor(dataService) {
    this.dataService = dataService;
    this.projects = null;
  }

  async list() {
    if (!this.projects) {
      this.projects = await this.dataService.loadJson("projects.json");
    }
    return this.projects;
  }

  async findWithDetail(id) {
    const projects = await this.list();
    const summary = projects.find((item) => item.id === id);

    if (!summary) {
      return { project: null, projects };
    }

    const detail = summary.detailFile
      ? await this.dataService.loadJson(summary.detailFile)
      : {};

    return {
      project: { ...summary, ...detail },
      projects
    };
  }
}
