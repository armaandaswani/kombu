# Nota de produção · Pera & Alecrim no gelo

## Ideia e origem
Transformar a sensação de gelo e água da referência enviada pelo titular em uma cena própria da Kombú. Produto literal: Penta PET de 500 ml, rótulo Pera & Alecrim. Cenário, água, gelo, pera e alecrim são imagens novas geradas para o filme; não são registro documental de parceiro ou cliente.

Referência observada: https://www.instagram.com/reel/DfH_SAlTME_/ (Vih Kombucha, 7,33 s). A análise foi visual no navegador. O download por blob não era suportado; a exportação de recursos da página também falhou. Nenhuma mídia da referência foi usada na produção. Não alegar análise via Gemini nem análise integral do áudio.

Duas cenas fotográficas novas e movimento gerado localmente com o motor LTX já instalado. A composição usa Remotion, com a geometria do rótulo acompanhada somente se a análise de movimento tiver cobertura suficiente. Preservar o formato e o conteúdo do rótulo; rejeitar frames com marca invertida ou deformada.

## Intenção da montagem
Seis planos de dois setups, aproximadamente 10,08 s. Cada take é utilizado em segmentos não repetidos: primeiro a garrafa inteira, depois materialidade do frio, retorno ao sabor, detalhe e encerramento curto ainda em movimento. Sem cartão final, contadores, barras, título de capítulo ou marca K sobreposta. A marca aparece no produto. A duração responde ao anúncio sensorial de referência, sem estender o vídeo artificialmente até a duração narrativa do filme v6.

Som: instrumental original sintetizado e acentos discretos de gelo/água também sintetizados. Sem áudio do Instagram, sem amostras de terceiros e sem narração Rayssa de avaliação privada.

## Verificação final
Análise executada em `output/pera-ice-v1/Kombu-Pera-Alecrim-Gelo-v1.mp4` com a adaptação local `look-no-drawtext.py`. A única diferença para o script da skill é remover o drawtext ausente no FFmpeg deste Mac; os cálculos dos gates são os mesmos. Comando: `--expect 10.083333 --expect-audio --events events.json --frames 12 --shown 6 --strict`.

- G0 PASS: 10,091 s, 242 frames, 24 fps, H.264, 1080×1920, áudio AAC estéreo 48 kHz; 10.889.552 bytes, abaixo de 25 MiB.
- G2 PASS: nenhum trecho com mais de três frames planos/vazios.
- G3 PASS: hold final 0,00 s; último plano 1,05 s, 10% do filme. Termina com água em movimento.
- G1 por inspeção: a marca e o sabor estão legíveis nos planos abertos e nos detalhes; não há copy de campanha sobre a embalagem. Não se atribui score automatizado de leitura.
- G4 por inspeção: a garrafa é o foco em todos os planos; gelo, pera e alecrim formam o cenário, sem painéis concorrentes.
- G5 HTML não executado: composição JSX, sem alegar PASS fictício. A inspeção das folhas de frames e transições não encontrou contadores, timecodes de campanha, barras, rótulos de cena ou cartela de rodapé.

Cinco cortes, todos confirmados pela análise: 2,00; 3,75; 5,625; 7,875 e 9,0417 s. Nenhum congelamento de 0,6 s ou mais; nenhum trecho abaixo do limiar de variação de 0,35/255. Movimento médio 4,22/255, abaixo da banda mediana dos filmes de motion graphics da skill; é um diagnóstico, não uma certificação de realismo. Aqui o que vive é água, gelo, reflexos e a pequena deriva da câmera/produto.

Áudio: -16,0 LUFS integrados, LRA 0,1 LU, pico verdadeiro -7,1 dBFS, som detectado de 0,00 a 10,07 s; cauda silenciosa de 0,021 s, sem dropouts. Um de cinco cortes está a até 80 ms de um onset detectado, 20%; não se afirma que os acentos sintetizados equivalem a gravação real de gelo.

Rastreamento: 121/121 frames visíveis em cada setup, cobertura de 100%, sem frames ocultos. A arte do rótulo da respectiva referência fotográfica é preservada na área rastreada. Revisados início, meio e fim do hero, folha de 12 frames, pré-cortes, tiras de transição e reprodução no navegador.

## Descrição da folha de 12 frames
1. Garrafa inteira inclinada em água rasa; a embalagem é o foco, não um slide.
2. Mesmo plano com novos reflexos na água e gelo à direita, sem texto de campanha.
3. Ângulo próximo com ombro, condensação e rótulo, com profundidade realista de campo.
4. O detalhe continua com corrente de água na frente e letras preservadas.
5. Retorno ao plano aberto com sombra e pera à esquerda.
6. Água atravessa a pedra ao redor da garrafa inteira.
7. O mesmo plano aberto avança antes do próximo corte; não é frame congelado.
8. O close volta com a marca legível e gelo desfocado em primeiro plano.
9. Close com a frente do rótulo e os ingredientes impressos em evidência.
10. Garrafa inteira novamente, com luz e gelo mantendo movimento.
11. Plano aberto perto do encerramento, com sombra suave sob a base.
12. Último detalhe ainda em movimento, sem card, fade ou marca de canto.

## Limitações e próxima revisão
As cenas têm origem gerada; não são filmagem documental. O movimento-base foi gerado em 576×1024 e composto em 1080×1920; detalhes pequenos do plástico, da pedra e da água continuam mais suaves que uma captação nativa em alta resolução. A proteção do rótulo ajuda a leitura, mas não substitui a revisão do titular em velocidade normal. O ritmo alterna dois setups; são seis planos editados, não seis câmeras diferentes. O hero levou 785,7 s e o detalhe 706,6 s no motor local. Não houve uso de voz clonada nem contratação de serviço pago.

Este projeto não altera o vídeo v6 aprovado, o calendário de Reels nem os horários de publicação. Entregar para revisão do titular antes de colocá-lo na fila.
