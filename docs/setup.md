# Setup & Development Guide

Follow these steps to get the portfolio project up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

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
    Open [http://localhost:5173](http://localhost:5173) in your browser to see the result.

## Content Management

The project follows a **Single Source of Truth** pattern. Most content is stored in `src/lib/content/` as Markdown
files.

For detailed instructions on how to update your CV data, see [How to Update Content](./how-to-update.md).

## Deployment

The project is configured for **Netlify** using SvelteKit's static adapter.

- **Build Command:** `bun run build`
- **Publish Directory:** `build`

Pushing to the `main` branch will automatically trigger a deployment on Netlify if the integration is set up.
