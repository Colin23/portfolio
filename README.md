# Professional Portfolio & CV - [![Netlify Status](https://api.netlify.com/api/v1/badges/c62f9035-43dd-4892-a02a-33f22c10e919/deploy-status)](https://app.netlify.com/projects/colinmoerbe/deploys)

This repository contains my personal portfolio.

## 📂 Project Structure

- `src/lib/content/`: Markdown files containing CV data (Experience, Skills, Projects, ...).
- `src/routes/cv/`: The CV page with print-optimized styling for PDF generation.
- `docs/`: Documentation for planning, tech stack, and updates.

## 🛠 Tech Stack

- **Frontend:** SvelteKit (SSG Mode)
- **Styling:** Tailwind CSS v4
- **Content:** Markdown (mdsvex)
- **Runtime:** Bun
- **Hosting:** Netlify

## ✅ Quality Checks

Run all checks locally before pushing:

```bash
bun run check && bun run eslint && bun run test:unit && bun run build
```

CI runs automatically:

- on pull requests targeting `main`
- on pushes to `main`

## 🔎 SEO & Crawling

- `static/robots.txt` allows crawling and points to the sitemap.
- `static/sitemap.xml` lists indexable site routes.

## 📄 Documentation

- [Setup & Development Guide](docs/setup.md)
- [Project Plan](docs/plan.md)
- [Architecture & Data Flow](docs/architecture.md)
- [Tech Stack Details](docs/tech-stack.md)
- [How to Update Content](docs/how-to-update.md)
- [AI Agent Rules](AGENTS.md)

## 📜 License

[License](LICENSE)
