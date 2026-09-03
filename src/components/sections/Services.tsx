import { BrainCircuit, Code2, ShieldCheck, Workflow } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n';
import { services } from '@/data/services';
import type { AreaId } from '@/data/types';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

const icons = { Code2, BrainCircuit, Workflow, ShieldCheck } as const;

export function Services({ lang, area }: { lang: Locale; area: AreaId }) {
  const t = getDictionary(lang);
  const items = services.filter((s) => s.area === area);

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="servicos" label={t.sections.servicesTitle} />
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2">
          {items.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <Reveal key={s.id} delay={i * 0.08}>
                <div className="border-t border-line pt-5">
                  <Icon size={20} className="text-accent" aria-hidden />
                  <h3 className="font-head mt-3 text-base font-semibold">{s.title[lang]}</h3>
                  <ul className="mt-3 space-y-2">
                    {s.items.map((item) => (
                      <li key={item.en} className="text-sm leading-relaxed text-muted">
                        {item[lang]}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
