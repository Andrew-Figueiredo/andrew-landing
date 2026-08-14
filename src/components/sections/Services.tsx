import { BrainCircuit, Code2, ShieldCheck, Workflow } from 'lucide-react';
import { getDictionary, type Locale } from '@/i18n';
import { services } from '@/data/services';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

const icons = { Code2, BrainCircuit, Workflow, ShieldCheck } as const;

export function Services({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  const primary = services.filter((s) => s.weight === 'primary');
  const secondary = services.filter((s) => s.weight === 'secondary');

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="servicos" label={t.sections.servicesTitle} />
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-3">
          {primary.map((s, i) => {
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

        {/* A frente secundária não entra no grid: um quarto card daria a ela o mesmo peso
            visual das três principais. Aqui ela é o fecho do ciclo — mais discreta por
            construção, com os itens em linha em vez de lista vertical. */}
        {secondary.map((s) => {
          const Icon = icons[s.icon];
          return (
            <Reveal key={s.id} delay={0.24}>
              <div className="mt-12 border-t border-line pt-5">
                <p className="font-mono mb-3 text-[0.65rem] uppercase tracking-[0.09em] text-muted">
                  {t.sections.servicesClosing}
                </p>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Icon size={16} className="text-accent" aria-hidden />
                  <h3 className="font-head text-sm font-semibold">{s.title[lang]}</h3>
                </div>
                <p className="mt-2 max-w-[72ch] text-sm leading-relaxed text-muted">
                  {s.items.map((item) => item[lang]).join(' · ')}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
