# Social Media Context
last_updated: 2026-10-27

The brand rules in `../calendar.json` ("rules") and the checks in `../render.mjs` win over anything
a social-media skill suggests. When a skill's generic advice (urgency, "save this", stats, arrows in
copy) conflicts with them, follow the rules.

---

## Identity
- **Type**: Brand
- **Name**: Kombú
- **Handle(s)**: @kombu.amazonia on Instagram
- **Role**: Artisan kombucha made in Manaus since 2017
- **Industry/niche**: Premium artisan kombucha in Manaus. B2B first (cafés, empórios, bakeries, restaurants), with consumers buying at partners
- **Positioning**: A Arte do Natural. Kombucha artesanal premium de Manaus, suave e com sabor intenso. Frutas, flores, ervas e especiarias, com gás da própria fermentação.

---

## Target Audience
- **Primary audience**: (1) Manaus consumers who care about what they drink and like to discover a premium local product; (2) owners of cafés, empórios, bakeries and restaurants looking for a differentiated drink for their fridge
- **Pain points**: Consumers find mass-market sodas and juices artificial, and don't know where to buy good kombucha in Manaus. Owners want something their customers can't find anywhere else, without complicated logistics
- **Goals**: Consumers want to find a cold bottle nearby and try new flavours. Owners want a premium product that sells and gets restocked on their schedule
- **Sophistication level**: Beginner to intermediate. Many have never tasted kombucha, so explain it simply
- **Where they hang out**: Instagram feed and Stories, in Manaus

---

## Voice & Tone
- **Voice adjectives**: calm, premium, natural, simple, warm
- **Formality**: Semi-formal, in Brazilian Portuguese that's easy to read
- **Humor**: None to light
- **Phrases to use**: "A Arte do Natural", "fruta de verdade", "a bolha vem da própria fermentação", "feita em Manaus", "prove gelada", "pergunte quais sabores estão gelados hoje"
- **Phrases to avoid**: any health claim (cura, previne, desintoxica, emagrece, fortalece, imunidade as a benefit), "sem açúcar", prices, "o melhor", absolute claims, hype, invented urgency or scarcity, invented testimonials or numbers

---

