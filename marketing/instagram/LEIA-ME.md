# Instagram da Kombú (@kombu.amazonia): publicação automática

Gêmeo do publicador da Reveja. Um post a cada dois dias, às 12:30 de Manaus.

## Como funciona
- `calendar.json`: os posts, em ordem, com slides e legendas. As regras de conteúdo estão no topo do arquivo.
- `render.mjs`: gera as imagens 1080×1350 (JPEG) em `out/`. Antes de desenhar, revisa o calendário e
  **para** se encontrar alegação de saúde, preço, "sem açúcar", nome de sabor fora do oficial, mais de
  5 hashtags, falta de #manaus ou dois posts seguidos na mesma família de cor.
- As imagens ficam em `https://kombu-social.pages.dev/<post>/<n>.jpg` (Cloudflare Pages). A API do
  Instagram exige URL pública; não usamos o domínio .com.br para que um vencimento de domínio não
  derrube a publicação.
- Worker Cloudflare `kombu-instagram` (pasta `worker/`): sem URL pública, roda às 12:30 e às 18:30
  de Manaus (`30 16 * * *` e `30 22 * * *` UTC). Publica **o próximo post da fila** quando já se
  passaram ~2 dias do último. Se começar atrasado, não dispara posts acumulados.
- Estado no KV `KOMBU_IG_STATE` (id `b59df63d5f8d4b91a087a818f4252c3e`): `published:<id>`, `last`,
  `token` (renovado a cada 30 dias, sozinho), `user`, `log`.
- Antes de publicar, o worker confere as últimas 25 publicações da conta: se a legenda já existe
  (post feito à mão), registra e não repete.

## Conectar a conta (ação do titular, uma vez)
1. A conta @kombu.amazonia precisa ser **profissional** (já é).
2. developers.facebook.com → Meus apps. Dois caminhos:
   - **Mais rápido:** abrir o app que já existe, "Reveja Publicador", e acrescentar a conta da Kombú nele.
   - **Mais separado:** Criar app → escolher o caso de uso do Instagram → nome "Kombú Publicador".
3. No app: produto **Instagram** → "API com login do Instagram".
4. Em "Gerar tokens de acesso", adicionar a conta @kombu.amazonia (entrando com o login do Instagram
   da Kombú) e gerar o token. Permissões: `instagram_business_basic` e
   `instagram_business_content_publish`. Se a Meta pedir, aceite o convite de testador em
   Instagram → Configurações → Apps e sites.
5. Copiar o token (sem colar em nenhum chat) e rodar no Terminal:
   ```
   cd "$HOME/Desktop/Kombucha/Kombu New Site/marketing/instagram" && node connect.mjs
   ```
   Colar o token quando pedir. O script confere que é a conta da Kombú, salva o token como segredo
   do worker e guarda uma cópia local em `~/Library/Application Support/Kombu/instagram.json` (600).

O app pode ficar **não publicado** (modo desenvolvimento): para postar na própria conta não precisa
de revisão da Meta. É assim que a Reveja funciona desde 23/10/2026.

## Rotina
- Ver o log: `wrangler kv key get log --namespace-id b59df63d5f8d4b91a087a818f4252c3e --remote`
- Mudou o calendário? `node render.mjs` → `wrangler pages deploy out --project-name kombu-social --branch main`
  → `cd worker && wrangler deploy` (o calendário vai embutido no worker).
- Acrescentar posts: adicionar ao fim de `posts` em `calendar.json` e repetir o passo acima.
  O worker avisa "calendário esgotado" no log quando a fila acaba.
- Pausar: remover os crons em `worker/wrangler.toml` e `wrangler deploy`.
- Wrangler neste Mac: `~/.npm/_npx/*/node_modules/.bin/wrangler`, com `CI=1` e
  `CLOUDFLARE_ACCOUNT_ID=d96b1341ef54c6d28ad6415f18220aaf`.

## Postar à mão
Os arquivos de cada post estão em `out/<post>/` (`1.jpg`, `2.jpg`... e `legenda.txt`). Cole a
legenda **exatamente** como está em `legenda.txt`: é pela legenda que o worker reconhece o post e
não o repete.
