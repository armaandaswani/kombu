# Kombú v5 — filme narrado, 30/10/2026

O titular rejeitou o ensaio v4: “This is way too short and way too bland. The voice is missing and the different angles and takes also are missing.” Esta versão desenvolve a pausa no calor de Manaus com narração e cinco setups de câmera. O roteiro, os tempos e a função de cada plano estão em `STORYBOARD-v5.md`.

## O que foi produzido

18,5 segundos planejados, 444 frames a 24 fps, exportação 1080×1920 H.264/AAC. São sete planos e seis cortes, usando cinco enquadramentos: macro da condensação, garrafa inteira, servir de lado, servir visto de cima e copo levantado. O macro e o produto inteiro retornam na montagem; não são apresentados como sete ângulos diferentes.

Foram criadas três novas imagens-base e três novas sequências de movimento. Os dois outros setups são as cenas fotográficas originais da v4, feitas nesta tarefa, não material de Instagram. Não se usa o cenário/garrafa CGI da v3. Todas as imagens e movimentos visuais são síntese de IA, com o produto oficial como referência. O filme não é filmagem documental.

A voz é uma nova geração Rayssa Original (`rayssa`, não `rayssa2`), com o roteiro completo. Não foi alongada nem acelerada. A transcrição faster-whisper small confirmou as 42 palavras e os tempos; o último termo termina em 17,47 s, considerando a margem inicial de 0,35 s. A voz original dura 17,32 s.

A composição tem uma base instrumental original sintetizada e foley do líquido em volume baixo. O efeito “Pouring Water”, de edschaefer, é CC0 conforme a página do autor: https://freesound.org/people/edschaefer/sounds/411438/ . A origem, a cópia HQ pública e o tratamento estão em `assets/audio/CREDITS.md`. O foley não foi captado junto das imagens.

## Direitos e publicação

A versão com Rayssa é uma prévia privada de avaliação. O HumanVoice instalado informa pesos OmniVoice CC-BY-NC; não há liberação comercial dessa narração neste fluxo. O arquivo e o texto de uso foram entregues localmente. Nenhum áudio clonado, MP4 narrado ou credencial entra no Git. Não se enviou a versão ao Instagram, calendário ou Worker.

## Edição e correções verificadas

- Os cortes ocorrem em 1,75; 3,7917; 5,875; 9,25; 11,9583 e 14,0 s, acompanhando as frases.
- O macro tem ajuste sutil de tempo e o gesto do copo usa 0,75× com interpolação óptica. O servir lateral usa a parte antes da retirada da garrafa, também em 0,75×, para cortar durante o fluxo.
- O rótulo do plano de cima é aplicado a partir da imagem de referência. O rastreador confirmou os 65 quadros que entram na edição. Quatro quadros de retirada rápida sem correspondência e 12 quadros com a garrafa fora da cena ficaram fora do corte.
- A visibilidade do rótulo é tratada na análise; a impressão não permanece flutuando depois que a garrafa sai do quadro. A geometria recebe filtro temporal simétrico.
- A primeira montagem colocava o texto de fermentação sobre sombras e a frase final sobre o copo. A revisão moveu essas frases para a pedra livre, com contraste e margem em relação à ação.
- Mantivemos a pequena logo K por preferência explícita do titular. Não há contadores, rótulos de cena, barras, páginas ou cartela final lavada.

## Verificações do arquivo final

`look-no-drawtext.py` foi executado no MP4 completo com `--expect 18.5 --expect-audio`. Essa adaptação local só remove o filtro drawtext ausente do FFmpeg deste Mac.

- G0 PASS: duração real 18,517 s, compatível com 18,5 s planejados; áudio presente e audível.
- G2 PASS: nenhuma sequência de mais de três frames planos/vazios.
- G3 PASS: fechamento em movimento, hold de 0,08 s; último plano de 4,52 s ocupa 24% do filme, abaixo de 25%.
- G1 por inspeção: marca e sabor são legíveis nos planos de produto; frases curtas foram revisadas sobre a imagem. Fontes de apoio variam entre 64 e 76 px na exportação. Não há medição automática de tipografia alegada.
- G4 por inspeção: garrafa, líquido ou copo conduzem o olhar a cada plano; a garrafa atrás do copo está fora de foco.
- G5/lint HTML: não executado, pois a composição é Remotion/JSX e não uma cena HTML de motionmaxxing. Não se registrou um PASS inexistente.

Mudança média de luminância: 2,02/255, abaixo da referência de motion graphics do analisador (mediana 6,8). A imagem tem fotografia, macro e câmera fixa; o número foi preservado como diagnóstico, sem certificação geral de qualidade.

Áudio: -15,9 LUFS integrados, LRA 1,8 LU, true peak -3,8 dBFS. Som detectado entre 0,06 e 18,42 s, sem dropouts. O MP4 também foi reproduzido até 18,517 s no player local, com `muted=false` e estado final `ended=true`.

## Descrição dos 16 quadros da folha automática

1. Macro da gota e frase inicial sobre o calor de Manaus.
2. A gota avança pela superfície, mantendo o mesmo enquadramento e a frase.
3. Garrafa inteira, tampa e base visíveis, com o rótulo como foco.
4. Retorno ao macro em recorte mais próximo, sem texto.
5. Gota mais baixa no ombro da garrafa, ainda com o produto como único assunto.
6. A mão serve de lado e a frase sobre suavidade aparece acima da embalagem.
7. O fluxo continua e o nível do copo sobe sob a mesma frase.
8. O servir lateral continua sem texto, liberando a ação.
9. Novo ângulo de cima, com rótulo preservado e frase sobre fermentação na pedra.
10. O líquido gira no copo visto de cima, sem texto.
11. A garrafa inteira retorna para identificar o sabor apresentado pela voz.
12. Mesmo produto inteiro antes da transição para o gesto humano.
13. O copo aparece na mão, próximo à mesa, com a garrafa atrás fora de foco.
14. A mão eleva o copo e a frase de Manaus/2017 fica na mesa livre.
15. O copo inclina levemente, com líquido e reflexo visíveis e texto abaixo.
16. O gesto se resolve com o copo elevado, preservando contraste e profundidade.

Foram inspecionadas `look-final/sheet.jpg`, `mid.jpg`, `strips.jpg` e uma folha adicional de nove quadros. Os strips mostram os seis cortes sem frames vazios; a imagem do encerramento permanece no ambiente fotográfico.

## Ferramentas e reprodução

`generate-realistic.mjs <plano> realistic-v5` usa o motor local e os modelos já baixados, sem fallback de API paga. `track-packaging.py overhead realistic-v5` escreve somente geometria. `make-score.py` e `mix-montage.mjs` preparam o som. `compose-montage.mjs` monta o filme no Remotion; `--render-only` permite revisar textos sem refazer os intermediários. A composição e a análise usam imagens de referência intactas.

As gerações locais levaram 471,6 s (macro), 483,9 s (de cima) e 492,5 s (copo). A v5 mantém os modelos e revisões fixados já documentados na v4. Os intermediários privados ficam em `output/realistic-v5`, sem pesos de modelos no pacote do projeto.

Oito testes Node e dois Python passaram. Sintaxe dos scripts e bundle JSX também foram verificados. O feed, os Stories, o Worker e trabalhos de terceiros não foram alterados.
