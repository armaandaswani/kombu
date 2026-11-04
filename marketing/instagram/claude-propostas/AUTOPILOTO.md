# Piloto automático do Instagram da Kombú (Claude)

Pedido do dono, 03/11/2026: "Tudo isso tem que ser automatizado. Eu não consigo ficar em cima de você o tempo todo."

Claude cria os posts, confere e coloca na fila. O Worker `kombu-instagram` publica sozinho:
- feed e Reels às 09:00 de Manaus, a cada dois dias;
- cinco Stories das 07:00 às 07:20.

O dono não aprova post a post. A garantia de qualidade são as regras abaixo e a revisão independente do passo 4. Post que não passa não entra.

A tarefa agendada `kombu-instagram-piloto` roda este roteiro todo dia às 20:00 de Manaus. O app do Claude precisa estar aberto. Se estiver fechado, a tarefa roda quando o app abrir.

## Divisão com o Codex

O Codex continua com:
- o publicador: Worker, crons, KV e segredos;
- a rotina das 06:30 que prepara e confere os Stories do dia.

Claude escreve em:
- `claude-propostas/`;
- novas entradas no fim de `calendar.json`, via `integrar.mjs`, só posts não publicados;
- dias novos de Stories em `stories-calendar.json`, só datas que ainda não existem.

Sempre:
- releia o arquivo antes de editar;
- commit só dos seus arquivos;
- `git push origin HEAD:main` apenas fast-forward;
- nunca desfazer trabalho do Codex.

Se o Codex estiver no meio de uma mudança no mesmo arquivo (diff não commitado em `calendar.json` ou `stories-calendar.json`), não mexa no arquivo e deixe para a próxima rodada.

## Motor

Fica em `claude-propostas/2026-11-03-direcao-criativa/render/`:

| Arquivo | Para quê |
|---|---|
| `estado.mjs` | Só leitura. Mostra o que já saiu, o que falta, quantos dias de feed restam e até quando há Stories. |
| `fila.json` + `pos/<post>.json` | Os posts do Claude, na ordem, com `hero` (sabor principal). |
| `cenas.json`, `../cenas/` | As cenas geradas. |
| `render.mjs`, `luz.mjs` | Garrafa oficial na cena, luz integrada, texto e logo (`BRIEF-AGENTES.md`, passos 1 a 9). |
| `legendas.mjs` / `legendas.json` | As legendas por post. Para posts novos, escreva direto no `legendas.json`. |
| `integrar.mjs` | Copia os JPGs para `assets/partners/feed-<post>-<n>.jpg`, escreve as entradas `art` no `calendar.json` e roda a revisão do `render.mjs`. Se a revisão falhar, desfaz. Use `PUBLICADOS=<ids>` com a lista do `estado.mjs`. |

## Rodada diária

### 1. Estado
Rode `node estado.mjs`. Se o KV falhar por autenticação, rode `wrangler whoami` e tente de novo. Se ainda falhar, registre no diário e pare a rodada sem mexer na fila.

### 2. Precisa de posts novos?
Se `diasDeFeed < 16` (menos de 8 posts na fila), produza um lote de 6 posts. Se não, vá para o passo 6.

### 3. Pauta do lote (6 posts)
Antes de criar, leia o vault (`~/Documents/Kombú Vault`):
- `02 Marca/Palavras certas e palavras proibidas.md` e `Voz e tom.md`;
- `03 Produto/Sabores.md`;
- `04 Público/Perfis de cliente.md`;
- `05 Processos/Parcerias.md` e `Revenda.md`;
- `07 Instagram e Conteúdo/Regras de post.md`;
- `08 Decisões/Log de decisões do dono.md` (as decisões mais novas valem mais).

Use as skills `content-calendar-sms`, `caption-writer-sms` e `carousel-writer-sms`.

Mistura de cada lote:
- **2 de sabor:** sabores que não saíram nos últimos 6 posts.
- **1 de ocasião ou serviço:** como servir, harmonização, momento do dia, onde comprar.
- **1 de parceiro real** da lista de Parceiros do site, com o @ certo. Confira o @ no site ao vivo, sem copiar de post antigo. Não afirme estoque nem sabor disponível no parceiro.
- **1 de revenda** (cafés, empórios, academias, hotéis), chamando para `/revenda`.
- **1 de parcerias**, em rodízio pelo público do formulário de parcerias:
  1. nutricionistas e nutrólogos;
  2. personal trainers;
  3. professores de yoga, pilates e meditação;
  4. fisioterapeutas e terapeutas;
  5. influenciadores de Manaus ("Você é influenciador em Manaus?");
  6. eventos.

  Chamar para Parcerias, no site. Profissional de saúde não recebe promessa de comissão nem de cachê. Nunca perguntar o preço da consulta ou do ingresso.

