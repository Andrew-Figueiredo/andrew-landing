# Prompt para melhoria do currículo

Prompt pronto para colar num agente de IA (Claude, ChatGPT ou equivalente) e obter uma versão
reescrita do currículo do Andrew Figueiredo, alinhada ao posicionamento do portfólio.

## Como usar

1. Abra uma conversa nova com o agente.
2. Anexe o CV atual: `public/cv-andrew-figueiredo.pdf` (versão PT-BR).
3. Copie o bloco inteiro da seção seguinte e cole como primeira mensagem.
4. O agente vai fazer perguntas onde faltar informação — responda antes de aceitar o resultado.
   Ele foi instruído a **não** preencher lacunas com suposição.

O resultado esperado é um **currículo reescrito**, pronto para diagramar, não um relatório com
sugestões sobre o currículo.

Se o agente não aceitar anexos, cole o texto do CV logo após o prompt, sob o título
`CURRÍCULO ATUAL:`.

## O prompt

````text
Você vai reescrever meu currículo. Sou Andrew Figueiredo. O CV atual está anexado (PT-BR).

Entregue o currículo reescrito por completo, pronto para eu diagramar. Não entregue um
relatório, uma análise ou uma lista de sugestões — entregue o documento.

## POSICIONAMENTO (leia antes de escrever qualquer linha)

Título profissional: Especialista em Desenvolvimento de Sistemas | Consultoria em IA e Automação

Atuo em três frentes de peso equivalente:
1. Desenvolvimento de Sistemas — aplicações web, APIs, integrações entre sistemas
2. Consultoria em IA — LLMs, machine learning aplicado, automação inteligente
3. Automação e Bots — n8n, chatbots para WhatsApp e Telegram, RPA

O eixo que une as três: eu construo o sistema, integro inteligência nele e automatizo a
operação em volta. São camadas do mesmo trabalho, não serviços soltos. O resumo profissional
no topo do CV precisa deixar isso explícito.

## COMO TRATAR MINHA EXPERIÊNCIA EM QUALIDADE DE SOFTWARE

Boa parte da minha trajetória tem títulos de Analista de Qualidade de Software. Isso é parte
relevante da história, mas NÃO é a identidade do currículo.

Regras:
- Preserve os títulos de cargo reais. Não invente títulos mais "de desenvolvedor".
- Escreva os bullets em linguagem de engenharia. Certo: "desenvolvi suítes de automação em
  Python integradas ao pipeline de CI". Errado: "executei testes".
- Essa experiência prova domínio de código, APIs, bancos de dados, arquitetura, CI/CD e visão
  de ciclo completo de entrega. Faça os bullets evidenciarem isso.

## TOM — regras não negociáveis

- Sóbrio e técnico. Descreva capacidade e entrega.
- PROIBIDO: "apaixonado", "apaixonado por tecnologia", "energia contagiante", "entusiasmado",
  "movido por desafios" e qualquer variação de autoelogio emocional.
- NUNCA invente métricas, percentuais ou números. Onde um número fortaleceria o bullet mas você
  não o tem, escreva literalmente [MÉTRICA A PREENCHER] e me pergunte ao final. Estimar,
  arredondar ou sugerir um número plausível é falha grave.
- Não invente tecnologias, clientes, projetos ou responsabilidades que não estejam neste prompt
  ou no CV anexado.

## DATAS VERIFICADAS — não altere nenhuma

- ENACOM: Jul/2021 – Out/2024 (encerrada em 30/10/2024)
- CODATA (Companhia de Dados da Paraíba): Nov/2024 – atual
- Projeto Keep Chat (FAPESQ / SECTIES-PB): Set/2025 – atual
- UFPB, Desenvolvedor Mobile: Abr/2019 – Jan/2020

CODATA e Keep Chat são simultâneos, e isso está correto: CODATA é vínculo empregatício e Keep
Chat é bolsa de pesquisa de 20 horas semanais. Deixe a natureza distinta de cada um legível,
para que a sobreposição de datas não pareça erro de currículo.

## ENACOM — agrupe, não fragmente

Tive três cargos na ENACOM, em progressão:
- Analista de Qualidade de Software I / Estágio (Jul/2021 – Out/2022)
- Analista de Qualidade de Software III (Out/2022 – Fev/2023)
- Analista de Qualidade de Software V — Líder Técnico (Fev/2023 – Out/2024)

Apresente como UM bloco da empresa com os três cargos aninhados, mostrando a progressão. Três
entradas separadas leem como rotatividade; agrupadas leem como crescimento em três anos na
mesma casa.

## PROJETO KEEP CHAT

Pesquisa com fomento público estadual. Executado pela FAPESQ (Fundação de Apoio à Pesquisa do
Estado da Paraíba) em parceria com a SECTIES-PB (Secretaria de Estado da Ciência, Tecnologia,
Inovação e Ensino Superior). Entrei pelo perfil de Pesquisador — Analista de TI.

