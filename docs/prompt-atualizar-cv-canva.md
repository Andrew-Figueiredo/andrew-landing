# Prompt para atualizar o CV no Canva

Prompt pronto para colar no Claude e obter **instruções de edição elemento por elemento** do
currículo que já existe no Canva — não um currículo novo do zero.

Diferença em relação aos outros dois arquivos desta pasta:

| Arquivo | Entrega |
|---|---|
| `prompt-melhoria-curriculo.md` | o texto do currículo reescrito, para diagramar onde quiser |
| `prompt-melhoria-linkedin.md` | os textos de cada campo do perfil do LinkedIn |
| **este arquivo** | **o que trocar em cada elemento do design atual do Canva** |

Use este quando quiser manter o layout que já está pronto e só atualizar o conteúdo.

## Como usar

1. Abra uma conversa nova com o Claude.
2. Anexe o PDF atual: `public/cv-andrew-figueiredo.pdf`.
3. Copie o bloco inteiro da seção seguinte e cole como primeira mensagem.
4. Vá aplicando no Canva conforme a saída, elemento por elemento.

O mapa da estrutura já vai dentro do prompt, levantado do PDF. Mesmo assim anexe o arquivo: o
agente confere o que descrevi contra o documento real e avisa se algo mudou desde então.

## O prompt

````text
Preciso atualizar meu currículo, que vive como um design no Canva. Sou Andrew Figueiredo.

Não quero um currículo novo do zero: quero saber **exatamente o que trocar em cada elemento do
design que já existe**, para eu aplicar no editor. Entregue instruções acionáveis, não um
documento pronto.

## COMO ENTREGAR

Para cada elemento, use este formato:

  [Página X · Nome do elemento]
  ANTES: <texto atual, resumido se for longo>
  DEPOIS: <texto novo, completo e pronto para colar>
  CARACTERES: <n> (o atual tinha <n>)

Quando o texto novo for mais longo que o atual, avise explicitamente — no Canva isso significa
estourar a caixa ou reduzir a fonte. Se for inevitável, proponha o que cortar em troca.

Ao final, liste em separado:
- as mudanças estruturais que exigem mexer no layout, não só no texto;
- as perguntas que preciso responder para fechar lacunas;
- cada [MÉTRICA A PREENCHER] e que tipo de número serviria ali.

## ESTRUTURA ATUAL DO DESIGN

Quatro páginas. A barra lateral esquerda se repete idêntica nas quatro; a coluna direita muda.
As páginas 1, 2 e 3 terminam com "CONTINUA..." no rodapé.

**Barra lateral (repetida nas 4 páginas)**
- Foto circular
- CONTATOS: e-mail, telefone, LinkedIn, GitHub, site pessoal
- SOFT SKILLS: 4 itens, cada um com avaliação de 4 bolinhas
- HARD SKILLS: 13 itens, cada um com 4 bolinhas e o tempo em anos
- Gráfico de rosca "Linguagem de Programação": 5 fatias com percentual

**Página 1 (coluna direita)**
- Nome
- Título em duas linhas: "ESPECIALISTA EM QUALIDADE DE SOFTWARE / CIENTISTA DE DADOS"
- PERFIL: 4 parágrafos
- HISTÓRICO ACADÊMICO: IFPB (mestrado), com 9 bullets

**Página 2** — HISTÓRICO ACADÊMICO: UNIPÊ com ~10 bullets, UFPB com 5 bullets

**Página 3** — EXPERIÊNCIA: CODATA (10 bullets), ENACOM Analista V (8 bullets),
ENACOM Analista III (7 bullets)

**Página 4** — EXPERIÊNCIA: ENACOM Estágio/I (9 bullets), Desenvolvedor Mobile (2 bullets),
Monitor Matemática Discreta (2 bullets), Monitor Cálculo II (2 bullets)

## O QUE PRECISA MUDAR, E POR QUÊ

Estou me reposicionando. Hoje o documento me apresenta como analista de qualidade e cientista
de dados. Quero que ele apresente três frentes de peso equivalente:

1. Desenvolvimento de Sistemas — aplicações web, APIs, integrações
2. Consultoria em IA — LLMs, machine learning aplicado, automação inteligente
3. Automação e Bots — n8n, chatbots WhatsApp e Telegram, RPA

