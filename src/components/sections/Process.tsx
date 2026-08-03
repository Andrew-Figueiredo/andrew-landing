import { getDictionary, type Locale } from '@/i18n';
import { processSteps } from '@/data/process';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export function Process({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="processo" label={t.sections.processTitle} />
        </Reveal>
        <ol className="grid gap-px sm:grid-cols-5">
          {processSteps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.06}>
              <li className="h-full border-t border-line pt-4 sm:pr-4">
                <span className="font-mono text-[0.65rem] text-accent">{step.n}</span>
                <h3 className="font-head mt-1 text-sm font-semibold leading-snug">{step.title[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description[lang]}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
