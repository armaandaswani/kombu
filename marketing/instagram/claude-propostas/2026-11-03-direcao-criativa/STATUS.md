# Status

Atualizado em 03/11/2026, depois das respostas do dono.

## Decisões do dono (03/11)
1. Os seis conceitos podem seguir para produção.
2. Um prato pode compor a cena (ex.: sanduíche natural), mas o foco é a Kombú. O conceito 2 foi refeito assim.
3. Stories devem levar a pessoa a interagir, com chamadas variadas; "Responda este Story" não vai em todos. Ver [STORIES-INTERACAO.md](STORIES-INTERACAO.md).
4. O @ da Gelateria Dolce Vita é **@ladolcevitagelataria** (conferido no Instagram: La Dolce Vita Gelateria, 24 mil seguidores).
5. Refazer os estáticos 05 a 20 no padrão novo, bonito e realista. Ver [FILA-NOVA.md](FILA-NOVA.md).

## Arquivos
| Arquivo | Conteúdo |
|---|---|
| [CRITICA.md](CRITICA.md) | Crítica da fila e da V2, com as regras de composição |
| [CONCEITOS.md](CONCEITOS.md) | Os seis conceitos: chamada, legenda, composição, prompts |
| [FILA-NOVA.md](FILA-NOVA.md) | 18 posts na ordem nova (16 refeitos + 2 novos), com layout, legenda e prompt de cada um |
| [STORIES-INTERACAO.md](STORIES-INTERACAO.md) | Mecânicas de interação e uma semana de exemplo |

## Para o Codex
1. **Produção automática:** seguir [render/LEIA-ME.md](render/LEIA-ME.md).
   - Gerar as 27 cenas de `render/cenas.json` na ferramenta de imagem do ChatGPT. Salvar em `cenas/<arquivo>.png`, sem garrafa em nenhuma.
   - Depois rodar `node render/render.mjs`. O compositor (já testado) aplica garrafa oficial, sombra, assinatura e texto, e gera `saida/` e `saida/previa.jpg`.
2. **Prévia antes da fila:**
   - Claude revisa `saida/previa.jpg` e o dono aprova.
   - Só depois trocar as entradas 05 a 20 no `calendar.json` e acrescentar `23-cardapio` e `24-profissionais` na posição de `render/fila.json`.
3. **Stories dos conceitos 3 e 6:** ficam para o lote de Stories, com o formato de STORIES-INTERACAO.md.
4. **@ da Dolce Vita:** trocar `@ladolcevitagelateria` por `@ladolcevitagelataria` em `calendar.json`, `stories-calendar.json` (só nas entradas futuras) e `.agents/social-media-context-sms.md`.
5. **Stories:** copiar o lint de palavras do `render.mjs` para o `render-stories.mjs` e tirar "a bolha vem da própria fermentação" do contexto.
6. **Lote de 04/11 em diante:** seguir STORIES-INTERACAO.md, com uma interação por dia, variando a mecânica.

## Para o dono
- No admin, em **Parceiros**, trocar o Instagram da Dolce Vita para `@ladolcevitagelataria`. O site ainda mostra o @ antigo.
