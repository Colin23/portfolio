import { chromium } from "playwright";

const BASE_URL = "http://127.0.0.1:4173";

const targets = [
    { locale: "en", url: `${BASE_URL}/en/cv/`, outputPath: "static/colin-moerbe-cv-en.pdf" },
    { locale: "de", url: `${BASE_URL}/de/cv/`, outputPath: "static/colin-moerbe-cv-de.pdf" }
];

/**
 * Generates one PDF from a CV route.
 *
 * @param {{ locale: string; url: string; outputPath: string }} target
 * @returns {Promise<void>}
 */
async function generatePdfForTarget(target) {
    const browser = await chromium.launch({ headless: true });

    try {
        const page = await browser.newPage();
        const response = await page.goto(target.url, { waitUntil: "networkidle" });

        if (!response || !response.ok()) {
            const status = response?.status() ?? "NO_RESPONSE";
            throw new Error(
                `Failed to load ${target.locale.toUpperCase()} CV page for PDF generation (status: ${status}).`
            );
        }

        await page.emulateMedia({ media: "print" });

        await page.pdf({
            path: target.outputPath,
            format: "A4",
            printBackground: true,
            displayHeaderFooter: false,
            margin: {
                top: "2.5cm",
                right: "2cm",
                bottom: "2.5cm",
                left: "2.5cm"
            }
        });

        console.log(`✅ Generated ${target.outputPath}`);
    } finally {
        await browser.close();
    }
}

/**
 * Generates all localized CV PDFs.
 *
 * @returns {Promise<void>}
 */
async function generateAllPdfs() {
    await Promise.all(targets.map(target => generatePdfForTarget(target)));
}

/**
 * Handles PDF generation failures and exits with an error.
 *
 * @param {unknown} err
 * @returns {never}
 */
function handlePdfGenerationError(err) {
    console.error("❌ PDF generation failed:", err);
    process.exit(1);
}

generateAllPdfs().catch(handlePdfGenerationError);