Descrição oficial do projeto, conforme o Edital nº 30/2025 SECTIES/FAPESQ/PB: iniciativa
educativa voltada para a capacitação, formação e treinamento em ferramentas de Inteligência
Artificial generativa, com o propósito de promover impacto social positivo.

AVISO: se você pesquisar o edital, vai encontrar trechos de pré-requisito que falam em
segurança pública, sistemas de vigilância e estatísticas criminais. Esses trechos foram
reaproveitados de outro edital e NÃO descrevem o Keep Chat. Não caracterize o projeto como
sendo de segurança pública.

Este item é uma das provas mais fortes do currículo: pesquisa em IA generativa com
financiamento público, verificável em fonte oficial. Dê a ele destaque compatível.

## FORMAÇÃO

- Mestrado em Tecnologia da Informação — IFPB (Fev/2025 – atual). Linha de Gestão e
  Desenvolvimento de Sistemas. Pesquisa em IA aplicada à Engenharia de Software: machine
  learning em testes, qualidade e automação. Estudo de LLMs.
- Tecnólogo em Ciência de Dados — UNIPÊ (Fev/2021 – Dez/2022). ML supervisionado e não
  supervisionado: classificação, regressão, árvores de decisão, redes neurais. Avaliação de
  modelos com scikit-learn. MLOps. Big data com PySpark, PostgreSQL e MongoDB.
- Graduação em Matemática Computacional — UFPB (Jul/2016 – Dez/2021). Álgebra linear
  computacional, cálculo numérico, otimização, análise numérica e modelagem matemática.
  Monitorias de Cálculo II e Matemática Discreta.

O argumento que a formação precisa comunicar: eu treino e crio modelos, trabalho com LLMs e
entendo a matemática que faz os modelos funcionarem — não apenas consumo API de terceiros.
Deixe isso perceptível sem precisar afirmar de forma direta.

## SKILLS — mantenha esta ordem, ela comunica o posicionamento

1. Desenvolvimento Web — React, Next.js, TypeScript, JavaScript, React Native, Tailwind CSS,
   HTML/CSS
2. Backend & APIs — Python, Node.js, APIs REST, PostgreSQL, MongoDB, SQL
3. IA & Machine Learning — LLMs, treinamento de modelos, ML supervisionado e não
   supervisionado, redes neurais, classificação, regressão, árvores de decisão, scikit-learn,
   PySpark, MLOps, avaliação de modelos, Jupyter, Python, R
4. Automação & Bots — n8n, chatbots WhatsApp, chatbots Telegram, Power Automate, integrações
   entre sistemas, RPA
5. Dados & BI — Power BI, dashboards, modelagem de dados, análise de dados, Knime Analytics
6. Infra & DevOps — Docker, Nginx, GitHub Actions, Linux/VPS, CI/CD
7. Qualidade & Engenharia de Testes — Playwright, Pytest, Pytest-BDD, Cypress, Selenium,
   Azure DevOps, SonarQube, BDD, testes de API, testes de performance
8. Metodologias — SCRUM, Ágil, Design Patterns, Clean Code

Sem barras de progresso, sem percentuais, sem níveis do tipo "avançado" ou "intermediário".

## ESTRUTURA ESPERADA DO CURRÍCULO

1. Cabeçalho — nome, título profissional, contatos (use os que estão no CV anexado)
2. Resumo profissional — 3 a 4 linhas articulando as três frentes
3. Experiência profissional — ordem cronológica reversa, com ENACOM agrupada
4. Formação acadêmica
5. Skills agrupadas na ordem acima

Se você julgar que outra ordem serve melhor ao posicionamento, proponha a mudança e explique
em uma linha — mas entregue o currículo montado de todo jeito.

## ANTES DE ENTREGAR

Cheque item a item:
- Nenhuma palavra da lista proibida aparece no texto.
- Nenhum número foi inventado; toda lacuna numérica está como [MÉTRICA A PREENCHER].
- Todas as datas conferem com a lista de datas verificadas.
- ENACOM está agrupada com os três cargos aninhados.
- O Keep Chat não foi descrito como projeto de segurança pública.
- Os bullets de qualidade estão em linguagem de engenharia.

Ao final da entrega, liste em separado:
- as perguntas que você precisa que eu responda para fechar as lacunas;
- cada ocorrência de [MÉTRICA A PREENCHER] e que tipo de número serviria ali.
````

## Manutenção

Se o posicionamento mudar, as fontes de verdade são:

- `docs/superpowers/specs/2026-08-02-portfolio-andrew-figueiredo-design.md`, seções 2 e 8
- `src/data/experience.ts`, `src/data/education.ts`, `src/data/skills.ts`

Atualize este prompt junto com elas, senão CV e site passam a contar histórias diferentes.
