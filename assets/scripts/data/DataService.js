export class DataService {
  constructor(dataRoot) {
    this.dataRoot = dataRoot;
  }

  async loadJson(file) {
    const response = await fetch(`${this.dataRoot}${file}`);
    if (!response.ok) {
      throw new Error(`Could not load ${file}`);
    }
    return response.json();
  }
}
