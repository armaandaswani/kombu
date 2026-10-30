# Instagram da Kombú (@kombu.amazonia): publicação automática

Gêmeo do publicador da Reveja. Um post a cada dois dias, às 09:00 de Manaus.

## Como funciona
- `calendar.json`: os posts, em ordem, com slides e legendas. As regras de conteúdo estão no topo do arquivo.
- `render.mjs`: gera as imagens 1080×1350 (JPEG) em `out/`. Antes de desenhar, revisa o calendário e
  **para** se encontrar alegação de saúde, preço, "sem açúcar", nome de sabor fora do oficial, mais de
  5 hashtags, falta de #manaus ou dois posts seguidos na mesma família de cor.
- As imagens ficam em `https://kombu-social.pages.dev/<post>/<n>.jpg` (Cloudflare Pages). A API do
  Instagram exige URL pública; não usamos o domínio .com.br para que um vencimento de domínio não
  derrube a publicação.
- Worker Cloudflare `kombu-instagram` (pasta `worker/`): sem URL pública, publica às 09:00
  de Manaus (13:00 UTC), sem tentativa de publicação à tarde ou à noite. Publica **o próximo post da fila** quando já se
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
- Mudou o calendário? `node render.mjs` → `node prepare-publish.mjs` → `wrangler pages deploy .render/publish --project-name kombu-social --branch main`
  → `cd worker && wrangler deploy` (o calendário vai embutido no worker).
- Acrescentar posts: adicionar ao fim de `posts` em `calendar.json` e repetir o passo acima.
  O worker avisa "calendário esgotado" no log quando a fila acaba.
- `node render.mjs --check` revisa o calendário sem abrir o Chrome. A revisão também confere a abertura da legenda e impede repetir o sabor principal numa sequência de seis posts futuros, usando `heroFlavor`.
- Posts com `publishedAt` não são renderizados novamente. Preserve seus arquivos existentes em `out/`; a preparação da publicação copia somente os JPEGs e legendas previstos no calendário, sem slides antigos ou cópias de conflito do iCloud.
- O tipo `lifestyle` usa as cenas aprovadas em `assets/lifestyle/`. As pessoas são fictícias e não devem ser apresentadas como clientes ou depoimentos reais.
- Os posts 17 e 20 convidam criadores para o programa descrito em `https://www.kombukombucha.com.br/#criadores`. O cadastro passa por aprovação antes da ativação do cupom. Percentuais não devem ser alterados sem conferir as condições atuais.
- Pausar: remover os crons em `worker/wrangler.toml` e `wrangler deploy`.
- Wrangler neste Mac: `~/.npm/_npx/*/node_modules/.bin/wrangler`, com `CI=1` e
  `CLOUDFLARE_ACCOUNT_ID=d96b1341ef54c6d28ad6415f18220aaf`.

## Postar à mão
Os arquivos de cada post estão em `out/<post>/` (`1.jpg`, `2.jpg`... e `legenda.txt`). Cole a
legenda **exatamente** como está em `legenda.txt`: é pela legenda que o worker reconhece o post e
não o repete.


## Stories diários (27/10/2026)
- Pedido do titular: cinco Stories diferentes por dia, com logo K pequena e arte própria em 1080×1920. Fotos da Dolce Vita podem receber fundo e luz por IA; a montagem não representa o interior real da parceira.
- `stories-calendar.json` guarda cinco artes por data local de Manaus. A primeira sequência, em 28/10, apresenta Dolce Vita, explica kombucha, o sabor/gás da fermentação e a produção artesanal da Kombú em Manaus desde 2017. Benefícios são apresentados pela experiência e pelos diferenciais verificáveis, sem promessas de saúde.
- `render-stories.mjs` valida e gera `out/stories/<data>/<id>.jpg`. O tipo `art` usa uma arte final aprovada; os demais montam fotos e garrafas com a logo pequena. A área segura de texto evita a interface do Instagram.
- Fluxo: `node render-stories.mjs --check`, `node render-stories.mjs`, revisão visual, `node prepare-publish.mjs`, deploy de `.render/publish` no Pages `kombu-social`. A preparação preserva os arquivos do feed e copia somente os Stories manifestados.
- O Worker publica um Story por execução às 07:00, 07:05, 07:10, 07:15 e 07:20 de Manaus. O feed publica às 09:00 de Manaus e mantém o intervalo de dois dias. Não existem chamadas manuais de publicação.
- Chaves: `story:<data>:<id>` e `stories:done:<data>`. A chave stories:slot:<data>:<horaUTC> impede mais de uma publicação bem-sucedida no mesmo horário. Uma publicação com resposta incerta fica retida para revisão, em vez de duplicar na tentativa seguinte. Stories requerem conta Business e permissão de publicação da Meta; a primeira execução real confirma a elegibilidade.
- A automação deste chat prepara/revisa a fila diariamente às 06:30 de Manaus e confere o resultado às 07:30. Em 28/10, a conferência excepcional ocorre às 10:30. Ela depende do ambiente local disponível. A publicação no horário é feita no Cloudflare, com as artes já preparadas.
- Antes de mudar um dia, confira o log e `stories:done:<data>` sem ler tokens. Nunca substitua arte já publicada. Preserve também o feed e as alterações de terceiros.
- Testes do publicador, com respostas simuladas e sem Instagram: `node --test worker/stories.test.mjs`.

