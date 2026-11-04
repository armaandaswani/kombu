# Crítica das campanhas atuais

03/11/2026. Base: `calendar.json` (posts 01 a 21, imagens em `out/`), Stories de 02/11 e 03/11 em `out/stories/`, revisão V2 em `research/2026-11-02-vih/`. Nada aqui altera calendário ou arte publicada.

## O que está bom
- A V2 acertou a direção: cenário fotográfico, luz de verdade, garrafa oficial preservada. O dono respondeu "Bem melhor" e isso vale como rumo.
- As legendas da fila evoluíram: abrem com uma situação ("Vai passar pelo São Geraldo?") e ligam as frases, como o dono pediu em 27/10.
- O filme v6 (Rosas & Cardamomo) é a peça mais forte da conta: líquido, frio, mão, ritmo.

## O que precisa mudar

### 1. A fila do feed é um catálogo com um só molde
Dos 16 estáticos que faltam publicar, 13 usam o mesmo desenho: garrafa no centro, fundo liso na cor do sabor, logo no alto, título serifado embaixo. Exemplos: 05 Frutas Vermelhas, 09 Hibisco, 11 Imunidade, 14 Lavanda & Limão, 15 Maçã & Canela, 16 "Quer saber o que vai na sua Kombú?", 18 "Fazemos Kombú em Manaus desde 2017", 19 "Guarde sua Kombú na geladeira", 20 cupom. Os três posts de parceiro (03, 10, 13) repetem até a frase: "Tem Kombú gelada na ___." mais o endereço.
No grid de três colunas isso vira uma parede de blocos coloridos. Ninguém para o dedo numa garrafa que já viu ontem com outro fundo.

### 2. A mesma garrafa volta como protagonista
O lint de seis posts passa, mas o olho não: Uva protagoniza 03, 13 e 19; Lavanda & Limão 14 e 20; Pêra & Alecrim 04 e 16; Goiaba 08 e 17; Rosas & Cardamomo 10 e 18. Como o fundo é a cor do sabor, 13 e 19 são dois quadrados roxos idênticos.

### 3. Três identidades em 21 posts
01 a 03 usam o nome digitado; 04 a 20 usam a logo V4 com "KOMBUCHA" (o manual classifica como versão anterior); 21 usa o K circular, que o manual reserva para ícone. Os Stories de 02/11 ainda saem com a V4 e os de 03/11 já com a assinatura atual. Precisa ser uma só: assinatura atual ou símbolo botânico.

### 4. Contador e falsa interface
O post 21 tem "1/4" no canto. Vários posts desenham os pontinhos de carrossel dentro da arte (01, 04, 06, 08, 12, 14, 16, 17, 20). O dono proibiu contadores em 30/10; os pontinhos são a mesma ideia e ainda imitam a interface do Instagram, que já mostra os seus.

### 5. Pergunta como fórmula
08 "Quer servir Kombú no seu estabelecimento?", 11 "Gosta de gengibre?", 14 "Já provou lavanda com limão?", 16 "Quer saber o que vai na sua Kombú?", 17 "Você é influenciador em Manaus?", 20 "Como funciona seu cupom de afiliado?". Seis títulos-pergunta em dezesseis. A do 17 é a chamada aprovada pelo dono e fica; as outras viram tique.

### 6. Quase nenhuma cena, nenhum copo
Só 07, 12 e 17 têm pessoas, e são as três cenas sintéticas de 27/10 (yoga, corrida, tênis), que já saíram nos Stories de 02/11 e 03/11. Na fila inteira do feed não há copo, servir, gelo, mesa ou mão, justamente o que a leitura da Vih concluiu que funciona ("uma cena antes de uma tese").

### 7. Um "bolha" passou para o ar
O Story 1 de 03/11 diz "As bolhas se formam na própria fermentação". O `render.mjs` bloqueia "bolha", mas o `render-stories.mjs` não tem essa checagem. E o `.agents/social-media-context-sms.md` ainda lista "a bolha vem da própria fermentação" entre as frases recomendadas. Correção para o Codex: copiar o lint de palavras do feed para os Stories e tirar essa frase do contexto.

### 8. Os Stories não conversam entre si
O dono pediu em 27/10 que os cinco do dia formem uma conversa. 02/11: frase solta sem imagem (60% da tela vazia), parceiro, Imunidade, Maracujá, tênis. 03/11: yoga, afiliados, Casa Agridoce, Hibisco, Lavanda. São cinco anúncios avulsos por dia.

### 9. A V2 melhorou a foto, mas manteve o molde
- **Uma cena para três peças.** Em cada campanha, capa, continuação e Story são a mesma foto recortada. São 4 cenas para 12 artes.
- **O mesmo layout nas quatro.** Logo no canto superior esquerdo, título serifado logo abaixo, cena ocupando o resto, selo pequeno embaixo. Muda a foto, fica o molde, que é exatamente o que o brief do Codex pede para evitar.
- **A colagem aparece.**
  - No café, a cena tem contraluz quente e a garrafa tem luz frontal de estúdio, sem sombra de contato.
  - No empório, a mesa é vista de cima e a garrafa de frente: a perspectiva é impossível.
  - Na lavanda, a garrafa está grande demais perto dos limões.
- **"Parcerias perfis" não tem produto.** Um casal segura copos de líquido âmbar, que lê como cerveja.
- **Texto abstrato.** "Sua indicação começa pela afinidade." não diz o que é nem para quem. "Conheça a revenda no site da bio" soa estranho; o mais simples é "Link na bio".

## Uma limitação técnica que muda a estratégia de interação
A API de publicação da Meta publica Stories, mas **não coloca figurinhas** (enquete, caixa de pergunta, quiz, link). Por isso a interação não pode depender delas nos Stories automáticos. Ela tem de vir:
- de uma pergunta real no fim do Story, que a pessoa responde por mensagem (resposta a Story já fica ligada);
- de uma pergunta na legenda do feed que tenha resposta de verdade, nunca isca.

Figurinhas só em Stories feitos à mão pelo dono, se ele quiser.

## Regras de composição para as próximas peças
1. A cena gerada **nunca** contém garrafa, lata ou rótulo. Ela é pedida já com o espaço da garrafa, a altura da câmera e a direção da luz definidos.
2. A garrafa oficial entra depois, sem redesenho, com:
   - sombra de contato e reflexo suave, desenhados na composição, fora da garrafa;
   - ajuste de cor só no entorno, nunca no rótulo.
3. Cena vista de cima não leva garrafa em pé. A garrafa vai num painel à parte ou num segundo slide com câmera frontal.
4. Duas peças seguidas não podem repetir:
   - a posição do texto;
   - o enquadramento (macro, de cima, frontal, plano aberto);
   - a presença humana (nenhuma, mãos, pessoa de costas, pessoa inteira).
5. Uma cena por peça. Story e feed podem compartilhar a direção, não a mesma foto recortada.
