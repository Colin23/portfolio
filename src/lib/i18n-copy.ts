import type { Locale } from "$lib/i18n";

export const copy = {
    en: {
        nav: {
            skills: "Tech Stack",
            experience: "Experience",
            education: "Education",
            languages: "Languages",
            projects: "Projects",
            certificates: "Certificates",
            contact: "Contact"
        },
        layout: {
            portfolio: "Portfolio",
            downloadCv: "Download Resume",
            toggleTheme: "Toggle Dark Mode",
            toggleMenu: "Toggle Menu",
            switchTo: "Switch language"
        },
        home: {
            getInTouch: "Get in touch",
            viewResume: "View Resume",
            technicalExpertise: "Technical Expertise",
            professionalExperience: "Professional Experience",
            education: "Education",
            languages: "Languages",
            projects: "Projects",
            certificates: "Certificates",
            getInTouchHeading: "Get in Touch",
            contactIntro:
                "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
            sendMessage: "Send Message"
        },
        cv: {
            backToPortfolio: "Back to Portfolio",
            downloadCv: "Download CV",
            profile: "Profile",
            technicalExpertise: "Technical Expertise",
            basicKnowledge: "Basic knowledge",
            languages: "Languages"
        },
        success: {
            title: "Thanks for your message!",
            body: "I got your submission and will get back to you soon.",
            backToContact: "Back to contact section"
        }
    },
    de: {
        nav: {
            skills: "Technologie",
            experience: "Erfahrung",
            education: "Ausbildung",
            languages: "Sprachen",
            projects: "Projekte",
            certificates: "Zertifikate",
            contact: "Kontakt"
        },
        layout: {
            portfolio: "Portfolio",
            downloadCv: "Lebenslauf herunterladen",
            toggleTheme: "Dark Mode umschalten",
            toggleMenu: "Menü umschalten",
            switchTo: "Sprache wechseln"
        },
        home: {
            getInTouch: "Kontakt aufnehmen",
            viewResume: "Lebenslauf ansehen",
            technicalExpertise: "Technische Expertise",
            professionalExperience: "Berufserfahrung",
            education: "Ausbildung",
            languages: "Sprachen",
            projects: "Projekte",
            certificates: "Zertifikate",
            getInTouchHeading: "Kontakt",
            contactIntro:
                "Ich bin immer offen für neue Projekte, kreative Ideen oder Möglichkeiten, Teil eurer Vision zu sein.",
            sendMessage: "Nachricht senden"
        },
        cv: {
            backToPortfolio: "Zurück zum Portfolio",
            downloadCv: "Lebenslauf herunterladen",
            profile: "Profil",
            technicalExpertise: "Technische Expertise",
            basicKnowledge: "Grundkenntnisse",
            languages: "Sprachen"
        },
        success: {
            title: "Vielen Dank für deine Nachricht!",
            body: "Ich habe deine Nachricht erhalten und melde mich bald zurück.",
            backToContact: "Zurück zum Kontaktbereich"
        }
    }
} as const;

/**
 * Shortcut for accessing localized copy.
 * @param locale 2-letter locale code
 */
export function t(locale: Locale): (typeof copy)[Locale] {
    return copy[locale];
}