- Correção do titular: não usar referências à família na comunicação. Os validadores impedem esses termos e o nome inexistente “Vitalidade”; o sabor correto é Imunidade. A fila inclui o novo carrossel 21-dolce-vita-fotos, com quatro artes finais do tipo art, preservadas em assets/partners/.

- A variedade do chá é informação confidencial e não deve aparecer em comunicação nova. Os validadores bloqueiam a divulgação nos posts futuros e Stories. Reforçar produção artesanal premium em Manaus, suavidade e sabor intenso. O post21 já publicado permanece registrado para impedir duplicidade; a segunda tela e a legenda corrigidas estão disponíveis nos downloads, sem republicação automática.

## Horário autorizado pelo titular em 28/10/2026

Cinco Stories em escadinha, um a cada cinco minutos a partir de 07:00 Manaus. O titular autorizou expressamente essa alteração dos crons de Stories. As execuções de feed não publicam Stories e os horários do feed foram preservados. Como o pedido chegou após as 07:00, somente em 28/10 haverá a sequência de 10:00 a 10:20. A regra anual do cron excepcional é neutralizada no código fora da data exata 28/10/2026. A elegibilidade Business e a permissão real da Meta continuam pendentes da primeira execução.

- O limite gratuito de cinco crons é por conta e já estava ocupado por outros publicadores. Para manter tudo gratuito sem modificar outros Workers, este publicador usa um único cron compartilhado. O código só libera Stories nas cinco janelas da manhã e o feed às 13:00 UTC (09:00 Manaus), conforme alteração autorizada em 30/10/2026. Os demais disparos não publicam nada.

## Horário do feed atualizado em 30/10/2026

A pedido do titular, o feed passa a publicar somente às 09:00 de Manaus (13:00 UTC), a cada dois dias. Foram removidas as janelas de 12:30 e 18:30. Os Stories continuam às 07:00, 07:05, 07:10, 07:15 e 07:20. O cron compartilhado dispara nas horas 11 e 13 UTC; o código bloqueia o feed fora das 13:00 UTC e os Stories fora de suas cinco janelas.

## Preparação de 30/10/2026

Os cinco Stories foram revisados antes da janela das 07:00: Casa Agridoce, Manga & Jasmim, gás da fermentação, pausa após o tênis e convite a criadores. Composições distintas e cenas aprovadas; sem alegar estoque de sabor no parceiro. Prévia em `research/2026-10-27/dolce-vita-fotos/stories-2026-10-30.jpg`. A sequência de ontem foi confirmada pelo log seguro e pela chave `stories:done:2026-10-29` (cinco publicações).

`node render-stories.mjs --date=2026-10-30` renderiza somente a data selecionada, preservando os demais dias; sem argumento, usa a data local de Manaus. Datas passadas são recusadas. Confira sempre o estado remoto do dia antes de renderizar. O manifesto mantém todos os dias e `prepare-publish.mjs` preserva os 44 JPEGs do feed.

## Incidente de Stories em 30/10/2026

Às 07:00, a Meta recusou `/media_publish` com “The requested resource does not exist”. O estado havia sido salvo como `publishing`; a proteção anterior bloqueou todas as tentativas seguintes, sem conciliar o container. A consulta local às 07:32 também falhou por autenticação do Wrangler, mas esse problema de verificação não foi a causa da falha de publicação. O acesso voltou após `wrangler whoami`, sem alterar segredos.

O Worker agora consulta `status_code` de um container pendente antes de qualquer nova publicação. `PUBLISHED` confirma o Story sem republicá-lo; `FINISHED`, após dois minutos, permite retomar o mesmo container; `ERROR` ou `EXPIRED` permite substituí-lo. Respostas inacessíveis ou incertas ficam retidas. Cada execução publica no máximo uma nova arte. Há recuperação dos pendentes a cada cinco minutos até 07:55; as cinco janelas normais continuam às 07:00–07:20. Em 30/10 somente, há recuperação a partir de 08:30, com margem até 09:55 para falhas transitórias ou propagação do cron. O feed permanece restrito às 09:00.

O log mantém o status da conciliação e os códigos numéricos seguros da Meta. `stories:health:<data>` registra erro, progresso ou conclusão, sem tokens. Na conferência, execute primeiro `wrangler whoami` para validar/renovar a sessão local, depois leia o log, `stories:health:<data>` e `stories:done:<data>`. Uma falha de autenticação da consulta não comprova uma falha no Instagram. Verificação da correção: testes simulam erro da Meta, resposta perdida, retomada do mesmo container, container já publicado, terminal e sequência de recuperação.

