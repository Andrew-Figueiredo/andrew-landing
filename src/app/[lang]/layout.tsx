import { Geist, Geist_Mono, Inter } from 'next/font/google';
import '../globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }];
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
