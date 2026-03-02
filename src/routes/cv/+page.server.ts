import type { PageServerLoad } from "./$types";
import { loadCvContent } from "$lib/server/content-loader";
import { DEFAULT_LOCALE } from "$lib/i18n";

export const load: PageServerLoad = () => {
    return loadCvContent(DEFAULT_LOCALE);
};
