# Handoff para Claude — direção de criação do Instagram da Kombú

Atualizado em **03/11/2026**, horário de Manaus (UTC−4). Base do projeto: `/Users/armaandaswani/Desktop/Kombucha/Kombu New Site`. Todos os caminhos abaixo são relativos a `marketing/instagram/`, salvo indicação diferente.

**Claude assume direção criativa; Codex mantém integração e operação do publicador.** Este arquivo registra o estado observado, decisões do dono e limites. Não autoriza republicar históricos, liberar a voz privada ou colocar propostas na fila sem o fluxo descrito no item 9.

Leitura inicial: este arquivo → `.agents/social-media-context-sms.md` (priorizar correções recentes) → `assets/brand/LEIA-ME.md` → `research/2026-11-02-vih/LEITURA-EDITORIAL.md` → artes **V2** dessa pasta. Textos antigos dos READMEs podem conflitar com correções posteriores; não os usar isoladamente como briefing atual.

## 1. O que está no ar e como é publicado

### Calendários e infraestrutura ativos

| Arquivo | Função e estado |
|---|---|
| `calendar.json` | 21 posts estáticos em ordem. A fila não usa a data do nome de arquivo: publica o próximo ID sem chave `published:<id>`, respeitando o intervalo. Cinco IDs já registrados como publicados. |
| `stories-calendar.json` | Cinco Stories por data local. Contém **28/10 a 03/11**, sete dias. Todos os lotes estão concluídos no KV. **Ainda não existe lote de 04/11 ou posterior.** |
| `reels-calendar.json` | Um Reel comercial aprovado: `22-rosas-cardamomo-filme`, já publicado. Não contém as prévias Pera & Alecrim. |
| `worker/index.mjs`, `worker/stories.mjs`, `worker/reels.mjs` | Publicador Cloudflare `kombu-instagram`, sem endpoint público de publicação. Feed e Reels usam calendários embutidos no deploy do Worker; Stories buscam o manifesto público do Pages. |
| `out/` | Exportações canônicas. Não é a fonte de aprovação. |
| `.render/publish/` | Pacote preparado por `prepare-publish.mjs`, destinado ao Cloudflare Pages `kombu-social`. |

**Feed, Stories e Reels saem automaticamente pela API da Meta, pelo Worker. Não são manuais.** A conexão e a elegibilidade Business foram comprovadas por publicações reais; não apenas pela existência de configuração. Nesta auditoria executei `wrangler whoami` antes de ler chaves seguras. Não li tokens, não fiz chamada manual à API da Meta e não publiquei nada.

Horários autorizados: Stories às **07:00, 07:05, 07:10, 07:15, 07:20**; feed/Reels às **09:00**, aproximadamente a cada dois dias. Reels têm prioridade sobre o próximo estático quando há um Reel novo liberado. O intervalo real segue `last`; o código tem tolerância de oito horas (`everyDays * 24 - 8`), mas a janela das 09:00 continua obrigatória. Há preparação de Reel às 08:50/08:55 e recuperação de Stories pendentes às 07:25–07:55. **Nunca publicar à tarde/noite para compensar falhas.** O relógio real também bloqueia publicações fora da manhã.

A automação do Codex faz preparação às 06:30 e verificações às 07:30 e 09:30. A publicação não depende de manter o navegador aberto; a preparação de novas artes depende do ambiente local. Não alterar crons, segredos ou bindings para trabalho criativo.

### Feed publicado — leitura remota em 03/11

| ID | Data/hora em Manaus | Evidência |
|---|---|---|
| `01-a-arte-do-natural` | 24/10, 15:13 | KV `published`, media `18008412065792725`. |
| `02-maracuja` | 26/10, 12:30 | KV `published`, media `18078043415459303`. |
| `21-dolce-vita-fotos` | Registro: 27/10, 21:55 | **Publicado manualmente e informado pelo dono**; KV com `byHand` e `reportedByOwner`, sem media ID. Não tratar como confirmação independente da Meta nesta auditoria. |
| `03-divina-terra` | 29/10, 18:30 | KV `published`, media `18113395934239204`. Horário histórico anterior à mudança para manhã. |
| `22-rosas-cardamomo-filme` | 01/11, 09:00:56; confirmado 09:01:21 | Reel, media `18133700947799339`; estados reel/published e log concordantes. |
| `04-fermentacao` | 03/11, 09:01:21 | Media `17995219995050370`; `last`, `published` e log concordantes. |

