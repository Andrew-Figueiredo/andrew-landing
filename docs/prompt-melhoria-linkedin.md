# Prompt para melhoria do LinkedIn

Prompt pronto para colar num agente de IA (Claude, ChatGPT ou equivalente) e obter os textos do
perfil do LinkedIn do Andrew Figueiredo reescritos, alinhados ao posicionamento do portfólio.

Companheiro de `prompt-melhoria-curriculo.md`. Os dois partem das mesmas fontes de verdade, mas
o LinkedIn é outro meio: tem campos com limite rígido de caracteres e funciona como motor de
busca para recrutador. O prompt abaixo trata dessas duas diferenças.

## Como usar

1. Abra uma conversa nova com o agente.
2. Copie o bloco inteiro da seção seguinte e cole como primeira mensagem.
3. Junto, cole o conteúdo atual do seu perfil — pelo menos o Headline e o Sobre. Sem isso o
   agente escreve do zero em vez de melhorar o que existe.
4. Responda às perguntas que ele fizer antes de aceitar o resultado. Ele foi instruído a **não**
   preencher lacunas com suposição.

O resultado esperado é o **texto de cada campo, pronto para colar no LinkedIn**, com a contagem
de caracteres ao lado — não um relatório com sugestões.

## O prompt

````text
Você vai reescrever os textos do meu perfil do LinkedIn. Sou Andrew Figueiredo.

Entregue o texto final de cada campo, pronto para eu colar, com a contagem de caracteres ao
lado de cada um. Não me entregue análise, diagnóstico ou lista de sugestões: entregue os textos.

## POSICIONAMENTO (leia antes de escrever qualquer linha)

Meu título profissional é: Especialista em Desenvolvimento de Sistemas | Consultoria em IA e
Automação.

Atuo em três frentes principais, de peso equivalente entre si, mais uma quarta
complementar:
1. Desenvolvimento de Sistemas — aplicações web, APIs, integrações
2. Consultoria em IA — LLMs, machine learning aplicado, automação inteligente
3. Automação e Bots — n8n, chatbots WhatsApp e Telegram, RPA
4. Qualidade e Engenharia de Testes — automação de testes, BDD, CI/CD, análise estática de
   código. **Peso deliberadamente menor que as três primeiras.**

A quarta não é uma oferta em pé de igualdade com as outras: é o que fecha o ciclo delas.
Construo o sistema, integro inteligência nele, automatizo a operação em volta — e sei garantir
que aquilo se sustenta em produção. Poucos desenvolvedores conseguem afirmar essa última parte
com lastro; eu consigo, e é isso que ela acrescenta.

Regra prática: a qualidade deve aparecer, ter lastro nos bullets e ser buscável, mas nunca
ocupar o mesmo espaço que as três primeiras nem vir antes delas. Onde faltar espaço, ela é a
primeira a ceder.


## O LINKEDIN É UM MOTOR DE BUSCA — trate como tal

Recrutador técnico e cliente de consultoria chegam por busca, não navegando. Os termos que
importam para mim: Next.js, React, TypeScript, Python, LLM, machine learning, n8n, automação de
processos, RPA, Docker, CI/CD, Playwright, Pytest.

Distribua esses termos com naturalidade no Headline, no Sobre e nas descrições de experiência.
**Não** produza lista de palavras-chave separada por barras nem parágrafo empilhando termos:
isso lê como spam e derruba a credibilidade que o resto do perfil constrói.

## TOM — regras não negociáveis

Sóbrio e técnico. Descreva capacidade e entrega.

Proibido: "apaixonado", "movido por desafios", "energia contagiante", "entusiasmado",
"antenado", "mão na massa", "profissional dedicado" e qualquer variação de autoelogio genérico.
Também proibido: emoji, hashtag e frase de efeito motivacional.

Se um trecho puder ser dito por qualquer pessoa da área, ele não está dizendo nada — reescreva
com o fato concreto que só se aplica a mim.

**Nunca invente números.** Se um resultado pedir métrica que eu não forneci, escreva
[MÉTRICA A PREENCHER] e me pergunte ao final. Não estime, não arredonde, não deduza.

## CAMPOS A ENTREGAR, COM OS LIMITES

Os limites abaixo eram os vigentes quando este prompt foi escrito. Respeite-os; se souber que o
LinkedIn mudou algum, use o valor atual e me avise.