O eixo que une as três: construo o sistema, integro inteligência nele e automatizo a operação
em volta. São camadas do mesmo trabalho, não serviços soltos.

Meu título passa a ser: Especialista em Desenvolvimento de Sistemas | Consultoria em IA e
Automação.

**A experiência em qualidade não sai do documento** — ela prova domínio de código, APIs,
bancos, arquitetura, CI/CD e visão de ciclo completo. Mas deixa de ser a identidade. Mantenha
os títulos de cargo reais e reescreva os bullets em linguagem de engenharia: "desenvolvi suítes
de automação em Python integradas ao pipeline de CI", não "execução de testes manuais".

## PROBLEMAS CONCRETOS DO DOCUMENTO ATUAL

**Título.** "Especialista em Qualidade de Software / Cientista de Dados" é exatamente a
identidade que estou deixando para trás. Primeira coisa a trocar, nas 4 páginas.

**Perfil.** Os 4 parágrafos usam "apaixonado pela interseção", "trago uma energia contagiante"
e "Estou entusiasmado". Reescrever inteiro, com tom sóbrio e técnico.

**Idade.** O perfil informa "aos 25 anos". Remover: não acrescenta nada e convida viés.

**Data errada.** ENACOM Analista V aparece como "Fev 2023 - Today". Encerrou em Out/2024.

**Ausências.** Não há nada de Desenvolvimento (React, Next.js, TypeScript, Node.js, APIs REST),
nada de Automação (n8n, chatbots, RPA), nada de Infra (Docker, CI/CD, Nginx, Linux/VPS), nada
de LLMs, e falta o projeto Keep Chat, que começou depois da última atualização.

**Ordem cronológica.** O bloco de experiência precisa começar pelo mais recente, e o mais
recente hoje é o Keep Chat.

## RESTRIÇÕES DO LAYOUT — trate como limite real

**As bolinhas são de 0 a 4.** Não proponha escala diferente nem valor fora dela.

**A barra lateral já tem 13 hard skills e está cheia.** Adicionar as três frentes novas não
cabe sem tirar coisa. Proponha uma lista final que caiba em 13 a 15 linhas, priorizando o
posicionamento, e diga o que sai. Competências que existem mas não entram na lateral podem
viver nos bullets de experiência.

**O gráfico de rosca tem 5 fatias** e hoje mostra: Python 44,4% · JavaScript 22,2% · SQL 14,8%
· R 14,8% · C/C++ 3,7%. Se a distribuição mudar, entregue os 5 rótulos com percentuais que
somem 100%. Se achar que o gráfico deixou de servir ao posicionamento, diga e proponha o que
colocar no lugar — é um elemento visual que ocupa espaço nobre.

**Quatro páginas é longo.** Recrutador técnico costuma ler uma ou duas. Avalie e proponha uma
versão condensada, dizendo o que cortaria e o que perderia com isso. Se recomendar manter as
quatro, justifique em uma linha.

## DADOS VERIFICADOS — não altere nenhum

**Experiência, em ordem cronológica reversa**

- Pesquisador — Analista de TI | Projeto Keep Chat | FAPESQ / SECTIES-PB | Set/2025 – atual.
  Bolsa de pesquisa, 20h semanais. **Bloco novo, não existe no documento.**
- Analista de TI — Desenvolvimento e Qualidade | CODATA (Companhia de Dados da Paraíba) |
  Nov/2024 – atual
- ENACOM | Jul/2021 – Out/2024, com três cargos em progressão:
  - Analista de Qualidade de Software V — Líder Técnico | Fev/2023 – Out/2024
  - Analista de Qualidade de Software III | Out/2022 – Fev/2023
  - Analista de Qualidade de Software I / Estágio | Jul/2021 – Out/2022
- Desenvolvedor Mobile | UFPB | Abr/2019 – Jan/2020
- Monitorias UFPB: Matemática Discreta (Fev/2017 – Jun/2018), Cálculo II (Jul/2018 – Jun/2019).
  Condense as duas em uma linha só; hoje ocupam dois blocos.

