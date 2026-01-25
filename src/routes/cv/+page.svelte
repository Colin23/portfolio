<script lang="ts">
    import Experience from "$lib/content/experience.md";
    import Skills from "$lib/content/skills.md";
    import Projects from "$lib/content/projects.md";

    function handlePrint() {
        window.print();
    }
</script>

<div class="print-container flex flex-col gap-8 print:block">
    <div class="flex items-center justify-between print:hidden">
        <h1 class="text-4xl font-bold">Curriculum Vitae</h1>
        <button
            onclick={handlePrint}
            class="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
            Download PDF
        </button>
    </div>

    <div
        class="max-w-none
		print:text-black">
        <section
            class="mb-12 print:mb-8 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-ul:ml-6 prose-ul:list-disc prose-li:mb-2">
            <Experience />
        </section>

        <section
            class="mb-12 print:mb-8 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-ul:ml-6 prose-ul:list-disc prose-li:mb-2">
            <Skills />
        </section>

        <section
            class="mb-12 print:mb-8 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-ul:ml-6 prose-ul:list-disc prose-li:mb-2">
            <Projects />
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

        /* Hide unnecessary elements */
        :global(header),
        :global(footer) {
            display: none !important;
        }
    }
</style>
