export const SUPPORTED_LOCALES = ["en", "de"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/**
 * Checks if a value is a valid locale.
 * @param value The value to check.
 */
export function isLocale(value: string): value is Locale {
    return SUPPORTED_LOCALES.includes(value as Locale);
}

/**
 * Gets the alternative locale for a given locale.
 * @param locale The locale to get the alternative for.
 */
export function getAltLocale(locale: Locale): Locale {
    return locale === "en" ? "de" : "en";
}
