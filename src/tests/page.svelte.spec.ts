import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-svelte";
import { page } from "vitest/browser";
import HomePage from "../routes/+page.svelte";

describe("Home page smoke", () => {
    it("renders section headings", async () => {
        render(HomePage, {
            data: {
                profile: "Senior software engineer focused on maintainable web platforms.",
                contact: {
                    email: "placeholder@example.com",
                    location: "Berlin",
                    linkedin: "linkedin.com/in/placeholder",
                    github: "github.com/placeholder"
                },
                skills: [
                    { title: "Frontend", items: ["SvelteKit", "TypeScript"] },
                    { title: "Basic knowledge", items: ["Go"] }
                ],
                projects: [
                    {
                        title: "Portfolio",
                        tech: "SvelteKit",
                        content: "Demo project",
                        github: undefined,
                        liveDemo: undefined
                    }
                ],
                experience: [
                    { title: "Engineer", period: "2023—Now", role: "Senior Engineer", content: "<ul><li>x</li></ul>" }
                ],
                certificates: [{ title: "Cert A", info: "2025", link: undefined }],
                education: [{ institution: "Uni", degree: "BSc", period: "2018—2021" }],
                languages: ["English (Fluent)"]
            }
        });

        await expect.element(page.getByRole("heading", { name: "Technical Expertise" })).toBeInTheDocument();
        await expect.element(page.getByRole("heading", { name: "Get in Touch" })).toBeInTheDocument();
    });
});
