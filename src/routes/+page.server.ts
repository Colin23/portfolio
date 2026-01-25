import type { PageServerLoad } from "./$types";
import fs from "node:fs";
import path from "node:path";

export const load: PageServerLoad = () => {
    const projectsPath = path.resolve("src/lib/content/projects.md");
    const skillsPath = path.resolve("src/lib/content/skills.md");
    const experiencePath = path.resolve("src/lib/content/experience.md");
    const certificatesPath = path.resolve("src/lib/content/certificates.md");

    const projectsContent = fs.readFileSync(projectsPath, "utf-8");
    const skillsContent = fs.readFileSync(skillsPath, "utf-8");
    const experienceContent = fs.readFileSync(experiencePath, "utf-8");
    const certificatesContent = fs.readFileSync(certificatesPath, "utf-8");

    const projects = parseProjects(projectsContent);
    const skills = parseSkills(skillsContent);
    const experience = parseExperience(experienceContent);
    const certificates = parseCertificates(certificatesContent);

    return {
        projects,
        skills,
        experience,
        certificates
    };
};

/**
 * Parses the work experience Markdown content.
 *
 * @param {string} content - The raw Markdown content from experience.md.
 * @returns {Array<{title: string, period: string, content: string}>} Array of experience objects.
 */
function parseExperience(content: string) {
    // Split content by H2 headers (## Title)
    const sections = content.split(/^## /m).slice(1);
    return sections.map(section => {
        const lines = section.split("\n");
        const title = lines[0].trim();
        // Look for the date/period line which is wrapped in underscores (e.g., _January 2022 – Present_)
        const dateLine = lines.find(l => l.startsWith("_") && l.endsWith("_"));
        const period = dateLine ? dateLine.replaceAll("_", "").trim() : "";

        const dateIndex = dateLine ? lines.indexOf(dateLine) : -1;
        const contentStart = dateIndex >= 0 ? dateIndex + 1 : 1;
        const rawContent = lines.slice(contentStart).join("\n").trim();

        // Convert simple Markdown list items to HTML list items
        const htmlContent = rawContent
            .split("\n")
            .map(line => {
                if (line.startsWith("- ")) {
                    return `<li>${line.substring(2)}</li>`;
                }
                return line;
            })
            .join("\n");

        return {
            title,
            period,
            // Wrap in <ul> if list items were found
            content: htmlContent.includes("<li>") ? `<ul>${htmlContent}</ul>` : htmlContent
        };
    });
}

/**
 * Parses the certificates Markdown content.
 *
 * @param {string} content - The raw Markdown content from certificates.md.
 * @returns {Array<{title: string, info: string, link: string | undefined}>} Array of certificate objects.
 */
function parseCertificates(content: string) {
    // Split content by H2 headers (## Title)
    const sections = content.split(/^## /m).slice(1);
    return sections.map(section => {
        const lines = section.split("\n");
        const title = lines[0].trim();
        // Look for the info line (e.g., _Oracle, 2023_)
        const infoLine = lines.find(l => l.startsWith("_") && l.endsWith("_"));
        const info = infoLine ? infoLine.replaceAll("_", "").trim() : "";

        // Extract link from Markdown format [Text](URL)
        const link = lines.find(l => l.includes("[View Certificate]"))?.match(/\(([^)]+)\)/)?.[1];

        return {
            title,
            info,
            link
        };
    });
}

/**
 * Parses the projects Markdown content.
 *
 * @param {string} content - The raw Markdown content from projects.md.
 * @returns {Array<{title: string, tech: string, content: string, github: string | undefined, liveDemo: string | undefined}>} Array of project objects.
 */
function parseProjects(content: string) {
    // Split content by H2 headers (## Title)
    const sections = content.split(/^## /m).slice(1);
    return sections.map(section => {
        const lines = section.split("\n");
        const title = lines[0].trim();
        // Look for the tech stack line (e.g., _SvelteKit, Tailwind CSS_)
        const techLine = lines.find(l => l.startsWith("_") && l.endsWith("_"));
        const tech = techLine ? techLine.replaceAll("_", "").trim() : "";

        // Extract content between tech line and links
        const techIndex = techLine ? lines.indexOf(techLine) : -1;
        const contentStart = techIndex >= 0 ? techIndex + 1 : 1;
        // Links start at lines beginning with [GitHub] or [Live Demo]
        const linksStart = lines.findIndex(l => l.startsWith("[GitHub]") || l.startsWith("[Live Demo]"));
        const rawContentLines = lines.slice(contentStart, linksStart > -1 ? linksStart : undefined);
        const rawContent = rawContentLines.join("\n").trim();

        // Convert simple Markdown list items to HTML list items
        const htmlContent = rawContent
            .split("\n")
            .map(line => {
                if (line.startsWith("- ")) {
                    return `<li>${line.substring(2)}</li>`;
                }
                return line;
            })
            .join("\n");

        // Extract links from Markdown format [Text](URL) using Regex
        const github = lines.find(l => l.startsWith("[GitHub]"))?.match(/\(([^)]+)\)/)?.[1];
        const liveDemo = lines.find(l => l.startsWith("[Live Demo]"))?.match(/\(([^)]+)\)/)?.[1];

        return {
            title,
            tech,
            // Wrap in <ul> if list items were found
            content: htmlContent.includes("<li>") ? `<ul>${htmlContent}</ul>` : htmlContent,
            github,
            liveDemo
        };
    });
}

/**
 * Parses the skills Markdown content.
 *
 * @param {string} content - The raw Markdown content from skills.md.
 * @returns {Array<{title: string, items: string[]}>} Array of skill categories.
 */
function parseSkills(content: string) {
    // Split content by H2 headers (## Category)
    const sections = content.split(/^## /m).slice(1);
    return sections.map(section => {
        const lines = section.split("\n");
        const title = lines[0].trim();
        // Extract bullet points (- Skill Name) and remove bold markers (**)
        const items = lines
            .slice(1)
            .filter(l => l.startsWith("- "))
            .map(l => l.substring(2).replaceAll("**", "").trim());

        return {
            title,
            items
        };
    });
}
