# Social Media Context
last_updated: 2026-10-24

The brand rules in `../calendar.json` ("rules") and the checks in `../render.mjs` win over anything
a social-media skill suggests. When a skill's generic advice (urgency, "save this", stats, arrows in
copy) conflicts with them, follow the rules.

---

## Identity
- **Type**: Brand
- **Name**: Kombú
- **Handle(s)**: @kombu.amazonia on Instagram
- **Role**: Artisan kombucha made in Manaus by a family, since 2017
- **Industry/niche**: Premium artisan kombucha in Manaus. B2B first (cafés, empórios, bakeries, restaurants), with consumers buying at partners
- **Positioning**: A Arte do Natural. Green tea, live culture, real fruit, flowers, herbs and spices, and time. The bubbles come from the fermentation itself.

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
5. **Bastidores e história** (behind the scenes and story): the family, Manaus, small batches, 2017 to today. Only facts the owner has confirmed (no invented brand story)

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
Kombú é kombucha artesanal feita em Manaus: chá verde, fermentação natural e sabor de ingredientes de verdade.

Doze sabores, todos gaseificados pela própria fermentação. Encontre gelada na @divinaterramanaus, na @casaagridoceam, na @ladolcevitagelateria e na @cafeteriagarden_.

#kombucha #manaus #kombuchaartesanal #amazonia #aartedonatural

---

## Anti-Patterns
- **Topics to avoid**: health and medical benefits, sugar content beyond "a fermentação consome a maior parte do açúcar", prices and wholesale terms, competitors, politics
- **Tones to avoid**: hype-y, preachy, wellness-guru, "rise and grind", engagement bait
- **Ambiguity**: every line must have only one reading, even out of context (owner, 24/10). Never "Fica de fora." over a list; write "A Kombú não leva:" and "Nenhum conservante."
- **Content types to avoid**: memes, polls for engagement's sake, invented testimonials or statistics
