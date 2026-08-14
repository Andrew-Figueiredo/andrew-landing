import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';

export function Footer({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}. {t.footer.rights}
        </p>
        <a
          href={profile.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-accent"
        >
          {t.footer.source}
        </a>
      </div>
    </footer>
  );
}
