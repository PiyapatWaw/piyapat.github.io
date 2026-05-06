import { PortfolioApp } from "./scripts/app/PortfolioApp.js";

const page = document.body.dataset.page === "detail" ? "detail" : "home";
const context = {
  page,
  dataRoot: page === "detail" ? "../data/" : "data/",
  siteRoot: page === "detail" ? "../" : ""
};

document.addEventListener("DOMContentLoaded", () => {
  const app = new PortfolioApp(context);
  app.start();
});
