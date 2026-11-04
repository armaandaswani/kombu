# 16-de-verdade — notas de cena

## Slide 1 — cena nova `../cenas/16-1b.png` (03/11/2026)
Substitui o fundo de papel visto de cima `16-bg.png` com a garrafa deitada (rejeitado pela regra 4). O `16-bg.png` continua nos slides 2 e 3.
Layout trocado de G para A (canto superior direito para o título, logo no canto superior esquerdo) para a garrafa ficar em pé na bancada.
Gerada no Canva `generate-image`, PORTRAIT_4_5, duas opções; escolhida a opção 2. Na opção 1 a goiaba cortada parecia tomate.
Exportada em tamanho cheio pelo design de trabalho DAHZ5W65N64 (página 2).

Prompt usado:

> Fotografia de frente, câmera na altura da bancada, de uma mesa rústica de madeira clara numa cozinha iluminada de Manaus, com parede de azulejo artesanal creme liso e desfocado ao fundo; o terço superior do quadro é parede limpa, sem objetos. Luz natural suave e quente vinda da direita. À direita, um copo alto de vidro liso, transparente e sem desenhos, com líquido rosa-rubi translúcido, gelo e gotas de condensação. Na frente, em fila solta e com espaço entre eles: pétalas secas de hibisco vermelho-escuro numa tábua pequena, um ramo de alecrim fresco, meia goiaba vermelha mostrando a polpa rosada e duas estrelas de anis estrelado. À esquerda do copo, com espaço generoso entre eles, um trecho livre e plano da mesa, sem objetos, onde depois será colocada uma garrafa em pé vista de frente. Paleta madeira, creme, rubi e verde. Fotografia realista, aparência de câmera full-frame com lente real, cores naturais e textura de filme sutil. Não incluir nenhuma garrafa, lata, embalagem, rótulo, logotipo, marca ou texto legível. Pessoas, se houver, são adultos fictícios. Formato vertical 4:5.

Opção 1 (descartada): bancada de madeira escura com parede de reboco creme; a goiaba saiu com cara de tomate.

## Slide 1, segunda rodada (03/11/2026)
O coordenador pediu para refazer: a garrafa parecia flutuar na frente dos azulejos, com luz chapada.
- A base foi para y ≈ 1130 (83,7%), no tampo, um pouco atrás do alecrim, com h 560 (≈ 1,3 vez o copo).
- A luz do slide virou `dir direita, sombra 0.45, borda 0.4, brilho 0.25, quente 0.14, contraste 1.1`.
- O título aumentou: `titleSize` 96 e `textWidth` 640.
- Relight em três tentativas:
  1. Correlação 0,848, mas sem sombra projetada.
  2. Visual com sol forte, mas o sombreamento escureceu o rótulo e o `luz.mjs` encaixou fora do lugar (0,759). No ponto certo a correlação era só ≈ 0,68. Descartada.
  3. Usada, correlação 0,907.

Prompt da tentativa 3 (usada):

> Integre a garrafa à cena como se tivesse sido fotografada junto, com sol quente de fim de manhã entrando pela direita. A garrafa está em pé sobre o tampo de madeira, um pouco atrás do ramo de alecrim, com o fundo visível apoiado na madeira. Sombra projetada longa e bem visível da garrafa sobre a madeira, saindo da base para a esquerda. Sombra de contato escura e estreita exatamente onde o fundo da garrafa toca a madeira. Na madeira, ao lado direito da base, um reflexo de luz rubi atravessando o líquido. Na própria garrafa, só um brilho quente estreito na borda direita e uma sombra suave na borda esquerda; o rótulo continua iluminado por igual, nítido e legível. Não mude o formato da garrafa, a tampa, o rótulo, as letras, as cores do rótulo, o tamanho nem a posição. Não mude o copo, a goiaba, o alecrim, o hibisco, o anis, o enquadramento nem o resto da cena. Fotografia realista.