## Content Pillars
1. **Os sabores** (the flavours): one flavour at a time, with its label colour, ingredients and mood. Official names only (Goiaba, Manga & Jasmim, Flor Fada Azul & Blueberry…)
2. **O que é de verdade** (what's real): what goes in the bottle and what stays out; how the fermentation works, explained plainly
3. **Onde provar** (where to try it): partners, tagged with their handle. Never claim a partner has a specific flavour, because stock changes. Solar Café Regional is always listed last
4. **Para o seu negócio** (for your business): resale, direct orders from 20 bottles with about two weeks to deliver, and how restocking works. Wholesale terms are discussed in DMs, never posted
5. **Bastidores e história** (behind the scenes and story): Manaus, small batches, 2017 to today. Only facts the owner has confirmed (no invented brand story)

---

## Platform Configuration
| Platform | Goal | Current Frequency | Target Frequency | BlackTwist |
|---|---|---|---|---|
| Instagram (@kombu.amazonia) | Get people to try it at partners; bring in resellers | 1 post every 2 days (automatic publisher) | 1 post every 2 days | No (Cloudflare Worker `kombu-instagram`) |

---

## Content Formats
- **Preferred formats**: carousels (the owner's favourite), mixed with other styles so the feed doesn't feel repetitive
- **Mix to keep**: carousels in varied structures (one flavour, a short list, before/after "vai na garrafa / fica de fora", step by step, partner spotlight); single-image posts (one bottle as a poster, a short phrase); Reels from the owner's own videos (folder `~/Desktop/Kombucha/Kombucha Videos`) once the publisher supports video
- **Per-platform preferences**: 1080×1350; Playfair Display + Plus Jakarta Sans; each flavour on its label colour; no two posts in a row in the same colour family; at most 5 hashtags and always #manaus
- **Calls to action**: only two: find a cold bottle at a partner, or a direct order from 20 bottles. Link in bio: the site

---

## Example Posts
### Example 1 — Instagram (post 01)
Kombú é kombucha artesanal feita em Manaus: fermentação natural e sabor de ingredientes de verdade.

Doze sabores, todos gaseificados pela própria fermentação. Encontre gelada na @divinaterramanaus, na @casaagridoceam, na @ladolcevitagelateria e na @cafeteriagarden_.

#kombucha #manaus #kombuchaartesanal #amazonia #aartedonatural

---

## Anti-Patterns
- **Topics to avoid**: health and medical benefits, sugar content beyond "a fermentação consome a maior parte do açúcar", prices and wholesale terms, competitors, politics
- **Tones to avoid**: hype-y, preachy, wellness-guru, "rise and grind", engagement bait
- **Ambiguity**: every line must have only one reading, even out of context (owner, 24/10). Never "Fica de fora." over a list; write "A Kombú não leva:" and "Nenhum conservante."
- **Content types to avoid**: memes, polls for engagement's sake, invented testimonials or statistics

---

## Voice Profile (brand-voice skill, 2026-10-24)
This block is the source of truth for how Kombú writes. It wins over the "Voice & Tone" section above when they differ.

```text
VOICE PROFILE
=============
Author: Kombú (@kombu.amazonia, kombukombucha.com.br)
Goal: get Manaus consumers to try it and order direct; bring in resellers
Confidence: medium-high. Built from the owner's own words and corrections, the label and the approved copy

Source Set
- owner's corrections, 24/10: "evitar frases e posts ambíguos"; "bolhas? GÁS!"; "role para escolher o seu??";
  "profissionais, mais simples e que deixem claro"; "gramática fácil, mas mantendo o tom premium, minimalista e profissional"
- the bottle label: "Kombucha premium artesanal da Amazônia", "Naturalmente gaseificada", "Manter sempre gelado"
- live site copy after the owner's review (24/10): "Peça direto da Kombú.", "O que vai na Kombú.", "Não usamos"
- owner's brief: slogan "A Arte do Natural", artisan production in Manaus since 2017, B2B first

Rhythm
- natural, connected sentences with varied length. Brevity must not break the thought into disconnected slogans. No fragments standing alone as slides ("Com o brunch.").

Compression
- says the fact plainly, then one detail. No adjective trios ("frutado, vibrante, equilibrado")

Capitalization
- conventional. Flavour names with official capitals: Manga & Jasmim, Flor Fada Azul & Blueberry

Parentheticals
- none

Question Use
- only real questions the reader has ("A Kombú tem açúcar?"). No bait questions

Claim Style
- verifiable facts only: ingredients, process, place, year, how to buy. No health claims, no "sem açúcar",
  no prices, no superlatives ("o melhor"), no invented stories

Preferred Moves
- name the thing exactly: "gás natural da fermentação", "a partir de 20 garrafas", "cerca de duas semanas"
- say what it is, then what to do: "Gelada nos parceiros ou em pedido direto. Link na bio."
- headings that work alone and read one way only: "A Kombú não leva:", "Nenhum conservante."

Banned Moves
- "bolha" / "borbulha" (say "gás")
- wordplay and instructions about the page ("Role e escolha o seu", "Arraste" is fine only in a carousel caption)
- any line with two readings ("Fica de fora." over a list)
- italic accent words, tracked capitals, em dashes, "de verdade" used as filler, "premium" more than once per piece
- hype, urgency, emojis

CTA Rules
- one call per piece: buy at a partner, or order direct from 20 bottles. Resale: "Fale com a gente", terms in the reply
- explanatory posts may also ask for a save or a share

Channel Notes
- Instagram: hook within 125 characters, max 5 hashtags, always #manaus, partners @mentioned (they get tagged)
- Site: same rules; buttons say what happens ("Fazer pedido", "Enviar pedido")
- WhatsApp/email: same register, first person plural ("nós produzimos", "combinamos")
```

## Image direction — owner feedback, 2026-10-27

- Do not reuse old photographs of people who already appeared on the Instagram page.
- For lifestyle concepts, the owner prefers newly generated fictional adults enjoying Kombú around yoga, running, and sports, with natural photographic styling.
- Product packaging is a Penta 500 ml bottle. Calibrate its size against the hand and face using the owner's real reference photos IMG_6992, IMG_6995 and IMG_6997. The first generated versions were oversized; the second were slightly too small. The third versions use a modest increase over version 2, guided by those real photos. Do not reuse the reference person's identity in generated lifestyle scenes.
- Use the actual bottle photographs as packaging references. Preserve the bottle shape, label, and beverage color. These scenes must not imply health or athletic-performance benefits, or be presented as real customer testimonials.

## Editorial direction — latest owner feedback, 2026-10-27

This section updates the earlier voice and CTA notes where they differ.

- Write in a human, warm, professional tone in posts and conversation. Read the copy aloud as a conversation with someone interested in Kombú. Connect ideas rather than putting three isolated claims next to each other.
- The owner explicitly rejected: “A flor dá cor. O blueberry traz sabor. O sabor é floral e frutado.” Short sentences alone do not make copy good. Explain the actual recipe in one flowing thought instead of rephrasing the same fact on every line.
- Rotate actual featured flavors, not just background colors. Do not repeat a hero flavor in a run of six upcoming posts. Avoid multi-bottle lineups that keep reintroducing the same flavors around the featured posts.
- Keep published posts 01 and 02 unchanged. Update the actual future calendar and render it for review.
- Include creator recruitment and affiliate-coupon posts. The public site confirms approval before activation, 5% off products for the audience, and 10% commission on paid products after the discount, excluding freight. Do not promise automatic approval, free products, minimum earnings, or invented eligibility thresholds.
- Creator posts may invite applications via the “Para criadores” section of the website; this is an owner-authorized exception to the older two-CTA rule. This is not authorization to message creators directly.
- The current site also offers kits of 4, 6, 12 and 20 bottles of 500 ml. Do not describe 20 bottles as the minimum for all direct purchases; distinguish standard production orders from the kit options. Do not publish monetary prices.


## Direção visual e Stories — 27/10/2026, à noite

- O titular rejeitou apenas colocar título sobre as fotos da Dolce Vita. Quer composição mais trabalhada com IA, fundo limpo/recriado, luz melhor e logo K pequena no topo. Preserve a embalagem real e não apresente a montagem como o interior real da parceira.
- Formatos: carrossel de feed 1080×1350; Stories 1080×1920, cinco diferentes por dia.
- As fotos IMG_7015/7017/7018 foram tiradas pelo titular na parceira Gelateria Dolce Vita. A sequência deve valorizar o local e explicar sutilmente por que experimentar kombucha e por que escolher Kombú. Conecte a ocasião de consumo com chá fermentado, sabores, gás da fermentação, produção artesanal em Manaus desde 2017 e ingredientes. Não transforme o pedido de benefícios em promessas de saúde.
- Stories devem formar uma conversa, com cada arte acrescentando uma informação. Evite cinco anúncios soltos ou a mesma foto com títulos diferentes dia após dia.

## Regra de posicionamento — correção do titular em 27/10/2026

Nunca usar “feita pela nossa família”, “nossa família”, “produção familiar” ou equivalentes no conteúdo da marca. O titular considera esse enquadramento amador. Valorizar produção artesanal, ingredientes, cuidado no processo e a experiência em Manaus desde 2017, com tom profissional. Esta regra vale para feed, Stories, legendas e futuras automações.

- O sabor é **Imunidade**. “Vitalidade” não existe no catálogo. A IA já inventou esse nome em um rótulo; revisar a embalagem visualmente após toda edição, além de validar os textos.

## Receita confidencial e posicionamento — orientação do titular, 27/10/2026

- Não divulgar o tipo de chá usado na receita. Tratar essa informação como segredo da marca, inclusive em prompts destinados a aparecer em peças, legendas, Stories e automações.
- Posicionamento prioritário: Kombucha Artesanal Premium de Manaus. A característica sensorial confirmada pelo titular é suavidade com sabor intenso. Integrar esses diferenciais em frases naturais e situações de consumo, sem slogans desconectados ou repetir tudo em cada post.
- O titular afirma que a Kombú é a única marca de kombucha artesanal premium de Manaus. Registrar como afirmação do titular; não extrapolar para superioridade absoluta ou afirmar que todas as outras marcas têm características inferiores. A comparação de exclusividade requer evidência de mercado atual antes de virar alegação categórica publicada.
- Conteúdos já publicados permanecem como histórico. Aplicar as correções nos futuros conteúdos e nos arquivos para download; alterações no Instagram já publicado dependem do titular.

## Stories em escadinha — pedido do titular, 28/10/2026

Publicar cinco Stories diferentes todos os dias às 07:00, 07:05, 07:10, 07:15 e 07:20 de Manaus. Preparar/revisar antes da primeira publicação e conferir o resultado às 07:30. Não publicar o lote inteiro de uma vez. Excepcionalmente em 28/10/2026, a sequência será de 10:00 a 10:20, pois o pedido foi feito após a janela da manhã.