Os outros 16 IDs estáticos (`05` até `20`) não têm chave de publicação na consulta. Próximo estático: **`05-frutas-vermelhas`**, com previsão de **05/11 às 09:00**, se não houver novo post manual, Reel liberado ou mudança na fila. Isto é uma previsão, não compromisso já executado.

`publishedAt` no JSON local está incompleto: `04-fermentacao`, por exemplo, foi confirmado remotamente sem esse campo local. **KV/log são a referência de execução.** O publicador verifica também legendas iguais nas últimas 25 mídias para evitar duplicação de post manual; não é um inventário completo da conta.

### Stories publicados

Chaves `stories:done:<data>` registram cinco por dia:

| Data | Conclusão em Manaus | Observação |
|---|---|---|
| 28/10 | 10:20 | Exceção autorizada da primeira sequência. |
| 29/10 | 07:20 | Sequência completa. |
| 30/10 | 09:11 | Recuperação e três substituições sem contador autorizadas; duas peças preservadas. Não apagar/republicar novamente. |
| 31/10 | 07:21 | Cinco IDs registrados. |
| 01/11 | 07:21 | Cinco IDs registrados. |
| 02/11 | 07:21 | Cinco IDs e log confirmados na preparação de 03/11. |
| 03/11 | 07:21 | Done, saúde completa, cinco estados individuais e log confirmados. |

Isso soma **35 posições diárias concluídas**, não 35 Stories simultaneamente visíveis: Stories expiram e 30/10 teve exclusões/substituições. Os IDs atuais de cada dia estão no calendário. Evidência segura desta auditoria: `research/handoff-claude-2026-11-03/publication-state-safe.json`; hoje também foi conferido com `node check-stories.mjs 2026-11-03` na execução anterior deste chat.

**Atenção operacional:** o calendário de Stories acaba em 03/11. Codex precisa preparar 04/11 em diante; não há reserva futura já pronta. Claude não deve presumir que uma proposta em sua pasta entra nesse manifesto sozinha.

## 2. Vídeo: ferramentas, aprovação e material real

### Fluxos realmente implementados

| Fluxo | Ferramentas e limites |
|---|---|
| Estúdio inicial / `scripts/render.mjs` | HyperFrames renderiza HTML/GSAP para vídeo base; Remotion monta áudio e captions. Three.js/Anime.js eram usados no cenário 2.5D/CGI inicial. **Esse resultado CGI foi rejeitado para o filme realista.** |
| Filme realista v6 | Imagens-base novas via ferramenta de imagem do ChatGPT; movimento via **LTX-2.3 local/MLX**, não filmagem real. `scripts/compose-v6.mjs` + **Remotion** (`src/MontageFilm.jsx`) fazem montagem; FFmpeg faz mistura e exportação. Esse render não passa pelo HTML do HyperFrames. |
| Pera & Alecrim | LTX para os takes gerados; `scripts/compose-cold-water.mjs` + Remotion (`src/ColdWaterFilm.jsx`) e FFmpeg para montagem/exportação. `uniqueTakes` bloqueia repetição de fontes. |
| Voz e legendas | Chatterbox multilíngue local como opção de voz padrão; HumanVoice/Rayssa Original para prévia privada; faster-whisper para transcrição e SRT. |
| OpenCut | Parser SRT do OpenCut Classic e pacote de mídias para edição. **Não é um editor OpenCut incorporado nem projeto nativo de timeline.** |

Detalhes técnicos: `video-studio/package.json`, `video-studio/README.md`, scripts e JSX acima. A documentação registra Remotion gratuito no contexto informado pelo dono (até três pessoas); não tomar isso como auditoria atual de todas as licenças. A demonstração Hugging Face foi tentada, mas os resultados realistas finais documentados usam o motor local. Não é necessário contratar outro gerador para abrir o projeto atual.

### O que foi aprovado

