# Prévia v3: servir criado do zero

29/10/2026. Ideia: a garrafa gelada deixa de ser uma fotografia e serve a bebida num copo, em um cenário tropical criado para este filme. O rótulo oficial permanece reconhecível durante a ação. Não foi usado nenhum trecho do Instagram, vídeo antigo ou material das referências de terceiros.

## O que foi criado e o que é referência

Cenário novo gerado por IA: `assets/generated/veranda-v3.png`. Garrafa Penta de 500 ml aproximada, copo, tampa, condensação, fluxo, nível e ondulações construídos em Three.js, em `src/pour-scene.js`. Logo e imagem do rótulo são ativos oficiais. O cenário e a animação são ilustrativos; não são filmagem real, instalação da marca, parceiro ou simulação científica do líquido.

A narração reutiliza a mesma avaliação privada Rayssa Original, sem nova clonagem, troca de voz ou mudança de velocidade. O HumanVoice instalado usa pesos CC-BY-NC. O MP4 com essa voz e o pacote OpenCut ficam restritos à prévia privada. Foi exportado também o vídeo visual sem narração, a partir do base.mp4; ele não contém áudio desse motor.

## Planos e intenção

- 0–2,3 s: apresenta a garrafa e o copo vazio numa mesma ocasião.
- 2,3–4,6 s: aproxima da embalagem e da condensação para mostrar o frio.
- 4,6–10,5 s: demonstra o servir, com gargalo, fluxo e nível do copo ligados.
- 10,5–13,7 s: reúne garrafa aberta e copo servido com um convite aos parceiros.

As revisões corrigiram o vidro branco, o rótulo desbotado, a transparência que ocultava o líquido e a falta de movimento no cenário. A cena distante acompanha a aproximação mais lentamente que os objetos. A câmera resolve antes do término. O modo novo bloqueia filmagem antiga e sabor principal diferente do modelo calibrado.

## Medições do MP4 final

Fonte: `output/created-pour-v3/look-final/gates.json`, obtida pelo look.py local com a única adaptação já existente que remove a queima de timecodes, indisponível neste FFmpeg. As análises e limites são os originais.

- G0 PASS: 13,717 s a 30 fps, 1080×1920, duração dentro da tolerância do plano de 13,7 s; vídeo decodificado e áudio presente.
- G2 PASS: nenhum trecho com mais de três frames vazios consecutivos.
- G3 PASS: hold final de 0,60 s; plano final de 3,22 s, 23% do filme.
- G5 PASS no lint.mjs original: nenhuma das 15 verificações de elementos de página sinalizou falha. O lint não lê texto dentro do canvas ou das imagens.
- Movimento médio: 0,71/255; abaixo da mediana de referência 6,8, compatível com a montagem calma, sem tratar esse número como nota de qualidade.
- Áudio: -15,7 LUFS integrados, pico verdadeiro -4,5 dBFS, voz audível entre 0,35 e 13,25 s, cauda de 0,467 s, sem dropouts detectados.
- G1, julgamento visual: rótulo legível no close; convite e legendas discretos. O tamanho não foi convertido em um escore inventado.
- G4, julgamento visual: a embalagem domina o close; durante o servir, a relação entre gargalo, fluxo e copo é o foco. O plano final mantém ambos no mesmo mundo, sem painéis.

A versão sem narração também passou G0/G2/G3: 13,700 s, hold de 0,60 s, plano final 3,20 s (23%), movimento médio 0,63/255.

## Leitura dos 16 frames da contact sheet final

1. Garrafa e copo vazio aparecem sobre travertino, com a embalagem como foco e a primeira legenda da fala.
2. A câmera se aproxima do mesmo conjunto e mantém a continuidade do cenário.
3. A embalagem fica maior enquanto a legenda completa a ideia de sabor intenso.
4. O corte aproxima do corpo e dos ombros da garrafa, mantendo o rótulo em destaque.
5. O close continua em aproximação, com a bebida e a embalagem ocupando o quadro.
6. A garrafa aparece inclinada sobre o copo vazio e inicia a ação de servir.
7. O fluxo liga o gargalo ao copo e começa a elevar o líquido.
8. O nível aumenta enquanto a câmera acompanha a ação sem trocar de cenário.
9. O copo ganha volume e o fluxo permanece conectado à superfície.
10. A aproximação destaca o servir e preserva o rótulo na garrafa inclinada.
11. O copo se aproxima do nível final, com pequenas ondulações na superfície.
12. O servir termina antes do corte para o conjunto final.
13. A garrafa volta à posição vertical e o convite aos parceiros começa a entrar.
14. Garrafa aberta e copo cheio aparecem juntos, com a tampa na bancada.
15. A câmera se aproxima do conjunto e a última legenda acompanha o convite.
16. O conjunto resolve em uma breve pausa, com logo pequeno e o copo servido.

## Limites e próximo refinamento

O líquido tem aparência estilizada e o fluxo ainda é regular demais para ser confundido com uma filmagem de bebida. A condensação é discreta e pode ganhar destaque com uma etapa posterior de imagem para vídeo. A prévia demonstra a ação solicitada, mas passar nas verificações técnicas não significa que atingiu o acabamento fotográfico desejado. A pesquisa de motores e skills, incluindo limites de memória e ausência de serviços pagos acionados, está em `MELHORIAS-GERACAO.md`.

Verificações de código: oito testes Node e dois testes Python passaram; verificações sintáticas e git diff --check passaram. A inspeção foi feita nos MP4 decodificados, contact sheets e frames da cena, não apenas em um storyboard.
