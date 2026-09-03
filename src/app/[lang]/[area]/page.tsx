import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n';
import { areas, areaBySlug } from '@/data/areas';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Projects } from '@/components/sections/Projects';
import { Process } from '@/components/sections/Process';
import { Skills } from '@/components/sections/Skills';
import { AiResearch } from '@/components/sections/AiResearch';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';

export function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) return [];
  return areas.map((a) => ({ area: a.slug[params.lang as Locale] }));
}

// Mesmo raciocínio do layout de [lang]: fora dos slugs gerados aqui, a rota vira 404 no
// build, não erro em runtime — não há runtime nesse projeto (output: 'export').
export const dynamicParams = false;

export default async function AreaPage({
  params,
}: {
  params: Promise<{ lang: string; area: string }>;
}) {
  const { lang, area: areaSlugParam } = await params;
  if (!isLocale(lang)) notFound();

  const area = areaBySlug(lang, areaSlugParam);
  if (!area) notFound();

  return (
    <>
      <Navbar lang={lang} area={area.id} />
      <main>
        <Hero lang={lang} area={area} />
        <About lang={lang} />
        <Services lang={lang} area={area.id} />
        <Projects lang={lang} area={area.id} />
        <Process lang={lang} />
        <Skills lang={lang} area={area.id} />
        <AiResearch lang={lang} />
        <Experience lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