- **Aprovado para publicação:** storyboard `video-studio/STORYBOARD-v6.md`, com a montagem específica de Rosas & Cardamomo, 21 s, oito planos/seis setups. Export comercial exato: `video-studio/output/realistic-v6/Kombu-Filme-v6-Sem-Locucao.mp4`. Fonte de liberação efetiva: `reels-calendar.json` com `approvedAt`, checksum e `voice: none`; já publicado em 01/11.
- **Privado:** `Kombu-Filme-Rayssa-v6-Previa-Privada.mp4`. O dono pediu Rayssa Original (`rayssa`, não `rayssa2`), mas o motor instalado informa uso não comercial. A aprovação criativa não libera essa narração para o Instagram comercial. Não copiar credenciais do HumanVoice.
- **Ainda sem liberação de fila:** `STORYBOARD-pera-ice-v1.md`, `v2.md`, `v3.md` e respectivos MP4s. V3: quatro takes únicos, 9,5 s. O dono pediu variação e depois proibiu repetir take; não houve pedido posterior para agendar a v3.
- **Regra posterior que vale para novos filmes:** cada corte deve usar um take diferente, sem retornar à fonte com zoom, recorte ou outro trecho. A v6 já aprovada/publicada tem retornos; não alterá-la retroativamente para fingir que obedecia à regra posterior.

`projects/realistic-v6.json` ainda diz `approved: false` e `NOTE-v6.md` diz que não foi publicado: são registros anteriores à liberação. **Não são a fonte do estado comercial atual.** Usar calendário + KV/log para esse estado.

### Filmagens reais existentes

- Arquivo real já usado tecnicamente na versão sensorial antiga: `/Users/armaandaswani/Desktop/Kombucha/KB Rosas Closeup.mov` — 19,458 s, vertical 2160×3840, áudio presente (FFprobe nesta auditoria). O trecho de servir a partir de 5,5 s é referenciado em `video-studio/scripts/render.mjs`; a v2 o recortava para preservar sabor e ocultar embalagem antiga.
- Acervo local: `/Users/armaandaswani/Desktop/Kombucha/Kombucha Videos/`. Inventário de nomes encontrou **48 arquivos de vídeo**: RAW 29, Used 5, Capcut Edited 4, Music 4, Kombútequila 6. Não assisti a todos nesta auditoria.
- Exemplos de fontes a revisar: `RAW/Flor azul Pour/IMG_2353 4.MOV`, `RAW/Frutas Vermelhas Pour/IMG_2301 4.MOV`, `RAW/Used/Pour Rosas/IMG_2243 4.MOV`, gravações IMG_* em Used e os diretórios de preparo/drinks.
- O acervo mistura gravações próprias, edições, gravações de tela de música e arquivos stock Mixkit. **Estar na pasta não equivale a liberação de uso.** Os títulos de vídeos antigos sobre açúcar/saúde também não tornam essas alegações autorizadas.
- Para o filme que começou em 29/10, o dono pediu **criar o cenário e o servir do zero**, sem reaproveitar o Instagram antigo. A existência do acervo real não revoga esse pedido específico. Para outra peça, propor os trechos ao dono antes de tratar como material criativo aprovado.

Os takes em `video-studio/output/realistic-v*/` e `public/generated/` são gerados, não captação real. `assets/audio/CREDITS.md` do estúdio identifica trilha original e foley CC0; o foley não foi gravado junto à cena.

## 3. Concorrentes acompanhados e atualização

Além de **@vihkombucha**, o dono forneceu: **@taokombucha, @kriakombucha, @bakombucha, @dr.kombu.kombucha, @podkombucha e @khappykombucha**.

Há pesquisa pontual, **não monitoramento contínuo**. Última coleta estruturada encontrada: **27/10/2026** via Apify, sete perfis, 237 registros de feed +118 de Reels, consolidados em 257 publicações distintas após deduplicação/recorte. A janela começa em 30/04/2026 e tem limites por conta; não é histórico completo.

Arquivos em `research/2026-10-27/`:
- `accounts.md`, `profiles-input.json`, `posts-input.json`, `reels-input.json`: escopo.
- `profiles-raw.json`, `posts-raw.json`, `reels-raw.json`: respostas coletadas.
- `rankings.json`, `rankings.csv`, `report.md`: tratamento e leitura comparativa.
- `frames/`, `frame-observations.json`, `frame-index.json`: amostra visual local de oito vídeos, quatro quadros por vídeo. Sem análise integral de ritmo/áudio. O Gemini não concluiu a inspeção dos vídeos; não afirmar que concluiu.
- `runs.json` e demais arquivos de execução: rastreabilidade. O orçamento gratuito descrito é **da coleta**, não saldo atualizado hoje. Não reler credenciais ou rodar `collect.py` só para abrir a pesquisa.

