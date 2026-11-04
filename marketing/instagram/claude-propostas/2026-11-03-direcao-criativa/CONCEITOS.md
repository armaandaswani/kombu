# Seis conceitos: consumo, revenda e parcerias

03/11/2026. Propostas para o dono avaliar. Nada entra em calendário sem aprovação ([HANDOFF-CLAUDE.md](../../HANDOFF-CLAUDE.md) §9). Crítica que motivou as escolhas: [CRITICA.md](CRITICA.md).

## Regras que valem para os seis
- **Garrafa:** a cena gerada nunca tem garrafa, lata, rótulo, logo ou texto. A garrafa oficial (`assets/bottles/*.webp`) entra depois, sem redesenho, com sombra de contato desenhada fora dela. Onde a câmera está de cima, a garrafa vai num slide à parte.
- **Marca:** assinatura atual ou símbolo botânico de `assets/brand/`; nunca a V4 com "KOMBUCHA" nem o K circular.
- **Arte:** sem contador, sem pontinhos de carrossel, sem "!", sem travessão, sem emoji. Só "gás", nunca "bolha".
- **Pessoas:** adultos fictícios, nunca apresentados como clientes, profissionais parceiros ou depoimento.
- **Parceiros nas legendas:** @divinaterramanaus, @casaagridoceam, @cafeteriagarden_, com @solarcaferegional sempre por último. A Gelateria Dolce Vita é @ladolcevitagelataria (confirmado pelo dono em 03/11).
- **Sufixo comum dos prompts** (colar no fim de cada um):
  > Fotografia realista, aparência de câmera full-frame com lente real, cores naturais e textura de filme sutil. Não incluir nenhuma garrafa, lata, embalagem, rótulo, logotipo, marca ou texto legível. Pessoas, se houver, são adultos fictícios. Formato vertical 4:5 (1080 × 1350).

## O que muda de um conceito para o outro

| # | Público | Formato | Sabor | Enquadramento | Pessoas | Luz | Onde fica o texto |
|---|---|---|---|---|---|---|---|
| 1 | Consumo | Carrossel 3 (ou Reel) | Hibisco & Anis Estrelado | Macro, altura do copo | Nenhuma | Sol duro da manhã em listras | Canto inferior esquerdo, na sombra |
| 2 | Consumo | Carrossel 2 | Maracujá | Frontal na altura da mesa, depois macro | Nenhuma | Meio-dia filtrado por folhas | Faixa creme no alto; canto no slide 2 |
| 3 | Revenda | Imagem única + Story | Maçã & Canela, Goiaba, Manga & Jasmim | Frontal, plano fechado | Nenhuma | LED frio com fundo quente | Faixa sólida no alto |
| 4 | Revenda | Carrossel 3 | Rosas & Cardamomo | De cima, plano | Nenhuma | Janela lateral suave | Dentro do cardápio, como parte da cena |
| 5 | Parcerias, profissionais | Carrossel 3 | Pêra & Alecrim | De cima, close | Nenhuma | Manhã quente, sombra de janela | Centralizado no cartão, como carta |
| 6 | Parcerias, influenciadores | Imagem única + Story | Flor Fada Azul & Blueberry | Por cima do ombro, altura da mesa | Antebraços e mãos | Janela de manhã e luz de LED | Faixa colorida embaixo |

Os seis sabores são diferentes entre si e diferentes dos protagonistas da V2 (Imunidade, Pêra & Alecrim no empório e Lavanda & Limão). Pêra & Alecrim reaparece no 5 porque o contexto é outro; se o dono preferir, troca por Frutas Vermelhas.

---

## 1. Consumo · "O perfume chega antes"
**Sabor:** Hibisco & Anis Estrelado · **Formato:** carrossel de 3; pode virar Reel de 4 takes distintos.

**Chamada (slide 1):** Primeiro vem o perfume do anis estrelado, depois o hibisco.

