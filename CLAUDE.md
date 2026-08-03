# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

Landing page institucional one-page da **Sonhai** (agência de IA e software sob medida para PMEs).
Site estático em **um único arquivo**: `index.html` (~880 linhas) contém HTML, `<style>` e `<script>` embutidos.
Conteúdo todo em português (`lang="pt-BR"`).

Não há build, package.json, dependências npm, linter nem testes. As duas únicas
dependências externas são Google Fonts (Plus Jakarta Sans + Inter) e nada mais —
os ícones são SVG inline e o favicon é um data URI SVG no `<head>`.

## Desenvolvimento

Abrir `index.html` direto no navegador já funciona. Para servir localmente:

```bash
python -m http.server 8000   # ou: npx serve .
```

Deploy: copiar `index.html` para qualquer host estático (GitHub Pages, Vercel, Netlify, Nginx). Sem passo de build.

## Estrutura de `index.html`

O arquivo é dividido por comentários-banner numerados. Ao navegar, procure por eles em vez de rolar o arquivo:

- `<head>` — bloco `SEO + Open Graph`, favicon SVG inline, Google Fonts.
- `<style>` — 14 seções numeradas, na ordem: `1. VARIÁVEIS DE TEMA`, `2. RESET + BASE`,
  `3. BOTÕES`, `4. HEADER / NAV`, `5. HERO`, `6. PROBLEMA / VALOR`, `7. SERVIÇOS`,
  `8. COMO FUNCIONA`, `9. POR QUE A SONHAI / DIFERENCIAIS`, `10. SOBRE`, `11. CONTATO`,
  `12. RODAPÉ`, `13. MICROINTERAÇÕES`, `14. RESPONSIVO`.
- `<body>` — `header#header`, e as seções `#hero`, `#valor`, `#servicos`, `#como-funciona`,
  `#diferenciais`, `#sobre`, `#contato`, `footer`, botão flutuante `.wa-float`.
- `<script>` — ano do rodapé, header com classe `scrolled`, menu mobile, IntersectionObserver
  das animações, validação do formulário.

Mantenha esse padrão de banners ao adicionar seções: o CSS de uma seção fica no bloco numerado
correspondente, não junto ao markup.

## Convenções

**Tema.** Todas as cores, raios, sombras e fontes vêm de custom properties no `:root` (`--c-*`,
`--radius*`, `--shadow*`, `--font-head`/`--font-body`, `--maxw`). Nunca hardcode cor ou fonte no CSS
das seções — use ou adicione uma variável.

**Alternância de fundo.** Seções alternam branco e `--c-bg-soft` via a classe `section--soft`.
Ao inserir uma seção nova, respeite a alternância com as vizinhas.

**Animação de entrada.** Elementos com `.reveal` começam invisíveis e ganham `.in` via
IntersectionObserver (`threshold: 0.12`). Escalone itens irmãos com `.d1`–`.d4` (delays de 80ms).
Se um elemento novo precisa aparecer no scroll, basta a classe — o JS já observa tudo com `.reveal`.
Existe fallback para navegadores sem IntersectionObserver e um `@media (prefers-reduced-motion: reduce)`
que desliga as animações; preserve os dois.

**Responsivo.** Breakpoints em 980px, 760px e 480px, todos no bloco `14. RESPONSIVO`.

**Ícones.** SVG inline com `stroke="currentColor"`, `stroke-width="2"`, `viewBox="0 0 24 24"` (estilo Feather).
Não adicione bibliotecas de ícones.

## Placeholders a substituir

O site ainda tem dados fictícios. Ao mexer em contato, atenção a:

- Telefone/WhatsApp `5500000000000` — aparece em 4 lugares (bloco de contato, rodapé, botão flutuante).
- E-mail `contato@sonhai.com.br` (bloco `DADOS DE CONTATO` e rodapé).
- Redes sociais no rodapé — `href="#"` em Instagram, LinkedIn e afins.
- `og:url` e o `og:image` comentado no `<head>`.

**Formulário de contato:** hoje só valida no front-end (nome, e-mail por regex, mensagem) e mostra
confirmação visual — **não envia nada**. O ponto de integração é o bloco comentado `ENVIO` dentro do
`submit` handler, onde já há um exemplo de `fetch`. Ao conectar um backend, substitua aquele bloco
mantendo o `e.preventDefault()` e a validação acima.

## Git

Commits recentes usam prefixo `feat:` em português/inglês misto. Branch principal: `main`.
