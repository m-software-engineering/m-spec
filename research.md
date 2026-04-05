# **Validação Arquitetural, Teste de Estresse e Requisitos de Produto (PRD) para Framework CLI de Spec-Driven Development em Orquestração de Agentes**

A transição do paradigma de codificação baseada em interações não estruturadas de linguagem natural para a engenharia conduzida por agentes autônomos exige um rigor arquitetural estrito. A concepção de um framework de interface de linha de comando (CLI) voltado para o _Spec-Driven Development_ (SDD) que unifique especificações Gherkin, ciclos Red-Green-Refactor de _Test-Driven Development_ (TDD) e a otimização autônoma contínua representa uma evolução fundamental na orquestração de Inteligência Artificial. A análise a seguir disseca, estressa e formaliza os requisitos para transformar esta arquitetura em um produto de software de alto valor, operando de forma agnóstica entre plataformas de agentes de codificação.

## **Análise e Validação do Paradigma Arquitetural**

A proposta de centralizar o desenvolvimento assistido por IA em um CLI de _scaffolding_ em TypeScript, publicado no registro NPM, atende diretamente à necessidade de distribuição padronizada e integração contínua em ambientes corporativos. A decisão de afastar-se de servidores _Model Context Protocol_ (MCP) monolíticos em favor de scripts Bash minimalistas é uma resposta precisa aos atuais gargalos de gerenciamento de janela de contexto em Modelos de Linguagem de Grande Escala (LLMs). A integração simultânea de ecossistemas como OpenSpec, SuperPowers e ferramentas de _autoresearch_ cria uma sinergia que mitiga a "amnésia de contexto" e a degradação de performance inerente a sessões autônomas prolongadas.

### **O Paradigma do Spec-Driven Development em Ecossistemas Brownfield**

A utilização do OpenSpec como fundação do framework é altamente validada pelas necessidades da indústria de software. Em projetos _brownfield_ — sistemas legados ou em andamento contínuo —, agentes de IA frequentemente perdem o alinhamento com a intenção arquitetural original, resultando em refatorações destrutivas e perda de regras de negócios que não estavam explícitas na janela de contexto.1 O modelo do OpenSpec resolve esta deficiência ao isolar as especificações de sistema (a fonte da verdade) das propostas de mudança iterativas, utilizando um sistema sofisticado de _delta specs_.1

A estratégia de forçar a criação de artefatos estruturados em markdown antes de qualquer geração de código garante que o agente compreenda rigorosamente os limites do domínio de atuação.3 Em ambientes de código preexistente, a capacidade de utilizar marcadores formais de alteração de estado permite que o agente modifique comportamentos sem reescrever especificações inteiras. A adoção de cabeçalhos como \#\# ADDED Requirements, \#\# MODIFIED Requirements e \#\# REMOVED Requirements estabelece um rastreamento de auditoria claro, mantendo a integridade do projeto e prevenindo alucinações arquiteturais.5

### **A Disciplina do Test-Driven Development via SuperPowers**

A incorporação da biblioteca de habilidades baseada no repositório SuperPowers valida a necessidade premente de restringir a tendência natural da IA de buscar atalhos cognitivos e de implementação. Agentes de IA são notórios por escreverem código de produção primeiro e testes frágeis posteriormente, frequentemente desenvolvendo racionalizações complexas para quebrar processos estabelecidos em nome da velocidade aparente.7 A metodologia do SuperPowers define habilidades não como meras sugestões no _prompt_ do sistema, mas como fluxos de trabalho absoluta e estritamente obrigatórios.9

A doutrina central imposta por este modelo determina que nenhum código de produção pode existir ou ser mantido no repositório sem que um teste falho correspondente tenha sido executado e registrado.10 Ao forçar o ciclo estrito de RED-GREEN-REFACTOR, o framework proposto assegura que o agente autônomo siga um encadeamento lógico irrefutável: a escrita do cenário Gherkin antecede a criação do teste unitário; o teste prova a ausência da funcionalidade ao falhar miseravelmente; o código mínimo é gerado exclusivamente para satisfazer a asserção do teste; e, finalmente, qualquer código gerado prematuramente é sumariamente excluído, inviabilizando qualquer tentativa do modelo de contornar a validação empírica.9

## **Fundações de Integração e Desempenho Minimalista**

Para que um framework de orquestração atinja níveis de performance ótimos sem exaurir os limites de tokens impostos pelas APIs subjacentes, a arquitetura de ferramentas deve ser implacavelmente minimalista. A proposta de substituir integrações densas por scripts Bash leves é o diferencial técnico que viabiliza execuções profundas e de baixo custo.

### **Minimalismo Operacional e o Paradigma "No MCP"**

