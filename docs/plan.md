# Portfolio Website – Plan & Goals

## Purpose

This portfolio website serves as:

- A public, always-up-to-date version of my CV.
- A place to showcase work experience, skills, and projects.
- A single source of truth for CV content, avoiding duplicate maintenance.

## Core Goals

- **Simple & maintainable**: Easy to update without overhead.
- **Cheap / free hosting**: No recurring costs beyond a domain.
- **Single source of truth**: CV content stored once in Markdown.
- **Professional presentation**: Clean design, fast, and SEO-friendly.
- **Extensible**: Easy to add new sections or features later.

## Key Features

- **About Me**: Hero section on the landing page.
- **Work Experience**: Markdown-driven section.
- **Skills**: Markdown-driven with proficiency levels.
- **Projects**: Markdown-driven with descriptions and tech stack.
- **Certificates**: Markdown-driven section for professional certifications.
- **Contact**: Section with contact details and a Netlify-integrated form.
- **Downloadable CV (PDF)**:
    - Dedicated print-optimized route (`/cv`).
    - Triggered via a 'Download CV' button in the navbar using a hidden iframe.
    - Generated automatically from Markdown -> HTML -> PDF.
    - Ensures website and PDF remain in sync.
- **Responsive Design**: Mobile-friendly via Tailwind CSS with a hamburger menu.
- **Dark Mode**: System-default aware with manual toggle.
- **ScrollSpy**: Navbar highlighting based on scroll position.
- **SEO-friendly**: Static Site Generation (SSG) for fast indexing.

## Future Considerations

- Analytics (Google Analytics).
- PWA support.
- Heavy animations.
- Extensive automated testing.
