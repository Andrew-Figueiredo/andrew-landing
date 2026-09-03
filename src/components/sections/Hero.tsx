import Image from 'next/image';
import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';
import { services } from '@/data/services';
import type { Area } from '@/data/areas';
import { Reveal } from '@/components/Reveal';

export function Hero({ lang, area }: { lang: Locale; area?: Area }) {
  const t = getDictionary(lang);

  const subheadline = area ? area.hero.subheadline[lang] : t.hero.subheadline;

  return (
    <section className="mx-auto max-w-5xl px-6 pb-12 pt-16 sm:pt-24">
      <Reveal>
        <div className="flex flex-col-reverse items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="font-mono mb-2 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.09em] text-accent">
              <span aria-hidden className="inline-block h-px w-7 bg-accent" />
              {t.hero.greeting}
            </p>

            <h1 className="font-head max-w-[16ch] text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              {profile.name}
            </h1>

            <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted">{subheadline}</p>

            <div className="mt-6 flex gap-6">
              <div>
                <p className="font-head text-xl font-bold">5+</p>
                <p className="text-xs text-muted">{t.hero.statsYears}</p>
              </div>
              <div>
                <p className="font-head text-xl font-bold">{profile.actuation.length}</p>
                <p className="text-xs text-muted">{t.hero.statsCompanies}</p>
              </div>
            </div>
          </div>

          <Image
            src={profile.photoPath}
            alt={t.about.photoAlt}
            width={120}
            height={140}
            className="h-[140px] w-[120px] flex-shrink-0 rounded-xl border border-line object-cover"
            style={{ objectPosition: 'center 20%' }}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {area && (
            <a
              href="#projetos"
              className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {t.hero.ctaProjects}
            </a>
          )}
          <a
            href={profile.cvPath}
            download
            className="rounded-md border border-line px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            {t.hero.ctaCv}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            LinkedIn ↗
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            GitHub ↗
          </a>
        </div>

        <p className="font-mono mt-8 text-[0.7rem] uppercase tracking-[0.09em] text-muted">
          {t.hero.actuationLabel}: {profile.actuation.join(' · ')}
        </p>
      </Reveal>

      {area && (
        <Reveal delay={0.08}>
          <div className="mt-10 grid gap-px border-t border-line sm:grid-cols-2">
            {services
              .filter((s) => s.area === area.id)
              .map((s, i) => (
                <div
                  key={s.id}
                  className={i > 0 ? 'pt-5 sm:border-l sm:border-line sm:pl-5' : 'pt-5 sm:pr-5'}
                >
                  <h2 className="font-head text-sm font-semibold">{s.title[lang]}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {s.items.slice(0, 2).map((it) => it[lang]).join(' · ')}
                  </p>
                </div>
              ))}
          </div>
        </Reveal>
      )}
    </section>
  );
}
