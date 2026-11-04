# 08-revenda — notas de produção

## Slide 1, cena nova `cenas/08-1b.png` (03/11/2026)

Motivo: na cena antiga (`08-1.png`) o vão da prateleira tinha só uns 430 px (fita de LED em cima, prateleira a 65%) e a faixa do título cobre os 32% de cima; as garrafas ficavam com 370 px e a metade de baixo da arte vazia. Reposicionar maior na mesma cena não dava: elas bateriam na fita de LED.

Foram geradas quatro opções no Canva (`PORTRAIT_4_5`):
- duas com o pedido de "prateleira a 88%" no mesmo estilo da antiga: a IA voltou a pôr a prateleira perto de 65%, com o mesmo problema;
- uma de balcão de madeira com a geladeira desfocada ao fundo: balcão a 65%, mesmo problema;
- a escolhida: interior da geladeira, só a prateleira de baixo, sem prateleira em cima. Media id `MAHZ6UubMOc`, exportada em 1080 × 1350 pelo design `DAHZ5e6UBzU`.

Prompt usado (escolhido):

> Fotografia frontal, câmera baixa, do interior de uma geladeira expositora de bebidas de porta de vidro aberta, num café contemporâneo em Manaus. Só uma prateleira aparece: uma prateleira larga de aço inox com grelha fina, vazia, cuja superfície de apoio fica rente à parte de baixo da imagem, por volta de 88% da altura. Não aparece nenhuma outra prateleira acima: de 88% até o topo da imagem, só o fundo da geladeira, um painel traseiro de aço escovado com névoa de frio e gotas de condensação, iluminado por fitas de LED frias verticais nas duas laterais. Nas bordas laterais, o café quente e desfocado aparece pela porta aberta. Lente 50 mm, perspectiva reta, linhas niveladas. + `sufixo` de `cenas.json`.

Pedido de integração de luz:

> Integre as três garrafas à cena como se tivessem sido fotografadas junto: elas estão em pé sobre a grelha de aço inox da prateleira da geladeira expositora, lado a lado, com espaço entre elas. Mesma luz fria das fitas de LED laterais, que acendem as bordas das garrafas, sombra de contato na grelha, reflexo suave no metal, gotas de condensação no plástico por causa do frio. Não mude o formato das garrafas, as tampas, os rótulos, as letras, as cores dos rótulos, o tamanho nem a posição. Não mude a geladeira, o enquadramento nem o resto da cena. Fotografia realista.

Posição: as três em pé, `base 91`, `h 620`, `x 27 / 50 / 73` (uns 45 a 50 px entre elas). O `luz.mjs` achou as três com 629 px, base y 1248. Na goiaba o rótulo desce mais que nas outras; `luz.rotulo` dela foi para `[0.31, 0.86]` para o "MANTER SEMPRE GELADO | 100% NATURAL" voltar nítido do arquivo oficial.

Antigos preservados: `saida/08-revenda/1-antiga.jpg` e `1-luz-antiga-deitada.png` (esse nome é só o backup da versão anterior; no 08 as garrafas já estavam em pé).