A decisão de adotar scripts Bash e Node.js em detrimento de servidores MCP completos (como os implementados pelo Playwright ou Chrome DevTools) representa uma vantagem competitiva crítica para a conservação de contexto. Servidores MCP genéricos são construídos para cobrir todas as bases funcionais possíveis. Consequentemente, eles expõem dezenas de ferramentas complexas acompanhadas de descrições semânticas longas, consumindo rotineiramente entre 13.700 e 18.000 _tokens_ (cerca de 7% a 9% da janela de contexto de modelos de ponta) apenas para a injeção de documentação.14

O framework proposto alcança um desempenho drasticamente superior ao adotar a tática de "Divulgação Progressiva" aliada a scripts que utilizam a biblioteca puppeteer-core. Ao registrar um único arquivo de documentação de aproximadamente 225 _tokens_, o agente é instruído a invocar ferramentas CLI modulares, injetando código diretamente no contexto do emulador de terminal.14 A tabela a seguir consolida as ferramentas minimalistas requeridas e seus padrões de interação:

| Script Node.js / Bash | Comportamento Arquitetural e Propósito de Desempenho                                                                                                                                                                                                                                              |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| start.js              | Inicializa o contexto do navegador manipulando o ciclo de vida do processo. Opcionalmente, sincroniza o perfil do usuário via rsync para preservar a sessão de autenticação, executando o navegador em segundo plano (_detached_) enquanto mantém a porta 9222 aberta para depuração remota.14    |
| nav.js                | Conecta-se ao terminal de depuração e injeta comandos de navegação de aba com condições estritas de espera, como domcontentloaded, evitando bloqueios por ativos de rede pesados.14                                                                                                               |
| eval.js               | Transfere a complexidade da automação para o conhecimento inerente do LLM sobre a API do DOM. Ele empacota as instruções do agente em um construtor AsyncFunction, permitindo extração e manipulação assíncrona de nós HTML sem a necessidade de expor centenas de métodos do Puppeteer.14        |
| screenshot.js         | Captura o estado visual da aplicação e escreve um arquivo temporário no sistema operacional, retornando apenas o caminho absoluto via stdout. Isso permite que o agente invoque suas capacidades de visão computacional de forma cirúrgica e intermitente.14                                      |
| pick.js               | Paralisa a execução autônoma para solicitar interação humana em interfaces ambíguas. Injeta uma sobreposição na interface do usuário que, ao ser clicada pelo desenvolvedor, extrai metadados complexos (tags, identificadores, classes e hierarquia pai) e os canaliza de volta para o agente.14 |

Esta abordagem garante a composabilidade essencial ausente em estruturas MCP nativas. O agente pode canalizar saídas de scripts diretamente para arquivos no disco físico, iterando sobre estruturas de dados maciças ou logs de erros extensos sem nunca inundar a janela de contexto, mantendo a capacidade de raciocínio da IA inalterada ao longo de dezenas de iterações.14

## **O Ecossistema de Agentes Suportados e Configuração de Domínio**

Um requisito central da arquitetura proposta é a agnosia de plataforma, garantindo que o CLI funcione de maneira idêntica independentemente do agente subjacente escolhido pelo desenvolvedor. A fase de inicialização do CLI (que questiona o usuário sobre o uso do OpenAI Codex, Claude Code ou GitHub Copilot CLI) requer a geração de esquemas de configuração radicalmente diferentes para acomodar as particularidades de cada ecossistema.15

### **Orquestração e Adaptação Específica por Plataforma**

O framework de SDD deve atuar como um compilador de intenções, traduzindo as _skills_ e os _hooks_ do projeto para o dialeto nativo de cada ferramenta de IA suportada.

Para o **Claude Code**, a orquestração demanda a criação de rotinas no arquivo \~/.claude/settings.json ou localmente em .claude/settings.json. A plataforma do Claude suporta um ecossistema robusto de eventos de ciclo de vida. O CLI deve realizar o _scaffolding_ mapeando as ferramentas de formatação e segurança para os eventos PreToolUse (que possibilita a intercepção e o bloqueio de comandos indesejados) e PostToolUse (para formatações e execuções de linting após alterações no código-fonte).17 Além disso, os subagentes no Claude são instanciados declarativamente via arquivos em .claude/agents/, permitindo a delegação transparente de contexto para tarefas secundárias.18

Para o **GitHub Copilot CLI**, as exigências de configuração deslocam-se para o diretório .github/. As personas e instruções de subagentes devem ser registradas sob .github/agents/, utilizando o protocolo nativo da ferramenta para orquestrar comandos complexos.19 Os _hooks_ de ciclo de vida são mapeados no arquivo .github/hooks/hooks.json. O CLI deve gerar os metadados corretos para que o Copilot compreenda as permissões de acesso às ferramentas de _shell_ e as delegações de interface.20

