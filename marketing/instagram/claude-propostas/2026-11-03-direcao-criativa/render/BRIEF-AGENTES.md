# Brief para os agentes de produção (03/11/2026)

Pasta de trabalho: `/Users/armaandaswani/Desktop/Kombucha/Kombu New Site/marketing/instagram/claude-propostas/2026-11-03-direcao-criativa/render`
Exemplos aprovados pelo dono:
- `../saida/09-hibisco/1.jpg`: garrafa no peitoril, atrás do copo;
- `../saida/18-feita-em-manaus/1.jpg`: garrafa no parapeito, com espaço até o copo. O dono respondeu "Agora simmmmm".

## Regras do dono (obrigatórias)
1. **Toda arte com cena tem a garrafa oficial** (`/Users/armaandaswani/Desktop/Kombucha/Kombu New Site/assets/bottles/<slug>.webp`), do sabor indicado em `fila.json` para aquele slide.
2. **A garrafa parece fotografada na cena:**
   - apoiada numa superfície real (mesa, bancada, prateleira, parapeito, peitoril);
   - em escala certa com o copo: garrafa de 500 ml, mais ou menos 1,2 a 1,4 vez a altura de um copo alto na mesma profundidade, e menor se estiver mais ao fundo;
   - com a luz da cena.

   Garrafa "jogada por cima", flutuando ou com luz chapada é recusada.
3. **Posição natural, com respiro:**
   - nunca espremida contra o copo nem tocando objetos;
   - nunca cobrindo o elemento importante da cena;
   - texto e logo só em área vazia.

   Pode ficar parcialmente atrás do copo se for natural (veja `occluders`).
4. **A garrafa fica sempre em pé. Nunca deitada** (o dono, 03/11: "eu não quero ela deitada nunca"). Nada de `rotate`. Por isso, nada de cena vista de cima (flat lay): toda cena com garrafa é de frente ou em três quartos, com câmera entre a altura da mesa e um pouco acima, e uma superfície onde a garrafa fica de pé.
5. **Rótulo intocável.** O `luz.mjs` restaura o rótulo oficial. Confira as letras do resultado contra o arquivo oficial. Se o encaixe falhar, ajuste e refaça.
6. **Nada é publicado.** Não mexa em `calendar.json`, `fila.json`, `render.mjs`, `luz.mjs`, nem em posts fora do seu grupo.

## Onde ficam suas posições
Para cada post do seu grupo:
- crie `pos/<post-id>.json` no formato `{"slides":[...]}`;
- copie os slides daquele post de `fila.json` e ajuste só o que precisar:
  - `bottles`: `slug`, `x`, `base`, `h`, `tom`, `sombra`, `luz`;
  - `occluders` / `occludersLuz`;
  - `corner`, `logo`, `titleSize`, `textWidth`, `band`, `box`, `menu`, `card`.

O `render.mjs` e o `luz.mjs` leem esse arquivo no lugar do `fila.json`.

**Coordenadas** (arte de 1080 × 1350):
- `x` = centro da garrafa em % da largura;
- `base` = linha em que a garrafa toca a superfície, em % da altura;
- `h` = altura em px.

**Objeto na frente da garrafa:**
- `occluders: [{"x","y","w","h","r"}]` em px, no retângulo do objeto na cena original, usado na montagem;
- `occludersLuz`: o mesmo retângulo na imagem que volta do Canva (ela pode vir com zoom ou deslocada).

**Luz opcional:** `"luz": {"dir": "esquerda|direita", "sombra": 0.3-0.5, "borda": 0.2-0.45, "brilho": 0.15-0.3, "posBrilho": 0.6-0.8, "quente": 0-0.16, "contraste": 1.05-1.12}`.

