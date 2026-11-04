# 24-profissionais — notas de produção

## Slide 1, cena nova `cenas/24-1b.png` (03/11/2026)

Motivo: a cena antiga (`24-1.png`) era flat lay com a garrafa deitada sobre o cartão, recusada pela regra 4.

Gerada no Canva `generate-image`, `PORTRAIT_4_5`, duas opções; escolhida a opção B (janela grande com verde lá fora e espaço livre na mesa entre o cartão e o pires). A opção A tinha o cartão mais frontal, mas o pires ficava colado e não sobrava lugar para a garrafa sem espremer. Media id `MAHZ6Tdhnzw`, exportada em 1080 × 1350 pelo design `DAHZ5e6UBzU`.

Prompt usado (opção B, a escolhida):

> Fotografia em três quartos leves, câmera na altura do tampo, de uma mesa de madeira de carvalho encostada numa janela grande com caixilho branco, de manhã cedo. Sobre a mesa, à esquerda, ocupando de 10% a 56% da largura e de 16% a 74% da altura, um cartão grande cor creme de papel de algodão grosso, retangular na vertical, apoiado em pé contra um pequeno cavalete de madeira, virado de frente para a câmera, completamente em branco, sem letras, monograma ou desenho. À direita, em primeiro plano, centrado em 86% da largura, um pires de cerâmica branca com uma pera verde fatiada ao meio e um ramo de alecrim fresco. Entre o cartão e o pires, de 60% a 78% da largura, a mesa fica livre e vazia. Luz do sol entrando pela esquerda, quente e suave, com plantas desfocadas lá fora. Nenhum objeto médico, de academia ou de consultório. Clima calmo e editorial, paleta creme, verde-sálvia e madeira. Abaixo de 80% da altura, a borda frontal da mesa, limpa. + `sufixo` de `cenas.json`.

Opção A (descartada): "Fotografia de frente, com a câmera um pouco acima da altura da mesa, de uma mesa de madeira clara de carvalho junto a uma janela, de manhã..." com o cartão num suporte de madeira e o pires com pera inteira e meia pera.

Pedido de integração de luz:

> Integre a garrafa à cena como se tivesse sido fotografada junto: ela está em pé sobre a mesa de madeira clara, no fundo da mesa, junto à janela, à direita do cartão no cavalete e atrás do pires com a pera. Mesma luz do sol da manhã entrando pela janela, contraluz suave que acende as bordas da garrafa e o líquido, sombra de contato na madeira, reflexo suave na mesa, leve condensação no plástico. Não mude o formato da garrafa, a tampa, o rótulo, as letras, as cores do rótulo, o tamanho nem a posição. Não mude o cartão em branco, o pires, a pera, o enquadramento nem o resto da cena. Fotografia realista.

Posição na base: `x 59.5`, `base 67`, `h 470`. A IA trouxe a garrafa um pouco para a frente e a aumentou; o `luz.mjs` a encontrou em centro x 668, base y 972, altura 526 px (correlação 0.794), que é onde ficou o rótulo oficial. Caixa do cartão ajustada à imagem da IA: `x 23.8, y 40.5, w 42`.

Antigos preservados: `saida/24-profissionais/1-antiga.jpg` e `1-luz-antiga-deitada.png`.
