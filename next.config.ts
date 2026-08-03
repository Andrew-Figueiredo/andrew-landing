import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Site 100% estático: sem runtime Node em produção.
  output: 'export',
  // Gera out/pt/index.html. Sem isso o Nginx precisaria de regras de try_files
  // e /pt e /pt/ passariam a existir como conteúdo duplicado para o Google.
  trailingSlash: true,
  // Obrigatório com output: 'export' — não há servidor para otimizar sob demanda.
  images: { unoptimized: true },
};

export default nextConfig;
