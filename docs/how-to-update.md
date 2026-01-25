# How to Update Your Portfolio

## Content (Single Source of Truth)

All CV-related content is stored in Markdown files in `src/lib/content/`. Editing these files will automatically update
both the website's CV page and the generated PDF.

- `experience.md`: Your work history.
- `skills.md`: Your technical skills.
- `projects.md`: Your portfolio projects.

## About Me Section

The 'About Me' section on the landing page is hardcoded in `src/routes/+page.svelte`. You can edit it there.

## Development

To start the development server:

```bash
bun run dev
```

## Building for Production

To generate the static site (SSG) for Netlify:

```bash
bun run build
```

The output will be in the `build/` directory.

## PDF Generation

The PDF is generated using the browser's print engine to ensure it perfectly matches your website's styling.
To 'download' your CV as a PDF:

1. Navigate to the `/cv` page.
2. Click the 'Download PDF' button.
3. In the browser's print dialog, select 'Save as PDF' as the destination.
4. (Optional) In the print settings, ensure 'Background graphics' is enabled if you have colored backgrounds.
