import fs from "node:fs";
import { chromium } from "playwright";

const BASE_URL = "http://127.0.0.1:4173";
const CV_URL = `${BASE_URL}/cv/`;

const currentDate = new Date().toISOString().slice(0, 10);
const datedFileName = `${currentDate}-colin-moerbe-cv.pdf`;
const datedOutputPath = `static/${datedFileName}`;
const stableOutputPath = "static/colin-moerbe-cv.pdf";

/**
 * Generates the CV PDF from the /cv route and writes both a dated and stable output file.
 *
 * @returns {Promise<void>} Resolves when PDF generation is complete.
 */
async function generatePdf() {
    const browser = await chromium.launch({ headless: true });

    try {
        const page = await browser.newPage();
        await page.goto(CV_URL, { waitUntil: "networkidle" });
        await page.emulateMedia({ media: "print" });

        await page.pdf({
            path: datedOutputPath,
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

        fs.copyFileSync(datedOutputPath, stableOutputPath);

        console.log(`✅ Generated ${datedOutputPath}`);
        console.log(`✅ Updated ${stableOutputPath}`);
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