Para o **OpenAI Codex CLI**, o comportamento da IA é guiado primordialmente pelo arquivo AGENTS.md e configurado via \~/.codex/config.toml ou sobrescritas locais.22 O Codex CLI suporta a descoberta automática de _skills_ em diretórios predefinidos, o que significa que a instalação das habilidades derivadas do SuperPowers deve ocorrer sob o caminho .agents/skills/. O CLI de _scaffolding_ deve gerar as configurações em TOML habilitando a _feature flag_ experimental de _hooks_ (codex_hooks \= true) para garantir a paridade de funcionalidades com os demais agentes.24

A tabela a seguir evidencia o mapeamento de diretórios de configuração que o CLI desenvolvido em TypeScript deverá construir dinamicamente durante a rotina de inicialização:

| Plataforma Alvo    | Caminho de Configuração de Hooks | Caminho de Especificação de Agentes/Skills | Arquivo Primário de Instruções |
| :----------------- | :------------------------------- | :----------------------------------------- | :----------------------------- |
| Claude Code        | .claude/settings.json            | .claude/agents/ e .claude/skills/          | CLAUDE.md                      |
| GitHub Copilot CLI | .github/hooks/hooks.json         | .github/agents/                            | Copilot-instructions.md        |
| OpenAI Codex CLI   | .codex/hooks.json                | .agents/skills/                            | AGENTS.md                      |

### **Disseminação de Contexto através de AGENTS.md**

A exigência de inserir um arquivo AGENTS.md em todos os diretórios de domínio do repositório constitui uma estratégia brilhante de gerenciamento de estado. Em projetos complexos e densos (_brownfield_), consolidar todas as especificações e regras de negócios em um único arquivo raiz frequentemente resulta em sobrecarga da janela de contexto.23 A injeção paramétrica e descentralizada do AGENTS.md cria uma arquitetura de "roteamento de conhecimento".

Opcionalmente habilitada pelo usuário, esta funcionalidade permite que, ao atuar sobre o domínio de autenticação (ex: src/modules/auth/), o agente de IA seja restringido pelas diretrizes locais do src/modules/auth/AGENTS.md. Isso previne que o agente alucine padrões globais ou aplique metodologias pertencentes ao domínio de faturamento em um contexto não relacionado, mitigando agressivamente os problemas de "perda no meio" (_Lost in the Middle_) que afetam os LLMs durante o processamento de longos documentos de especificação.25

## **Engenharia de Disciplina e Segurança**

A liberdade de ação conferida a agentes que executam comandos no terminal local apresenta riscos significativos, tanto para a integridade da arquitetura de software quanto para a segurança da infraestrutura da máquina do desenvolvedor. A integração obrigatória das metodologias do repositório SuperPowers aliada a protocolos estritos de _hooks_ de ciclo de vida endereça diretamente estas vulnerabilidades.

### **Governança Gherkin e o Ciclo Red-Green-Refactor**

A imposição do uso do padrão Gherkin transcende a mera organização de requisitos textuais. A estrutura de Given/When/Then estabelece uma ponte semântica exata entre o modelo de linguagem natural processado pela IA e as funções de teste determinísticas (como o uso do Vitest no ecossistema JavaScript/TypeScript). Ao vincular a especificação ao TDD, o framework garante que a IA converta o Gherkin diretamente em blocos de teste executáveis antes de conceber a lógica de negócios.13

A aplicação da "Lei de Ferro" arquitetada pelo SuperPowers atua como uma barreira psicológica e técnica contra o desvio metodológico do agente. O agente é rigidamente programado para registrar as racionalizações comuns que ele mesmo tenta usar para justificar a não escrita de testes (ex: "é apenas uma mudança simples", ou "adicionarei os testes após garantir que funciona").7 O framework rejeita e descarta automaticamente qualquer conjunto de alterações no código de produção que não seja precedido pela evidência de um teste que compilou e falhou adequadamente devido à ausência da implementação funcional correspondente.9

### **Interceptação Ativa e Proteção via Hooks**

Para implementar os controles inspirados em repositórios como claude-code-hooks (de karanb192) e as ferramentas adaptadas, o CLI deve instalar _shell scripts_ de auditoria invisível.16 A arquitetura de _hooks_ deve ser adaptada em tempo de execução para cada agente suportado, monitorando eventos críticos.