Em **02/11**, houve aprofundamento de Vih: 40 legendas da coleta anterior e inspeção visual de 24 publicações no navegador. Arquivos: `research/2026-11-02-vih/LEITURA-EDITORIAL.md`, `amostra-vih.json`, `PLANO-12-POSTS.md` e `posts.json`. Os contadores antigos não foram atualizados por essa inspeção. As 20 referências adicionais enviadas pelo dono estão em `video-studio/references/2026-10-28/links.json` e `LEITURA-VISUAL.md`.

**Cadência de atualização: nenhuma agendada.** Não dizer que acompanhamos semanalmente ou diariamente. Emular presença humana, produto em contexto, materialidade e ocasião; não copiar mídia, identidade ou legendas. A pesquisa antiga sugere linguagem familiar/saúde em alguns trechos; isso foi superado pelas correções do dono.

## 4. Rejeições, correções e aprovações do dono

Esta é a lista consolidada dos registros disponíveis neste chat e contexto local; não é alegação de acesso a todas as conversas do dono com outras ferramentas.

| O que foi recusado/corrigido | Por quê / direção válida |
|---|---|
| Texto como “A flor dá cor. O blueberry traz sabor...” | Robótico e desconexo. Desenvolver uma ideia em frases que se completam. |
| Mirtilo/Blueberry três vezes e maracujá duas numa sequência curta | Pouca alternância. Variar protagonistas, famílias de cor, assuntos e cenas. |
| Apenas escrever um título em cima da foto | Arte pouco trabalhada. Quer criação visual com IA, luz/cenário/composição e marca oficial. |
| Comunicação “feita pela nossa família” | Passa amadorismo para o dono. Ver item 5. |
| Nome “Vitalidade” | Sabor inexistente; nome correto **Imunidade**, sem prometer efeito imunológico. |
| Divulgar variedade da base | Receita confidencial. Ver item 5. |
| Final desbotado e captions em caixas verdes do primeiro vídeo | Preservar cores; legendas discretas e legíveis, sem tarja pesada. |
| v3 `created-pour` com aparência CGI | Quer aparência de filmagem: materiais, líquido, mão e condensação naturais. |
| Reaproveitar servir antigo do Instagram naquele filme | Pediu cenário e ação criados do zero. |
| Rótulo orientado incorretamente no servir | Manter orientação coerente com garrafa/gargalo; não deformar texto ou produto. |
| v4 de cinco segundos | Curta e sem voz, ângulos e takes suficientes. |
| Pera & Alecrim v1 pouco variada; v2 retornando a takes | Cada corte usa fonte diferente, uma única vez. Recortar/zoomer não cria take novo. |
| Stories com “1 de 5”, “2 de 5”, “3/5” | Nunca numeração visível de lote. Substituição de três em 30/10 foi excepcionalmente autorizada. |
| “Você cria conteúdo?” / “Cria conteúdo?” | Ambíguo para o dono. Para afiliados: **“Você é influenciador em Manaus?”** |
| Área de parceria só para influenciadores | Incluir nutricionistas, nutrólogos, personal trainers e outras propostas; não reduzir todos a afiliados. |
| Logo errada/reconstruída | Usar arquivo de marca, não uma letra digitada. Depois do manual: assinatura atual/botânico; K circular só ícone digital. |
| Publicações à tarde/noite | Dono relata engajamento ruim. Manhã apenas, inclusive recuperação. |
| Primeira campanha B2B de 02/11 (“V1”) | Repetição extrema de layout e garrafa Lavanda & Limão deformada pela IA. Codex errou ao aprová-la. Essa V1 **não é** a mesma versão que o v1 do vídeo. |
| Redesenhar a embalagem em cena gerada | Na revisão atual, cenário gerado e garrafa oficial aplicada separadamente, preservando proporção/tampa/base/rótulo. Não confiar só no prompt “preserve o produto”. |

### Aprovações e preferências registradas

- Carrosséis de feed e cinco Stories diferentes por dia; novos formatos também são desejados.
- Três lifestyle v3 em `assets/lifestyle/`, aprovadas em 27/10, com pessoas fictícias.
- Estética ilustrada de criadora em Manaus, **ocasionalmente**; não como modelo único nem depoimento.
- Artes Dolce Vita aprovadas e pedido explícito de colocação do feed na programação; o dono informou depois que já publicou esse carrossel.
- Filme v6: **“Excelente. Coloque no pipeline.”**, em 30/10. Export comercial sem locução já publicado.
- Rayssa Original escolhida para prévia; isso não resolve o limite comercial do motor.
- Campanhas B2B **V2**: após refazer quatro cenas/composições e preservar as garrafas, o dono respondeu **“Bem melhor”**. Isso confirma a melhora/direção visual, **não houve instrução para agendar essas quatro campanhas**. O texto antigo “aguarda avaliação” deve ser lido como “avaliada positivamente, sem pedido de inclusão na fila”.
- O dono quer colaboração com Claude como diretor de criação; este handoff atende esse pedido.

