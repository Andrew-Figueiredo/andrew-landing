'use client';

import Link from 'next/link';
import type { Locale } from '@/i18n';
import { areaById } from '@/data/areas';
import type { AreaId } from '@/data/types';

// O toggle é um <Link> real: troca a rota, não o estado. O localStorage só grava a
// preferência para a próxima entrada pela raiz do domínio.
export function LanguageToggle({
  lang,
  label,
  area,
}: {
  lang: Locale;
  label: string;
  area?: AreaId;
}) {
  const other: Locale = lang === 'pt' ? 'en' : 'pt';
  const href = area ? `/${other}/${areaById(area).slug[other]}/` : `/${other}/`;

  return (
    <Link
      href={href}
      aria-label={label}
      onClick={() => {
        try {
          localStorage.setItem('lang', other);
        } catch {
          // localStorage indisponível: a navegação acontece do mesmo jeito.
        }
      }}
      className="font-mono rounded border border-line px-2 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <span className={lang === 'pt' ? 'text-accent' : undefined}>PT</span>
      <span aria-hidden> / </span>
      <span className={lang === 'en' ? 'text-accent' : undefined}>EN</span>
    </Link>
  );
}
