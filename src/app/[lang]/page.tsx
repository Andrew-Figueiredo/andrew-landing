import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { AreaSelector } from '@/components/sections/AreaSelector';

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <>
      <Navbar lang={lang} />
      <main>
        <Hero lang={lang} />
        <AreaSelector lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
