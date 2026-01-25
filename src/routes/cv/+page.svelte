<script lang="ts">
    import Experience from "$lib/content/experience.md";
    import Skills from "$lib/content/skills.md";
    import Projects from "$lib/content/projects.md";
    import Certificates from "$lib/content/certificates.md";

    /**
     * Triggers the browser's print dialog.
     */
    function handlePrint() {
        window.print();
    }
</script>

<div class="print-container flex flex-col gap-8 pt-24 print:block print:pt-0">
    <div class="mx-auto flex w-full max-w-5xl flex-col px-4 md:px-8 print:hidden">
        <div class="mb-4 flex flex-wrap items-center justify-end gap-2 sm:gap-4">
            <a
                href="/"
                class="rounded-lg border border-gray-200 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                Back to Portfolio
            </a>
            <button
                onclick={handlePrint}
                class="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                Download PDF
            </button>
        </div>
        <h1 class="text-3xl font-bold md:text-4xl">Curriculum Vitae</h1>
    </div>

    <div
        class="mx-auto prose max-w-5xl px-4 prose-slate md:px-8 dark:prose-invert
		print:max-w-none print:px-0 print:text-black print:prose-p:text-black print:prose-li:text-black">
        <section
            class="mb-12 print:mb-8 prose-headings:font-bold prose-h1:hidden prose-h2:text-2xl prose-ul:ml-6 prose-ul:list-disc prose-li:mb-2">
            <Experience />
        </section>

        <section
            class="mb-12 print:mb-8 prose-headings:font-bold prose-h1:hidden prose-h2:text-2xl prose-ul:ml-6 prose-ul:list-disc prose-li:mb-2">
            <Skills />
        </section>

        <section
            class="mb-12 print:mb-8 prose-headings:font-bold prose-h1:hidden prose-h2:text-2xl prose-ul:ml-6 prose-ul:list-disc prose-li:mb-2">
            <Projects />
        </section>

        <section
            class="mb-12 print:mb-8 prose-headings:font-bold prose-h1:hidden prose-h2:text-2xl prose-ul:ml-6 prose-ul:list-disc prose-li:mb-2">
            <Certificates />
        </section>
    </div>
</div>

<style>
    /* Print specific adjustments */
    @media print {
        @page {
            margin: 0;
        }

        :global(body) {
            background: white !important;
            color: black !important;
            margin: 0;
        }

        .print-container {
            padding: 2cm;
        }

        section {
            break-inside: avoid;
        }

        /* Ensure links don't show URLs in print */
        a:after {
            content: "" !important;
        }

        /* Hide unnecessary elements */
        :global(header),
        :global(footer) {
            display: none !important;
        }
    }
</style>
