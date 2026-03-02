import { isLocale } from "$lib/i18n";

/**
 * SvelteKit route param matcher for locale prefixes.
 */
export function match(param: string): boolean {
    return isLocale(param);
}
