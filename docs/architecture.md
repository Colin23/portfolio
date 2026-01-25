# Architecture & Data Flow

## Single Source of Truth

The project is designed so that professional data is defined once and consumed by multiple outputs.

### 1. Data Layer (Markdown)

- All CV-related data resides in `src/lib/content/*.md`.
- These files use standard Markdown syntax.
- **Why?** Markdown is portable, easy to edit, and version-control friendly.

### 2. Processing Layer (mdsvex)

- **mdsvex** acts as a bridge, allowing Markdown files to be imported directly into Svelte components as if they were Svelte components themselves.
- It parses the Markdown into HTML at compile time.

### 3. Presentation Layer (SvelteKit & Tailwind)

- **Web View:** The `/cv` route imports the Markdown components and wraps them in Tailwind-styled sections.
- **PDF View:** The same `/cv` route uses CSS Print Media Queries (`@media print`) to reformat the HTML for an A4 paper layout.
- **Print Logic:**
    - `@page { margin: 0; }` hides browser headers/footers.
    - `.print-container` adds physical padding to simulate margins.
    - `break-inside: avoid` ensures sections don't get split awkwardly across pages.

## Deployment Pipeline

1. **Push to GitHub**: Triggers a Netlify build.
2. **Build Step (`bun run build`)**:
    - SvelteKit pre-renders all routes into static HTML files.
    - mdsvex converts Markdown to HTML.
    - Tailwind CSS compiles and minifies the styles.
3. **Static Hosting**: Netlify serves the pre-rendered files from the `build/` directory.