Distinção: a afirmação “única marca artesanal premium de Manaus/do Norte” foi proposta pelo dono, **não rejeitada por ele**. A restrição de publicar essa comparação sem evidência atual é uma cautela editorial, não um fato de mercado comprovado. Não inventar que foi verificada.

## 5. Regras: posicionamento familiar e formulação confidencial

**Posicionamento familiar** é usar parentesco/domesticidade como argumento de valor da marca: “feita pela nossa família”, “nossa família”, “produção familiar”, “receita de família”, equivalentes e histórias com esse foco. O dono considera isso amador. A restrição não proíbe mostrar pessoas trabalhando: o foco pode ser produção artesanal, cuidado, ingredientes e contexto real. Não tentar contornar com sinônimos que transmitam o mesmo enquadramento.

**Confidencialidade expressamente declarada pelo dono:** a variedade/tipo de chá da base. Não repito aqui o nome que ele proibiu divulgar. Não colocar em legenda, arte, prompt público, roteiro, FAQ ou descrição de produção.

**Outros detalhes internos:** proporções, procedimento exato, parâmetros, fornecedores e especificações de formulação que apareçam em material privado não estão automaticamente liberados. Não há neste handoff uma lista de segredos adicionais explicitamente ratificada pelo dono; tratar esses detalhes como não autorizados para divulgação até confirmação.

**Fatos de comunicação já usados/autorizados:** kombucha/bebida fermentada; produção artesanal premium em Manaus; fermentação natural; gás formado na fermentação; ingredientes e nomes oficiais de sabores (frutas, flores, ervas e especiarias). Explicar a categoria não exige ensinar a receita. Imunidade é nome de sabor, não benefício.

Sem alegações de cura, prevenção, emagrecimento, detox, intestino/probiótico ou ganho de desempenho. Sem preços, estoque específico de parceiro, testemunhos inventados ou porcentagens novas. Palavra preferida nas correções antigas: **gás**, evitando transformar “bolhas” em slogan. Há históricos com divergências; não reproduzi-los como nova regra.

O manual permanece **local e privado** em `/Users/armaandaswani/Desktop/Kombucha/Manual da Marca Kombú.pdf`. Não copiar para Pages ou arte pública. Não é uma lista de tarefas autorizadas. Instruções diretas recentes do dono prevalecem sobre trechos antigos do manual.

## 6. Fontes dos fatos centrais

| Fato | Fonte e grau de confirmação |
|---|---|
| “Produzida em Manaus desde 2017” | `.agents/social-media-context-sms.md`, seção Voice Profile/Source Set, atribui **produção artesanal em Manaus desde 2017 ao brief do dono**. O manual fornecido pelo dono situa o início da bebida em 2017 e a formalização da marca em 2025; conferi apenas o trecho de data localmente. Não é uma pesquisa externa nem prova de CNPJ/empresa fundada em 2017. A frase foi usada nos materiais revisados e no filme aprovado. Não localizei nesta auditoria uma mensagem primária datada com “confirmo 2017”; não fabricar essa citação. |
| “Suave ao beber e com sabor intenso” | **Confirmação direta do dono neste chat:** “Somos diferentes de todas as outras kombuchas, a nossa é suave e o sabor é intenso.” A parte sensorial está confirmada; a comparação absoluta com todas as concorrentes não foi demonstrada. Também consta da correção de posicionamento de 27/10 no contexto local. |
| Gás da própria fermentação | Brief/contexto, rótulos e roteiros revisados/aprovados. Fato de marca para comunicação; não fiz auditoria laboratorial do processo. |

Portanto: a origem em 2017 está registrada como informação fornecida pelo titular e em seu manual; a suavidade/sabor intenso têm também declaração literal no chat. Não apresentar nenhum dos dois como resultado de ensaio independente.

## 7. Fotos e cenas disponíveis

