import Link from 'next/link';
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons';
import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';
import { LanguageToggle } from './LanguageToggle';

export function Navbar({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  const anchors = [
    { href: '#sobre', label: t.nav.about },
    { href: '#servicos', label: t.nav.services },
    { href: '#projetos', label: t.nav.projects },
    { href: '#ia', label: t.nav.ai },
    { href: '#experiencia', label: t.nav.experience },
    { href: '#contato', label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link href={`/${lang}/`} className="font-head text-sm font-semibold tracking-tight">
          {profile.name}
        </Link>

        <nav aria-label={t.nav.ariaMain} className="hidden gap-5 text-sm text-muted md:flex">
          {anchors.map((a) => (
            <a key={a.href} href={a.href} className="transition-colors hover:text-accent">
              {a.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
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
          <LanguageToggle lang={lang} label={t.nav.ariaLang} />
        </div>
      </div>
    </header>
  );
}
