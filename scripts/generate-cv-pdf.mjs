import { chromium } from "playwright";

const BASE_URL = "http://127.0.0.1:4173";
const CV_URL = `${BASE_URL}/cv/`;

const outputPath = "static/colin-moerbe-cv.pdf";

/**
 * Generates the CV PDF from the /cv route and writes it to the stable output path.
 *
 * @returns {Promise<void>} Resolves when PDF generation is complete.
 */
async function generatePdf() {
    const browser = await chromium.launch({ headless: true });

    try {
        const page = await browser.newPage();
        const response = await page.goto(CV_URL, { waitUntil: "networkidle" });

        if (!response || !response.ok()) {
            const status = response?.status() ?? "NO_RESPONSE";
            throw new Error(`Failed to load CV page for PDF generation (status: ${status}).`);
        }

        await page.emulateMedia({ media: "print" });

        await page.pdf({
            path: outputPath,
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

        console.log(`✅ Generated ${outputPath}`);
    } finally {
        await browser.close();
    }
}

/**
 * Handles PDF generation failures and exits the process with an error code.
 *
 * @param {unknown} err - The thrown error.
 * @returns {never} This function always terminates the process.
 */
function handlePdfGenerationError(err) {
    console.error("❌ PDF generation failed:", err);
    process.exit(1);
}

generatePdf().catch(handlePdfGenerationError);
