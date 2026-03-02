import type { Locale } from "$lib/i18n";

export const prerender = true;

/**
 * SvelteKit route entries for language prefixes.
 */
export function entries(): Array<{ lang: Locale }> {
    return [{ lang: "en" }, { lang: "de" }];
}
