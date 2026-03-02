<script lang="ts">
    import { dev } from "$app/environment";
    import ExperienceCard from "$lib/components/ExperienceCard.svelte";
    import CertificateCard from "$lib/components/CertificateCard.svelte";
    import ProjectCard from "$lib/components/ProjectCard.svelte";
    import type { Locale } from "$lib/i18n";
    import { t } from "$lib/i18n-copy";

    const { data } = $props();
    const profile = $derived(data.profile);
    const contact = $derived(data.contact);
    const skills = $derived(data.skills);
    const projects = $derived(data.projects);
    const experience = $derived(data.experience);
    const certificates = $derived(data.certificates);
    const education = $derived(data.education);
    const languages = $derived(data.languages);

    const locale = $derived((data.locale ?? "en") as Locale);
    const ui = $derived(t(locale));

    const familiarityTitlesByLocale: Record<Locale, readonly string[]> = {
        en: ["Working Knowledge", "Familiarity", "Additional Technologies", "Basic knowledge"],
        de: ["Grundkenntnisse", "Grundwissen", "Zusätzliche Technologien", "Vertrautheit"]
    };

    function normalizeTitle(title: string): string {
        return title.trim().toLocaleLowerCase();
    }

    const normalizedFamiliarityTitles = $derived(
        new Set(familiarityTitlesByLocale[locale].map(normalizeTitle))
    );

    /**
     * Normalizes an e-mail value to a mailto URL.
     *
     * @param {string | undefined} value - Raw e-mail value from content.
     * @returns {string} Safe mailto URL or empty string.
     */
    function toMailtoHref(value: string | undefined): string {
        if (!value) return "";
        const normalized = value.trim();
        return normalized.toLowerCase().startsWith("mailto:") ? normalized : `mailto:${normalized}`;
    }

    /**
     * Normalizes an external URL to include the scheme if missing.
     *
     * @param {string | undefined} value - Raw URL/host value from content.
     * @returns {string} Normalized URL or empty string.
     */
    function toExternalHref(value: string | undefined): string {
        if (!value) return "";
        const normalized = value.trim();
        return /^https?:\/\//i.test(normalized) ? normalized : `https://${normalized}`;
    }

    const contactEmailHref = $derived(toMailtoHref(contact.email));
    const linkedInHref = $derived(toExternalHref(contact.linkedin));
    const githubHref = $derived(toExternalHref(contact.github));

    const coreSkillGroups = $derived(
        skills.filter((group: { title: string }) => !normalizedFamiliarityTitles.has(normalizeTitle(group.title)))
    );

    const familiarityItems = $derived(
        skills
            .filter((group: { title: string; items: string[] }) => normalizedFamiliarityTitles.has(normalizeTitle(group.title)))
            .flatMap((group: { items: string[] }) => group.items)
    );
</script>

