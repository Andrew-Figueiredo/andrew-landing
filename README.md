# Sonhai — Landing Page Institucional

Landing page institucional de página única (one-page) da **Sonhai**, agência de
Inteligência Artificial e desenvolvimento de software sob medida para PMEs.

O objetivo do site é apresentar os serviços de forma clara e profissional,
gerar confiança e facilitar o contato.

## ✨ Características

- **Single-page** estática (HTML + CSS + JS), sem build e sem dependências pesadas.
- **Tudo em um arquivo** (`index.html`): estilos e scripts embutidos para
  carregamento rápido (menos requisições) e edição simples.
- **Responsiva** (mobile-first), com bom contraste e navegação por teclado.
- **Microinterações**: animações de entrada ao rolar, hover em cards e botões.
- **SEO**: title, description e Open Graph configurados.
- Ícones em **SVG inline** (sem biblioteca externa) e tipografia via Google Fonts.

## 📑 Seções

Header · Hero · Problema/Valor · Serviços · Como funciona · Diferenciais ·
Sobre · Contato (formulário + WhatsApp) · Rodapé.

## 🛠 Como editar

Tudo fica em `index.html`:

| O que mudar | Onde |
|---|---|
| **Cores / tema** | Bloco `:root` no topo do `<style>` (variáveis `--c-*`). |
| **Textos** | Diretamente no HTML de cada seção (estão em português, prontos). |
| **Contato** | Procure por `DADOS DE CONTATO` — troque e-mail, telefone e os links `wa.me/55...` pelo número real. |
| **Redes sociais** | Bloco `socials` no rodapé — troque os `href="#"`. |
| **Envio do formulário** | Procure por `ENVIO` no `<script>` — aponte o `fetch`/`action` para o seu endpoint (Formspree, Web3Forms, webhook do n8n, API própria). |

> O formulário hoje faz **validação básica no front-end** e mostra uma confirmação
> visual. Ainda **não** envia e-mail — basta conectar o backend no ponto indicado.

## 🚀 Publicação

Por ser estático, basta servir o `index.html` por qualquer servidor web
(Nginx, Apache, GitHub Pages, Vercel, Netlify etc.). Nenhum passo de build é necessário.

## 📄 Licença

© Sonhai. Todos os direitos reservados.
