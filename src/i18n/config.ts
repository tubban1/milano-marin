// Milano Marin Locales Configuration
export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];

// Default language: French
export const defaultLocale: Locale = 'fr';
