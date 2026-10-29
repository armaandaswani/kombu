# Inspeção da primeira prévia

Data local: 28/10/2026. Projeto final: `output/reel-1793233432413`. Arquivo: `Kombu-Reel.mp4`. Duração medida: 13,717 s, 1080 × 1920, 30 fps, H.264/AAC, yuv420p, BT.709, faststart.

## Ideia e material

Uma aproximação da embalagem dá espaço ao detalhe e termina com o trio de sabores. O primeiro plano apresenta o produto; o detalhe evidencia condensação e rótulo; o último indica parceiros. Fotografias de embalagens aprovadas, sem alterar os nomes. Cenário ilustrativo de pedra, luz e sombras em Three.js; garrafas em planos 2.5D, não modelos volumétricos. Não representa fábrica ou interior de parceiro. A composição pode evoluir com filmagens reais de servir.

A voz final é Rayssa Original (`rayssa`), solicitada pelo titular e gerada pela fila autorizada do HumanVoice. Não é Rayssa 2. Preservamos o ritmo do perfil, sem alteração de velocidade. Chatterbox padrão também gerou uma versão real do roteiro, preservada localmente como teste, sem substituir a voz escolhida. Transcrição final feita com faster-whisper small; modelo base foi rejeitado por erros em “Kombú” e “suavidade”.

A prévia com Rayssa é privada: o motor instalado informa avaliação não comercial, com pesos OmniVoice CC-BY-NC. Não foi enviada ao Instagram ou calendário. O consentimento do perfil não muda a licença dos pesos.

## Medições finais

- G0 PASS: 13,72 s medidos para 13,70 s planejados, vídeo em movimento e áudio presente.
- G2 PASS: nenhum trecho de mais de três quadros planos/vazios.
- G3 PASS: encerramento resolvido de 0,63 s; último plano 3,02 s, 22% do filme.
- G5 PASS: lint DOM em 1080 × 1920, sem os padrões de chrome detectados pelo script.
- Áudio: −15,7 LUFS integrados, LRA 1,7 LU, pico verdadeiro −4,5 dBFS; silêncio inicial 0,35 s e final 0,47 s; nenhuma falha de silêncio apontada.
- Movimento médio: 0,59/255 de diferença de luminância. Abaixo da faixa de referência do skill: é uma peça de produto com movimento calmo, não uma animação dinâmica. Isso permanece uma limitação de direção para o próximo filme.
- Nenhum corte ficou a ±80 ms de um ataque sonoro. Não há música ou efeitos nesta versão; os cortes seguem a mudança visual, com a narração contínua.

O `look.py` original não conseguiu desenhar timecodes porque o FFmpeg Homebrew deste Mac não contém `drawtext`. Uma cópia local ignorada removeu somente a gravação visual dos timecodes; cálculos, limites e análise ficaram iguais. Relatórios, sheet, mid e strips estão em `output/.../look-final/`. O G5 foi executado com o script original. Não se alterou o skill global.

## Leitura do contact sheet, em ordem

1. O trio aparece apoiado na pedra, com Jasmim & Manga ao centro e o convite surgindo acima.
2. A câmera aproxima o trio e o rótulo central ganha presença.
3. A aproximação continua, com o texto principal ainda legível e a legenda falada abaixo.
4. O título sai e a narração passa à origem de Manaus.
5. O produto central cresce enquanto os sabores laterais permanecem como contexto.
6. O primeiro plano termina com a garrafa central dominante e sem título sobreposto.
7. O corte entra no detalhe do rótulo e da condensação, com a origem discreta acima.
8. A câmera percorre o detalhe enquanto a legenda menciona o ano e a produção artesanal.
9. O detalhe continua com o nome e as ilustrações do rótulo visíveis.
10. A embalagem central ocupa o quadro, com o sabor e o volume reconhecíveis.
11. O plano se move lateralmente durante a frase de apresentação.
12. O detalhe resolve antes do convite aos parceiros.
13. O corte abre novamente para o trio, enquanto K e convite começam a aparecer.
14. O convite aos parceiros e K estão resolvidos, com a última legenda ainda visível.
15. O trio permanece apoiado e a narração encerra.
16. A legenda sai e o encerramento mantém K, convite e embalagens por menos de um segundo.

G1, por observação: texto e legenda têm contraste e área de leitura; o detalhe permite ler o rótulo principal, mas letras pequenas da embalagem não são o conteúdo editorial. G4, por observação: a embalagem central é o foco em todos os planos, os dois outros sabores dão contexto. Revisei também os quadros antes/depois dos dois cortes. A escuta humana da identidade, pronúncia e naturalidade continua pendente da avaliação do titular; não foi certificada por métricas.

## Ferramenta e verificação

A interface foi testada em 1440 × 1000 e 390 × 844, sem rolagem horizontal; campos têm rótulos e foco visível. Testei seleção de sabores, rejeição de duplicados e o botão Gerar vídeo até o MP4 real. A prévia carregou no player. O servidor aceita apenas loopback, limita o corpo, rejeita origem externa e serve arquivos em diretórios delimitados. Seis testes passaram para caminhos/sabores, linguagem rejeitada, SRT OpenCut, bloqueio de produção concorrente, nome Imunidade e hashtags. `npm audit` terminou com zero vulnerabilidades após correção compatível de Zod.

OpenCut: o parser SRT real do Classic validou todas as cues, sem cues descartadas, e o ZIP oferece vídeo sem legendas, áudio e SRT. O editor gráfico OpenCut não foi embutido ou iniciado, e o pacote não é um projeto nativo. A importação manual completa no editor não foi verificada; essa é uma limitação explícita desta integração.

Próxima melhoria editorial: usar filmagem de servir ou uma cena ilustrada aprovada para acrescentar ação real além do movimento de câmera. O titular aprovou ilustração como estilo ocasional, não como substituto de todas as imagens.
