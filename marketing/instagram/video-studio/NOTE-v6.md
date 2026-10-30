# Kombú v6 — continuação do filme

A v6 mantém os takes fotográficos gerados da v5 e acrescenta um novo enquadramento humano de provar a bebida. Não usa pessoas ou filmagens antigas do Instagram. As cenas são geradas e não devem ser apresentadas como captação documental ou depoimento.

Plano: 504 quadros a 24 fps, 21 segundos, oito planos editados e seis setups de câmera. Ver `STORYBOARD-v6.md`. Os textos de tela recebem Plus Jakarta Sans menor, sem tarja, com frases conectadas à narração; sem contadores, capítulos ou cartela final lavada. A pequena logo K continua por preferência do titular.

A geração é local, com os modelos já baixados e verificados no fluxo v4/v5, sem serviço pago ou credenciais novas. Uma imagem-base nova foi criada com a ferramenta integrada imagegen; asset e prompts em `assets/generated/realistic-v6/`. O único novo movimento neural é o take `finish`.

A Rayssa Original reutiliza a narração privada já produzida na v5, sem mudar sua velocidade nem gerar outro clone. O motor HumanVoice instalado informa pesos OmniVoice CC-BY-NC: esta versão narrada permanece restrita à avaliação privada e não é enviada ao calendário ou Instagram. O instrumental é original do projeto; o foley de servir é o mesmo CC0 creditado em `assets/audio/CREDITS.md`.

A revisão incluiu a folha de 16 quadros, as imagens anteriores aos cortes e os strips de cada transição. O primeiro render tinha pouco contraste nos textos sobre a pedra clara; o render final usa verde nesses pontos e contorno discreto nos textos brancos. Não há tarjas nem texto no rosto do take final. Os oito testes Node e dois testes Python existentes passaram após parametrizar a composição para um diretório de assets novo, preservando o padrão da v5.

## Arquivos e reprodução

- `output/realistic-v6/Kombu-Filme-Rayssa-v6-Previa-Privada.mp4`: montagem com a narração já produzida, restrita à avaliação privada.
- `output/realistic-v6/Kombu-Filme-v6-Sem-Locucao.mp4`: mesma imagem, com trilha original e foley, sem a voz clonada.
- `scripts/compose-v6.mjs`: monta os oito planos, mixa e exporta as duas versões. `src/MontageFilm.jsx` é a composição editável, em Remotion; não há arquivo HTML de animação usado no render.
- `projects/realistic-v6.json` e `assets/generated/realistic-v6/PROMPTS.md`: prompts e proveniência. A imagem-base foi criada pela imagegen integrada; a animação foi gerada no LTX local, com modelos já verificados na v4/v5.
- `output/realistic-v6/legendas-pt-BR.srt`: transcrição sincronizada reutilizada da voz da v5.

O take novo levou 458,6 s; o motor registrou pico Metal de 9,27 GB. Os outros cinco setups são as cenas originais geradas para a v4/v5. Há oito planos editados e seis setups, não oito ângulos diferentes. A narração não foi esticada nem acelerada. A trilha foi sintetizada novamente para 21 s, sem repetir um trecho já encerrado.

## Gates calculados no MP4 final

A adaptação local de `look.py` remove apenas o filtro drawtext indisponível no FFmpeg deste Mac. Execução final com `--expect 21 --expect-audio --events events.json --strict`.

- G0 PASS: duração 21,013 s, 504 frames, 24 fps, 1080×1920 H.264, áudio presente.
- G2 PASS: nenhuma sequência com mais de três frames planos/vazios.
- G3 PASS: último plano de 3,39 s, 16% do filme; hold final 0,00 s. O filme termina durante o gesto, intencionalmente.
- G1 por inspeção: rótulo principal visível nos planos de produto; texto de tela entre 52 e 54 px, com contraste corrigido sobre a pedra. Não se atribui uma medição automatizada de legibilidade.
- G4 por inspeção: cada cena tem um assunto principal: garrafa, fluxo, copo ou pessoa bebendo. A garrafa no fundo do take humano está fora de foco; não é tratada como segundo hero.
- G5/lint HTML: não aplicável ao JSX de Remotion; não foi alegado PASS automatizado. A inspeção não encontrou contadores, timecodes, barras, rótulos de cena ou cartela final de site. A pequena logo K é preferência expressa do titular.

Cortes detectados: sete, todos explicados pelos eventos, em 1,75; 3,7917; 5,875; 9,25; 11,9583; 14 e 17,625 s. Nenhum congelamento de 0,6 s ou mais. Há um trecho de deriva muito lenta no produto, de 11,96 a 14 s; foi preservado como plano de identificação do sabor.

Áudio: -16,0 LUFS integrados, LRA 5,0 LU, true peak -3,9 dBFS. Som detectado de 0,07 a 20,85 s, sem dropouts; cauda silenciosa de 0,163 s. Três dos sete cortes estão a até 80 ms de um onset de som, diagnóstico de 43%, sem transformar isso em certificação de qualidade.

Movimento médio de luminância: 2,04/255. Está abaixo da referência de motion graphics do analisador, mediana 6,8; a peça usa planos fotográficos contidos. O número é diagnóstico e não foi removido nem transformado em nota de aprovação.

## Descrição da folha de 16 quadros

1. Macro da tampa, ombro e condensação da garrafa, com a textura do frio como assunto.
2. Garrafa inteira com o rótulo rosa e a frase inicial na base da imagem.
3. O mesmo plano de produto continua com embalagem e texto legíveis.
4. Retorno ao macro da gota, com a frase sobre suavidade e sabor.
5. A mão inclina a garrafa e o primeiro fluxo ocupa o copo.
6. O servir continua, com o nível do líquido subindo e a frase acompanhando a fala.
7. O fluxo continua sem texto, dando espaço à ação.
8. O ângulo de cima mostra a mesma garrafa e o copo, com a frase sobre fermentação na pedra livre.
9. O líquido se movimenta no copo visto de cima, sem texto.
10. A garrafa inteira retorna para identificar Rosas & Cardamomo.
11. O rótulo continua como foco, sem frase sobreposta à embalagem.
12. A mão levanta o copo e o texto final aparece na pedra, com contraste verde.
13. O copo se inclina levemente, mantendo a bebida e a refração como assunto.
14. Uma personagem adulta fictícia aproxima o copo dos lábios na mesma varanda.
15. O vidro alcança os lábios e a mão mantém anatomia consistente nos quadros inspecionados.
16. O take termina durante um pequeno gole, sem cartela ou texto cobrindo o rosto.

## Limites e continuidade

O novo take e os anteriores são síntese, não captação real. A exportação é 1080×1920, mas o movimento neural novo foi gerado em 576×1024; a ampliação não restitui detalhe óptico de uma filmagem nativa. Refração e textura fina ainda podem variar entre quadros. A aparência e o ritmo continuam sujeitos à avaliação do titular. A variante com Rayssa não deve ser publicada comercialmente nas condições atuais do motor de voz. Nenhuma das duas versões foi enviada ao publicador automático.

A reprodução no player local terminou em 21,013 s, com `ended=true`, `muted=false` e `readyState=4`. As duas versões têm o mesmo hash do fluxo de vídeo H.264: `930428f9df1a5eeefed671962405b8037bcd2635b3bf6dd328700e9a6b700b42`; a variante sem locução remove apenas a voz do mix.
