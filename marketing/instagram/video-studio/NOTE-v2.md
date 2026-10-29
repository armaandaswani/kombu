# Revisão sensorial v2 — 28/10/2026, Manaus

O titular rejeitou o final desbotado e as legendas em caixas verdes. Pediu close da garrafa com condensação, seguido de um servir bonito no copo, e enviou 20 referências de vídeos/posts. A leitura visual dessas referências está em `references/2026-10-28/LEITURA-VISUAL.md`, com seus limites explícitos.

## O que mudou e por quê

- Fotografias das embalagens com `fog: false`: a névoa do cenário estava clareando os produtos conforme a distância da câmera, sobretudo no final. Preservamos as cores do arquivo aprovado, sem tentar compensar isso com saturação artificial.
- Close com microgotas refrativas, crescimento e alguns percursos de gravidade. Efeito animado em Three.js sobre a foto já condensada, não filmagem de condensação real. Uma primeira tentativa com gotas grandes pareceu artificial e foi reduzida.
- Corte do close para filmagem do titular: `KB Rosas Closeup.mov`, recorte de 5,5 s em diante, focando líquido e copo. O sabor principal é Rosas & Cardamomo para corresponder ao material real. A embalagem antiga e seus textos ficam fora do recorte; não usamos o material como representação da embalagem atual.
- Legendas em 40 px, Plus Jakarta Sans, brancas com sombra discreta, sem tarja; agrupadas por trechos da fala. Nenhuma palavra ou timestamp se perde na divisão.
- O encerramento continua com o K pequeno, três sabores e convite aos parceiros. Tem movimento de câmera até a resolução final breve.

Roteiro e voz são os mesmos da prévia autorizada anterior. Reutilizamos o WAV da Rayssa Original para comparar a montagem visual sem trocar a performance. A condição de avaliação privada não comercial do HumanVoice permanece. Não enviamos o Reel ao Instagram ou ao calendário.

## O que foi medido

Projeto: `output/sensorial-v2`. MP4 final: 1080 × 1920, 30 fps, H.264/AAC, BT.709; duração 13,717 s.

- G0 PASS: duração 13,72 s para 13,70 s planejados, movimento e áudio presentes.
- G2 PASS: nenhum trecho de mais de três quadros vazios/planos.
- G3 PASS: resolução final de 0,60 s; último plano 3,02 s, 22% do vídeo.
- G5 PASS: lint de composição 1080 × 1920, sem padrões de chrome detectados.
- Movimento médio: 1,52/255; continua abaixo da faixa comparativa do skill, embora o servir acrescente ação ao filme. Não é uma certificação de ritmo ou qualidade.
- Áudio: −15,7 LUFS, LRA 1,7 LU, pico verdadeiro −4,5 dBFS; silêncio inicial 0,35 s e final 0,47 s; sem flags de áudio no relatório.
- Dois dos três cortes ficaram a ±80 ms de um ataque sonoro. Não acrescentamos música ou som de servir fabricado.

A auditoria usa a mesma cópia local de `look.py` sem gravação visual de timecodes, pois o FFmpeg instalado não contém `drawtext`; os cálculos não foram alterados. O lint original foi usado. Um erro de inicialização da nova câmera foi encontrado no teste de seek e corrigido antes da versão final. A cena foi percorrida nos tempos 0, 3, 4, 5,2, 7 e 12,5 s; repetir o mesmo tempo produziu o mesmo canvas, enquanto tempos distintos mudaram a imagem.

## Contact sheet final, em ordem

1. Trio de garrafas com Rosas & Cardamomo no centro, título e primeira legenda.
2. A câmera aproxima o trio, mantendo o rótulo principal como foco.
3. O primeiro plano termina com a fala sobre suavidade.
4. O corte mostra a parte transparente e o rótulo da garrafa no close.
5. Microgotas aparecem no close, sem outra ação concorrendo no quadro.
6. A origem em Manaus entra na narração, com o produto ainda em detalhe.
7. A câmera percorre a condensação antes da mudança para o copo.
8. O corte revela o copo real ainda vazio, antes da entrada do líquido.
9. O líquido começa a acumular no fundo do copo, com a narração contínua.
10. O fluxo e o nível do líquido mudam durante o servir.
11. O copo segue recebendo a bebida, sem rótulo antigo no quadro.
12. O servir continua até a passagem para o convite aos parceiros.
13. O corte volta ao trio, com o K e o convite aparecendo.
14. O produto se aproxima no encerramento, mantendo as cores dos arquivos aprovados.
15. A última legenda termina com o convite aos parceiros.
16. O trio e o K resolvem brevemente antes do fim.

G1, por inspeção: as novas legendas têm leitura direta sem caixa de fundo e o detalhe mostra a embalagem; algumas letras pequenas do rótulo continuam sem ser conteúdo editorial. G4, por inspeção: o foco é a garrafa central, depois o fluxo/copo, depois o trio; não há dois acontecimentos concorrendo no mesmo plano. Foram inspecionados os quadros antes e depois dos três cortes. A percepção de naturalidade das gotas e da voz continua sujeita à avaliação do titular.

## Verificações da ferramenta

Sete testes Node para regras de marca, caminhos, sabores, SRT, concorrência, hashtags e correspondência entre sabor/filmagem; dois testes Python para agrupamento das legendas sem perda de palavras ou tempos. O preset “Rosas & Cardamomo com servir real” aparece no estúdio e exige o mesmo sabor principal. O player abre a nova versão. Remotion Studio passa a carregar o último projeto gerado, com suas legendas, em vez do projeto antigo fixo. Nenhuma credencial foi copiada para a interface ou para o Git.

Limites: o cenário/condensação são ilustrativos; o servir é filmagem própria existente, com o enquadramento e a iluminação dessa gravação. Um novo take do servir, dirigido no mesmo cenário da garrafa, daria maior unidade de luz entre os planos. As referências de terceiros não entram no filme ou no ZIP de edição.
