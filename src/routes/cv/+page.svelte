<script lang="ts">
    import Experience from "$lib/content/experience.md";
    import Education from "$lib/content/education.md";

    const { data } = $props();
</script>

<div class="print-container flex flex-col gap-8 pt-24 print:block print:pt-0">
    <div class="mx-auto flex w-full max-w-5xl flex-col px-4 md:px-8 print:hidden">
        <div class="mb-4 flex flex-wrap items-center justify-start gap-2 sm:gap-4">
            <a
                href="/"
                class="rounded-lg border border-gray-200 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                Back to Portfolio
            </a>
        </div>
    </div>

    <div class="mx-auto max-w-5xl px-4 md:px-8 print:max-w-none print:px-0 print:text-black">
        <section class="mb-10 print:mb-8">
            <h1 class="text-3xl font-extrabold">{data.contact.name ?? ""}</h1>
            <p class="mt-1 text-lg font-semibold">{data.contact.role ?? ""}</p>
            <p class="mt-2 text-sm text-gray-700 print:text-black">{data.contact.location ?? ""}</p>
            <p class="text-sm text-gray-700 print:text-black">
                {data.contact.phone ?? ""} · {data.contact.email ?? ""}
            </p>
            <p class="text-sm text-gray-700 print:text-black">LinkedIn: {data.contact.linkedin ?? ""}</p>
            <p class="text-sm text-gray-700 print:text-black">GitHub: {data.contact.github ?? ""}</p>
        </section>

        <section class="mb-10 print:mb-8">
            <h2 class="mb-3 text-2xl font-bold">Profile</h2>
            <p class="leading-relaxed text-gray-800 print:text-black">{data.profile}</p>
        </section>

        <section class="mb-10 print:mb-8">
            <h2 class="mb-3 text-2xl font-bold">Technical Expertise</h2>
            <div class="space-y-4">
                {#each data.coreSkills as group (group.title)}
                    <div>
                        <h3 class="text-lg font-semibold">{group.title}</h3>
                        <p class="mt-1 leading-relaxed text-gray-800 print:text-black">{group.items.join(", ")}</p>
                    </div>
                {/each}
                {#if data.familiarity.length > 0}
                    <div>
                        <h3 class="text-lg font-semibold">Basic knowledge</h3>
                        <p class="mt-1 leading-relaxed text-gray-800 print:text-black">{data.familiarity.join(", ")}</p>
                    </div>
                {/if}
            </div>
        </section>

        <section
            class="prose mb-10 max-w-none prose-slate print:mb-8 prose-h1:mb-3 prose-h1:text-2xl prose-h1:font-bold prose-h2:text-lg prose-h2:font-bold prose-h3:mt-1 prose-h3:mb-0 prose-h3:text-base prose-h3:font-normal print:prose-p:text-black prose-strong:font-normal prose-ul:ml-6 prose-ul:list-disc prose-li:mb-1 print:prose-li:text-black">
            <Experience />
        </section>

        <section
            class="prose mb-10 max-w-none prose-slate print:mb-8 prose-h1:mb-3 prose-h1:text-2xl prose-h1:font-bold prose-h2:text-lg prose-h2:font-bold prose-h3:mt-1 prose-h3:mb-0 prose-h3:text-base prose-h3:font-normal print:prose-p:text-black prose-strong:font-normal prose-ul:ml-6 prose-ul:list-disc prose-li:mb-1 print:prose-li:text-black">
            <Education />
        </section>

        <section class="mb-10 print:mb-8">
            <h2 class="mb-3 text-2xl font-bold">Languages</h2>
            <div class="space-y-1">
                {#each data.languages as language, i (i)}
                    <p class="text-base text-gray-800 print:text-black">{language}</p>
                {/each}
            </div>
        </section>
    </div>
</div>

<style>
    @media print {
        :global(body) {
            margin: 0;
            background: white !important;
            color: black !important;
        }

        .print-container {
            padding: 0;
        }

        section {
            break-inside: avoid;
            page-break-inside: avoid;
        }

        a:after {
            content: "" !important;
        }

        :global(header),
        :global(footer) {
            display: none !important;
        }
    }
</style>