A implementação de segurança primária reside na fase PreToolUse (ou equivalente na plataforma). O _hook_ interceptará a solicitação da IA para acionar ferramentas classificadas de alto risco, como o Bash.16 O _payload_ JSON recebido do agente via entrada padrão (stdin) conterá a representação do comando que a IA deseja executar. O _script_ validador inspecionará este comando contra uma lista de expressões regulares que identificam ações catastróficas. Operações como deleção recursiva forçada (rm \-rf / ou rm \-rf \~), bombas lógicas (_fork bombs_), e a execução arbitrária de binários remotos via curl | sh serão liminarmente rejeitadas.16

Em caso de violação, o script encerrará a execução com um código de erro de rejeição, retornando um log determinístico para a IA, instruindo-a sobre a recusa do comando e obrigando o modelo a traçar uma rota de ação baseada em APIs de manipulação de arquivo mais seguras ou comandos puramente investigativos. Da mesma forma, _hooks_ complementares de proteção contra exfiltração de dados monitorarão ativamente a tentativa de leitura ou escrita em arquivos de manifesto de segurança e matrizes de senhas (como arquivos .env), bloqueando ferramentas de Read e Write conforme as diretivas estabelecidas pela política de configuração da equipe.16

## **Otimização Autônoma Contínua: A Lógica de Autoresearch**

O conceito de _autoresearch_, concebido por Andrej Karpathy para o treinamento iterativo de redes neurais, baseia-se em delegar o raciocínio experimental a uma IA através de um ciclo rígido de modificação e avaliação de hipóteses. A transposição desse padrão específico de _Machine Learning_ para a otimização de bases de código generalistas introduz um novo horizonte na manutenção de software, materializado no comando /optimize.

### **O Ciclo "Ratchet" e a Estrutura de Avaliação**

A lógica do _autoresearch_ opera por meio de um "ciclo de catraca" (_ratchet loop_), caracterizado por um mecanismo que avança quando o resultado é benéfico, mas trava e impede o retrocesso quando ocorre uma degradação. O experimento de Karpathy estabilizava três entidades: os parâmetros intocáveis (prepare.py), as instruções para a IA (program.md), e a área de mutação (train.py), tudo restrito a um orçamento de tempo rígido.29

No contexto do framework de SDD para aplicações generalistas de software, a estrutura é perfeitamente espelhada:

1. **Parâmetros Intocáveis:** A suíte de testes gerada a partir das especificações Gherkin atua como o avaliador imutável. A IA não possui permissão para afrouxar os critérios de aceitação com o objetivo de contornar erros. O orquestrador (ex: test-runner.sh) isola e garante a integridade da medição de sucesso.
2. **A Área de Mutação:** O arquivo ou módulo de implementação subjacente que a IA pode refatorar intensamente. Ela é livre para reescrever algoritmos, trocar estruturas de dados, implementar técnicas locais de memoização ou reordenar lógicas síncronas para operações paralelas.31
3. **Métrica de Avaliação:** Enquanto o projeto original utilizava val_bpb (validation bits per byte) independentemente do tamanho do vocabulário, o comando /optimize utiliza métricas de engenharia definidas no _prompt_ (ex: redução de latência de resposta a níveis p95, otimização do tamanho final do pacote gerado, redução de consultas N+1 a bancos de dados, ou aumento na eficiência do uso de memória).29
4. **Decisão Escalar:** O agente realiza a modificação, submete o código à suíte de testes com um orçamento de tempo fixo (_time budget_). Se o código passar na validação funcional e simultaneamente apresentar melhoria na métrica escalar estipulada, a IA consolida o avanço registrando o experimento no repositório. Caso a métrica degrade ou os testes falhem, o sistema executa um git reset HEAD\~1 destrutivo, apagando o ramo de falha e restaurando o estado imaculado antes de iniciar a próxima tentativa.29

Esse processo noturno automatizado viabiliza o teste exaustivo de centenas de variações de refatoração, descobrindo melhorias incrementais e gargalos de performance que estariam fora do alcance de um ciclo tradicional de revisão humana.29

## **Teste de Estresse e Mitigação de Falhas Sistêmicas**

Apesar da elegância arquitetural da integração desses paradigmas, a orquestração paralela de agentes autônomos introduz variáveis de risco que o framework deve endereçar em seu núcleo operacional. A análise de estresse revela os seguintes cenários de falha e suas correspondentes mitigações sistêmicas:

### **Colisões de Orquestração Concorrente**

O comando /implement do framework exige o uso de subagentes para paralelizar o trabalho, buscando melhor desempenho. Todavia, ecossistemas como o GitHub Copilot CLI, ao utilizar comandos como /fleet para despachar subagentes em paralelo, carecem de um mecanismo nativo de bloqueio de arquivos (_file locking_). Múltiplos agentes operam dentro do mesmo sistema de arquivos; se duas instâncias autônomas tentarem reescrever a mesma estrutura de configuração ou a base de utilitários simultaneamente, prevalecerá a edição do último agente a finalizar, sobrescrevendo perigosamente e silenciosamente o trabalho alheio.15