| Acervo | Natureza e aprovação |
|---|---|
| `assets/bottles/*.webp` | 12 embalagens oficiais. Fonte de produto, com nomes/cor/proporção preservados. Há cópias no `assets/bottles/` da raiz do site; usar os arquivos, sem redesenhar. |
| `assets/lifestyle/yoga-500ml.png` | Cena sintética aprovada em 27/10; Flor Fada Azul & Blueberry. |
| `assets/lifestyle/tenis-500ml.png` | Cena sintética aprovada; Goiaba. |
| `assets/lifestyle/corrida-500ml.png` | Cena sintética aprovada; Maracujá. |
| `assets/partners/dolce-vita-original.jpg` e originais IMG_7015/7017/7018.JPG em Downloads | Fotografias **reais do dono** na Gelateria Dolce Vita. O dono identificou a parceria e pediu uso em carrossel/Stories. Há cópias em `research/2026-10-27/dolce-vita-fotos/input-*.jpg`. |
| `assets/partners/dolce-feed-*`, `dolce-story-*` | Artes derivadas/compostas a partir das fotos; cenários editoriais recriados não documentam o interior real. Históricos têm K/versões antigas e um slide revisto; não republicar automaticamente. |
| `/Users/armaandaswani/Downloads/IMG_6992.JPG`, `IMG_6995.JPG` | Fotos reais fornecidas pelo dono, com homem segurando/bebendo Kombú; arquivos presentes. Não são as imagens de yoga/tênis/corrida. Não há registro aqui de uma campanha nova final aprovada com esses retratos. |
| `research/2026-11-02-vih/sources/cena-*.png` | Quatro cenários **novos gerados no ChatGPT** na V2: café, empório, lavanda e conversa ao ar livre. Direção avaliada positivamente (“Bem melhor”), sem agendamento. Pessoas/estabelecimentos são fictícios. |
| `research/2026-11-02-vih/sources/*.webp` | Fotografias oficiais aplicadas à V2; `verificacao-embalagens-v2.json` confirma cópias binárias iguais à origem. |
| `assets/brand/` | Assinaturas atuais e símbolo botânico. `LEIA-ME.md` e `sources.json` documentam origens. K circular reservado a ícone. Versões V4/V.3 com KOMBUCHA são históricas. |

Existem registros reais de produto na parceira Dolce Vita e retratos reais fornecidos; não os classifiquei como sessão profissional dirigida. **Não há evidência neste acervo revisado de sessão profissional aprovada com nutricionistas, nutrólogos ou personal trainers reais.** Não transformar personagens sintéticos em profissionais parceiros ou depoimentos. Não afirmar estoque de um sabor na gelateria só porque está na foto.

## 8. Métricas da própria Kombú

**Não encontrei relatório consolidado de Insights da Kombú** com alcance, salvamentos, retenção, visitas, cliques ou desempenho por conteúdo. O Worker guarda IDs, horários e execução; isso comprova publicação, não engajamento. Seus pedidos de mídia recente usam `id,caption,timestamp`, não métricas de desempenho.

Também não há, no fluxo atual auditado, uma série consolidada de curtidas/comentários da própria Kombú. Portanto não é correto dizer “temos só curtidas”: o que existe de forma estruturada aqui é principalmente **métrica dos concorrentes**, incluindo curtidas, comentários e algumas visualizações/reproduções. Esses dados não medem o resultado dos nossos posts.

Sem consulta autorizada aos Insights ou export fornecido pelo dono, não atribuir melhora de engajamento às artes, não prometer desempenho e não afirmar que a referência Vih é viral. A mediana de curtidas da amostra de imagens Vih era sete, volume pequeno. O dono relatou pior engajamento à tarde/noite; isso é observação do titular, não experimento quantitativo disponível.

## 9. Aprovação: fluxo humano versus código

**Decisão editorial:** novas campanhas/conceitos são apresentados ao dono antes de colocação na fila. “Gostei/Bem melhor” sobre uma direção não deve ser interpretado como autorização automática de agendamento de todos os arquivos. As quatro campanhas V2 não estão nos calendários ativos. Os 12 textos de `research/2026-11-02-vih/posts.json` são rascunhos.

**Exceção já autorizada:** os cinco Stories diários têm autorização permanente para Codex preparar/revisar e disponibilizar ao Worker dentro das regras. Não dependem de uma pergunta de aprovação todos os dias. Isso não libera substituir Story já publicado nem usar qualquer rascunho de campanha sem avaliar contexto/decisão do dono.

