<script lang="ts">
    import "../app.css";
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { getAltLocale, type Locale } from "$lib/i18n";
    import { t } from "$lib/i18n-copy";

    const { children } = $props();

    const siteUrl = "https://colinmoerbe.com";
    const locale = $derived.by<Locale>(() => {
        const first = page.url.pathname.split("/").filter(Boolean)[0];
        return first === "de" ? "de" : "en";
    });
    const ui = $derived(t(locale));
    const otherLocale = $derived(getAltLocale(locale));

    const isPortfolioHomeRoute = $derived.by(() => {
        const segments = page.url.pathname.split("/").filter(Boolean);
        return segments.length === 0 || (segments.length === 1 && (segments[0] === "en" || segments[0] === "de"));
    });

    const localizedSiteTitle = "Colin Mörbe | Portfolio";
    const localizedSiteDescription = $derived(
        locale === "de"
            ? "Backend Software Engineer Portfolio mit Projekten, Berufserfahrung, Tech-Stack, Zertifikaten und downloadbarem Lebenslauf."
            : "Backend Software Engineer portfolio with projects, professional experience, technical skills, certificates, and a downloadable CV."
    );

    const canonicalUrl = $derived(`${siteUrl}${page.url.pathname}`);

    const localeAgnosticPath = $derived.by(() => {
        const segments = page.url.pathname.split("/").filter(Boolean);
        if (segments[0] === "en" || segments[0] === "de") segments.shift();

        const path = `/${segments.join("/")}`;
        if (path === "/") return "/";
        if (page.url.pathname.endsWith("/")) return `${path}/`;
        return path;
    });

    const hreflangEn = $derived(`${siteUrl}/en${localeAgnosticPath}`);
    const hreflangDe = $derived(`${siteUrl}/de${localeAgnosticPath}`);

    let isMenuOpen = $state(false);
    let mobileMenuEl = $state<HTMLElement | null>(null);
    let menuToggleButtonEl = $state<HTMLButtonElement | null>(null);

    const navItems = $derived.by(() => [
        { id: "skills", label: ui.nav.skills },
        { id: "experience", label: ui.nav.experience },
        { id: "education", label: ui.nav.education },
        { id: "languages", label: ui.nav.languages },
        { id: "projects", label: ui.nav.projects },
        { id: "certificates", label: ui.nav.certificates },
        { id: "contact", label: ui.nav.contact }
    ]);

    let scrollSection = $state("");

    /**
     * Initialize state before the first paint on the client
     */
    $effect.pre(() => {
        if (!browser || !isPortfolioHomeRoute) {
            scrollSection = "";
            return;
        }

        const hash = window.location.hash.replace("#", "");
        const isValidHash = navItems.some(item => item.id === hash);
        if (isValidHash) {
            scrollSection = hash;
        } else if (!scrollSection) {
            const sections = navItems
                .map(item => document.getElementById(item.id))
                .filter((el): el is HTMLElement => el !== null);

            const anchorY = 120;
            let currentSection = "";
            for (const section of sections) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= anchorY) {
                    currentSection = section.id;
                }
            }
            scrollSection = currentSection;
        }
    });

    /**
     * Derives the active section based on the current scroll position.
     */
    const activeSection = $derived.by(() => {
        if (!isPortfolioHomeRoute) return "";
        return scrollSection;
    });

    let observer: IntersectionObserver | undefined;
    let rafId: number | undefined;

    /**
     * Updates the active section based on which section top is closest to the header anchor line.
     */
    function updateActiveSectionByPosition(): void {
        if (!browser || !isPortfolioHomeRoute) return;

        const sections = navItems
            .map(item => document.getElementById(item.id))
            .filter((el): el is HTMLElement => el !== null);

        if (sections.length === 0) return;

        const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
        if (isAtBottom) {
            scrollSection = "contact";
            return;
        }

        // Keep no active nav item while the user is still in the hero/about region.
        if (window.scrollY < 120) {
            scrollSection = "";
            return;
        }

        const anchorY = 120;
        let bestSectionId = sections[0].id;
        let bestDistance = Number.POSITIVE_INFINITY;

        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top - anchorY);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestSectionId = section.id;
            }
        }

        scrollSection = bestSectionId;
    }

    /**
     * Schedules active-section update once per frame to avoid jitter on fast scroll.
     */
    function scheduleActiveSectionUpdate(): void {
        if (!browser) return;
        if (rafId !== undefined) return;

        rafId = window.requestAnimationFrame(() => {
            rafId = undefined;
            updateActiveSectionByPosition();
        });
    }

    /**
     * Sets up observers/listeners to track the active section.
     */
    function setupObserver(): void {
        if (!browser) return;

        observer?.disconnect();

        observer = new IntersectionObserver(
            () => {
                scheduleActiveSectionUpdate();
            },
            {
                threshold: [0, 1],
                rootMargin: "-64px 0px -60% 0px"
            }
        );

        navItems.forEach(item => {
            const el = document.getElementById(item.id);
            if (el) observer?.observe(el);
        });

        window.removeEventListener("scroll", scheduleActiveSectionUpdate, {
            capture: false
        } as AddEventListenerOptions);
        window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });

        // Initialize immediately
        scheduleActiveSectionUpdate();
    }

    onMount((): (() => void) => {
        const handleDocumentClick = (event: MouseEvent): void => {
            if (!isMenuOpen) return;

            const target = event.target as Node | null;
            if (!target) return;

            const clickedInsideMenu = mobileMenuEl?.contains(target) ?? false;
            const clickedToggle = menuToggleButtonEl?.contains(target) ?? false;

            if (!clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }
        };

        document.addEventListener("click", handleDocumentClick, true);

        return (): void => {
            if (rafId !== undefined) {
                window.cancelAnimationFrame(rafId);
                rafId = undefined;
            }

            document.removeEventListener("click", handleDocumentClick, true);
        };
    });

    /**
     * Handles client-side navigation between routes by setting up observers/listeners for active section tracking.
     */
    $effect(() => {
        if (!browser) return;
        document.documentElement.lang = locale;
    });

    $effect(() => {
        if (!browser) return;

        if (!isPortfolioHomeRoute) {
            observer?.disconnect();
            window.removeEventListener("scroll", scheduleActiveSectionUpdate);
            scrollSection = "";
            return;
        }

        setupObserver();

        return (): void => {
            observer?.disconnect();
            window.removeEventListener("scroll", scheduleActiveSectionUpdate);
        };
    });

    /**
     * Opens the locale-specific CV PDF in a new browser tab.
     *
     * The downloadCV function selects the file path based on the current locale
     * and calls window.open with "_blank" and "noopener,noreferrer".
     */
    function downloadCV(): void {
        const file = locale === "de" ? "/colin-moerbe-cv-de.pdf" : "/colin-moerbe-cv-en.pdf";
        window.open(file, "_blank", "noopener,noreferrer");
    }

    /**
     * Sets the active language for the website.
     * @param target - The locale to switch to.
     */
    function switchLanguage(target: Locale): void {
        const segments = page.url.pathname.split("/").filter(Boolean);
        if (segments[0] === "en" || segments[0] === "de") {
            segments[0] = target;
        } else {
            segments.unshift(target);
        }

        const nextPath = `/${segments.join("/")}${page.url.pathname.endsWith("/") ? "/" : ""}`;
        goto(`${nextPath}${page.url.search}${page.url.hash}`, {
            noScroll: true,
            keepFocus: true
        });
    }

    /**
     * Toggles between light and dark mode and saves the preference to localStorage.
     */
    function toggleTheme(): void {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.theme = isDark ? "dark" : "light";
    }

    /**
     * Toggles the mobile navigation menu.
     */
    function toggleMenu(): void {
        isMenuOpen = !isMenuOpen;
    }

    /**
     * Closes the mobile navigation menu.
     */
    function closeMenu(): void {
        isMenuOpen = false;
    }

    /**
     * Handles navigation link clicks, updating the active section and closing the menu.
     *
     * @param {string} id - The ID of the section to navigate to.
     */
    function handleNavClick(id: string): void {
        scrollSection = id;
        closeMenu();
    }