Para mitigar esta vulnerabilidade, o CLI deve instanciar padrões oriundos da biblioteca do SuperPowers. Empregará a habilidade de gerenciamento using-git-worktrees, provisionando espaços de trabalho Git completamente isolados para as trilhas de execução paralela antes da alocação das tarefas. Alternativamente, o CLI deve instruir a fase anterior de planejamento (/spec) a impor divisões arquiteturais severas, onde os artefatos atribuídos aos agentes jamais sofram interseção em árvores de dependência durante o ciclo de desenvolvimento.9

### **O Perigo do "Gaming the Metrics" (A Lei de Goodhart)**

Durante o processo noturno do /optimize, a IA opera de maneira implacável na busca do melhor resultado para a métrica escalar estipulada. Se o parâmetro avaliado for unicamente a velocidade de execução da função, a probabilidade da IA aplicar atalhos antiéticos — como remover o tratamento de exceções, pular validações de integridade estrutural, ou ignorar regras de auditoria estática para melhorar os tempos da operação em alguns milissegundos — é acentuadamente alta.34

A mitigação para essa síndrome, onde a otimização cega deturpa a funcionalidade, recai na obrigatoriedade dos cenários Gherkin e dos _hooks_ do ecossistema. O loop de _autoresearch_ não apenas submeterá as mudanças aos parâmetros de performance, mas dependerá da suíte de _Test-Driven Development_ implementada no passo anterior. O ciclo de aceitação garantirá que, para que um experimento seja preservado na linha de base (_baseline_), ele não deve quebrar nem contornar nenhum _assert_ rigoroso da bateria de testes, neutralizando a possibilidade de regressão funcional camuflada como otimização estrutural.35

## **Documento de Requisitos do Produto (PRD)**

A integração destas análises desdobra-se em um Documento de Requisitos do Produto projetado para nortear a engenharia da ferramenta, encapsulando metodologias densas em abstrações CLI eficientes.

### **Objetivos do Produto**

O framework deve ser um utilitário CLI em TypeScript, distribuído através do repositório NPM. Ele proverá o ambiente, as ferramentas (scripts Bash/_Node.js_ modulares) e a configuração dos _hooks_ de controle, tornando projetos legados (_brownfield_) totalmente receptivos a ciclos de engenharia disciplinada com Inteligência Artificial. Ele será capaz de orquestrar nativamente o OpenAI Codex CLI, Claude Code e GitHub Copilot CLI.

### **Requisitos Funcionais de Configuração e _Scaffolding_**

1. **Interrogatório e Instalação (Comando init):** O CLI, ao ser inicializado pela primeira vez no repositório, deve interrogar o usuário sobre qual plataforma de IA será o vetor de desenvolvimento primário. Com base na resposta, o framework aplicará os metadados de ciclo de vida apropriados em \~/.codex/config.toml (para Codex), .claude/settings.json (para Claude Code) ou .github/hooks/hooks.json (para Copilot).16
2. **Injeção de Ferramentas "No MCP":** O CLI injetará a suíte de ferramentas de performance (como os scripts eval.js, pick.js, screenshot.js de Mario Zechner) em uma pasta global (ex: \~/agent-tools/), registrando-as no caminho de execução e expondo um manifesto compacto de habilidades para os agentes, limitando drasticamente o consumo do orçamento de _tokens_ em relação à dependência de servidores complexos.14
3. **Distribuição Paramétrica de Contexto:** O CLI deve permitir o roteamento paramétrico do escopo do domínio através da propagação automatizada do arquivo AGENTS.md (ou o equivalente da plataforma). Este artefato será ancorado não apenas no nível raiz do projeto, mas inserido granularmente nos subdiretórios estratégicos, governando micro-comportamentos contextuais durante o processamento das tarefas.23
4. **Segurança _By Default_:** O utilitário configurará e travará os _hooks_ de eventos prévios à execução (como PreToolUse) injetando os _scripts_ desenvolvidos (adaptados do projeto de karanb192 e pchalasani) para salvaguardar variáveis de ambiente e recusar invocações de terminais nocivos, impedindo o modelo de desativar sua própria auditoria cibernética.16

### **Especificação do Workflow de Comandos SDD**

O CLI deve registrar na interface do agente quatro macros de execução de alto nível, mapeando a evolução do requisito ao laboratório noturno de _tuning_.

#### **1\. Comando /plan**

Este comando aciona a fase exploratória e estratégica.

