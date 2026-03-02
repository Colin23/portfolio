# How to Update Your Portfolio

## Content (Single Source of Truth)

All CV-related content is stored in Markdown files in `src/lib/content/`. Editing these files will automatically update
both the website and the CV page.

- `profile.md`: The "About Me" hero text on the landing page.
- `contact.md`: Name, role, location, phone, email, LinkedIn, and GitHub.
- `experience.md`: Your work history.
- `education.md`: Your education background.
- `skills.md`: Your technical skills grouped by category.
- `projects.md`: Your portfolio projects with descriptions and links.
- `certificates.md`: Your professional certifications.
- `languages.md`: Your spoken languages.

## Development

To start the development server:

```bash
bun run dev
```

## Quality Checks

Run all checks locally before pushing:

```bash
bun run check && bun run eslint && bun run prettier && bun run test:unit && bun run build
```

## Building for Production

To generate the static site (SSG) for Netlify:

```bash
bun run build
```

The output will be in the `build/` directory.

## PDF Generation

The CV PDF is generated automatically via a GitHub Actions workflow whenever changes are pushed to main. It uses
Playwright to render the /cv route and produce static/colin-moerbe-cv.pdf.
To generate the PDF locally:

```bash
bun run generate:cv-pdf:local
```

This builds the site, starts a preview server, generates the PDF, and shuts down the server.
