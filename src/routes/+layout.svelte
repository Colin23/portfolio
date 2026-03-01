<script lang="ts">
    import "../app.css";
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { browser } from "$app/environment";

    const { children } = $props();

    let isMenuOpen = $state(false);
    let mobileMenuEl = $state<HTMLElement | null>(null);
    let menuToggleButtonEl = $state<HTMLButtonElement | null>(null);

    const navItems = [
        { name: "About", id: "about" },
        { name: "Technical Expertise", id: "skills" },
        { name: "Professional Experience", id: "experience" },
        { name: "Education", id: "education" },
        { name: "Languages", id: "languages" },
        { name: "Projects", id: "projects" },
        { name: "Certificates", id: "certificates" },
        { name: "Contact", id: "contact" }
    ];

    // Section tracked by intersection observer (home page only)
    let scrollSection = $state("");

    // Initialize state before first paint on client
    $effect.pre(() => {
        if (!browser || page.url.pathname !== "/") {
            scrollSection = "";
            return;
        }

        const hash = window.location.hash.replace("#", "");
        const isValidHash = navItems.some(item => item.id === hash);
        if (isValidHash) {
            scrollSection = hash;
        } else if (!scrollSection) {
            // Check scroll position if no hash
            const sections = navItems
                .map(item => document.getElementById(item.id))
                .filter((el): el is HTMLElement => el !== null);
            let currentSection = "about";
            for (const section of sections) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 120) {
                    currentSection = section.id;
                }
            }
            scrollSection = currentSection;
        }
    });

    // Derive active section
    const activeSection = $derived.by(() => {
        const path = page.url.pathname;
        if (path !== "/") return "";
        return scrollSection;
    });

    let observer: IntersectionObserver | undefined;

    /**
     * Sets up the IntersectionObserver to track the active section during scroll.
     * Only active on the home page.
     */
    function setupObserver(): void {
        if (!browser) return;

        observer?.disconnect();

        observer = new IntersectionObserver(
            (entries): void => {
                if (page.url.pathname !== "/") return;

                const intersectingEntries = entries.filter(e => e.isIntersecting);
                if (intersectingEntries.length > 0) {
                    const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
                    if (isAtBottom) {
                        scrollSection = "contact";
                        return;
                    }

                    intersectingEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                    scrollSection = intersectingEntries[0].target.id;
                }
            },
            {
                threshold: [0.1, 0.5, 0.8, 1.0],
                rootMargin: "-10% 0px -40% 0px"
            }
        );

        navItems.forEach(item => {
            const el = document.getElementById(item.id);
            if (el) observer?.observe(el);
        });
    }

    onMount((): (() => void) => {
        if (page.url.pathname === "/") {
            setupObserver();
        }

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
            observer?.disconnect();
            document.removeEventListener("click", handleDocumentClick, true);
        };
    });

    // Handle client-side navigation between routes
    $effect((): void => {
        const path = page.url.pathname;

        if (path === "/") {
            setupObserver();
        } else {
            observer?.disconnect();
        }
    });

    /**
     * Triggers the CV download by opening the /cv route in a hidden iframe and printing it.
     */
    function downloadCV(): void {
        window.open("/colin-moerbe-cv.pdf", "_blank", "noopener,noreferrer");
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

<div
    class="min-h-screen bg-white font-sans text-gray-900 antialiased transition-colors duration-300 dark:bg-zinc-950 dark:text-gray-100">
    <header
        class="fixed top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/80 print:hidden">
        <nav class="mx-auto flex max-w-5xl items-center justify-between p-4">
            <a href="/#about" class="mr-6 text-xl font-bold tracking-tight" onclick={() => handleNavClick("about")}>
                Portfolio
            </a>
            <!-- Desktop Nav -->
            <div class="hidden items-center space-x-6 lg:flex">
                {#each navItems as item (item.id)}
                    <a
                        href="/#{item.id}"
                        onclick={() => handleNavClick(item.id)}
                        class="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 {activeSection ===
                        item.id
                            ? 'font-bold text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-zinc-400'}">
                        {item.name}
                    </a>
                {/each}
                <div class="h-4 w-px bg-gray-200 dark:bg-zinc-800"></div>
                <button
                    onclick={downloadCV}
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md">
                    Download CV
                </button>
                <button
                    onclick={toggleTheme}
                    class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900"
                    aria-label="Toggle Dark Mode">
                    <span class="hidden text-xl dark:inline">🌞</span>
                    <span class="inline text-xl dark:hidden">🌙</span>
                </button>
            </div>
            <!-- Mobile -->
            <div class="flex items-center space-x-4 lg:hidden">
                <button
                    onclick={toggleTheme}
                    class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900"
                    aria-label="Toggle Dark Mode">
                    <span class="hidden dark:inline">🌞</span>
                    <span class="inline dark:hidden">🌙</span>
                </button>
                <button
                    bind:this={menuToggleButtonEl}
                    onclick={toggleMenu}
                    class="p-2 text-gray-600 dark:text-gray-400"
                    aria-label="Toggle Menu">
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
                bind:this={mobileMenuEl}
                class="relative z-50 max-h-[70vh] overflow-y-auto border-t border-gray-200 bg-white p-4 lg:hidden dark:border-zinc-800 dark:bg-zinc-950">
                <div class="flex flex-col space-y-4">
                    {#each navItems as item (item.id)}
                        <a
                            href="/#{item.id}"
                            onclick={() => handleNavClick(item.id)}
                            class="text-lg font-medium {activeSection === item.id
                                ? 'font-bold text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-zinc-400'}">
                            {item.name}
                        </a>
                    {/each}
                    <button
                        onclick={() => {
                            closeMenu();
                            downloadCV();
                        }}
                        class="self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700">
                        Download CV
                    </button>
                </div>
            </div>
        {/if}
    </header>
    <main class="pt-16">
        {@render children()}
    </main>
    <footer
        class="border-t border-gray-200 py-12 text-center text-sm text-gray-500 dark:border-zinc-800 dark:text-gray-400 print:hidden">
        <p>© {new Date().getFullYear()} Colin Mörbe</p>
    </footer>
</div>
