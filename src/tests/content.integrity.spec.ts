import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Reads a Markdown content file from src/lib/content.
 *
 * @param {string} fileName - File name including extension.
 * @returns {string} UTF-8 file content.
 */
function readContentFile(fileName: string): string {
    const filePath = path.resolve("src/lib/content", fileName);
    return fs.readFileSync(filePath, "utf-8");
}

describe("Content integrity", () => {
    it("has required content files with non-empty content", () => {
        const requiredFiles = [
            "profile.md",
            "contact.md",
            "skills.md",
            "projects.md",
            "experience.md",
            "education.md",
            "languages.md",
            "certificates.md"
        ];

        for (const fileName of requiredFiles) {
            const content = readContentFile(fileName).trim();
            expect(content.length, `${fileName} should not be empty`).toBeGreaterThan(0);
        }
    });

    it("contact.md contains required keys", () => {
        const content = readContentFile("contact.md");

        expect(content).toContain("**Name:**");
        expect(content).toContain("**Role:**");
        expect(content).toContain("**Location:**");
        expect(content).toContain("**Phone:**");
        expect(content).toContain("**Email:**");
    });

    it("skills.md and projects.md contain at least one section", () => {
        const skills = readContentFile("skills.md");
        const projects = readContentFile("projects.md");

        expect(skills.match(/^##\s+/gm)?.length ?? 0).toBeGreaterThan(0);
        expect(projects.match(/^##\s+/gm)?.length ?? 0).toBeGreaterThan(0);
    });
});