- **Ação do Agente:** O modelo realiza investigações e pesquisas sobre o escopo funcional solicitado em relação à base de código legada ou atual (abordagem _brownfield_). Ele analisa as convenções pré-existentes, os padrões de arquitetura em uso e as limitações estruturais.4
- **Resultados Esperados:** A emissão de um arquivo plan.md profundamente detalhado. Este artefato conterá as premissas arquitetônicas, as decisões tomadas, as bibliotecas selecionadas e as referências aos arquivos originais pesquisados. O requisito primário é que o documento proporcione um rastreamento lógico transparente, permitindo que o engenheiro humano compreenda exatamente o porquê de cada deliberação técnica estabelecida.38

#### **2\. Comando /spec**

Este comando atua sobre os resultados do planejamento para formular a constituição comportamental do software.

- **Ação do Agente:** O modelo assimila o plan.md como base de referência e desdobra o desenho em abstrações puramente funcionais. Ele inspeciona as propostas em busca de componentes que possam ser delegados de maneira assíncrona, observando tudo o que é passível de paralelização algorítmica para a etapa de implementação.4
- **Resultados Esperados:** A geração de um ou mais arquivos spec.md, formulados rigorosamente sob a semântica de Gherkin (Dado / Quando / Então). O agrupamento destas _specs_ representará os testes de aceitação prontos, sem dubiedades, estabelecendo os cenários para o código que ainda não existe.3 Adicionalmente, as _delta specs_ gerenciarão as remoções e atualizações das intenções em projetos de vida longa.5

#### **3\. Comando /implement**

O núcleo executor da arquitetura, submetido aos construtos do TDD.

- **Ação do Agente:** A orquestração das plataformas é invocada para acionar subagentes paralelos (seja pelo uso dinâmico de instâncias iterativas do Codex, pela invocação estrutural da ferramenta Task do Claude, ou pelo envio de frotas através do /fleet do Copilot).15 O objetivo vital de instanciar subagentes em janelas de contexto independentes é maximizar o desempenho e mitigar a degradação de informações de tarefas pregressas.40
- **Mecânica de Imposição:** O comando acionará ativamente a integração de habilidades do repositório _SuperPowers_, exigindo a submissão aos princípios estritos de TDD.9 Os subagentes instanciados estarão travados em um ciclo Red-Green-Refactor: deverão traduzir o comportamento estipulado pelo spec.md em módulos de teste (ex: no formato Vitest). Apenas quando o teste falhar e sinalizar carência funcional, o agente será autorizado a utilizar o _array_ de ferramentas CLI disponíveis para inserir ou modificar a base do código até a solução dos testes propostos. Qualquer implementação não suportada por um teste equivalente recém-inserido deverá ser descartada e a iterada interrompida, retornando erros ao fluxo do agente.11

#### **4\. Comando /optimize**

Um laboratório contínuo de experimentação inspirada pelos avanços autônomos em engenharia estrutural.

- **Ação do Agente:** Este comando estabelece as balizas metodológicas do _autoresearch_ formulado por Andrej Karpathy para atuar sobre aplicações genéricas a partir das instruções provenientes do _prompt_ do usuário.29
- **Processamento da Otimização:** Com a fundação já implementada, validada em testes e operante (graças ao passo /implement), o modelo é deixado solto para submeter os módulos à prova. As mutações estruturais são efetuadas seguidas de execuções automatizadas nos parâmetros do usuário (como o _time budget_ de Karpathy traduzido para ciclos limitados de aferição da aplicação).29 A métrica definida de otimização servirá de filtro para aprovação. Através da execução ininterrupta da mecânica de "catraca" (_ratchet loop_), os refatoramentos algorítmicos empíricos são aprovados e mantidos por _commit_, e as falhas descartadas impiedosamente por meio de _reset_, esculpindo e depurando o software até o alcance do limite teórico de performance do escopo submetido sem requerer supervisão manual durante o labor.30

A convergência desses comandos sob um instalador e orquestrador via linha de comando TypeScript oferece um canal profissional robusto que encapsula anos de metodologias ágeis e padrões de IA experimentais em um formato altamente repetível, transformando processos orgânicos propensos a erros e ao declínio cognitivo das IAs em uma esteira de produção e desenvolvimento confiável, mensurável e veloz.

#### **Works cited**