Conferência segura: `node check-stories.mjs 2026-10-30`. O script usa Wrangler 4.156.0 e retorna somente conclusão, saúde, estados das cinco artes e log de Stories da data. Não lê tokens e não chama a API do Instagram. O Wrangler 4.151.3 apresentou respostas 401 intermitentes nas consultas KV; uma leitura com 4.156.0 foi bem-sucedida, sem reconectar a conta. A conferência excepcional das 09:00 foi criada no mesmo chat para acompanhar a recuperação até confirmar ou relatar bloqueio.

## Sem contador nas artes de Stories

Correção do titular em 30/10/2026: retirar toda numeração visível de lote, como “2 de 5”. O gerador não inclui mais contador. As próximas 20 artes de 31/10–03/11 e os dois Stories de 30/10 ainda não iniciados foram renderizados novamente. Os três de 30/10 já publicados permanecem preservados; apagar e republicar exige aprovação do titular. `--only=id1,id2` seleciona artes específicas; `--preview` gera cópias privadas em `.render/stories-preview/`, sem alterar os arquivos publicados ou o manifesto.

### Substituição autorizada em 30/10

O titular aprovou expressamente apagar e republicar os três Stories de hoje com contador. Foram excluídos pela interface autenticada do Instagram: Uva (4019354028647237021), Manga & Jasmim (4019351552925856963) e Casa Agridoce (4019300721979991338), com retorno da interface confirmado após cada exclusão. Os dois Stories sem contador e os Stories manuais anteriores foram preservados. As substituições têm IDs novos com sufixo `-sem-contador` e imagens novas; o histórico dos IDs antigos fica no KV. A marca de conclusão agora inclui os cinco `frameIds`, e uma marca de uma versão anterior só é aceita se os cinco estados do manifesto atual estiverem publicados. A verificação de leitura também confere os cinco estados atuais. Assim, o Worker publica somente as três substituições, a cinco minutos de intervalo, e preserva as duas artes já publicadas.

Substituição conferida no próprio Instagram: Casa Agridoce republicado às 09:01 (Story 4019361578923805977), Manga & Jasmim às 09:06 (4019364104036159598) e Uva às 09:11 (4019366615183018427), todos sem contador. Os dois Stories sem numeração foram preservados. As capturas de comprovação estão em `.render/verification/`, com cópia da última em Downloads/Kombu-Stories-sem-contador-confirmacao.jpg. A conferência excepcional foi excluída após a verificação visual. O erro 401 intermitente também ocorreu em Wrangler 4.156.0; o verificador agora limita as tentativas de renovação e cada chamada a 30 segundos, sem ler credenciais e sem confundir falha da consulta com falha de publicação.

## Reels aprovados
`reels-calendar.json` contém os filmes liberados pelo titular. Esta fila entra antes do próximo post estático, respeitando o mesmo intervalo e publicando exclusivamente às 09:00 de Manaus. A primeira peça é `22-rosas-cardamomo-filme`, prevista para 01/11/2026 às 09:00 pelo último feed confirmado em 29/10 às 18:30. Um novo post manual pode mudar essa previsão.

Execute `node prepare-reel.mjs`, depois `node prepare-publish.mjs`. O primeiro prepara e valida H.264 1080×1920, AAC 48 kHz, duração e limite de 25 MiB por arquivo do Pages, com checksum da versão liberada. Nunca usar a prévia Rayssa na fila comercial. O segundo preserva os assets estáticos e acrescenta MP4, capa JPEG e legenda.

O Worker prepara o container às 08:50/08:55; somente o evento de 09:00 pode chamar a publicação. O estado seguro fica em `reel:<id>`, além de `published:<id>` e `last`. Container em processamento não é publicado prematuramente; resposta incerta não abre um novo container nem repete a publicação. Erros terminais exigem revisão. Nenhum endpoint público ou chamada manual de publicação foi adicionado.

Para conferir depois da janela, consulte somente `log`, `reel:22-rosas-cardamomo-filme`, `published:22-rosas-cardamomo-filme` e `last` com Wrangler 4.156.0. Não leia `token`. A primeira publicação de Reel ainda será validada pela execução real da Meta. A preparação de container segue o fluxo documentado pela Meta: https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api

As futuras artes usam as logos originais V4/V.3, sem recriar o K em uma fonte. Para uma revisão privada da peça de afiliados já publicada: `node render-stories.mjs --date=2026-10-30 --preview --draft=drafts/afiliados-2026-10-30.json`. Rascunhos são permitidos apenas em modo de prévia e não alteram a imagem publicada.

### Bloqueio de tarde/noite
Por orientação expressa do titular, feed, Reels e Stories nunca são publicados à tarde ou à noite, nem para compensar falhas. Os horários permanecem 09:00 no feed e 07:00–07:20 nos Stories, em Manaus. Além dos horários de cron, o Worker verifica a hora real da execução e bloqueia qualquer publicação fora da manhã (07:00–11:59), impedindo que uma execução atrasada publique à tarde. Não há recuperação vespertina/noturna. A correção de afiliados foi autorizada somente para futuras peças, preservando o Story de 30/10 já publicado.
