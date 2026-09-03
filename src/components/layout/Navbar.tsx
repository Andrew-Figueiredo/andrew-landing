import Link from 'next/link';
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons';
import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';
import { areas } from '@/data/areas';
import type { AreaId } from '@/data/types';
import { LanguageToggle } from './LanguageToggle';

export function Navbar({ lang, area }: { lang: Locale; area?: AreaId }) {
  const t = getDictionary(lang);

  const anchors = area
    ? [
        { href: '#sobre', label: t.nav.about },
        { href: '#servicos', label: t.nav.services },
        { href: '#projetos', label: t.nav.projects },
        { href: '#ia', label: t.nav.ai },
        { href: '#experiencia', label: t.nav.experience },
        { href: '#contato', label: t.nav.contact },
      ]
    : [];

  const otherAreas = areas.filter((a) => a.id !== area);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link href={`/${lang}/`} className="font-head text-sm font-semibold tracking-tight">
          {profile.name}
        </Link>

        {anchors.length > 0 && (
          <nav aria-label={t.nav.ariaMain} className="hidden gap-5 text-sm text-muted md:flex">
            {anchors.map((a) => (
              <a key={a.href} href={a.href} className="transition-colors hover:text-accent">
                {a.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {area && (
            <nav className="hidden gap-3 border-r border-line pr-3 text-sm text-muted sm:flex">
              {otherAreas.map((a) => (
                <Link
                  key={a.id}
                  href={`/${lang}/${a.slug[lang]}/`}
                  className="transition-colors hover:text-accent"
                >
                  {a.label[lang]}
                </Link>
              ))}
              <Link href={`/${lang}/`} className="transition-colors hover:text-accent">
                {t.nav.backToAreas}
              </Link>
            </nav>
          )}
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted transition-colors hover:text-accent"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted transition-colors hover:text-accent"
          >
            <LinkedinIcon size={18} />
          </a>
          <LanguageToggle lang={lang} label={t.nav.ariaLang} area={area} />
        </div>
      </div>
    </header>
  );
}
