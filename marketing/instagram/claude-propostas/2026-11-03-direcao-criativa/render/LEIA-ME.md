# Produção automática da fila nova

Nada aqui é manual para o dono. O fluxo é este:

1. **Codex gera as cenas:** para cada item de `cenas.json` que ainda não existe em `../cenas/`, gera a imagem na ferramenta de imagem do ChatGPT. O prompt é o do item mais o `sufixo`. A imagem é salva com o nome do campo `arquivo`, em PNG, retrato 4:5.
2. **Codex roda o compositor:** `node render.mjs`, nesta pasta. Ele monta:
   - a garrafa oficial (`assets/bottles`), sem alteração;
   - a sombra de contato;
   - a assinatura da marca e o texto de `fila.json`.

   Saída:
   - `../saida/<post>/<n>.jpg`, em 1080 × 1350;
   - `../saida/previa.jpg`, com todos os posts.

   Cena que falta aparece como "cena pendente".
2b. **Luz integrada (pedido do dono em 03/11: a garrafa tem de parecer fotografada na cena, como o copo).**
   - Rodar `SO_GARRAFA=1 node render.mjs`. Isso gera `../saida/<post>/<n>-base.png`: cena mais garrafa oficial na posição certa, sem texto.
   - Para cada base, usar a edição de imagem do ChatGPT com a própria base como imagem de entrada e este pedido: "Integre a garrafa à cena como se tivesse sido fotografada junto com ela: mesma luz, sombras, reflexo na superfície, condensação leve e cor da luz ambiente. Não mude o formato da garrafa, a tampa, o rótulo, as letras, as cores do rótulo nem a posição. Não mude o resto da cena."
   - Salvar o resultado como `../saida/<post>/<n>-luz.png`.
   - Claude confere cada rótulo contra a foto oficial antes de seguir. Se alguma letra, proporção ou cor mudou, o arquivo é apagado e refeito.
   - Depois, `node render.mjs` põe o texto e a assinatura sobre o `-luz.png`, sem colar a garrafa de novo.
3. **Claude revisa a prévia:**
   - posição e luz das garrafas: se precisar, ajusta `x`, `base` e `h` em `fila.json` e roda de novo;
   - texto;
   - repetição.
4. **O dono aprova a prévia.**
5. **Codex troca as entradas no `calendar.json`:** 05 a 20, mais `23-cardapio` e `24-profissionais` na ordem de `fila.json`. Depois faz o deploy como sempre.

`node render.mjs 09-hibisco` refaz só um post.

As legendas estão em `../FILA-NOVA.md` e `../CONCEITOS.md`.

Regras que o compositor já respeita:
- sem contador nem pontinhos;
- assinatura atual;
- garrafa nunca redesenhada.
