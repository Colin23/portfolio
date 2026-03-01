import type { PageServerLoad } from "./$types";
import fs from "node:fs";
import path from "node:path";

export const load: PageServerLoad = () => {
    const projectsPath = path.resolve("src/lib/content/projects.md");
    const skillsPath = path.resolve("src/lib/content/skills.md");
    const experiencePath = path.resolve("src/lib/content/experience.md");
    const certificatesPath = path.resolve("src/lib/content/certificates.md");
    const profilePath = path.resolve("src/lib/content/profile.md");
    const contactPath = path.resolve("src/lib/content/contact.md");
    const educationPath = path.resolve("src/lib/content/education.md");
    const languagesPath = path.resolve("src/lib/content/languages.md");

    const projectsContent = fs.readFileSync(projectsPath, "utf-8");
    const skillsContent = fs.readFileSync(skillsPath, "utf-8");
    const experienceContent = fs.readFileSync(experiencePath, "utf-8");
    const certificatesContent = fs.readFileSync(certificatesPath, "utf-8");
    const profileContent = fs.readFileSync(profilePath, "utf-8");
    const contactContent = fs.readFileSync(contactPath, "utf-8");
    const educationContent = fs.readFileSync(educationPath, "utf-8");
    const languagesContent = fs.readFileSync(languagesPath, "utf-8");

    const projects = parseProjects(projectsContent);
    const skills = parseSkills(skillsContent);
    const experience = parseExperience(experienceContent);
    const certificates = parseCertificates(certificatesContent);
    const profile = parseProfile(profileContent);
    const contact = parseContact(contactContent);
    const education = parseEducation(educationContent);
    const languages = parseLanguages(languagesContent);

    return {
        projects,
        skills,
        experience,
        certificates,
        profile,
        contact,
        education,
        languages
    };
};

/**
 * Parses the work experience Markdown content in date-first format:
 * ## Date
 * ### Company — Location
 * **Role**
 * - Bullet
 */
function parseExperience(content: string): Array<{ title: string; period: string; role: string; content: string }> {
    const sections = content.split(/^## /m).slice(1);

    return sections.map(section => {
        const lines = section
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean);

        const period = lines[0] ?? "";
        const titleLine = lines.find(line => line.startsWith("### ")) ?? "";
        const title = titleLine.replace(/^###\s+/, "").trim();

        const roleLine = lines.find(line => line.startsWith("**") && line.endsWith("**")) ?? "";
        const role = roleLine.replaceAll("**", "").trim();

        const listItems = lines.filter(line => line.startsWith("- "));
        const htmlContent = listItems.map(line => `<li>${line.substring(2).trim()}</li>`).join("\n");

        return {
            title,
            period,
            role,
            content: htmlContent ? `<ul>${htmlContent}</ul>` : ""
        };
    });
}

/**
 * Parses the certificates Markdown content.
 *
 * @param {string} content - The raw Markdown content from certificates.md.
 * @returns {Array<{title: string, info: string, link: string | undefined}>} Array of certificate objects.
 */
function parseCertificates(content: string): Array<{ title: string; info: string; link: string | undefined }> {
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
function parseProjects(content: string): Array<{
    title: string;
    tech: string;
    content: string;
    github: string | undefined;
    liveDemo: string | undefined;
}> {
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
function parseSkills(content: string): Array<{ title: string; items: string[] }> {
    const sections = content.split(/^## /m).slice(1);
    return sections.map(section => {
        const lines = section.split("\n");
        const title = lines[0].trim();
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

/**
 * Parses the profile markdown content.
 *
 * @param {string} content - The raw Markdown content from profile.md.
 * @returns {string} Profile summary text.
 */
function parseProfile(content: string): string {
    return content
        .split("\n")
        .map(line => line.trim())
        .filter((line, index) => !(index === 0 && line.startsWith("#")))
        .join(" ")
        .replaceAll(/\s+/g, " ")
        .trim();
}

/**
 * Parses the contact markdown content.
 *
 * @param {string} content - The raw Markdown content from contact.md.
 * @returns {{name?: string; role?: string; location?: string; phone?: string; email?: string; linkedin?: string; github?: string}} Contact fields.
 */
function parseContact(content: string): {
    name?: string;
    role?: string;
    location?: string;
    phone?: string;
    email?: string;
    linkedin?: string;
    github?: string;
} {
    const lines = content
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.startsWith("- **"));

    const fields: Record<string, string> = {};

    for (const line of lines) {
        const match = line.match(/^- \*\*(.+?):\*\*\s*(.+)$/);
        if (!match) continue;
        const key = match[1].toLowerCase();
        fields[key] = match[2].replaceAll(/\[(.*?)]\((.*?)\)/g, "$2").trim();
    }

    return {
        name: fields.name,
        role: fields.role,
        location: fields.location,
        phone: fields.phone,
        email: fields.email,
        linkedin: fields.linkedin,
        github: fields.github
    };
}

/**
 * Parses the education markdown content.
 *
 * @param {string} content - The raw Markdown content from education.md.
 * @returns {Array<{institution: string; degree: string; period: string}>} Array of education entries.
 */
function parseEducation(content: string): Array<{ institution: string; degree: string; period: string }> {
    const sections = content.split(/^## /m).slice(1);

    return sections.map(section => {
        const lines = section
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean);

        const period = lines[0] ?? "";
        const institutionLine = lines.find(line => line.startsWith("### ")) ?? "";
        const institution = institutionLine.replace(/^###\s+/, "").trim();

        const degreeLine = lines.find(line => line.startsWith("**") && line.endsWith("**")) ?? "";
        const degree = degreeLine.replaceAll("**", "").trim();

        return { institution, degree, period };
    });
}

/**
 * Parses the languages markdown content.
 *
 * @param {string} content - The raw Markdown content from languages.md.
 * @returns {string[]} Array of language entries.
 */
function parseLanguages(content: string): string[] {
    return content
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.startsWith("- "))
        .map(line => line.substring(2).trim());
}
