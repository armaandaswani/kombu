# 26-personal-trainers (Goiaba), 03/11/2026

Sabor trocado de Maracujá para **Goiaba** a pedido do coordenador (rotação de sabores). `fila.json` continua com `maracuja`; o `pos/26-personal-trainers.json` usa `goiaba`. As primeiras cenas geradas com maracujá foram descartadas e refeitas com goiaba.

Cenas geradas no Canva `generate-image`, `aspectRatio: PORTRAIT_4_5`. Prompt = texto abaixo + o `sufixo` de `cenas.json`. Exportadas em 1080 × 1350 pelo design de trabalho `DAHZ5Rfk8Ko` (página 2, `update_fill`).

## 26-1.png (layout A)
Escolhida: opção B (media `MAHZ6YOSVxk`): pessoa em pé alongando, longe à direita, sobra um vão limpo entre o copo e ela para a garrafa. A opção A (`MAHZ6QoCNmg`) tinha a pessoa sentada exatamente onde a garrafa ficaria. Nas duas a pessoa usa top de treino com a barriga à mostra (desfocada, ao fundo).

> Fotografia em três quartos, câmera um pouco acima da altura da bancada, lente 50 mm, num estúdio de treino funcional elegante em Manaus, de manhã, com luz natural entrando por janelas grandes à esquerda, piso de madeira e plantas tropicais. Em primeiro plano, um banco largo de madeira clara com uma toalha branca dobrada e, um pouco à esquerda do centro, um copo alto de vidro liso com bebida rosa-goiaba translúcida, gelo e condensação. À direita do copo, com bom espaço, uma área livre e vazia do tampo do banco onde depois será colocada uma garrafa em pé. Ao fundo, bem desfocada, uma pessoa adulta fictícia de roupa de treino comum alongando. Sem shaker, pote de suplemento, balança, aparelhos grandes em destaque nem corpo exposto. O terço superior da imagem é calmo e simples, parede e janela desfocadas, para receber um título.

## 26-3.png (layout F, texto à direita)
Primeira rodada (copo "exatamente no centro"): opções `MAHZ6QFN8Ig` e `MAHZ6bpnpaA`, descartadas porque o copo invadia a coluna de texto (x > 594 px). Segunda rodada com o prompt abaixo: opções `MAHZ6X5n6OE` (escolhida) e `MAHZ6cGaakc` (copo muito perto da borda esquerda, sem espaço para a garrafa).

> Fotografia frontal em close, câmera na altura do parapeito, lente 85 mm, num estúdio de treino claro em Manaus, de manhã. Parapeito largo de madeira clara junto a uma parede clara lisa, luz natural suave e quente vinda da esquerda. Todos os objetos ficam na metade esquerda da imagem. Um copo alto de vidro liso com bebida rosa-goiaba translúcida, gelo e condensação, um pouco menor no quadro, com o centro por volta de 38% da largura e a borda direita antes da metade da imagem. Entre o copo e a borda esquerda da imagem, um trecho livre e vazio do parapeito, com cerca de um quarto da largura, onde depois será colocada uma garrafa em pé. Em primeiro plano, logo à frente do copo, uma goiaba vermelha cortada ao meio mostrando a polpa rosada, baixa no quadro. A metade direita da imagem fica totalmente livre: só parede lisa clara e parapeito vazio, para receber texto.

## Resultado do luz.mjs
- 26-1: correlação 0.872 (altura 526 px, centro x 563, base y 1174).
- 26-3: o Canva pôs a garrafa um pouco atrás das goiabas; `occludersLuz` cobre as goiabas (x 115, y 1068, 335 × 180). Correlação 0.917 (altura 574 px, centro x 169, base y 1109).

## Relight (passo 5)
26-1 "em pé sobre o banco de madeira clara, à direita do copo, com espaço entre os dois; mesma luz natural suave da manhã vindo das janelas à esquerda"; 26-3 "em pé sobre o parapeito de madeira clara, um pouco atrás das goiabas cortadas e à esquerda do copo, com espaço entre ela e o copo; mesma luz natural suave e quente vinda da esquerda".
