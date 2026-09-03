import { getDictionary, type Locale } from '@/i18n';
import { skillGroups } from '@/data/skills';
import type { AreaId } from '@/data/types';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

// Sem barras de progresso percentuais. Layout escaneável, com a ordem dos grupos preservada.
export function Skills({ lang, area }: { lang: Locale; area: AreaId }) {
  const t = getDictionary(lang);
  const groups = skillGroups.filter((g) => g.area === area || g.area === undefined);

  return (
    <section className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="skills" label={t.sections.skillsTitle} />
        </Reveal>
        <div className="space-y-6">
          {groups.map((group, i) => (
            <Reveal key={group.id} delay={Math.min(i, 4) * 0.05}>
              <div className="grid gap-3 border-t border-line pt-4 sm:grid-cols-[220px_1fr]">
                <h3 className="font-head text-sm font-semibold">{group.title[lang]}</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="font-mono rounded border border-line bg-bg px-2 py-0.5 text-xs text-muted"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
