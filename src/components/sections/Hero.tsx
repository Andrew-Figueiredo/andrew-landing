import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';
import { services } from '@/data/services';
import type { Area } from '@/data/areas';
import { Reveal } from '@/components/Reveal';

export function Hero({ lang, area }: { lang: Locale; area?: Area }) {
  const t = getDictionary(lang);

  const eyebrow = area ? area.hero.eyebrow[lang] : t.hero.eyebrow;
  const headlineBefore = area ? area.hero.headlineBefore[lang] : t.hero.headlineBefore;
  const headlineAccent = area ? area.hero.headlineAccent[lang] : t.hero.headlineAccent;
  const headlineAfter = area ? area.hero.headlineAfter[lang] : t.hero.headlineAfter;
  const subheadline = area ? area.hero.subheadline[lang] : t.hero.subheadline;

  return (
    <section className="mx-auto max-w-5xl px-6 pb-12 pt-16 sm:pt-24">
      <Reveal>
        <p className="font-mono mb-6 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.09em] text-accent">
          <span aria-hidden className="inline-block h-px w-7 bg-accent" />
          {eyebrow}
        </p>

        <h1 className="font-head max-w-[20ch] text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl">
          {headlineBefore}
          <span className="text-accent">{headlineAccent}</span>
          {headlineAfter}
        </h1>

        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted">{subheadline}</p>

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
