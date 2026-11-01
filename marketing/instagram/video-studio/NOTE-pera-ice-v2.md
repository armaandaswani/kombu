# Nota de produção · Pera & Alecrim v2

## Revisão do titular
A v1 tinha pouca variação. A v2 mantém o sabor e o ambiente, acrescentando serviço e líquido em outro enquadramento: sete planos de quatro setups, 11,833 segundos planejados. Fontes, decisões e beats completos em STORYBOARD-pera-ice-v2.md.

## Origem e limites
As cenas são geradas e ilustrativas, com aparência fotográfica; não são uma filmagem documental. Hero/detail são a criação original da v1. Servir e copo são duas imagens novas criadas com imagegen integrado, com movimento local LTX, sem API paga. Não há mídia ou música retirada da referência do concorrente.

Garrafa Penta PET 500 ml e rótulo Pêra & Alecrim como referência. O rótulo do servir acompanha a inclinação da garrafa: topo voltado ao gargalo, sem contrarrotação. Tracking aceito em 67/81 frames totais do take; somente os primeiros 40 entram no filme, todos com tracking aceito (40/40). Retirada final da garrafa excluída. Hero/detail mantêm os tracks originais de 121/121 frames cada. Não se trata de seis ângulos: há quatro setups físicos e sete segmentos editados, sem repetição/reversão de frames.

Trilha instrumental e acentos sintetizados originalmente, com textura de servir sincronizada. Sem samples de terceiros nem voz Rayssa restrita. Nenhum texto, contador, K circular ou end card sobreposto. Marca no produto. A v1 foi preservada. Nenhum agendamento ou publicação foi alterado.

## Geração
A primeira tentativa local de servir teve erro Metal no encoder e não produziu vídeo. Nova execução com prompt mais curto completou em 489,7 s, 81 frames a 24 fps. O take de copo completou em 486,4 s, 81 frames a 24 fps. O primeiro corte de 56 frames do servir foi reduzido a 40 após revisar artefatos no contorno do rótulo durante a retirada. Uma máscara mais larga trouxe bordas de fundo; foi rejeitada e a máscara anterior preservada. Os últimos 41 frames do copo encerram o filme sem repetir os 40 primeiros.

## Verificação final
Arquivo 1080×1920 H.264, 24 fps, 284 frames; duração do contêiner 11,84 s, AAC stereo 48 kHz. O motor local gera em 576×1024: export ampliado, não captura nativa de alta resolução. Código MJS validado com node --check; Python compilado; composição e rastreio executados de fato. git diff --check sem erros.

Auditoria pelo look-no-drawtext.py local (a adaptação remove só o timestamp, pois o FFmpeg instalado não tem drawtext; cálculos originais preservados):
- G0 PASS: 11,84 s corresponde ao plano 11,83 s, vídeo decodifica e áudio presente.
- G2 PASS: nenhuma sequência com mais de três frames planos.
- G3 PASS: hold final 0,00 s; último plano 1,71 s = 14% do filme, encerramento deliberado em movimento.
- G1 e G4: avaliação visual da folha, mids e transições; rótulos legíveis nos planos de produto, um foco principal por quadro, mão e copo compõem uma ação. Sem atribuir pontuação automática.
- G5: lint HTML não se aplica ao JSX; inspeção visual confirma ausência de barras, contadores, metadados e cartão final. Não alegar PASS automático.
- Movimento médio 4,08/255, abaixo da faixa de motion graphics do script; água, líquido, gelo e folhagem mudam continuamente. Sem trecho congelado de 0,6 s ou mais; nenhum trecho estático abaixo de 0,35/255.
- Áudio −16,0 LUFS, LRA 0,1 LU, true peak −7,1 dBFS; silêncio final 0,02 s, sem dropouts ou flags. Zero de seis cortes a até 80 ms de onset detectado: score suave, não montagem com batida forte. A textura de servir acompanha seu intervalo visual; não equivale a som gravado real.

Folha de 12 frames, uma descrição por frame:
1. Garrafa inteira sobre água e pedra, rótulo verde e pera visíveis; quadro fotográfico, sem layout de slide.
2. Mesmo overhead com água em outro instante; produto continua sendo o foco.
3. Close baixo de condensação e marca; o frio passa pela textura.
4. Outro instante do close com água se deslocando junto ao corpo da garrafa.
5. Mão serve o líquido no copo; rótulo gira fisicamente junto à garrafa.
6. Copo pronto, gelo e reflexos em close; líquido substitui embalagem como foco.
7. Outro instante do copo, com superfície e gás se movendo.
8. Retorno à garrafa inteira no segmento posterior do take original.
9. Água e ingredientes mantêm o mesmo ambiente ao redor do produto.
10. Detalhe de condensação retoma a identidade antes do final.
11. Copo com gelo em movimento, sem texto ou cartão.
12. Último instante do copo mantém luz e cor, sem desbotar para branco.

Limites: cenas sintéticas, microtextura e gás ainda menos ricos que filmagem macro real. O nível do líquido não constitui continuidade documental entre os setups; a montagem é um ensaio sensorial. Sem promessa de saúde nem ação atribuída a cliente real. Versão pronta para revisão do titular, não inserida no calendário comercial.

SHA-256 do export: 1a75df7032db5ddb0a4e3e6776d4d7c52f16a7cd9c3fefc5e9a869b860c6c382
Tamanho: 12558596 bytes.
