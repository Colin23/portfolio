# Tech Stack

## Runtime & Package Management

- **Bun**: Fast JavaScript runtime, package manager, and bundler.

## Frontend Framework

- **SvelteKit**:
    - Routing, SSG (Static Site Generation), and SSR (Server-Side Rendering).
    - Uses `@sveltejs/adapter-static` for zero-cost hosting on Netlify.

## Styling

- **Tailwind CSS**: Utility-first CSS framework for responsive design.

## Content Management

- **Markdown**: Single source of truth for CV, projects, and skills.
- **mdsvex**: Pre-processor to use Markdown in Svelte components.

## PDF Generation

- **Browser-based / Library-assisted**:
    - CSS Print Media Queries for styling the CV.
    - Automated conversion from HTML to PDF.

## Tooling

- **TypeScript**: Type safety.
- **Vite**: Dev server and build tool.
- **Vitest**: Testing framework.
- **ESLint & Prettier**: Code quality and consistent formatting.

## Hosting & Deployment

- **Netlify**:
    - Global CDN for static files.
    - Netlify Forms for the contact section.
    - Automatic deployments via GitHub integration.
