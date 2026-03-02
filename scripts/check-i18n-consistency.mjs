import fs from "node:fs";
import path from "node:path";

const BASE = path.resolve("src/lib/content");
const locales = ["en", "de"];
const requiredFiles = [
    "profile.md",
    "contact.md",
    "skills.md",
    "experience.md",
    "education.md",
    "languages.md",
    "projects.md",
    "certificates.md"
];

/**
 * Lists all Markdown files in a given locale directory.
 * @param {string} locale - The locale directory.
 * @returns {string[]} List of Markdown file names.
 */
function listMarkdownFiles(locale) {
    const dir = path.join(BASE, locale);
    if (!fs.existsSync(dir)) {
        throw new Error(`Missing locale directory: ${dir}`);
    }

    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter(entry => entry.isFile() && entry.name.endsWith(".md"))
        .map(entry => entry.name)
        .sort();
}

/**
 * Asserts that all required files exist in a given locale.
 * @param {string} locale - The locale directory.
 * @param {string[]} files - List of Markdown file names.
 */
function assertRequiredFilesExist(locale, files) {
    const missing = requiredFiles.filter(file => !files.includes(file));
    if (missing.length > 0) {
        throw new Error(`Locale "${locale}" is missing required files: ${missing.join(", ")}`);
    }
}

/**
 * Main function to run the i18n consistency check.
 */
function main() {
    const localeFiles = Object.fromEntries(locales.map(locale => [locale, listMarkdownFiles(locale)]));

    for (const locale of locales) {
        assertRequiredFilesExist(locale, localeFiles[locale]);
    }

    const [first, ...rest] = locales;
    for (const locale of rest) {
        const missingInLocale = localeFiles[first].filter(file => !localeFiles[locale].includes(file));
        const extraInLocale = localeFiles[locale].filter(file => !localeFiles[first].includes(file));

        if (missingInLocale.length > 0 || extraInLocale.length > 0) {
            throw new Error(
                [
                    `File mismatch between "${first}" and "${locale}":`,
                    missingInLocale.length ? `- Missing in ${locale}: ${missingInLocale.join(", ")}` : "",
                    extraInLocale.length ? `- Extra in ${locale}: ${extraInLocale.join(", ")}` : ""
                ]
                    .filter(Boolean)
                    .join("\n")
            );
        }
    }

    console.log("✅ i18n content consistency check passed");
}

try {
    main();
} catch (error) {
    console.error("❌ i18n consistency check failed");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
}
