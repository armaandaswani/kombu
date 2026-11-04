# 25-nutricionistas (Pêra & Alecrim), 03/11/2026

Cenas geradas no Canva `generate-image`, `aspectRatio: PORTRAIT_4_5`, duas opções por cena. Prompt = texto abaixo + o `sufixo` de `cenas.json`. Exportadas em 1080 × 1350 pelo design de trabalho `DAHZ5Rfk8Ko` (página 2, `update_fill`).

## 25-1.png (layout A)
Escolhida: opção A (media `MAHZ6ak3P-8`). A opção B (`MAHZ6XYqIT8`) tinha o copo mais à esquerda e a mesa menos composta.

> Fotografia em três quartos, câmera um pouco acima da altura do tampo, lente 50 mm, de uma mesa de trabalho de madeira clara num consultório de nutricionista bonito, claro e acolhedor em Manaus, de manhã. Luz natural suave de uma janela grande à esquerda. Sobre a mesa: um caderno aberto com uma caneta, um raminho de alecrim fresco e meia pera cortada. Um pouco à esquerda do centro, um copo alto de vidro liso com bebida verde-clara translúcida, gelo e condensação. À direita do copo, com bom espaço, uma área livre e vazia do tampo onde depois será colocada uma garrafa em pé. Ao fundo, desfocado, plantas em vasos e uma estante de madeira clara. Nada clínico: sem balança, fita métrica, jaleco, estetoscópio ou prato de comida. O terço superior da imagem é calmo e simples, parede clara desfocada, para receber um título.

## 25-3.png (layout F, texto à direita)
Escolhida: opção B (media `MAHZ6X0wyds`). A opção A (`MAHZ6dQsbO8`) tinha o copo ainda mais colado à borda esquerda. Nas duas o copo saiu no terço esquerdo (não em 40%), então a garrafa ficou atrás e à esquerda do copo, parcialmente escondida por ele (como no 09-hibisco aprovado).

> Fotografia frontal em close, câmera na altura da bancada, lente 85 mm. Bancada de madeira clara contra uma parede bege-clara lisa, luz natural suave vinda da esquerda com sombras leves de folhas na parede. No terço esquerdo da imagem, uma área livre do tampo onde depois será colocada uma garrafa em pé; à direita dessa área, com espaço, por volta de 40% da largura, um copo alto de vidro liso com bebida verde-clara translúcida, gelo e condensação. Um raminho de alecrim fresco deitado na bancada em primeiro plano, perto do copo. A metade direita da imagem fica livre e limpa: só parede lisa clara e bancada vazia, para receber texto.

## Resultado do luz.mjs
- 25-1: correlação 0.904 (altura 507 px, centro x 684, base y 1141).
- 25-3: o primeiro relight herdou um "degrau" claro no ombro da garrafa, vindo do retângulo do `occluders` que começava acima da borda do copo. Corrigi os `occluders` (dois retângulos seguindo a curva da borda), refiz a base e o relight (1 refação). O Canva deslocou a composição um pouco para a direita, então o `occludersLuz` foi ajustado para o copo novo (x 257, y 708). Correlação final 0.859 (altura 672 px, centro x 193, base y 1161).

## Relight (passo 5)
Pedido padrão do brief, adaptado: 25-1 "em pé sobre o tampo de madeira clara da mesa, à direita do copo, com espaço entre os dois; mesma luz natural suave e quente da janela à esquerda"; 25-3 "em pé sobre a bancada de madeira clara, um pouco atrás e à esquerda do copo, parcialmente escondida por ele; mesma luz natural suave vinda da esquerda com sombras de folhas na parede".

## 25-3 refeito (pedido do coordenador, 03/11)
Motivo: o copo cobria a parte direita do rótulo ("KOMBÚ" cortado). Regra: garrafa ao lado do copo, à esquerda, com 50 a 80 px de respiro, escala 1,2 a 1,3 vez o copo, tudo na metade esquerda.

Nova cena (2 opções). Escolhida `MAHZ6e-RrCY`, porque a `MAHZ6cdPLFE` deixava só uns 10 px de margem à esquerda da garrafa. Prompt (mais o `sufixo`):

> Fotografia frontal em close, câmera na altura da bancada, lente 85 mm. Bancada de madeira clara contra uma parede bege-clara lisa, luz natural suave vinda da esquerda com sombras leves de folhas na parede. Todos os objetos ficam na metade esquerda da imagem. Um copo alto de vidro liso com bebida verde-clara translúcida, gelo e condensação, um pouco menor no quadro, com o centro por volta de 38% da largura e a borda direita antes da metade da imagem. Entre o copo e a borda esquerda da imagem, um trecho livre e vazio da bancada, com cerca de um quarto da largura, onde depois será colocada uma garrafa em pé. Em primeiro plano, à frente do copo, um raminho de alecrim fresco deitado na bancada, baixo no quadro. A metade direita da imagem fica totalmente livre: só parede lisa clara e bancada vazia, para receber texto.

Posição: x 12.1, base 87.2, h 557, sem occluders. Relight `MAHZ6XdWJ7Q`: o Canva deslocou a composição uns 50 px para a direita, e a garrafa ficou em x 82-272, com o copo em x 330-556 (respiro de cerca de 58 px). luz.mjs: correlação 0.882 (altura 574 px, centro x 177, base y 1199), cerca de 1,21 vez o copo. O rótulo aparece inteiro. Os slides 1 e 2, já aprovados, foram restaurados byte a byte depois do render.
