<script lang="ts">
    import ExperienceCard from "$lib/components/ExperienceCard.svelte";
    import CertificateCard from "$lib/components/CertificateCard.svelte";
    import ProjectCard from "$lib/components/ProjectCard.svelte";

    const { data } = $props();
    const profile = $derived(data.profile);
    const contact = $derived(data.contact);
    const skills = $derived(data.skills);
    const projects = $derived(data.projects);
    const experience = $derived(data.experience);
    const certificates = $derived(data.certificates);
    const education = $derived(data.education);
    const languages = $derived(data.languages);

    const coreSkillGroups = $derived(
        skills.filter(
            (group: { title: string }) =>
                group.title !== "Working Knowledge" &&
                group.title !== "Familiarity" &&
                group.title !== "Additional Technologies" &&
                group.title !== "Basic knowledge"
        )
    );

    const familiarityItems = $derived(
        skills
            .filter(
                (group: { title: string; items: string[] }) =>
                    group.title === "Working Knowledge" ||
                    group.title === "Familiarity" ||
                    group.title === "Additional Technologies" ||
                    group.title === "Basic knowledge"
            )
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
                Get in touch
            </a>
            <a
                href="/cv"
                class="rounded-lg border border-gray-200 px-6 py-3 font-semibold transition-all hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-900">
                View Resume
            </a>
        </div>
    </section>

    <!-- Skills Section -->
    <hr class="border-gray-100 dark:border-slate-800" />
    <section id="skills" class="scroll-mt-24 py-20">
        <h2 class="mb-12 text-3xl font-bold">Technical Expertise</h2>

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
                    Basic knowledge
                </h3>
                <p class="text-sm text-gray-600 dark:text-zinc-400">{familiarityItems.join(" · ")}</p>
            </div>
        {/if}
    </section>

    <!-- Experience Section -->
    <hr class="border-gray-100 dark:border-slate-800" />
    <section id="experience" class="scroll-mt-24 py-20">
        <h2 class="mb-12 text-3xl font-bold">Professional Experience</h2>
        <div class="space-y-6">
            {#each experience as exp (exp.title)}
                <ExperienceCard {...exp} />
            {/each}
        </div>
    </section>

    <!-- Education Section -->
    <hr class="border-gray-100 dark:border-zinc-800" />
    <section id="education" class="scroll-mt-24 py-20">
        <h2 class="mb-12 text-3xl font-bold">Education</h2>
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
        <h2 class="mb-12 text-3xl font-bold">Languages</h2>
        <div class="space-y-2">
            {#each languages as language, i (i)}
                <p class="text-base text-gray-700 dark:text-zinc-300">{language}</p>
            {/each}
        </div>
    </section>

    <!-- Projects Section -->
    <hr class="border-gray-100 dark:border-zinc-800" />
    <section id="projects" class="scroll-mt-24 py-20">
        <h2 class="mb-12 text-3xl font-bold">Projects</h2>
        <div class="grid gap-8 md:grid-cols-2">
            {#each projects as project (project.title)}
                <ProjectCard {...project} />
            {/each}
        </div>
    </section>

    <!-- Certificates Section -->
    <hr class="border-gray-100 dark:border-zinc-800" />
    <section id="certificates" class="scroll-mt-24 py-20">
        <h2 class="mb-12 text-3xl font-bold">Certificates</h2>
        <div class="grid gap-6 md:grid-cols-2">
            {#each certificates as cert (cert.title)}
                <CertificateCard {...cert} />
            {/each}
        </div>
    </section>

    <!-- Contact Section -->
    <hr class="border-gray-100 dark:border-zinc-800" />
    <section id="contact" class="min-h-[70vh] scroll-mt-24 py-20 pb-40">
        <h2 class="mb-8 text-3xl font-bold">Get in Touch</h2>
        <div class="grid gap-12 md:grid-cols-2">
            <div>
                <p class="mb-6 text-lg text-gray-600 dark:text-gray-400">
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your
                    vision.
                </p>
                <ul class="space-y-4">
                    <li class="flex items-center gap-3">
                        <span class="text-xl">📧</span>
                        <a
                            href={"mailto:" + (contact.email ?? "")}
                            class="hover:text-blue-600 dark:hover:text-blue-400">
                            {contact.email}
                        </a>
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="text-xl">📍</span>
                        <span>{contact.location}</span>
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="text-xl">🔗</span>
                        <a
                            href={"https://" + (contact.linkedin ?? "")}
                            target="_blank"
                            rel="noreferrer"
                            class="hover:text-blue-600 dark:hover:text-blue-400">
                            LinkedIn
                        </a>
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="text-xl">💻</span>
                        <a
                            href={"https://" + (contact.github ?? "")}
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
                data-netlify="true"
                class="flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
                <input type="hidden" name="form-name" value="contact" />
                <div class="flex flex-col gap-1">
                    <label for="name" class="text-sm font-medium">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        class="rounded-lg border border-gray-200 bg-white p-2 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950" />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="email" class="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
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
                    Send Message
                </button>
            </form>
        </div>
    </section>
</div>
