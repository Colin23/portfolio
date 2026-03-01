import type {PageServerLoad} from "./$types";
import fs from "node:fs";
import path from "node:path";

/**
 * Parses contact markdown bullet lines in format:
 * - **Key:** Value
 *
 * @param {string} content - Raw markdown content from contact.md.
 * @returns {{name?: string; role?: string; location?: string; phone?: string; email?: string; linkedin?: string; github?: string}} Parsed contact object.
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
 * Parses profile markdown as plain paragraph text.
 *
 * @param {string} content - Raw markdown content from profile.md.
 * @returns {string} Profile summary text.
 */
function parseProfile(content: string): string {
    return content
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith("#"))
        .join(" ")
        .replaceAll(/\s+/g, " ")
        .trim();
}

/**
 * Parses skills markdown into section objects.
 */
function parseSkills(content: string): Array<{ title: string; items: string[] }> {
    const sections = content.split(/^## /m).slice(1);
    return sections.map(section => {
        const lines = section.split("\n");
        const title = lines[0].trim();
        const items = lines
            .slice(1)
            .filter(l => l.trim().startsWith("- "))
            .map(l => l.trim().substring(2).replaceAll("**", "").trim());

        return { title, items };
    });
}

/**
 * Parses languages markdown into array of entries.
 *
 * @param {string} content - Raw markdown content from languages.md.
 * @returns {string[]} Parsed language entries.
 */
function parseLanguages(content: string): string[] {
    return content
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.startsWith("- "))
        .map(line => line.substring(2).trim());
}

/**
 * Loads and derives data required for rendering the CV route.
 */
export const load: PageServerLoad = () => {
    const contactPath = path.resolve("src/lib/content/contact.md");
    const profilePath = path.resolve("src/lib/content/profile.md");
    const skillsPath = path.resolve("src/lib/content/skills.md");
    const languagesPath = path.resolve("src/lib/content/languages.md");

    const contactContent = fs.readFileSync(contactPath, "utf-8");
    const profileContent = fs.readFileSync(profilePath, "utf-8");
    const skillsContent = fs.readFileSync(skillsPath, "utf-8");
    const languagesContent = fs.readFileSync(languagesPath, "utf-8");

    const contact = parseContact(contactContent);
    const profile = parseProfile(profileContent);
    const skills = parseSkills(skillsContent);
    const languages = parseLanguages(languagesContent);

    const familiarityTitles = new Set([
        "Working Knowledge",
        "Familiarity",
        "Additional Technologies",
        "Basic knowledge"
    ]);
    const coreSkills = skills.filter(group => !familiarityTitles.has(group.title));
    const familiarity = skills.filter(group => familiarityTitles.has(group.title)).flatMap(group => group.items);

    if (!contact.name || !contact.role || !contact.location || !contact.phone || !contact.email) {
        throw new Error("contact.md is missing required fields for CV rendering.");
    }
    if (!profile) {
        throw new Error("profile.md is empty or invalid.");
    }

    return { contact, profile, coreSkills, familiarity, languages };
};