<svelte:head>
    <title>Colin Mörbe | Portfolio</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-8 md:px-8">
    <!-- About Section (Hero) -->
    <section id="about" class="flex min-h-[70vh] scroll-mt-24 flex-col justify-center py-20">
        <h1 class="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
            Hi, I'm <span class="text-blue-600 dark:text-blue-400">Colin Mörbe</span>
        </h1>
        <p class="max-w-2xl text-xl leading-relaxed text-gray-600 md:text-2xl dark:text-gray-300">{profile}</p>
        <div class="mt-10 flex gap-4">
            <a
                href="#contact"
                class="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600">
                {ui.home.getInTouch}
            </a>
            <a
                href={`/${locale}/cv/`}
                class="rounded-lg border border-gray-200 px-6 py-3 font-semibold transition-all hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-900">
                {ui.home.viewResume}
            </a>
        </div>
    </section>

    <!-- Skills Section -->
    <hr class="border-gray-100 dark:border-slate-800" />
    <section id="skills" class="scroll-mt-24 py-20">
        <h2 class="mb-12 text-3xl font-bold">{ui.home.technicalExpertise}</h2>

        <div class="grid gap-6 md:grid-cols-2">
            {#each coreSkillGroups as skillGroup (skillGroup.title)}
                <div
                    class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h3 class="mb-4 text-lg font-bold text-blue-600 dark:text-blue-400">{skillGroup.title}</h3>
                    <div class="flex flex-wrap gap-2">
                        {#each skillGroup.items as item, i (i)}
                            <span
                                class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-zinc-800 dark:text-zinc-300">
                                {item}
                            </span>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>

        {#if familiarityItems.length > 0}
            <div
                class="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 dark:border-zinc-700 dark:bg-zinc-900/30">
                <h3 class="mb-3 text-sm font-semibold tracking-wide text-gray-600 uppercase dark:text-zinc-400">
                    {ui.cv.basicKnowledge}
                </h3>
                <p class="text-sm text-gray-600 dark:text-zinc-400">{familiarityItems.join(" · ")}</p>
            </div>
        {/if}
    </section>

    <!-- Experience Section -->
    <hr class="border-gray-100 dark:border-slate-800" />
    <section id="experience" class="scroll-mt-24 py-20">
        <h2 class="mb-12 text-3xl font-bold">{ui.home.professionalExperience}</h2>
        <div class="space-y-6">
            {#each experience as exp (exp.title)}
                <ExperienceCard {...exp} />
            {/each}
        </div>
    </section>

    <!-- Education Section -->
    <hr class="border-gray-100 dark:border-zinc-800" />
    <section id="education" class="scroll-mt-24 py-20">
        <h2 class="mb-12 text-3xl font-bold">{ui.home.education}</h2>
        <div class="space-y-6">
            {#each education as edu (edu.institution)}
                <article
                    class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                    <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{edu.period}</p>
                    <h3 class="mt-2 text-base font-medium text-gray-700 dark:text-zinc-300">{edu.institution}</h3>
                    <p class="mt-1 text-base font-medium text-gray-700 dark:text-zinc-300">{edu.degree}</p>
                </article>
            {/each}
        </div>
    </section>

    <!-- Languages Section -->
    <hr class="border-gray-100 dark:border-zinc-800" />
    <section id="languages" class="scroll-mt-24 py-20">
        <h2 class="mb-12 text-3xl font-bold">{ui.home.languages}</h2>
        <div class="space-y-2">
            {#each languages as language, i (i)}
                <p class="text-base text-gray-700 dark:text-zinc-300">{language}</p>
            {/each}
        </div>
    </section>

    <!-- Projects Section -->
    <hr class="border-gray-100 dark:border-zinc-800" />
    <section id="projects" class="scroll-mt-24 py-20">
        <h2 class="mb-12 text-3xl font-bold">{ui.home.projects}</h2>
        <div class="grid gap-8 md:grid-cols-2">
            {#each projects as project (project.title)}
                <ProjectCard {...project} />
            {/each}
        </div>
    </section>

    <!-- Certificates Section -->
    <hr class="border-gray-100 dark:border-zinc-800" />
    <section id="certificates" class="scroll-mt-24 py-20">
        <h2 class="mb-12 text-3xl font-bold">{ui.home.certificates}</h2>
        <div class="grid gap-6 md:grid-cols-2">
            {#each certificates as cert (cert.title)}
                <CertificateCard {...cert} />
            {/each}
        </div>
    </section>

    <!-- Contact Section -->
    <hr class="border-gray-100 dark:border-zinc-800" />
    <section id="contact" class="min-h-[70vh] scroll-mt-24 py-20 pb-40">
        <h2 class="mb-8 text-3xl font-bold">{ui.home.getInTouchHeading}</h2>
        <div class="grid gap-12 md:grid-cols-2">
            <div>
                <p class="mb-6 text-lg text-gray-600 dark:text-gray-400">
                    {ui.home.contactIntro}
                </p>
                <ul class="space-y-4">
                    <li class="flex items-center gap-3">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="h-5 w-5 text-gray-900 dark:text-white">
                            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                        </svg>
                        <a href={contactEmailHref} class="hover:text-blue-600 dark:hover:text-blue-400">
                            {contact.email}
                        </a>
                    </li>
                    <li class="flex items-center gap-3">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="h-5 w-5 text-gray-900 dark:text-white">
                            <path
                                d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
                            ></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{contact.location}</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 50 50"
                            fill="currentColor"
                            class="h-5 w-5 text-gray-900 dark:text-white">
                            <path
                                d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"
                            ></path>
                        </svg>
                        <a
                            href={linkedInHref}
                            target="_blank"
                            rel="noreferrer"
                            class="hover:text-blue-600 dark:hover:text-blue-400">
                            LinkedIn
                        </a>
                    </li>
                    <li class="flex items-center gap-3">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="h-5 w-5 text-gray-900 dark:text-white">
                            <path
                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                            ></path>
                        </svg>
                        <a
                            href={githubHref}
                            target="_blank"
                            rel="noreferrer"
                            class="hover:text-blue-600 dark:hover:text-blue-400">
                            GitHub
                        </a>
                    </li>
                </ul>
            </div>
            <!-- Netlify Form -->
            <form
                name="contact"
                method="POST"
                action={`/${locale}/contact-success/`}
                data-netlify="true"
                netlify-honeypot="bot-field"
                onsubmit={e => {
                    if (dev) {
                        e.preventDefault();
                        alert("Form submissions are handled by Netlify in deployed environments.");
                    }
                }}
                class="flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
                <input type="hidden" name="form-name" value="contact" />
                <p class="hidden" aria-hidden="true">
                    <label for="bot-field">Don’t fill this out if you’re human:</label>
                    <input id="bot-field" name="bot-field" tabindex="-1" autocomplete="off" />
                </p>
                <div class="flex flex-col gap-1">
                    <label for="name" class="text-sm font-medium">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        autocomplete="name"
                        required
                        class="rounded-lg border border-gray-200 bg-white p-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950" />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="email" class="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        autocomplete="email"
                        required
                        class="rounded-lg border border-gray-200 bg-white p-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950" />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="message" class="text-sm font-medium">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="4"
                        required
                        class="rounded-lg border border-gray-200 bg-white p-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    class="mt-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
                    {ui.home.sendMessage}
                </button>
            </form>
        </div>
    </section>
</div>