## Processo por slide com cena
1. Veja a cena: Read `../cenas/<arquivo>`. A arte final recorta em 1080 × 1350 (object-fit cover).
2. Escreva a posição em `pos/<post>.json` e rode `SO_GARRAFA=1 node render.mjs <post>`. Isso gera `../saida/<post>/<n>-base.png`.
3. Abra o `-base.png` e confira as regras 2 e 3. Ajuste até ficar natural.
4. Upload para o Canva:
   - carregue as ferramentas com ToolSearch: `select:mcp__ee2b1fb5-30fd-4f39-afbf-a850ecac3131__create-upload-url,mcp__ee2b1fb5-30fd-4f39-afbf-a850ecac3131__generate-image,mcp__ee2b1fb5-30fd-4f39-afbf-a850ecac3131__get-generate-image-job,mcp__ee2b1fb5-30fd-4f39-afbf-a850ecac3131__create-design,mcp__ee2b1fb5-30fd-4f39-afbf-a850ecac3131__get-create-design-async-job,mcp__ee2b1fb5-30fd-4f39-afbf-a850ecac3131__read-design,mcp__ee2b1fb5-30fd-4f39-afbf-a850ecac3131__edit-design,mcp__ee2b1fb5-30fd-4f39-afbf-a850ecac3131__export-design`;
   - chame `create-upload-url`;
   - envie com `curl -s -X POST -H "Content-Type: application/octet-stream" --data-binary @"<base.png>" "<uploadUrl>"`. A resposta traz o `mediaId`.
5. Peça ao Canva para integrar a luz:
   - chame `generate-image` com `imageReferences: [{"type":"MEDIA","id":"<mediaId>"}]` e `aspectRatio: "PORTRAIT_4_5"`;
   - use um pedido como este, adaptando superfície e luz: "Integre a garrafa à cena como se tivesse sido fotografada junto: ela está em pé sobre <superfície>, <relação com o copo>. Mesma luz <descrição da luz da cena>, sombra de contato, reflexo suave na superfície, leve condensação no plástico. Não mude o formato da garrafa, a tampa, o rótulo, as letras, as cores do rótulo, o tamanho nem a posição. Não mude o copo, o enquadramento nem o resto da cena. Fotografia realista.";
   - espere com `sleep 20` e consulte `get-generate-image-job` até SUCCESS.
6. Exporte em tamanho cheio. A miniatura não serve.
   - **Na primeira vez:** crie o seu design de trabalho com `create-design` (brief "Post de Instagram em branco, fundo liso, sem texto", format "Instagram Post (Portrait)"). Espere 15 s e consulte `get-create-design-async-job`. Depois abra a transação com `read-design` (`open_transaction: true`, filter fields `["page_metadata"]`), use `edit-design` `insert_fill` com o media id, `left: -5`, `top: 0`, `width: 1090`, `height: 1350`, e faça `commit`. Depois `export-design` com png 1080 × 1350, `pages: [1]`.
   - **Nas próximas vezes:** abra a transação, use `update_fill` no mesmo elemento (`locator_id` vindo do `read-design` com `design_content`), faça `commit` e exporte.
   - Baixe com `curl -s -o ../saida/<post>/<n>-luz-candidata.png "<url>"`.
7. Rode `node luz.mjs <post> <n> ../saida/<post>/<n>-luz-candidata.png`.
   - A correlação impressa deve ser ≥ 0.7, e o centro e a base devem cair onde a garrafa está na imagem da IA.
   - Se cair no copo ou em outro objeto, ajuste `occludersLuz` ou a posição e refaça.
8. Rode `node render.mjs <post>` e abra `../saida/<post>/<n>.jpg`. Confira:
   - garrafa natural na cena;
   - rótulo oficial, com as letras certas;
   - texto e logo sem cobrir nada.
9. Se a cena da IA sair ruim (garrafa deformada, flutuando ou com outra cena), gere de novo no passo 5, no máximo duas vezes. Depois disso, relate.

O hook de segurança bloqueia: `$VAR` como executável, heredoc de Python, `rm -rf` fora de /tmp. Use comandos literais e `/usr/bin/python3 -I -c` para editar JSON, ou a ferramenta Write.

## O que devolver
Uma lista curta com, para cada post:
- os slides prontos (`saida/<post>/<n>.jpg`);
- a correlação do `luz.mjs`;
- qualquer problema ou slide que não ficou bom.
