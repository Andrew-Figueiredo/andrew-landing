import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';
import { services } from '@/data/services';
import { Reveal } from '@/components/Reveal';

export function Hero({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <section className="mx-auto max-w-5xl px-6 pb-12 pt-16 sm:pt-24">
      <Reveal>
        <p className="font-mono mb-6 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.09em] text-accent">
          <span aria-hidden className="inline-block h-px w-7 bg-accent" />
          {t.hero.eyebrow}
        </p>

        <h1 className="font-head max-w-[20ch] text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl">
          {t.hero.headlineBefore}
          <span className="text-accent">{t.hero.headlineAccent}</span>
          {t.hero.headlineAfter}
        </h1>

        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted">{t.hero.subheadline}</p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <a
            href="#projetos"
            className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {t.hero.ctaProjects}
          </a>
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

      <Reveal delay={0.08}>
        {/* Só as três frentes principais. A qualidade tem peso menor e vive na seção
            de Serviços, num bloco próprio — não disputa a primeira dobra. */}
        <div className="mt-10 grid gap-px border-t border-line sm:grid-cols-3">
          {services
            .filter((s) => s.weight === 'primary')
            .map((s, i) => (
              <div
                key={s.id}
                className={i > 0 ? 'pt-5 sm:border-l sm:border-line sm:pl-5' : 'pt-5 sm:pr-5'}
              >
                <p className="font-mono text-[0.65rem] text-accent">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="font-head mt-1 text-sm font-semibold">{s.title[lang]}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {s.items
                    .slice(0, 2)
                    .map((it) => it[lang])
                    .join(' · ')}
                </p>
              </div>
            ))}
        </div>
      </Reveal>
    </section>
  );
}
