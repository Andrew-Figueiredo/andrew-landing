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
    <html lang={lang === 'en' ? 'en' : 'pt-BR'}>
      <body>{children}</body>
    </html>
  );
}
