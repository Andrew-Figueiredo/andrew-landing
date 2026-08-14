import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { locales, isLocale, defaultLocale, type Locale } from '@/i18n';
import '../globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const SITE = 'https://andrewfigueiredo.dev';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Com output: 'export', qualquer segmento fora de generateStaticParams não tem para onde
// ser resolvido em runtime. Fechar aqui transforma /fr/ em 404 no build, em vez de erro.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? raw : defaultLocale;

  const copy = {
    pt: {
      title: 'Andrew Figueiredo — Desenvolvimento de Sistemas, IA e Automação',
      description:
        'Especialista em desenvolvimento de sistemas, consultoria em IA e automação de processos. +5 anos construindo e sustentando sistemas, do requisito à produção.',
    },
    en: {
      title: 'Andrew Figueiredo — Systems Development, AI and Automation',
      description:
        'Systems development specialist, AI consulting and process automation. 5+ years building and sustaining systems, from requirements to production.',
    },
  }[lang];

  return {
    metadataBase: new URL(SITE),
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${SITE}/${lang}/`,
      languages: {
        'pt-BR': `${SITE}/pt/`,
        en: `${SITE}/en/`,
        'x-default': `${SITE}/pt/`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Andrew Figueiredo',
      locale: lang === 'en' ? 'en_US' : 'pt_BR',
      url: `${SITE}/${lang}/`,
      title: copy.title,
      description: copy.description,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Andrew Figueiredo' }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html
      lang={lang === 'en' ? 'en' : 'pt-BR'}
      className={`${geist.variable} ${geistMono.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