</script>

<svelte:head>
    <title>{localizedSiteTitle}</title>
    <meta name="description" content={localizedSiteDescription} />
    <link rel="canonical" href={canonicalUrl} />
    <link rel="alternate" hreflang="en" href={hreflangEn} />
    <link rel="alternate" hreflang="de" href={hreflangDe} />
    <link rel="alternate" hreflang="x-default" href={hreflangEn} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={localizedSiteTitle} />
    <meta property="og:description" content={localizedSiteDescription} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:image" content={`${siteUrl}/og-image.png`} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={localizedSiteTitle} />
    <meta name="twitter:description" content={localizedSiteDescription} />
</svelte:head>

<a
    href="#main-content"
    class="sr-only z-60 rounded bg-blue-600 px-3 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus-visible:ring-2 focus-visible:ring-blue-400">
    {ui.layout.skipToContent}
</a>

<div
    class="min-h-screen bg-white font-sans text-gray-900 antialiased transition-colors duration-300 dark:bg-zinc-950 dark:text-gray-100">
    <header
        class="fixed top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/80 print:hidden">
        <nav class="mx-auto flex max-w-5xl items-center justify-between p-4">
            <a
                href={`/${locale}/`}
                class="mr-6 text-xl font-bold tracking-tight focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                onclick={closeMenu}>
                {ui.layout.portfolio}
            </a>
            <!-- Desktop Nav -->
            <div class="hidden items-center gap-6 lg:flex">
                {#each navItems as item (item.id)}
                    <a
                        href={`/${locale}/#${item.id}`}
                        onclick={() => handleNavClick(item.id)}
                        class="flex h-10 items-center text-center text-sm leading-tight font-semibold transition-colors hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:hover:text-blue-400 {activeSection ===
                        item.id
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-zinc-400'}">
                        {item.label}
                    </a>
                {/each}
                <div class="h-4 w-px bg-gray-200 dark:bg-zinc-800"></div>
                <button
                    onclick={() => switchLanguage(otherLocale)}
                    class="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                    aria-label={`${ui.layout.switchTo}: ${otherLocale.toUpperCase()}`}>
                    {otherLocale.toUpperCase()}
                </button>
                <button
                    onclick={downloadCV}
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none">
                    {ui.layout.downloadCv}
                </button>
                <button
                    onclick={toggleTheme}
                    class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:hover:bg-zinc-900"
                    aria-label={ui.layout.toggleTheme}>
                    <span class="hidden text-xl dark:inline">🌞</span>
                    <span class="inline text-xl dark:hidden">🌙</span>
                </button>
            </div>
            <!-- Mobile -->
            <div class="flex items-center space-x-4 lg:hidden">
                <button
                    onclick={() => switchLanguage(otherLocale)}
                    class="rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold dark:border-zinc-800"
                    aria-label={`${ui.layout.switchTo}: ${otherLocale.toUpperCase()}`}>
                    {otherLocale.toUpperCase()}
                </button>
                <button
                    onclick={toggleTheme}
                    class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:hover:bg-zinc-900"
                    aria-label={ui.layout.toggleTheme}>
                    <span class="hidden dark:inline">🌞</span>
                    <span class="inline dark:hidden">🌙</span>
                </button>
                <button
                    bind:this={menuToggleButtonEl}
                    onclick={toggleMenu}
                    class="p-2 text-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:text-gray-400"
                    aria-label={ui.layout.toggleMenu}
                    aria-controls="mobile-navigation"
                    aria-expanded={isMenuOpen}>
                    {#if isMenuOpen}
                        <span class="text-2xl">✕</span>
                    {:else}
                        <span class="text-2xl">☰</span>
                    {/if}
                </button>
            </div>
        </nav>
        {#if isMenuOpen}
            <div
                id="mobile-navigation"
                bind:this={mobileMenuEl}
                class="relative z-50 max-h-[70vh] overflow-y-auto border-t border-gray-200 bg-white p-4 lg:hidden dark:border-zinc-800 dark:bg-zinc-950">
                <div class="flex flex-col space-y-4">
                    {#each navItems as item (item.id)}
                        <a
                            href={`/${locale}/#${item.id}`}
                            onclick={() => handleNavClick(item.id)}
                            class="text-lg font-semibold focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none {activeSection ===
                            item.id
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-zinc-400'}">
                            {item.label}
                        </a>
                    {/each}
                </div>
            </div>
        {/if}
    </header>
    <main id="main-content" class="pt-16">
        {@render children()}
    </main>
    <footer
        class="border-t border-gray-200 py-12 text-center text-sm text-gray-500 dark:border-zinc-800 dark:text-gray-400 print:hidden">
        <p>© {new Date().getFullYear()} Colin Mörbe</p>
    </footer>
</div>
