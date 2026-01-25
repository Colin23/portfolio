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

function parseExperience(content: string) {
    const sections = content.split(/^## /m).slice(1);
    return sections.map(section => {
        const lines = section.split("\n");
        const title = lines[0].trim();
        const dateLine = lines.find(l => l.startsWith("_") && l.endsWith("_"));
        const period = dateLine ? dateLine.replace(/_/g, "").trim() : "";

        const contentStart = lines.indexOf(dateLine!) + 1;
        const rawContent = lines.slice(contentStart).join("\n").trim();

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
            content: htmlContent.includes("<li>") ? `<ul>${htmlContent}</ul>` : htmlContent
        };
    });
}

function parseCertificates(content: string) {
    const sections = content.split(/^## /m).slice(1);
    return sections.map(section => {
        const lines = section.split("\n");
        const title = lines[0].trim();
        const infoLine = lines.find(l => l.startsWith("_") && l.endsWith("_"));
        const info = infoLine ? infoLine.replace(/_/g, "").trim() : "";

        const link = lines.find(l => l.includes("[View Certificate]"))?.match(/\((.*)\)/)?.[1];

        return {
            title,
            info,
            link
        };
    });
}

function parseProjects(content: string) {
    const sections = content.split(/^## /m).slice(1);
    return sections.map(section => {
        const lines = section.split("\n");
        const title = lines[0].trim();
        const techLine = lines.find(l => l.startsWith("_") && l.endsWith("_"));
        const tech = techLine ? techLine.replace(/_/g, "").trim() : "";

        // Extract content between tech line and links
        const contentStart = lines.indexOf(techLine!) + 1;
        const linksStart = lines.findIndex(l => l.startsWith("[GitHub]") || l.startsWith("[Live Demo]"));
        const rawContentLines = lines.slice(contentStart, linksStart > -1 ? linksStart : undefined);
        const rawContent = rawContentLines.join("\n").trim();

        // Very basic markdown list to HTML conversion
        const htmlContent = rawContent
            .split("\n")
            .map(line => {
                if (line.startsWith("- ")) {
                    return `<li>${line.substring(2)}</li>`;
                }
                return line;
            })
            .join("\n");

        const github = lines.find(l => l.startsWith("[GitHub]"))?.match(/\((.*)\)/)?.[1];
        const liveDemo = lines.find(l => l.startsWith("[Live Demo]"))?.match(/\((.*)\)/)?.[1];

        return {
            title,
            tech,
            content: htmlContent.includes("<li>") ? `<ul>${htmlContent}</ul>` : htmlContent,
            github,
            liveDemo
        };
    });
}

function parseSkills(content: string) {
    const sections = content.split(/^## /m).slice(1);
    return sections.map(section => {
        const lines = section.split("\n");
        const title = lines[0].trim();
        const items = lines
            .slice(1)
            .filter(l => l.startsWith("- "))
            .map(l => l.substring(2).replace(/\*\*/g, "").trim());

        return {
            title,
            items
        };
    });
}
