import { loadPortfolioContent } from "$lib/server/content-loader";
import type { PageServerLoad } from "./$types";
import type { Locale } from "$lib/i18n";

/**
 * SvelteKit route entries for language prefixes.
 */
export function entries(): Array<{ lang: Locale }> {
    return [{ lang: "en" }, { lang: "de" }];
}

export const load: PageServerLoad = ({ params }) => {
    const locale = params.lang as Locale;
    return loadPortfolioContent(locale);
};
