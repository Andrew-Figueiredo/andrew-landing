import { getDictionary, type Locale } from '@/i18n';
import { education, research } from '@/data/education';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

// Recorte desta seção: o CONTEÚDO da pesquisa. O vínculo e as datas ficam na timeline
// de Experiência, com texto deliberadamente distinto.
export function AiResearch({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="ia" label={t.sections.aiTitle} />
        </Reveal>

        <Reveal>
          <p className="font-mono mb-4 text-[0.65rem] uppercase tracking-wider text-muted">
            {t.ai.researchLabel}
          </p>
          {research.map((item) => (
            <div key={item.id} className="mb-10 border-l-2 border-accent pl-5">
              <h3 className="font-head text-base font-semibold">
                {item.title[lang]} <span className="text-muted">· {item.institution}</span>
              </h3>
              <p className="font-mono mt-1 text-xs text-muted">{item.period[lang]}</p>
              <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-muted">
                {item.description[lang]}
              </p>
              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
                >
                  {t.ai.sourceLabel} ↗
                </a>
              )}
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.08}>
          <p className="font-mono mb-4 text-[0.65rem] uppercase tracking-wider text-muted">
            {t.ai.educationLabel}
          </p>
          <div className="space-y-6">
            {education.map((item) => (
              <div key={item.id} className="border-t border-line pt-4">
                <h3 className="font-head text-sm font-semibold">
                  {item.degree[lang]} <span className="text-muted">· {item.institution}</span>
                </h3>
                <p className="font-mono mt-1 text-xs text-muted">{item.period[lang]}</p>
                <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-muted">
                  {item.description[lang]}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