**Composição**
- **Slide 1:** macro de um copo alto de vidro liso num peitoril de madeira escura. O líquido rosa-rubi entra por cima, num fio que vem de fora do quadro, com gelo e gás subindo e condensação no vidro. O sol da manhã atravessa uma persiana e faz listras sobre o copo. Texto pequeno em creme no canto inferior esquerdo, sobre a parte em sombra; assinatura creme pequena no canto superior direito.
- **Slide 2:** garrafa oficial de Hibisco & Anis Estrelado à esquerda, sobre papel creme com a mesma luz em listras, desenhada na composição e sem tocar o rótulo. Texto à direita: "O hibisco traz a cor e a acidez, e o anis estrelado entra pelo perfume. O gás se forma na própria fermentação, que fazemos de forma artesanal aqui em Manaus."
- **Slide 3:** fundo rubi profundo (#980549) com a lista dos parceiros em creme e a linha "Pergunte quais sabores estão gelados hoje."
- **Versão Reel:** quatro takes, cada um usado uma única vez: o fio caindo no copo em macro, o gelo assentando, o copo inteiro com a persiana, e uma mão adulta pegando o copo e saindo do quadro.

**Legenda**
```
Tem gente que repara primeiro na cor.

Quando você serve uma Kombú de Hibisco & Anis Estrelado, quem chega antes é o perfume do anis.

O hibisco traz a cor e a acidez, e o gás vem da própria fermentação, que fazemos de forma artesanal aqui em Manaus. Bem gelada, ela fica suave no gole e intensa no sabor.

Você encontra a Kombú gelada na @divinaterramanaus, na @casaagridoceam, na @ladolcevitagelataria, na @cafeteriagarden_ e no @solarcaferegional. Pergunte quais sabores estão gelados hoje.

#kombucha #manaus #kombuchaartesanal #hibisco #aartedonatural
```

**Prompt (slide 1)**
```
Macrofotografia de um copo alto de vidro liso, transparente e sem desenhos, sobre um peitoril de madeira escura envernizada, junto a uma janela de um apartamento em Manaus. Um fio fino de líquido rosa-rubi translúcido entra no copo pelo topo do quadro, vindo de fora da imagem; não mostrar de onde ele sai. O copo está dois terços cheio, com três cubos de gelo claros, gás fino subindo em linhas e gotas de condensação na parte de fora do vidro. Sol forte das 8 da manhã atravessa uma persiana de madeira e projeta listras de luz e sombra sobre o copo e o peitoril; o líquido brilha onde a luz bate. Câmera na altura do copo, lente 100 mm macro, profundidade de campo curta, fundo da sala desfocado em tons quentes. Deixar o canto inferior esquerdo em sombra limpa, sem objetos, para texto.
```

**Prompt (fundo do slide 2)**
```
Folha grande de papel de algodão cor creme, lisa e sem textura forte, fotografada de frente na vertical, com listras de sol de persiana atravessando em diagonal da esquerda para a direita. Superfície vazia, com uma área livre no terço esquerdo onde depois será colocada uma garrafa em pé, vista de frente, iluminada pela esquerda.
```

---

## 2. Consumo · "Almoço leve"
**Sabor:** Maracujá · **Formato:** carrossel de 2. Ajustado em 03/11 a pedido do dono: o prato compõe a cena, mas o foco é a Kombú.

**Chamada (slide 1, faixa no alto):** No almoço, a Kombú de Maracujá vai com a polpa e as sementes da fruta.

**Composição**
- **Slide 1:**
  - **Cena:** frontal, com a câmera na altura da mesa. A garrafa oficial de Maracujá é a protagonista, no terço esquerdo e nítida, com sombra de contato na madeira.
  - **Ao lado da garrafa:** um copo com líquido amarelo-dourado, sementes e gelo.
  - **Atrás, um pouco à direita e levemente desfocado:** um sanduíche natural cortado ao meio sobre tábua de madeira.
  - **Luz:** meio-dia filtrado por folhas, vindo da esquerda.
  - **Texto:** a chamada em faixa creme (#FFF7ED) no alto, com letra tinta.
- **Slide 2:**
  - **Cena:** macro do copo, com as sementes suspensas e o gás subindo. Sem pessoas. O sanduíche só aparece como forma desfocada no fundo.
  - **Texto:** no canto inferior esquerdo: "Ácida e refrescante, com o gás natural da fermentação."

**Legenda**
```
Um sanduíche natural no almoço pede uma bebida gelada e de sabor marcado.

A Kombú de Maracujá é feita com a polpa da fruta, sementes incluídas. Ela é ácida e refrescante, com o gás natural da fermentação, e fica melhor servida bem gelada, direto da geladeira.

Que sanduíche você pediria com ela? Os kits para levar para casa estão no site, link na bio.

#kombucha #manaus #maracuja #kombuchaartesanal #aartedonatural
```

**Prompt (slide 1)**
```
Fotografia frontal, com a câmera exatamente na altura do tampo de uma mesa de madeira clara numa varanda com plantas tropicais em Manaus, lente 50 mm, perspectiva reta. No terço esquerdo da imagem, em primeiro plano e nítida, deixar uma área livre do tampo onde depois será colocada uma garrafa em pé vista de frente; logo à direita dessa área, um copo alto de vidro liso com líquido amarelo-dourado translúcido, sementes escuras de maracujá suspensas, gelo e condensação. Mais atrás, à direita e levemente desfocado, um sanduíche natural em pão integral cortado ao meio, recheado com frango desfiado, cenoura ralada e folhas verdes, sobre uma tábua de madeira com um guardanapo de linho cru. Luz de meio-dia filtrada pelas folhas, vindo da esquerda, com manchas suaves de sol na mesa. Terço superior com fundo verde desfocado e calmo para texto.
```

**Prompt (slide 2)**
```
Macrofotografia de um copo alto de vidro liso com líquido amarelo-dourado translúcido, sementes escuras de maracujá suspensas, gás fino subindo e gotas de condensação no vidro, sobre mesa de madeira clara. Câmera na altura do copo, lente 100 mm macro, profundidade de campo muito curta. Ao fundo, apenas formas desfocadas de um sanduíche sobre tábua e plantas verdes. Luz de meio-dia filtrada por folhas vindo da esquerda, fazendo o líquido brilhar. Canto inferior esquerdo em sombra suave e limpa para texto.
```

---

## 3. Revenda · "Um lugar na geladeira"
**Sabores:** Maçã & Canela, Goiaba, Manga & Jasmim · **Formato:** imagem única no feed e Story com cena própria.

**Chamada (faixa no alto):** Tem um lugar na sua geladeira para uma bebida feita em Manaus?
**Linha de apoio:** Kombú para cafés, empórios e restaurantes.

**Composição**
- **Feed:** faixa sólida verde-escura (#1B2F18) ocupando o terço superior, com a chamada em Playfair creme e a assinatura pequena à direita. Abaixo, plano frontal e fechado de uma prateleira de expositor refrigerado aberto, com luz LED fria vindo de cima e grelha metálica. A prateleira está vazia, com três garrafas oficiais colocadas lado a lado, de frente. Na composição entram a sombra no metal e um brilho frio nas tampas. Atrás, através da lateral, o café quente e desfocado.
- **Story, outra cena:** close baixo da borda da mesma prateleira com uma só garrafa (Goiaba). Texto no terço inferior, sobre um painel lima (#D9F99D) com letra tinta. Fecho: "Tem um café ou empório em Manaus? Manda o nome dele pra gente."

**Legenda**
```
Quem vende bebida sabe que a geladeira também conversa com o cliente.

Uma garrafa que ele não conhece ali dentro já puxa a pergunta: o que é isso?

A Kombú é kombucha artesanal premium, produzida em Manaus desde 2017, com doze sabores de frutas, flores, ervas e especiarias. Ela fica sempre gelada, entre 0 e 5 °C, então combina com cafés, empórios e restaurantes que já têm refrigeração para bebidas.

Se você tem um espaço em Manaus, conte um pouco sobre ele em Revenda, no site. São perguntas rápidas e a conversa continua pelo WhatsApp. Link na bio.

#kombucha #manaus #revenda #kombuchaartesanal #cafesdemanaus
```

**Prompt (feed)**
```
Fotografia frontal, com a câmera exatamente na altura da prateleira, de um expositor refrigerado aberto de bebidas dentro de um café contemporâneo em Manaus. Plano fechado em uma única prateleira de aço inox com grelha fina, vazia, iluminada por uma fita de LED fria (5000 K) embutida no alto, com leve névoa de frio e gotas de condensação no metal. A prateleira ocupa a metade inferior da imagem; a metade de cima mostra a parte superior do expositor e, pela lateral aberta, o interior do café fora de foco: madeira, luz quente amarelada, plantas e um balcão. Nenhum produto, garrafa ou embalagem na prateleira. Lente 50 mm, perspectiva reta e sem distorção, linhas horizontais niveladas.
```

**Prompt (Story, 1080 × 1920)**
```
Close vertical, câmera baixa, de baixo para cima, da borda frontal de uma prateleira de inox de um expositor refrigerado de café, com luz de LED fria vinda de cima e condensação no metal. A prateleira atravessa o quadro na altura do terço médio, vazia, com espaço no centro para uma garrafa em pé vista de frente. O fundo é o interior quente de um café desfocado, com bokeh amarelo. Terço inferior com fundo calmo e escuro para texto. Formato 9:16.
```

---

## 4. Revenda · "Uma linha nova no cardápio"
**Sabor:** Rosas & Cardamomo · **Formato:** carrossel de 3.

**Chamada:** a cena é o próprio cardápio. Sobre o papel em branco gerado, o render desenha uma seção "Bebidas" com itens genéricos (Espresso, Cappuccino, Chá gelado, Água com gás). A última linha, em outra cor, diz "Kombú Rosas & Cardamomo". Na pedra, embaixo: "Uma linha nova no seu cardápio."

**Composição**
- **Slide 1:** de cima. Cardápio de papel de algodão sobre bancada de pedra escura, caneta-tinteiro, espresso, copo com líquido rosado e gelo, pétalas de rosa secas e bagas de cardamomo espalhadas com parcimônia. Luz de janela pela esquerda.
- **Slide 2:** garrafa oficial de Rosas & Cardamomo de frente, sobre um fundo de pedra escura liso, com sombra suave. Texto: "São doze sabores em cinco famílias: frutados, florais, especiados, herbais e cítricos. A gente ajuda a escolher os que combinam com o seu público."
- **Slide 3:** fundo creme. "Como começa" em três passos com números, porque são uma sequência de verdade: "Você conta sobre o seu espaço em Revenda, no site." · "Conversamos pelo WhatsApp." · "Combinamos os sabores para começar."

**Legenda**
```
Uma linha nova no cardápio às vezes começa com uma pergunta simples do cliente: tem alguma bebida diferente hoje?

A Kombú tem doze sabores, de frutados a especiados. Rosas & Cardamomo, por exemplo, junta pétalas de rosa com o toque especiado do cardamomo. Toda a produção é artesanal, aqui em Manaus, e a gente ajuda a escolher os sabores que combinam com quem frequenta o seu espaço.

Para começar, conte sobre o seu café, empório ou restaurante em Revenda, no site. Link na bio.

#kombucha #manaus #revenda #cardapio #kombuchaartesanal
```

**Prompt (slide 1)**
```
Fotografia vista de cima, a 90 graus, de uma bancada de pedra escura levemente polida em um café. No centro, ligeiramente deslocado para a esquerda, um cardápio retangular de papel de algodão cor creme, espesso, com bordas rústicas, totalmente em branco, sem nenhuma letra, linha ou desenho. Ao lado direito: uma caneta-tinteiro preta, uma xícara pequena de espresso em cerâmica clara, um copo baixo de vidro liso com líquido rosado translúcido e gelo, algumas pétalas de rosa secas e quatro bagas verdes de cardamomo espalhadas com parcimônia. Luz suave de janela vindo da esquerda, sombras longas e macias para a direita. Paleta terrosa e contida.
```

---

## 5. Parcerias, profissionais · "Uma conversa primeiro"
**Para:** nutricionistas, nutrólogos e personal trainers · **Sabor:** Pêra & Alecrim · **Formato:** carrossel de 3.
Sem consultório, balança, jaleco ou qualquer objeto clínico. A peça convida a conhecer a marca e conversar. Não sugere indicação para paciente nem remuneração.

**Chamada (no cartão):**
- Linha pequena: Para nutricionistas, nutrólogos e personal trainers de Manaus
- Título: Antes de qualquer proposta, queremos conhecer o seu trabalho.

**Composição**
- **Slide 1:** de cima. Cartão de correspondência creme sobre mesa de madeira clara, com a assinatura oficial e o texto compostos sobre ele, centralizados como uma carta. Ao lado, caderno fechado, caneta, ramo de alecrim e meia pera fatiada num pires. Sol da manhã com a sombra da janela cruzando a mesa.
- **Slide 2:** fundo creme liso, mesmo alinhamento centralizado: "Conte como você atende e quem acompanha você. A conversa começa pelo seu trabalho, e o formato de uma parceria só é combinado depois, respeitando as regras da sua profissão."
- **Slide 3:** garrafa oficial de Pêra & Alecrim de frente, sobre a mesma madeira clara. Ramo de alecrim e pera gerados à parte, sem garrafa. Texto: "A Kombú é kombucha artesanal feita em Manaus, suave e com sabor intenso. Para conversar, acesse Parcerias, no site."

**Legenda**
```
Se você é nutricionista, nutrólogo ou personal trainer em Manaus, a gente quer começar pelo seu trabalho.

Queremos entender como você atende e quem acompanha você antes de falar em qualquer formato de parceria. A Kombú é kombucha artesanal, produzida aqui em Manaus, e cada conversa respeita a atuação e as regras de cada profissão.

Para apresentar o seu trabalho, acesse Parcerias, no site. São perguntas rápidas e a conversa continua pelo WhatsApp. Link na bio.

#kombucha #manaus #parcerias #kombuchaartesanal #aartedonatural
```

**Prompt (slide 1)**
```
Fotografia vista de cima, a 90 graus, de uma mesa de madeira clara de carvalho junto a uma janela, de manhã. No centro, um cartão de correspondência cor creme, grosso, de papel de algodão, retangular na vertical, completamente em branco, sem letras, monograma ou desenho. À direita do cartão: um caderno fechado de capa de tecido verde-oliva, uma caneta de metal fosco, um ramo de alecrim fresco e meia pera verde fatiada sobre um pires de cerâmica branca. Sol quente da manhã entrando pela esquerda, com a sombra do caixilho da janela cruzando a mesa em diagonal sem cobrir o cartão. Nenhum objeto médico, de academia ou de consultório. Clima calmo, editorial, de carta escrita à mão.
```

**Prompt (fundo do slide 3)**
```
Superfície de madeira clara de carvalho fotografada de frente, com a câmera na altura do tampo, com um ramo de alecrim fresco e meia pera verde fatiada à direita, nítidos. Luz quente da manhã vinda da esquerda. Área central-esquerda livre, onde depois será colocada uma garrafa em pé vista de frente. Fundo de parede creme desfocado.
```

---

## 6. Parcerias, influenciadores · "Antes de gravar"
**Sabor:** Flor Fada Azul & Blueberry · **Formato:** imagem única no feed e Story com o mesmo tema e outra cena.

**Chamada (faixa embaixo):** Você é influenciador em Manaus? É a chamada aprovada pelo dono em 30/10.
**Linha de apoio:** Conheça nosso programa de afiliados.

**Composição**
- **Feed:**
  - **Cena:** vista por cima do ombro, na altura da mesa. Um celular num mini-tripé enquadra um copo com líquido azul-violeta e gelo. A tela mostra o próprio copo. Ao lado do copo fica um espaço livre para a garrafa oficial de frente. Há um ring light aceso fora de foco e uma janela com copas de árvores.
  - **Pessoa:** só antebraços e mãos adultas ajustando o celular.
  - **Texto:** faixa embaixo no azul do rótulo (#4D76C3), com a chamada em creme.
- **Story:**
  - **Cena:** close das mãos segurando o celular na vertical, com a tela mostrando o copo.
  - **Texto:** no topo.
  - **Fecho:** "Para conhecer o programa, acesse Parcerias, no site. Link na bio."

**Legenda**
```
Quem cria conteúdo sabe quanto tempo passa entre arrumar a luz e apertar o botão de gravar.

A Kombú procura influenciadores de Manaus para apresentar a marca a quem acompanha o seu perfil. Você se cadastra em Parcerias, a gente conhece o seu trabalho e, se a parceria for aprovada, o seu público passa a ter um cupom. As condições são conversadas depois da avaliação.

Conheça nosso programa de afiliados em Parcerias, no site. Link na bio.

#kombucha #manaus #influenciadoresmanaus #kombuchaartesanal #aartedonatural
```

**Prompt (feed)**
```
Fotografia por cima do ombro de uma pessoa adulta fora de quadro, câmera na altura da mesa e levemente acima, lente 35 mm. Mesa branca de madeira perto de uma janela grande com vista para copas de árvores tropicais de Manaus, manhã clara. Em primeiro plano, à esquerda, um smartphone preso num mini-tripé, com a tela voltada para a câmera mostrando a imagem do copo que está filmando. No centro, nítido, um copo alto de vidro liso com líquido azul-violeta translúcido, gelo e condensação. Ao lado direito do copo, um espaço livre na mesa onde depois será colocada uma garrafa em pé vista de frente. Antebraços e mãos de adulta ajustam o celular pela esquerda; nenhum rosto. Ao fundo, um ring light aceso, desfocado. Terço inferior da imagem com a mesa limpa, para texto.
```

---

## Stories como conversa: exemplo de um dia
A API não coloca figurinhas, então a conversa vem da sequência, e a resposta chega por mensagem. Exemplo com o conceito 1:
1. Macro do copo de Hibisco & Anis Estrelado: "Já provou kombucha de hibisco?"
2. Ingredientes em still life (hibisco seco, anis estrelado): "A cor vem do hibisco, e o anis estrelado traz o perfume."
3. Garrafa oficial: "O gás se forma na própria fermentação, feita em Manaus."
4. Parceiro do dia, sem dizer que tem o sabor: "Na @casaagridoceam, pergunte quais sabores estão gelados hoje."
5. Fundo rubi, só texto: "Hibisco ou Maracujá: qual você abriria primeiro?"

Cada Story funciona sozinho, sem número, e os cinco juntos contam uma coisa só.