1. OpenSpec Deep Dive: Spec-Driven Development Architecture & Practice in AI-Assisted Programming, accessed April 5, 2026, [https://redreamality.com/garden/notes/openspec-guide/](https://redreamality.com/garden/notes/openspec-guide/)
2. OpenSpec: Make AI Coding Assistants Follow a Spec, Not Just Guess, accessed April 5, 2026, [https://recca0120.github.io/en/2026/03/08/openspec-sdd/](https://recca0120.github.io/en/2026/03/08/openspec-sdd/)
3. How Specs Work in OpenSpec \- Rushi's, accessed April 5, 2026, [http://www.rushis.com/how-specs-work-in-openspec/](http://www.rushis.com/how-specs-work-in-openspec/)
4. Fission-AI/OpenSpec: Spec-driven development (SDD) for ... \- GitHub, accessed April 5, 2026, [https://github.com/Fission-AI/OpenSpec/](https://github.com/Fission-AI/OpenSpec/)
5. How to make AI follow your instructions more for free (OpenSpec) \- DEV Community, accessed April 5, 2026, [https://dev.to/webdeveloperhyper/how-to-make-ai-follow-your-instructions-more-for-free-openspec-2c85](https://dev.to/webdeveloperhyper/how-to-make-ai-follow-your-instructions-more-for-free-openspec-2c85)
6. openspec-sync-specs | Skills Marketp... \- LobeHub, accessed April 5, 2026, [https://lobehub.com/de/skills/foreztgump-massive-skill-openspec-sync-specs](https://lobehub.com/de/skills/foreztgump-massive-skill-openspec-sync-specs)
7. Stop Prompting, Start Managing. How I Built a Discipline System That… | by Israel Zablianov | Wix Engineering | Feb, 2026 | Medium, accessed April 5, 2026, [https://medium.com/wix-engineering/stop-prompting-start-managing-9eac9426930f](https://medium.com/wix-engineering/stop-prompting-start-managing-9eac9426930f)
8. claw-superpowers \- ClawHub, accessed April 5, 2026, [https://clawhub.ai/cutd/claw-superpowers](https://clawhub.ai/cutd/claw-superpowers)
9. obra/superpowers: An agentic skills framework & software ... \- GitHub, accessed April 5, 2026, [https://github.com/obra/superpowers](https://github.com/obra/superpowers)
10. Creating Skills \- Superpowers \- Mintlify, accessed April 5, 2026, [https://mintlify.com/obra/superpowers/development/creating-skills](https://mintlify.com/obra/superpowers/development/creating-skills)
11. tdd-workflow | Skills Marketplace \- LobeHub, accessed April 5, 2026, [https://lobehub.com/skills/anthemflynn-ccmp-tdd-workflow](https://lobehub.com/skills/anthemflynn-ccmp-tdd-workflow)
12. TDD Red-Green-Refactor Claude Code Skill | AI Testing \- MCP Market, accessed April 5, 2026, [https://mcpmarket.com/tools/skills/tdd-red-green-refactor](https://mcpmarket.com/tools/skills/tdd-red-green-refactor)
13. bdd-test-implementation | Skills Mar... \- LobeHub, accessed April 5, 2026, [https://lobehub.com/nl/skills/creatifcoding-gbg-bdd-test-implementation](https://lobehub.com/nl/skills/creatifcoding-gbg-bdd-test-implementation)
14. What if you don't need MCP at all? \- { Mario Zechner }, accessed April 5, 2026, [https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)
15. Run multiple agents at once with /fleet in Copilot CLI \- The GitHub Blog, accessed April 5, 2026, [https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/)
16. karanb192/claude-code-hooks: A growing collection of ... \- GitHub, accessed April 5, 2026, [https://github.com/karanb192/claude-code-hooks](https://github.com/karanb192/claude-code-hooks)
17. Automate workflows with hooks \- Claude Code Docs, accessed April 5, 2026, [https://code.claude.com/docs/en/hooks-guide](https://code.claude.com/docs/en/hooks-guide)
18. Create custom subagents \- Claude Code Docs, accessed April 5, 2026, [https://code.claude.com/docs/en/sub-agents](https://code.claude.com/docs/en/sub-agents)
19. Implementing the Orchestrator Pattern with GitHub Copilot Subagents \- Zenn, accessed April 5, 2026, [https://zenn.dev/openjny/articles/e11450f61d067f?locale=en](https://zenn.dev/openjny/articles/e11450f61d067f?locale=en)
20. Using hooks with GitHub Copilot CLI, accessed April 5, 2026, [https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-hooks](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-hooks)
21. About hooks \- GitHub Docs, accessed April 5, 2026, [https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-hooks](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-hooks)
22. Config basics – Codex | OpenAI Developers, accessed April 5, 2026, [https://developers.openai.com/codex/config-basic](https://developers.openai.com/codex/config-basic)
23. claude-code-with-codex.md \- GitHub, accessed April 5, 2026, [https://github.com/shakacode/claude-code-commands-skills-agents/blob/main/docs/claude-code-with-codex.md](https://github.com/shakacode/claude-code-commands-skills-agents/blob/main/docs/claude-code-with-codex.md)
24. Hooks – Codex \- OpenAI Developers, accessed April 5, 2026, [https://developers.openai.com/codex/hooks](https://developers.openai.com/codex/hooks)
25. Skills in OpenAI Codex \- Massively Parallel Procrastination, accessed April 5, 2026, [https://blog.fsck.com/2025/12/19/codex-skills/](https://blog.fsck.com/2025/12/19/codex-skills/)
26. Best Practices | Spec-Driven Development, accessed April 5, 2026, [https://intent-driven.dev/knowledge/best-practices/](https://intent-driven.dev/knowledge/best-practices/)
27. accessed April 5, 2026, [https://en.wikipedia.org/wiki/Hook](https://en.wikipedia.org/wiki/Hook)
28. Cursor (Windows): hooks-cursor.json should use run-hook.cmd for session-start · Issue \#871 · obra/superpowers \- GitHub, accessed April 5, 2026, [https://github.com/obra/superpowers/issues/871](https://github.com/obra/superpowers/issues/871)
29. karpathy/autoresearch: AI agents running research on ... \- GitHub, accessed April 5, 2026, [https://github.com/karpathy/autoresearch](https://github.com/karpathy/autoresearch)
30. Autoresearch: Karpathy's Minimal “Agent Loop” for Autonomous LLM Experimentation \- Kingy AI, accessed April 5, 2026, [https://kingy.ai/ai/autoresearch-karpathys-minimal-agent-loop-for-autonomous-llm-experimentation/](https://kingy.ai/ai/autoresearch-karpathys-minimal-agent-loop-for-autonomous-llm-experimentation/)
31. AutoResearch vs Classical Hyperparameter Tuning \- Weco AI, accessed April 5, 2026, [https://www.weco.ai/blog/autoresearch-vs-classical-hpo](https://www.weco.ai/blog/autoresearch-vs-classical-hpo)
32. Andrej Karpathy's 630-line Python script ran 50 experiments overnight without any human input \- The New Stack, accessed April 5, 2026, [https://thenewstack.io/karpathy-autonomous-experiment-loop/](https://thenewstack.io/karpathy-autonomous-experiment-loop/)
33. A Guide to Andrej Karpathy's AutoResearch: Automating ML with AI Agents | DataCamp, accessed April 5, 2026, [https://www.datacamp.com/tutorial/guide-to-autoresearch](https://www.datacamp.com/tutorial/guide-to-autoresearch)
34. Autoresearch: 700 Experiments While You Sleep \- Emergent Minds | paddo.dev, accessed April 5, 2026, [https://paddo.dev/blog/autoresearch-overnight-lab/](https://paddo.dev/blog/autoresearch-overnight-lab/)
35. What Is Andrej Karpathy's AutoResearch Pattern and How to Apply It to Marketing, accessed April 5, 2026, [https://www.mindstudio.ai/blog/karpathy-autoresearch-pattern-marketing-automation](https://www.mindstudio.ai/blog/karpathy-autoresearch-pattern-marketing-automation)
36. Getting Started with OpenAI Codex CLI: AI-Powered Code ..., accessed April 5, 2026, [https://dev.to/deployhq/getting-started-with-openai-codex-cli-ai-powered-code-generation-from-your-terminal-5hm8](https://dev.to/deployhq/getting-started-with-openai-codex-cli-ai-powered-code-generation-from-your-terminal-5hm8)
37. Claude Code Hooks: Automate Your AI Coding Workflow \- Kyle Redelinghuys, accessed April 5, 2026, [https://www.ksred.com/claude-code-hooks-a-complete-guide-to-automating-your-ai-coding-workflow/](https://www.ksred.com/claude-code-hooks-a-complete-guide-to-automating-your-ai-coding-workflow/)
38. Spec-driven development with AI: Get started with a new open source toolkit \- The GitHub Blog, accessed April 5, 2026, [https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
39. Coding with AI? Then You'd Better Document Like It \- HackerNoon, accessed April 5, 2026, [https://hackernoon.com/coding-with-ai-then-youd-better-document-like-it](https://hackernoon.com/coding-with-ai-then-youd-better-document-like-it)
40. Claude Code Agents: Engineering Autonomous AI Assistants, accessed April 5, 2026, [https://claudefa.st/blog/guide/agents/agent-fundamentals](https://claudefa.st/blog/guide/agents/agent-fundamentals)
41. Autoresearch: How AI is Autonomously Optimizing Its Own Training Code \- Buttondown, accessed April 5, 2026, [https://buttondown.com/verified/archive/autoresearch-how-ai-is-autonomously-optimizing/](https://buttondown.com/verified/archive/autoresearch-how-ai-is-autonomously-optimizing/)