CODATA e Keep Chat são simultâneos e legítimos: um é emprego, o outro é bolsa de pesquisa de
20h semanais. Deixe essa natureza explícita para não parecer inconsistência.

Os três cargos da ENACOM devem aparecer agrupados sob a empresa, mostrando progressão.
Agrupados leem como crescimento em quatro anos; separados leem como rotatividade.

**Formação**

- Mestrado em Tecnologia da Informação — IFPB | Fev/2025 – atual. Linha de Gestão e
  Desenvolvimento de Sistemas. Pesquisa em IA aplicada à Engenharia de Software.
- Tecnólogo em Ciência de Dados — UNIPÊ | Fev/2021 – Dez/2022
- Graduação em Matemática Computacional — UFPB | Jul/2016 – Dez/2021

Os bullets do mestrado no documento atual falam em arquitetura e modelagem de sistemas
distribuídos, soluções escaláveis, interoperabilidade entre sistemas, design patterns e DevOps.
**Isso sustenta a frente de Desenvolvimento, não só a de IA** — hoje está subaproveitado.

**Contato**

andrewdw18@gmail.com · +55 (96) 98102-9283 · linkedin.com/in/andrew-figueiredo ·
github.com/Andrew-Figueiredo

O site listado hoje é um endereço do Canva. **Trocar por andrewfigueiredo.dev.**

**Ferramentas que aparecem no documento** e podem ser aproveitadas: Orange Testing (automação
web na ENACOM), Allure Report (dashboards de teste na CODATA), Azure DevOps, SonarQube,
Playwright, Pytest, Pytest-BDD, Cypress, Selenium, Power Automate, Power BI, Knime Analytics,
PySpark, scikit-learn, Jupyter, PostgreSQL, MongoDB, Java, C/C++, R, SQL.

## PROJETO KEEP CHAT

Pesquisa com fomento público estadual, executada pela FAPESQ em parceria com a SECTIES-PB.
Entrei como Analista de TI em setembro de 2025.

Descrição oficial, conforme o Edital nº 30/2025 SECTIES/FAPESQ/PB: iniciativa educativa voltada
para capacitação, formação e treinamento em áreas específicas de ferramentas de Inteligência
Artificial generativa, com o propósito adicional de promover impacto social positivo.

**Atenção:** o edital contém trechos de pré-requisito que falam em segurança pública,
vigilância e estatísticas criminais. Foram reaproveitados de outro edital e **não descrevem o
Keep Chat**. Não mencione segurança pública em lugar nenhum.

## TOM — regras não negociáveis

Sóbrio e técnico. Descreva capacidade e entrega.

Proibido: "apaixonado", "energia contagiante", "entusiasmado", "movido por desafios",
"profissional dedicado" e qualquer autoelogio genérico. Sem emoji.

Se um trecho puder ser dito por qualquer pessoa da área, ele não está dizendo nada.

**Nunca invente números.** Toda lacuna numérica vira [MÉTRICA A PREENCHER] e volta como
pergunta no final. Não estime, não arredonde, não deduza. Os tempos por competência e os
percentuais do gráfico são autodeclarados por mim, não medidos — não os apresente como métrica
de mercado.

## ANTES DE ENTREGAR

Cheque item a item:
- O título foi trocado nas 4 páginas, não só na primeira.
- Nenhuma palavra da lista proibida sobrou, e a menção à idade saiu.
- ENACOM está com Out/2024, agrupada, com os três cargos em progressão.
- O Keep Chat entrou como bloco novo, no topo da experiência.
- As três frentes aparecem no perfil e têm lastro nos bullets.
- O site pessoal aponta para andrewfigueiredo.dev.
- Nenhum número inventado; lacunas marcadas.
- Cada bloco tem contagem de caracteres e aviso quando ficou maior que o atual.
- A lista de hard skills cabe em 13 a 15 linhas, e você disse o que saiu.
````

## Manutenção

Fontes de verdade, se o posicionamento mudar:

- `docs/superpowers/specs/2026-08-02-portfolio-andrew-figueiredo-design.md`, seções 2 e 8
- `src/data/experience.ts`, `src/data/education.ts`, `src/data/skills.ts`

Atualize os três prompts e o site juntos. Se divergirem, o recrutador que cruzar as fontes
encontra três versões da mesma pessoa.
