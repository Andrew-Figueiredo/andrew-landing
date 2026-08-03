import { pt, type Dictionary } from './pt';
import { en } from './en';

export const locales = ['pt', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'pt';

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { pt, en };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