1. **Headline** — até 220 caracteres. É o campo de maior alavanca: aparece na busca, nos
   convites e em cada comentário meu. Precisa comunicar as três frentes principais sem virar
   lista de
   cargos. Entregue **três variações** com abordagens distintas e diga em uma linha o que muda
   entre elas.

2. **Sobre** — até 2.600 caracteres, primeira pessoa. Estrutura sugerida: abre com o que eu
   faço e para quem; desenvolve a narrativa de origem (entrei pela qualidade e automação, e isso
   me deu leitura completa de como um sistema é construído, quebra e se sustenta); apresenta as
   três frentes principais e a qualidade como fecho; termina com formação e pesquisa em IA. Os dois primeiros períodos são os únicos
   visíveis antes do "ver mais" — eles precisam funcionar sozinhos.

3. **Descrição de cada experiência** — até 2.000 caracteres cada. Prosa curta de contexto
   seguida de bullets. Veja as regras de conteúdo mais abaixo.

4. **Skills** — proponha a lista ordenada, até 50, e indique quais **três** devo fixar no topo.
   As três fixadas são o que aparece no perfil sem clique, então precisam refletir o
   posicionamento, não o que eu mais uso no dia a dia.

5. **Seção "Em destaque"** — sugira o que colocar, com o texto de cada legenda. Tenho o
   portfólio em andrewfigueiredo.dev.

6. **URL personalizada** — avalie a atual (linkedin.com/in/andrew-figueiredo) e diga se vale
   mudar.

## COMO TRATAR MINHA EXPERIÊNCIA EM QUALIDADE DE SOFTWARE

**Escopo atualizado:** a qualidade também é uma frente que eu ofereço — a quarta da lista
acima. O que ela não é: minha identidade nem meu carro-chefe. Ela entra como capacidade
declarada e com lastro, sempre depois das três primeiras e com menos espaço.

Ela é parte relevante da trajetória, mas **não é a minha identidade profissional**. Ela prova
domínio de código, APIs, bancos, arquitetura, CI/CD e visão de ciclo completo de entrega.

Mantenha os títulos de cargo reais — não invente cargo que eu não tive. Mas nos bullets,
descreva o trabalho de engenharia: "desenvolvi suítes de automação em Python integradas ao
pipeline de CI", não "executei testes"; "administrei pipeline e TestPlan em Azure DevOps", não
"acompanhei execuções".

## DADOS VERIFICADOS — não altere nenhum

**Experiência**

- Pesquisador — Analista de TI | Projeto Keep Chat | FAPESQ / SECTIES-PB | Set/2025 – atual
  (bolsa de pesquisa, 20h semanais)
- Analista de TI — Desenvolvimento e Qualidade | CODATA (Companhia de Dados da Paraíba) |
  Nov/2024 – atual
  Suítes de automação em Python com Playwright e Pytest; BDD com Pytest-BDD integrado ao
  pipeline; análise de qualidade de código com SonarQube; dashboards de acompanhamento técnico;
  testes de desempenho e análise de gargalos.
- ENACOM | Jul/2021 – Out/2024, com progressão interna:
  - Analista de Qualidade de Software V — Líder Técnico (Fev/2023 – Out/2024): liderança técnica
    de equipe definindo padrões de código e processo; automações em Python; administração de
    pipeline e TestPlan em Azure DevOps; atuação junto ao cliente na operação assistida.
  - Analista de Qualidade de Software III (Out/2022 – Fev/2023): automações web com padrão Page
    Object; automação de processos com Power Automate.
  - Analista de Qualidade de Software I / Estágio (Jul/2021 – Out/2022): automação em Cypress
    com Page Objects; testes e integração de APIs REST; manipulação de bases MongoDB.
- Desenvolvedor Mobile | UFPB | Abr/2019 – Jan/2020: aplicação mobile em React Native;
  prototipação em Figma.

CODATA e Keep Chat são simultâneos e legítimos: um é emprego, o outro é bolsa de pesquisa de
20h semanais. Não trate como erro nem tente "resolver" a sobreposição.

No LinkedIn, os três cargos da ENACOM devem ficar **agrupados sob a empresa**, usando o recurso
de múltiplas posições. Agrupados leem como crescimento em quatro anos; separados leem como
rotatividade.

**Formação**

- Mestrado em Tecnologia da Informação — IFPB (Fev/2025 – atual). Linha de Gestão e
  Desenvolvimento de Sistemas. Pesquisa em IA aplicada à Engenharia de Software: machine
  learning em testes, qualidade e automação. Estudo de LLMs.
