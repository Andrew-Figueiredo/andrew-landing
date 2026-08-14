import { getDictionary, type Locale } from '@/i18n';
import { experience } from '@/data/experience';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

// CODATA e Keep Chat são simultâneos. O rótulo de natureza do vínculo existe para que a
// sobreposição de datas leia como acúmulo legítimo, não como inconsistência de currículo.
export function Experience({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <section className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="experiencia" label={t.sections.experienceTitle} />
        </Reveal>

        <div className="space-y-10">
          {experience.map((item, i) => (
            <Reveal key={item.id} delay={Math.min(i, 3) * 0.06}>
              <div className="border-l border-line pl-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-head text-base font-semibold">{item.organization}</h3>
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-accent">
                    {item.kind === 'research' ? t.experience.researchGrant : t.experience.employment}
                  </span>
                  <span className="font-mono text-xs text-muted">{item.period[lang]}</span>
                </div>

                <div className="mt-4 space-y-5">
                  {item.roles.map((role) => (
                    <div key={role.title.en}>
                      <p className="text-sm font-semibold">{role.title[lang]}</p>
                      <p className="font-mono mt-0.5 text-xs text-muted">{role.period[lang]}</p>
                      <ul className="mt-2 space-y-1.5">
                        {role.bullets.map((b) => (
                          <li
                            key={b.en}
                            className="max-w-[68ch] text-sm leading-relaxed text-muted before:mr-2 before:text-accent before:content-['—']"
                          >
                            {b[lang]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
