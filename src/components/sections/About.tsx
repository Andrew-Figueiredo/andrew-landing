import Image from 'next/image';
import { getDictionary, type Locale } from '@/i18n';
import { profile } from '@/data/profile';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

// A foto vive aqui, em tamanho médio ao lado do texto — onde apoia a leitura
// em vez de disputar espaço com a headline.
export function About({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);

  return (
    <section className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <SectionHeading id="sobre" label={t.sections.aboutTitle} />
          <div className="grid gap-8 sm:grid-cols-[180px_1fr]">
            <Image
              src={profile.photoPath}
              alt={t.about.photoAlt}
              width={180}
              height={216}
              className="h-[216px] w-[180px] rounded-lg border border-line object-cover"
              style={{ objectPosition: 'center 20%' }}
            />
            <div className="space-y-4">
              {t.about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="max-w-[62ch] leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
