<script lang="ts">
    import "../app.css";
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { browser } from "$app/environment";

    const { children } = $props();

    let isMenuOpen = $state(false);

    const navItems = [
        { name: "About", id: "about" },
        { name: "Experience", id: "experience" },
        { name: "Skills", id: "skills" },
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
            const sections = navItems.map(item => document.getElementById(item.id)).filter(Boolean);
            let currentSection = "about";
            for (const section of sections) {
                const rect = section!.getBoundingClientRect();
                if (rect.top <= 120) {
                    currentSection = section!.id;
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

    function setupObserver() {
        if (!browser) return;

        observer?.disconnect();

        observer = new IntersectionObserver(
            entries => {
                if (page.url.pathname !== "/") return;

                const intersectingEntries = entries.filter(e => e.isIntersecting);
                if (intersectingEntries.length > 0) {
                    // If we are at the very bottom of the page, force "contact"
                    const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
                    if (isAtBottom) {
                        scrollSection = "contact";
                        return;
                    }

                    // Sort by how much is intersecting to find the most prominent section
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

    onMount(() => {
        // Setup observer immediately if on home page
        if (page.url.pathname === "/") {
            setupObserver();
        }

        return () => observer?.disconnect();
    });

    // Handle client-side navigation between routes
    $effect(() => {
        const path = page.url.pathname;

        if (path === "/") {
            setupObserver();
        } else {
            observer?.disconnect();
        }
    });

    function downloadCV() {
        if (!browser) return;
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = "/cv";
        document.body.appendChild(iframe);

        iframe.onload = () => {
            if (iframe.contentWindow) {
                iframe.contentWindow.print();
                // We keep it in the DOM until printing is done, but technically print() is blocking in most browsers
                // or opens a dialog. Removing it too early might break printing.
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            }
        };
    }

    function toggleTheme() {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.theme = isDark ? "dark" : "light";
    }

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }

    function handleNavClick(id: string) {
        scrollSection = id;
        closeMenu();
    }
</script>

<!-- Rest of your template stays exactly the same -->
<div
    class="min-h-screen bg-white font-sans text-gray-900 antialiased transition-colors duration-300 dark:bg-zinc-950 dark:text-gray-100">
    <header
        class="fixed top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/80 print:hidden">
        <nav class="mx-auto flex max-w-5xl items-center justify-between p-4">
            <a href="/#about" class="text-xl font-bold tracking-tight" onclick={() => handleNavClick("about")}>
                Portfolio
            </a>
            <!-- Desktop Nav -->
            <div class="hidden items-center space-x-6 md:flex">
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
                <!-- Theme Toggle -->
                <button
                    onclick={toggleTheme}
                    class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900"
                    aria-label="Toggle Dark Mode">
                    <span class="hidden text-xl dark:inline">🌞</span>
                    <span class="inline text-xl dark:hidden">🌙</span>
                </button>
            </div>
            <!-- Mobile -->
            <div class="flex items-center space-x-4 md:hidden">
                <button
                    onclick={toggleTheme}
                    class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900"
                    aria-label="Toggle Dark Mode">
                    <span class="hidden dark:inline">🌞</span>
                    <span class="inline dark:hidden">🌙</span>
                </button>
                <button onclick={toggleMenu} class="p-2 text-gray-600 dark:text-gray-400" aria-label="Toggle Menu">
                    {#if isMenuOpen}
                        <span class="text-2xl">✕</span>
                    {:else}
                        <span class="text-2xl">☰</span>
                    {/if}
                </button>
            </div>
        </nav>
        {#if isMenuOpen}
            <div class="border-t border-gray-200 bg-white p-4 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
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
                        class="rounded-lg bg-blue-600 px-4 py-3 text-center text-lg font-semibold text-white transition-all hover:bg-blue-700">
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
