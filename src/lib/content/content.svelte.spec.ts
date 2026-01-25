import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-svelte";
import { page } from "vitest/browser";
import Experience from "./experience.md";

describe("Markdown Content Rendering", () => {
    it("should render Experience markdown correctly", async () => {
        render(Experience);
        const heading = page.getByRole("heading", { name: "Work Experience" });
        await expect.element(heading).toBeInTheDocument();

        const role = page.getByText("Senior Software Engineer at Tech Corp");
        await expect.element(role).toBeInTheDocument();
    });
});
