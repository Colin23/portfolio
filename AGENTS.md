# AI Agent Rules

- Do not add any new dependencies (via `bun add`, `npm install`, etc.) without explicit user permission.
- Always run `bun run prettier`, `bun run eslint` and `bun run test:unit` before submitting changes to ensure code quality and consistency.
- Always use `bun` and its commands (e.g. `bun install`, `bun run`); do not use `npm` or `pnpm` in this project.
- Always ensure that the documentation in the `docs/` folder and `README.md` is up to date when making changes to the project.
- All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
- All technical content (Experience, Skills, Projects, Certificates) must be pulled from the respective Markdown files in `src/lib/content/` to maintain a single source of truth. Do not hardcode this data in Svelte files.
- Always write sensible JSDoc comments for functions and components.
- Use inline comments to explain complex logic, such as Regex patterns or intricate state management.
- Make sure to add tests where sensible for any new functionality.
- Use explicit typing for variables and function parameters where possible.
