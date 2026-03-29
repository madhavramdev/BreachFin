# Getting Started

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local HTTP server to serve the files — any of these will work:
  - `python3 -m http.server`
  - VS Code Live Server extension
  - Node's `npx serve`

> **Why do I need a server?**  
> The app uses `fetch()` to load `data/tools.json` at runtime. Browsers block this when the page is opened via `file://` due to CORS restrictions.

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/madhavramdev/BreachFin.git
cd BreachFin

# 2. Start a local server (pick one)
python3 -m http.server 8080          # Python
npx -y serve .                        # Node.js
php -S localhost:8080                  # PHP

# 3. Open in your browser
open http://localhost:8080             # macOS
xdg-open http://localhost:8080        # Linux
```

There are **no build steps, no dependencies, and no `npm install`**. The project is pure HTML, CSS, and vanilla JavaScript.

---

## Deployment

BreachFin is deployed automatically to **GitHub Pages** on every push to `main`.

### How It Works

The workflow at `.github/workflows/deploy-pages.yml` does the following:

1. Checks out the repo.
2. Configures GitHub Pages.
3. Uploads the entire repo root as the site artifact.
4. Deploys to GitHub Pages.

### Manual Deployment

Since this is a static site, you can host it anywhere:

| Platform | Command / Method |
|---|---|
| GitHub Pages | Push to `main` (automatic via workflow) |
| Netlify | Drag-and-drop the project folder |
| Vercel | `npx vercel --prod` from the project root |
| Any server | Copy all files to the web root |

---

## Project File Layout

```
breachfin/
├── index.html              # Main entry point (Apple theme)
├── index_matrix.html       # Alternate entry point (Matrix theme layout)
├── js/
│   └── app.js              # All application logic (335 lines)
├── css/
│   ├── style.css           # Apple / light theme (default)
│   └── style_matrix.css    # Matrix / hacker theme
├── data/
│   └── tools.json          # Tool & command database
├── assets/
│   └── logo.png            # BreachFin logo
├── .github/
│   └── workflows/
│       └── deploy-pages.yml  # GitHub Pages CI/CD
└── docs/                   # This documentation
```

---

## Next Steps

- [Architecture overview →](./architecture.md)
- [Adding new tools →](./tools-database.md)
- [Understanding the themes →](./theming.md)
