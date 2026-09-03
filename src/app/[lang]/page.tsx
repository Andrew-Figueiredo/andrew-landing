import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Process } from '@/components/sections/Process';
import { AiResearch } from '@/components/sections/AiResearch';
import { Experience } from '@/components/sections/Experience';
import { Contact } from '@/components/sections/Contact';

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <>
      <Navbar lang={lang} />
      <main>
        <Hero lang={lang} />
        <About lang={lang} />
        <Projects lang={lang} />
        <Process lang={lang} />
        <AiResearch lang={lang} />
        <Experience lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
