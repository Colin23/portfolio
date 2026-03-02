<script lang="ts">
    import { page } from "$app/state";
    import type { Locale } from "$lib/i18n";
    import { t } from "$lib/i18n-copy";

    /**
     * Resolves the locale from a URL pathname.
     *
     * @param pathname - Current URL pathname.
     * @returns {Locale} "de" when the first path segment is "de"; otherwise "en".
     */
    function resolveLocaleFromPath(pathname: string): Locale {
        const first = pathname.split("/").filter(Boolean)[0];
        return first === "de" ? "de" : "en";
    }

    const locale = $derived.by<Locale>(() => resolveLocaleFromPath(page.url.pathname));

    const ui = $derived(t(locale));
</script>

<svelte:head>
    <title>{ui.success.title} | Colin Mörbe</title>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-24 md:px-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-zinc-100">{ui.success.title}</h1>
    <p class="mt-4 text-gray-700 dark:text-zinc-300">{ui.success.body}</p>
    <a
        href={`/${locale}/#contact`}
        class="mt-8 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
        {ui.success.backToContact}
    </a>
</div>
