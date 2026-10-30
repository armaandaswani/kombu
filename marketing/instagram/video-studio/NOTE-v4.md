# Prévia fotográfica v4 — 29/10/2026

A ideia é mostrar a garrafa gelada e o servir em uma varanda com luz natural, sem o cenário e os objetos em Three.js da v3. As cenas são geradas por IA; não são filmagem real nem conteúdo reaproveitado de Instagram.

## Resultado e limites

Prévia visual silenciosa: 1080×1920, 24 fps, 130 frames, 5,4167 segundos. Primeiro plano: garrafa e condensação por 2,0417 s. Corte direto para o servir por 3,375 s. A logo pequena fica sobre a cena. Não há cartela clara, legendas, narração ou publicação automática nesta versão.

As imagens de referência usam o produto Rosas & Cardamomo. O titular apontou a orientação errada do primeiro rótulo; `pour-corrected.png` corrige o topo em direção ao gargalo. O primeiro close local em 384×640 foi rejeitado porque o zoom cortava a tampa e deformava letras.

Os vídeos seguintes foram gerados em 576×1024. O close usa câmera fixa, 49 frames e a mesma referência no primeiro e no último frame. O servir usa 81 frames. O modelo ainda modifica letras; a composição Remotion aplica a impressão da referência sobre o vídeo com geometria rastreada e bordas suaves. A análise OpenCV escreve somente coordenadas; não modifica as imagens de origem. Rastreamento disponível em 49/49 frames do close e 81/81 frames do servir, com SIFT/RANSAC e fluxo óptico quando necessário. Cobertura não é garantia de alinhamento perfeito: requer inspeção visual.

Há movimento do líquido e da mão, aumento do nível do copo e retirada da garrafa. O close é deliberadamente quase imóvel. Pequenos detalhes de líquido, reflexo e anatomia continuam sendo síntese; esta é uma prévia para avaliação, não uma comprovação de filmagem.

## Verificação do MP4 completo

`look-no-drawtext.py` (adaptação local que só remove o filtro drawtext ausente do FFmpeg):

- G0 PASS: 5,42 s, conforme duração planejada; áudio ausente, não exigido no ensaio.
- G2 PASS: não há sequência com mais de três frames planos/vazios.
- G3 FAIL automático: último plano ocupa 62% do filme e termina em movimento, com hold de 0,00 s. O analisador trata o último plano como fechamento/CTA; aqui ele é a ação de servir, sem cartela ou CTA. A medição e o resultado FAIL foram preservados.
- G1: KOMBÚ e o nome do sabor permanecem legíveis na impressão de referência composta. Letras pequenas ainda precisam de avaliação na tela de destino.
- G4: um produto por plano; no servir, o fluxo conduz ao copo.
- G5/lint HTML: não aplicável ao clipe Remotion sem página HTML de motionmaxxing. Não foi declarado PASS.

Há um corte detectado em 2,04 s. Nenhum trecho totalmente congelado de 0,6 s; o close tem mudança inferior a 0,35/255 durante 2,04 s. Mudança média de luminância: 1,4/255, abaixo da referência de filmes de motion graphics usada pela skill. Não foi escondida essa diferença: o ensaio busca fotografia e câmera fixa, não movimento gráfico contínuo.

Folha `output/realistic-v4/final-sheet.jpg`, sete quadros selecionados:
1. Garrafa inteira, tampa e base visíveis, com condensação e fundo de varanda.
2. Close quase imóvel, com a mesma composição e rótulo legível.
3. Último quadro do close, mantendo o produto e a luz antes do corte.
4. Mão segura a garrafa inclinada e o jato chega ao copo.
5. O líquido sobe no copo enquanto o rótulo acompanha a garrafa.
6. A mão começa a elevar a garrafa e o fluxo diminui.
7. A garrafa é retirada, com o copo mais cheio e sem transbordamento.
A oitava célula da folha é vazia e não representa frame preto do vídeo.

## Reprodução

Modelos locais selecionados e verificados: LTX q4 `f306259444116d71927188af2fbbf7fdc1a8089a` e Gemma q4 `86cc6a8dedbc456dd0e4af01a9d09f396f77e558`. Runtime comunitário LTX-2-MLX 0.18.0, commit `895201df379b079c2154738bcf92005b7a371923`. Preservar licenças dos modelos no diretório local; não redistribuir os pesos com o projeto.

A ordem local é: `setup-realistic-video.py`, `generate-realistic.mjs close`, `generate-realistic.mjs pour`, `track-packaging.py close`, `track-packaging.py pour`, `compose-realistic.mjs`. Os scripts Python usam a venv separada em `../.render/video-tools/ltx-2-mlx/.venv`. Manter huggingface-hub 1.7.1 para compatibilidade com o Transformers instalado e OpenCV headless para análise. O gerador usa rede desativada durante a síntese, sem fallback pago.

O plano de servir levou 510,4 s e o close seguinte 390,0 s. Pico Metal da decodificação informado: 9,27 GB e 8,09 GB, respectivamente. A configuração e os resultados permanecem em `projects/realistic-v4.json` e `output/realistic-v4/`.

Testes existentes: oito Node e dois Python passaram. Também foram verificados sintaxe dos scripts Python/Node e bundle JSX. O ambiente HumanVoice, o feed, os Stories e o Worker de publicação não foram alterados. Nenhuma credencial foi extraída da conta Hugging Face.

O acabamento do rastreamento aplica mediana temporal e filtro simétrico de cinco quadros às coordenadas, sem alterar o vídeo de origem. Movimento máximo entre quadros dos cantos do rótulo na resolução nativa: close: 0.21 px, pour: 7.07 px. A impressão foi reinspecionada após a composição.
