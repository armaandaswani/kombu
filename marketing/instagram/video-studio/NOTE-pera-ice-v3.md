# Nota · Pera & Alecrim v3, sem takes repetidos

O titular exigiu um take diferente a cada corte. A v3 retira as revisitas da v2: quatro takes originais distintos, uma única vez cada. Sequência overhead → close oblíquo → servir → macro do copo. Mesma ideia sensorial e fontes próprias da v1/v2, sem nova geração, mídia de terceiros ou voz restrita. Storyboard e configuração editáveis em STORYBOARD-pera-ice-v3.md e projects/pera-ice-v3.json. Nenhuma publicação ou fila alterada. Versões anteriores preservadas.

## Verificação
- Invariante: quatro entradas no edit, quatro nomes e imagens-fonte distintos; uniqueTakes=true. O compositor rejeita fonte de take repetida quando essa opção está ativa. Cada arquivo de take é usado uma única vez, sem trechos posteriores, reenquadramentos ou reversão para simular outro take.
- Export: 228 frames, 24 fps, 1080×1920 H.264, AAC stereo 48 kHz. Plano 9,50 s, contêiner 9,52 s.
- G0 PASS: duração 9,52 corresponde a 9,50; áudio presente, decodificação válida.
- G2 PASS: nenhum trecho com mais de três frames planos.
- G3 PASS: hold final 0,00 s; último plano 2,35 s, 25% arredondado do filme, encerramento em movimento.
- G1/G4 revistos visualmente na folha e nas transições; rótulo e produto claros, um foco por plano, mão/copo constituem uma ação. Não são notas calculadas.
- G5 lint HTML não aplicável a JSX. Inspeção visual sem contadores, texto, HUD ou end card; não reivindicar PASS automático.
- Movimento médio 3,90/255; sem congelamentos >=0,6 s ou trechos estáticos abaixo de 0,35/255. Faixa comparativa de motion graphics do script é maior que este filme calmo.
- Áudio −16,0 LUFS, LRA 0,1 LU, true peak −7,1 dBFS; audível 0,00–9,49 s, silêncio final 0,03 s, sem dropouts ou flags. 0/3 cortes dentro de 80 ms de onsets detectados. Som de servir sintetizado sincronizado entre 5,50 e 7,167 s, sem samples de terceiros.
- Auditoria: look-no-drawtext.py, adaptação existente que remove timestamp por ausência do filtro drawtext, preservando os cálculos. Saída completa em output/pera-ice-v3/look-final.txt. node --check e git diff --check sem erros.

## Folha de oito frames
1. Garrafa inteira em água rasa, com pera e alecrim, produto como foco.
2. Outro instante dentro do mesmo primeiro take, com água em movimento, sem corte.
3. Último instante amostrado do primeiro take, mantendo a embalagem reconhecível.
4. Close oblíquo de condensação, um novo take após o primeiro corte.
5. Outro instante dentro do close; o mesmo take continua sem sair e voltar.
6. Mão serve no copo em vista lateral, novo take.
7. Macro do copo pronto, quarto e último take.
8. Continuação do macro até terminar, sem retornar à garrafa.

## Limites
As cenas são sintéticas com aparência fotográfica; não filmagem documental. Mantém os limites de detalhe e continuidade de líquido entre setups descritos na v2. Fontes locais geradas em 576×1024, export ampliado. Não apresentar como captura nativa em alta resolução. A correção entrega sequência mais curta em vez de preencher tempo repetindo takes. Nada foi publicado ou agendado.

Export SHA-256: 91b85ac56f73bf4aff1fee299ed1ae1ce7f1b6a306dabe3d25757fbac1132a61
Tamanho: 10181379 bytes.
