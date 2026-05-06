# Piyapat Portfolio Website

Static portfolio website for Piyapat Wawseengam, built with plain HTML, CSS, JavaScript, and JSON for deployment on GitHub Pages.

## Stack

- HTML
- CSS
- JavaScript
- JSON data files

## Project Structure

```text
.
|-- index.html
|-- projects/
|   `-- detail.html
|-- data/
|   |-- profile.json
|   |-- experience.json
|   |-- site.json
|   |-- projects.json
|   `-- projects/
|       |-- zarina.json
|       |-- sekai-o-sukuu.json
|       |-- pandora-hunter.json
|       `-- xbattlecars-pvp.json
|-- assets/
|   |-- style.css
|   |-- main.js
|   `-- images/
|       |-- profile.png
|       `-- projects/
`-- portfolio-plan.md
```

## Local Preview

Open the site with a local static server such as Live Server in VS Code.

Main pages:

- `index.html`
- `projects/detail.html?id=zarina`

## Content Updates

Update personal information:

- [data/profile.json](/D:/Git/PiyapatPortfolio/data/profile.json)

Update work experience:

- [data/experience.json](/D:/Git/PiyapatPortfolio/data/experience.json)

Update projects:

- [data/projects.json](/D:/Git/PiyapatPortfolio/data/projects.json)
- [data/projects/zarina.json](/D:/Git/PiyapatPortfolio/data/projects/zarina.json)
- [data/projects/sekai-o-sukuu.json](/D:/Git/PiyapatPortfolio/data/projects/sekai-o-sukuu.json)
- [data/projects/pandora-hunter.json](/D:/Git/PiyapatPortfolio/data/projects/pandora-hunter.json)
- [data/projects/xbattlecars-pvp.json](/D:/Git/PiyapatPortfolio/data/projects/xbattlecars-pvp.json)

Update styling and layout:

- [assets/style.css](/D:/Git/PiyapatPortfolio/assets/style.css)
- [index.html](/D:/Git/PiyapatPortfolio/index.html)
- [projects/detail.html](/D:/Git/PiyapatPortfolio/projects/detail.html)

## Deploy to GitHub Pages

1. Push this repository to `https://github.com/PiyapatWaw/piyapat.github.io.git`
2. Open the repository on GitHub
3. Go to `Settings > Pages`
4. Set `Source` to `Deploy from a branch`
5. Select branch `main`
6. Select folder `/ (root)`
7. Save and wait for GitHub Pages to publish

Expected URL:

- `https://piyapatwaw.github.io/`

## Notes

- This is a static site, so all files inside `assets/` and `data/` are public when deployed.
- Add only files that are safe to expose publicly.
- Project thumbnails can be replaced later by adding real images into `assets/images/projects/`.