Variedade:
- nenhum sabor repetido em 6 posts seguidos;
- nunca o mesmo layout (A a G) em dois posts seguidos;
- mais ou menos metade em carrossel, e nunca 4 seguidos no mesmo formato;
- presença humana alternada (mão, pessoa de lado, ninguém).

Engajamento:
- em mais ou menos metade das legendas, uma pergunta fácil ou um "marque alguém";
- nunca "Responda este Story" em todos.

### 4. Produção e conferência
Para cada post, siga `BRIEF-AGENTES.md`. Pode dividir em até 3 agentes, cada um com seu design de trabalho no Canva (`DAHZ5W65N64`, `DAHZ5e6UBzU`, `DAHZ5eQOrek`, `DAHZ5Rfk8Ko`).

Regras do dono que não negociam:
- **Toda arte com cena tem a garrafa oficial, sempre em pé, nunca deitada e nunca em cena vista de cima.**
  - apoiada numa superfície real;
  - em escala certa com o copo;
  - com a luz da cena;
  - com respiro;
  - rótulo oficial restaurado pelo `luz.mjs`, com correlação ≥ 0.7, conferido letra por letra.
- **Texto:**
  - sem "!" e sem travessão;
  - sem alegação de saúde (detox, imunidade como benefício, intestino, probiótico, emagrecer);
  - nunca "sem açúcar" e sem preço;
  - "gás", nunca "bolha";
  - nunca "família" nem "nossa família";
  - nunca o tipo de chá;
  - sem superlativo;
  - nada inventado sobre a marca.
  - Imunidade é só nome de sabor.
  - Frases que se completam, sem soar robótico.
- **Hashtags:** até 5, sempre com #manaus, e abertura da legenda com no máximo 125 caracteres.

Depois de renderizar, chame um agente revisor independente, sem contexto desta conversa. Passe a ele:
- os JPGs;
- as legendas;
- a lista de regras acima.

Ele devolve aprovado ou recusado por post, com o motivo. Recusado:
- refaça no máximo 2 vezes;
- se continuar recusado, o post não entra e fica registrado no diário.

### 5. Entrar na fila e publicar o pacote
Os comandos rodam em `marketing/instagram`. Wrangler com `CI=1` e `CLOUDFLARE_ACCOUNT_ID=d96b1341ef54c6d28ad6415f18220aaf`.

1. Acrescente os posts aprovados ao fim de `fila.json`, com `hero`, e as legendas em `legendas.json`.
2. `PUBLICADOS=<ids do estado> node integrar.mjs`. Ele aborta se algo faltar.
3. `node render.mjs`: só os posts não publicados, inclusive os `art`.
4. `node prepare-publish.mjs`.
5. `npx --yes wrangler@4.156.0 pages deploy .render/publish --project-name kombu-social --branch main`.
6. `cd worker && npx --yes wrangler@4.156.0 deploy`. O calendário vai embutido no Worker.
7. Confira por leitura que `https://kombu-social.pages.dev/<post>/1.jpg` responde 200 para os novos.
8. Commit só de `calendar.json`, `assets/partners/feed-*` e `claude-propostas/`. Depois `git push origin HEAD:main`, só fast-forward.

### 6. Stories
Se `stories-calendar.json` não tiver os próximos 2 dias:
- crie os dias que faltam: 5 artes por dia, tipos e campos iguais aos dias existentes;
- siga `2026-11-03-direcao-criativa/STORIES-INTERACAO.md`: perguntas, enquetes em texto e bastidores;
- sem contador "1 de 5";
- variando sabores e assuntos.

Depois:
1. `node render-stories.mjs --date=<dia>`.
2. Olhe as imagens.
3. `node prepare-publish.mjs` e o deploy do Pages.

Nunca altere um dia que já existe, nem um Story publicado.

### 7. Diário
Escreva uma linha por rodada em `~/Documents/Kombú Vault/07 Instagram e Conteúdo/Diário do piloto automático.md`:
- data;
- dias de feed na fila;
- o que entrou;
- o que foi recusado e por quê;
- falhas.

Se nada mudou, escreva só "fila ok, N dias".

## Nunca
- Ler, imprimir ou pedir o token.
- Chamar a API do Instagram à mão.
- Mexer em crons, KV ou segredos.
- Publicar à tarde ou à noite.
- Republicar ou apagar o que já saiu.
- Apagar `assets/menu-bottles/`.
