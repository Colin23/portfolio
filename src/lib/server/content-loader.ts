import fs from "node:fs";
import path from "node:path";
import type { Locale } from "$lib/i18n";
import { FAMILIARITY_TITLES_BY_LOCALE } from "$lib/familiarity-titles";

type Contact = {
    name?: string;
    role?: string;
    location?: string;
    phone?: string;
    email?: string;
    linkedin?: string;
    github?: string;
};

type SkillGroup = { title: string; items: string[] };

type ExperienceEntry = {
    title: string;
    period: string;
    role: string;
    content: string;
};

type EducationEntry = {
    institution: string;
    degree: string;
    period: string;
};

type CertificateEntry = {
    title: string;
    info: string;
    link: string | undefined;
};

type ProjectEntry = {
    title: string;
    tech: string;
    content: string;
    github: string | undefined;
    liveDemo: string | undefined;
};

/**
 * Resolves the content file path for a given locale and file name.
 * @param locale 2-letter locale code
 * @param fileName File name including extension
 */
async function resolveContentPathAsync(locale: Locale, fileName: string): Promise<string> {
    const localizedPath = path.resolve(`src/lib/content/${locale}/${fileName}`);

    try {
        await fs.promises.access(localizedPath, fs.constants.F_OK);
        return localizedPath;
    } catch {
        // Backward-compatible fallback while migrating files.
        return path.resolve(`src/lib/content/${fileName}`);
    }
}

/**
 * Reads the content of a file for a given locale.
 * @param locale 2-letter locale code
 * @param fileName File name including extension
 */
async function readContent(locale: Locale, fileName: string): Promise<string> {
    const resolvedPath = await resolveContentPathAsync(locale, fileName);
    return fs.promises.readFile(resolvedPath, "utf-8");
}

/**
 * Parses experience sections from Markdown content.
 * @param content Markdown content.
 */
function parseExperience(content: string): ExperienceEntry[] {
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
 * Parses certificates sections from Markdown content.
 * @param content Markdown content.
 */
function parseCertificates(content: string): CertificateEntry[] {
    const sections = content.split(/^## /m).slice(1);
    return sections.map(section => {
        const lines = section.split("\n");
        const title = lines[0].trim();
        const infoLine = lines.find(l => l.startsWith("_") && l.endsWith("_"));
        const info = infoLine ? infoLine.replaceAll("_", "").trim() : "";
        const link = lines.find(l => l.includes("[View Certificate]"))?.match(/\(([^)]+)\)/)?.[1];

        return { title, info, link };
    });
}

/**
 * Parses projects sections from Markdown content.
 * @param content Markdown content.
 */
function parseProjects(content: string): ProjectEntry[] {
    const sections = content.split(/^## /m).slice(1);
    return sections.map(section => {
        const lines = section.split("\n");
        const title = lines[0].trim();
        const techLine = lines.find(l => l.startsWith("_") && l.endsWith("_"));
        const tech = techLine ? techLine.replaceAll("_", "").trim() : "";

        const techIndex = techLine ? lines.indexOf(techLine) : -1;
        const contentStart = techIndex >= 0 ? techIndex + 1 : 1;
        const linksStart = lines.findIndex(l => l.startsWith("[GitHub]") || l.startsWith("[Live Demo]"));
        const rawContentLines = lines.slice(contentStart, linksStart > -1 ? linksStart : undefined);
        const rawContent = rawContentLines.join("\n").trim();

        const htmlContent = rawContent
            .split("\n")
            .map(line => (line.startsWith("- ") ? `<li>${line.substring(2)}</li>` : line))
            .join("\n");

        const github = lines.find(l => l.startsWith("[GitHub]"))?.match(/\(([^)]+)\)/)?.[1];
        const liveDemo = lines.find(l => l.startsWith("[Live Demo]"))?.match(/\(([^)]+)\)/)?.[1];

        return {
            title,
            tech,
            content: htmlContent.includes("<li>") ? `<ul>${htmlContent}</ul>` : htmlContent,
            github,
            liveDemo
        };
    });
}

/**
 * Parses skills sections from Markdown content.
 * @param content Markdown content.
 */
function parseSkills(content: string): SkillGroup[] {
    const sections = content.split(/^## /m).slice(1);
    return sections.map(section => {
        const lines = section.split("\n");
        const title = lines[0].trim();
        const items = lines
            .slice(1)
            .filter(l => l.startsWith("- "))
            .map(l => l.substring(2).replaceAll("**", "").trim());

        return { title, items };
    });
}

/**
 * Parses the profile section from Markdown content.
 * @param content Markdown content.
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
 * Parses the contact section from Markdown content.
 * @param content Markdown content.
 */
function parseContact(content: string): Contact {
    const lines = content
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.startsWith("- **"));

    const fields: Record<string, string> = {};

    for (const line of lines) {
        const match = new RegExp(/^- \*\*(.+?):\*\*\s*(.+)$/).exec(line);
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
 * Parses education sections from Markdown content.
 * @param content Markdown content.
 */
function parseEducation(content: string): EducationEntry[] {
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
 * Parses the languages section from Markdown content.
 * @param content Markdown content.
 */
function parseLanguages(content: string): string[] {
    return content
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.startsWith("- "))
        .map(line => line.substring(2).trim());
}

/**
 * Loads portfolio content for a given locale.
 * @param locale 2-letter locale code
 */
export async function loadPortfolioContent(locale: Locale): Promise<{
    locale: Locale;
    projects: ProjectEntry[];
    skills: SkillGroup[];
    experience: ExperienceEntry[];
    certificates: CertificateEntry[];
    profile: string;
    contact: Contact;
    education: EducationEntry[];
    languages: string[];
}> {
    const projects = parseProjects(await readContent(locale, "projects.md"));
    const skills = parseSkills(await readContent(locale, "skills.md"));
    const experience = parseExperience(await readContent(locale, "experience.md"));
    const certificates = parseCertificates(await readContent(locale, "certificates.md"));
    const profile = parseProfile(await readContent(locale, "profile.md"));
    const contact = parseContact(await readContent(locale, "contact.md"));
    const education = parseEducation(await readContent(locale, "education.md"));
    const languages = parseLanguages(await readContent(locale, "languages.md"));

    return {
        locale,
        projects,
        skills,
        experience,
        certificates,
        profile,
        contact,
        education,
        languages
    };
}

/**
 * Loads CV content for a given locale.
 * @param locale 2-letter locale code
 */
export async function loadCvContent(locale: Locale): Promise<{
    locale: Locale;
    contact: Contact;
    profile: string;
    coreSkills: SkillGroup[];
    familiarity: string[];
    languages: string[];
}> {
    const contact = parseContact(await readContent(locale, "contact.md"));
    const profile = parseProfile(await readContent(locale, "profile.md"));
    const skills = parseSkills(await readContent(locale, "skills.md"));
    const languages = parseLanguages(await readContent(locale, "languages.md"));

    const familiarityTitles = new Set(FAMILIARITY_TITLES_BY_LOCALE[locale]);

    const coreSkills = skills.filter(group => !familiarityTitles.has(group.title));
    const familiarity = skills.filter(group => familiarityTitles.has(group.title)).flatMap(group => group.items);

    if (!contact.name || !contact.role || !contact.location || !contact.phone || !contact.email) {
        throw new Error("contact.md is missing required fields for CV rendering.");
    }

    if (!profile) {
        throw new Error("profile.md is empty or invalid.");
    }

    return {
        locale,
        contact,
        profile,
        coreSkills,
        familiarity,
        languages
    };
}