**O código não possui uma caixa de aprovação geral:**
- Feed estático: incluir em `calendar.json`, renderizar/publicar os assets e implantar o calendário no Worker torna a entrada elegível automaticamente quando chegar sua vez. Não existe `approvedByOwner` obrigatório para todos os estáticos.
- Stories: colocar a data no manifesto do Pages com cinco imagens disponíveis torna o lote elegível na manhã da data. Não há revisão humana dentro do Worker.
- Reels: há bloqueio técnico por `approvedAt`, `voice: none` e checksum no preparo. Esses campos são metadados editáveis; não substituem consentimento real do dono.
- Salvar arquivos em `claude-propostas/`, criar um storyboard ou renderizar no `video-studio` **não agenda nem publica**.

Claude entrega conceito, roteiro, arte/prompt, origem do produto e status. Após aprovação aplicável, Codex faz validação de marca, render final, pacote, implantação e conferência segura. Não chamar a API manualmente nem repetir estados de publicação incertos.

## 10. Divisão de trabalho e prevenção de conflito

**Nesta solicitação**, Codex editou somente:
- `HANDOFF-CLAUDE.md` — este documento.
- `research/handoff-claude-2026-11-03/publication-state-safe.json` — snapshot de chaves seguras, sem tokens.

Não estou editando site, artes, calendários, renderizadores ou scripts do estúdio durante este handoff. A última preparação de Stories foi commit `5a2f010`; a base também inclui alterações de pré-contato do site feitas em outros trabalhos, até `7e48fd5`. Não desfazer essas alterações. Há vários arquivos de pesquisa/preview não rastreados; não tratá-los como lixo nem executar limpeza global.

### Áreas de responsabilidade a partir daqui

| Responsável | Área |
|---|---|
| Claude | `claude-propostas/`: direção, críticas, conceitos, roteiros, prompts, referências e artes novas para revisão. Usar subpastas por data/campanha e arquivos próprios. Pode ler o acervo, sem sobrescrever originais. |
| Codex | `calendar.json`, `stories-calendar.json`, `reels-calendar.json`, `render*.mjs`, `prepare*.mjs`, `out/`, `.render/`, `worker/` e deploys. A automação diária pode atuar nessas pastas mesmo sem conversa manual aberta. Próxima responsabilidade: lote de Stories de 04/11. |
| Compartilhado, com coordenação explícita | `video-studio/projects/`, `video-studio/src/`, `video-studio/scripts/`, contexto editorial e ativos de marca. Definir arquivo/versão antes de editar simultaneamente. O estúdio tem trava para produção pesada; não rodar dois renders pesados concorrentes. |
| Dono | Aprovação de campanha, condições comerciais, autorizações específicas sobre substituição de conteúdo publicado e novos fatos. |

Convenção recomendada para uma proposta Claude: `claude-propostas/AAAA-MM-DD-nome/BRIEF.md`, `COPY.md`, `STORYBOARD.md` (se vídeo), `PROMPTS.md`, `assets/`, `preview/` e `STATUS.md`. Registrar fontes, o que é gerado, o que é fotografia real e o que falta aprovar. Não é um mecanismo automático já instalado; é organização de trabalho.

**Não tocar sem coordenação:** segredos, credenciais, KV, crons, voz privada, arquivos já publicados e qualquer versão marcada como aprovada. Não copiar manual privado para arte pública. Fazer commits específicos, preservar trabalho de terceiros e nunca force-push.

## Pontos que Claude precisa saber antes de criar

1. V2 foi avaliada positivamente; V1 deformada está rejeitada. Os nomes dos arquivos de capa podem ser iguais entre entregas: confira o conteúdo e a nota V2.
2. Documentação antiga tem frases superadas (família, base, K nos posts, horários, criadores apenas, vídeo ainda manual/não publicado). As correções recentes e este estado verificado prevalecem.
3. Não há dados próprios para afirmar que um layout performa melhor. Direção aprovada e resultado de engajamento são coisas diferentes.
4. O novo destino de propostas é **`https://www.kombukombucha.com.br/parcerias`**; revenda usa **`/revenda`**. Profissionais de saúde não recebem automaticamente condições de afiliado de influenciador nem promessa de remuneração por indicação clínica.
5. O calendário de Stories precisa de extensão após hoje; o feed tem 16 estáticos pendentes, mas a fila antiga merece revisão de linguagem/marca antes de próximas inclusões ou mudanças. Não alterar publicados para corrigir histórico sem autorização.