- Tecnólogo em Ciência de Dados — UNIPÊ (Fev/2021 – Dez/2022). ML supervisionado e não
  supervisionado, avaliação de modelos com scikit-learn, MLOps, big data com PySpark,
  PostgreSQL e MongoDB.
- Graduação em Matemática Computacional — UFPB (Jul/2016 – Dez/2021). Álgebra linear
  computacional, cálculo numérico, otimização, análise numérica, modelagem matemática.

O argumento que a formação sustenta: eu treino e crio modelos, e entendo a matemática por trás
de por que funcionam — não apenas consumo API de terceiros. Comunique isso sem soar arrogante e
sem inventar projeto que eu não fiz.

## PROJETO KEEP CHAT

Projeto de pesquisa com fomento público estadual, executado pela FAPESQ em parceria com a
SECTIES-PB. Entrei como Analista de TI em setembro de 2025.

Descrição oficial, conforme o Edital nº 30/2025 SECTIES/FAPESQ/PB: iniciativa educativa voltada
para capacitação, formação e treinamento em áreas específicas de ferramentas de Inteligência
Artificial generativa, com o propósito adicional de promover impacto social positivo.

**Atenção:** o edital contém trechos de pré-requisito que falam em segurança pública, vigilância
e estatísticas criminais. Esses trechos foram reaproveitados de outro edital e **não descrevem o
Keep Chat**. Não mencione segurança pública em nenhum campo do perfil.

Não tenho link público do projeto por enquanto. Se precisar referenciar, use o edital da FAPESQ.

## SKILLS — esta ordem comunica o posicionamento

1. Desenvolvimento Web — React, Next.js, TypeScript, JavaScript, React Native, Tailwind CSS
2. Backend & APIs — Python, Node.js, APIs REST, PostgreSQL, MongoDB, SQL
3. IA & Machine Learning — LLMs, treinamento de modelos, ML supervisionado e não supervisionado,
   redes neurais, scikit-learn, PySpark, MLOps, avaliação de modelos, Jupyter, R
4. Automação & Bots — n8n, chatbots WhatsApp e Telegram, Power Automate, RPA
5. Qualidade & Engenharia de Testes — Playwright, Pytest, Pytest-BDD, Cypress, Selenium,
   Azure DevOps, SonarQube, BDD, testes de API e performance
6. Dados & BI — Power BI, dashboards, modelagem e análise de dados, Knime Analytics
7. Infra & DevOps — Docker, Nginx, GitHub Actions, Linux/VPS, CI/CD
8. Metodologias — SCRUM, Ágil, Design Patterns, Clean Code

Qualidade aparece em quinto de propósito: logo depois das três frentes principais e antes dos
grupos de apoio. Não a promova acima das três primeiras só porque tenho mais anos nela — a
ordem comunica onde eu quero atuar, não apenas onde eu estive.

## O QUE JA EXISTE NO DOCUMENTO ATUAL — e o que fazer com cada coisa

Este trecho foi levantado lendo o CV real. Use como inventario: nada aqui precisa ser
redescoberto, e nada aqui pode ser inventado alem do que esta escrito.

**Titulo atual:** "Especialista em Qualidade de Software / Cientista de Dados".
Substituir pelo posicionamento das tres frentes principais mais a quarta. Este e o ponto central da reescrita.

**Perfil atual:** contem "apaixonado pela intersecao", "trago uma energia contagiante" e
"Estou entusiasmado". Reescrever inteiro. As regras de tom acima existem por causa deste texto.

**Idade:** o texto atual informa "aos 25 anos". Remover — idade nao acrescenta nada e convida
vies. Nao substitua por "X anos de experiencia" inventado; use apenas o que as datas sustentam.

**Data desatualizada:** o documento traz ENACOM Analista V como "Fev 2023 - Today". Esta
errado. O vinculo encerrou em Out/2024, conforme a lista de datas verificadas. Corrija.

**Ausente do documento e que precisa entrar:**
- Projeto Keep Chat (comecou depois da ultima atualizacao)
- Toda a frente de Desenvolvimento de Sistemas: React, Next.js, TypeScript, Node.js, APIs REST
- Toda a frente de Automacao e Bots: n8n, chatbots WhatsApp e Telegram, RPA
- Infra e DevOps: Docker, Nginx, GitHub Actions, Linux/VPS, CI/CD
- LLMs

Sem esses blocos, o documento descreve um analista de qualidade e cientista de dados — nao a
pessoa das tres frentes principais mais a quarta.

## DADOS ADICIONAIS VERIFICADOS NO DOCUMENTO ATUAL

