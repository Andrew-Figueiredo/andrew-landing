import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, defaultLocale, type Locale } from '@/i18n';
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

const SITE = 'https://andrewfigueiredo.dev';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; area: string }>;
}): Promise<Metadata> {
  const { lang: raw, area: areaSlugParam } = await params;
  const lang: Locale = isLocale(raw) ? raw : defaultLocale;
  const area = areaBySlug(lang, areaSlugParam);
  if (!area) return {};

  const title = `${area.label[lang]} — Andrew Figueiredo`;
  const description = area.hero.subheadline[lang];

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical: `${SITE}/${lang}/${area.slug[lang]}/`,
      languages: {
        'pt-BR': `${SITE}/pt/${area.slug.pt}/`,
        en: `${SITE}/en/${area.slug.en}/`,
        'x-default': `${SITE}/pt/${area.slug.pt}/`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Andrew Figueiredo',
      locale: lang === 'en' ? 'en_US' : 'pt_BR',
      url: `${SITE}/${lang}/${area.slug[lang]}/`,
      title,
      description,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Andrew Figueiredo' }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

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
