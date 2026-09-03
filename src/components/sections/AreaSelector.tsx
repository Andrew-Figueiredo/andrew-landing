import Link from 'next/link';
import { getDictionary, type Locale } from '@/i18n';
import { areas } from '@/data/areas';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export function AreaSelector({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <section className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="areas" label={t.home.selectorTitle} />
          <p className="mb-8 max-w-[58ch] text-sm leading-relaxed text-muted">
            {t.home.selectorSubtitle}
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-3">
          {areas.map((area, i) => (
            <Reveal key={area.id} delay={i * 0.08}>
              <Link
                href={`/${lang}/${area.slug[lang]}/`}
                className="flex h-full flex-col border border-line p-5 transition-colors hover:border-accent"
              >
                <h3 className="font-head text-base font-semibold">{area.label[lang]}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {area.hero.subheadline[lang]}
                </p>
                <span className="mt-4 text-sm font-medium text-accent">
                  {t.home.selectorCta} ↗
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