Use apenas se servirem ao posicionamento. Nao force todos.

**Contato:** andrewdw18@gmail.com · +55 (96) 98102-9283 · linkedin.com/in/andrew-figueiredo ·
github.com/Andrew-Figueiredo
O site pessoal listado hoje e um endereco do Canva (andrew-oliveira.my.canva.site). Substituir
por andrewfigueiredo.dev.

**Ferramentas que aparecem no documento e nao estavam na lista de skills:**
- Orange Testing — automacao de testes web, usada na ENACOM
- Allure Report — dashboards de testes automatizados, usado na CODATA
- Java — implementacao em calculo numerico, na graduacao
- C/C++, R, SQL

**Distribuicao de linguagens declarada:** Python 44,4% · JavaScript 22,2% · SQL 14,8% ·
R 14,8% · C/C++ 3,7%. Isso e autodeclarado, nao medido. Nao apresente como metrica de mercado.

**Tempo por competencia, autodeclarado:** Python +5 anos, Jupyter +5, JavaScript +5, Automacao
de Tarefas +5, Selenium +3, Casos de Teste +3, Metodologia Agil +2, Analise de Dados +2,
Dashboards +2, Power BI +2, Testes de Usabilidade +2, Planejamento de Teste +2, Cypress +1.

**Soft skills listadas:** adaptabilidade, comunicacao, inteligencia emocional, multitarefa.
Se mantiver alguma, ancore em evidencia concreta — lideranca tecnica de equipe e atuacao junto
ao cliente em operacao assistida sustentam comunicacao e adaptabilidade. Lista solta de soft
skill sem lastro e ruido.

**Detalhamento do mestrado que estava no documento e nao na lista resumida:** arquitetura e
modelagem de sistemas distribuidos; implementacao de solucoes escalaveis com foco em eficiencia
e desempenho; tecnicas de integracao e interoperabilidade entre sistemas; design patterns;
otimizacao de processos de desenvolvimento com ferramentas DevOps; gerenciamento de requisitos
e qualidade de software. Isso sustenta a frente de Desenvolvimento, nao so a de IA — aproveite.

**Detalhes de experiencia presentes no documento:**
- CODATA: elaboracao de planos de teste, execucao de testes manuais, operacao assistida com
  cliente, dashboards de bugs e tarefas, SCRUM.
- ENACOM Analista V: dashboards de bugs e tarefas, SCRUM, automacao web com Orange Testing.
- ENACOM Analista III: testes de usabilidade, Azure DevOps, Test Plan.
- ENACOM Estagio/I: priorizacao de automacao pelas telas mais usadas, testes de API REST,
  MongoDB, tecnicas BDD.
- Graduacao: algoritmo SIMPLEX em pesquisa operacional; calculo numerico em Python e Java.

**Monitorias na UFPB, com datas:** Matematica Discreta (Fev/2017 – Jun/2018) e Calculo II
(Jul/2018 – Jun/2019). Condense em uma linha; nao merecem bloco proprio.

## ANTES DE ENTREGAR

Cheque item a item:
- Nenhuma palavra da lista proibida aparece, e não há emoji nem hashtag.
- Nenhum número foi inventado; toda lacuna está como [MÉTRICA A PREENCHER].
- Todas as datas conferem com a lista de dados verificados.
- ENACOM está agrupada sob a empresa, com os três cargos como posições internas.
- O Keep Chat não foi associado a segurança pública.
- Os bullets de qualidade estão em linguagem de engenharia, com os títulos de cargo preservados.
- Cada campo respeita seu limite, e a contagem de caracteres está declarada.
- Os dois primeiros períodos do Sobre funcionam sozinhos, antes do "ver mais".

Ao final da entrega, liste em separado:
- as perguntas que você precisa que eu responda para fechar as lacunas;
- cada ocorrência de [MÉTRICA A PREENCHER] e que tipo de número serviria ali;
- o que no perfil depende de ação minha e não de texto (foto, banner, recomendações).
````

## Manutenção

Se o posicionamento mudar, as fontes de verdade são:

- `docs/superpowers/specs/2026-08-02-portfolio-andrew-figueiredo-design.md`, seções 2 e 8
- `src/data/experience.ts`, `src/data/education.ts`, `src/data/skills.ts`

Atualize este prompt, o `prompt-melhoria-curriculo.md` e o site juntos. Se os três divergirem,
o recrutador que cruzar as fontes encontra três versões da mesma pessoa.
