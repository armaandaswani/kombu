# 23-cardapio — notas de produção

## Slide 1, cena nova `cenas/23-1b.png` (03/11/2026)

Motivo: a cena antiga (`23-1.png`) era flat lay com a garrafa deitada, recusada pela regra 4 (garrafa sempre em pé, nada de cena vista de cima).

Gerada no Canva `generate-image`, `PORTRAIT_4_5`, duas opções; escolhida a opção B (cardápio num cavalete, mais frontal e maior, com espaço livre entre ele e o copo). Media id `MAHZ6eVI1m4`, exportada em 1080 × 1350 pelo design `DAHZ5e6UBzU`.

Prompt usado (opção B, a escolhida):

> Fotografia em três quartos leves, com a câmera na altura do tampo de uma mesa de café de madeira escura, em Manaus, no fim da tarde. À esquerda, ocupando de 8% a 52% da largura e de 14% a 74% da altura, um cardápio grande de papel de algodão cor creme, espesso, de bordas rústicas, preso numa prancheta de madeira em pé num pequeno cavalete, virado de frente para a câmera, completamente em branco, sem nenhuma letra, linha ou desenho. À direita, centrado em 85% da largura, um copo alto de vidro liso com líquido rosado translúcido, gelo e condensação, apoiado na mesa por volta de 80% da altura, e algumas pétalas de rosa secas e bagas de cardamomo espalhadas com parcimônia. Entre o cardápio e o copo, de 55% a 75% da largura, a mesa fica livre e vazia. Fundo desfocado de um café acolhedor, com luz quente de pendentes e plantas. Luz de janela vindo da esquerda. Abaixo de 82% da altura, a borda da mesa e a sombra embaixo dela, escuras e limpas. + `sufixo` de `cenas.json`.

Opção A (descartada, cardápio menor num suporte baixo, balcão de pedra): mesmo pedido com "balcão de café de pedra escura levemente polida" e "em pé num suporte simples de madeira".

Pedido de integração de luz (Canva, com a base como referência):

> Integre a garrafa à cena como se tivesse sido fotografada junto: ela está em pé sobre a mesa de madeira escura do café, entre o cardápio no cavalete e o copo, com espaço livre dos dois lados. Mesma luz quente do café, com a luz de janela vindo da esquerda, sombra de contato na madeira, reflexo suave no tampo, leve condensação no plástico. Não mude o formato da garrafa, a tampa, o rótulo, as letras, as cores do rótulo, o tamanho nem a posição. Não mude o copo, o cardápio em branco, o enquadramento nem o resto da cena. Fotografia realista.

Posição na base: garrafa em pé, `x 63.6`, `base 70.2`, `h 560` (copo ≈ 452 px, razão ≈ 1,24). O `luz.mjs` achou a garrafa na imagem da IA em centro x 667, base y 970, altura 582 px (correlação 0.890). A IA ampliou um pouco a cena, então a caixa do cardápio foi ajustada ao papel da imagem final: `x 2.6, y 18.7, w 47.6, h 45.9` (o padding fica fora do papel e o texto cabe dentro).

Antigos preservados: `saida/23-cardapio/1-antiga.jpg` e `1-luz-antiga-deitada.png`.
