import type { PageServerLoad } from "./$types";
import { loadPortfolioContent } from "$lib/server/content-loader";
import { DEFAULT_LOCALE } from "$lib/i18n";

export const load: PageServerLoad = () => {
    return loadPortfolioContent(DEFAULT_LOCALE);
};
