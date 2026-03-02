# Setup & Development Guide

Follow these steps to get the portfolio project up and running.

## Prerequisites

Ensure the following tools are installed:

- [Bun](https://bun.com/) (latest version)
- [Git](https://git-scm.com/)

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd portfolio
    ```

2. **Install dependencies:**

    ```bash
    bun install
    ```

3. **Start the development server:**
    ```bash
    bun run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to see the result.

## Content Management

The project follows a **Single Source of Truth** pattern. Most content is stored in `src/lib/content/` as Markdown
files.

For detailed instructions on how to update the CV data, see [How to Update Content](./how-to-update.md).

## Deployment

The project is configured for **Netlify** using SvelteKit's static adapter.

- **Build Command:** `bun run build`
- **Publish Directory:** `build`

Pushing to the `main` branch will automatically trigger a deployment on Netlify if the integration is set up.
