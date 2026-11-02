# Revenda, parcerias e direção editorial — 02/11/2026

Implementação na base existente HTML/CSS/JS e API do projeto. Sem migração de framework, novos serviços pagos ou envio de contatos de teste à produção.

## Resultado
- `/revenda`: catálogo dos 12 sabores oficiais, filtro por perfil, seleção de garrafa no hero, foto real Dolce Vita, cuidados de fornecimento/refrigeração e pré-contato de três etapas inspirado no ritmo progressivo do formulário Orbital.
- `/parcerias`: nutricionistas, nutrólogos, personal trainers, influenciadores, estabelecimentos e outras conexões. Cadastro inicial sem requisito de seguidores; avaliação antes de condições/cupom. `/criadores` mantém fallback e redireciona permanentemente para a nova página em produção.
- CRM/notificação preservam públicos múltiplos, perfil, origem e contato. Captura confirmada no CRM é sucesso mesmo que a notificação falhe; falha real conserva os campos para nova tentativa. Metadados não consomem o limite da mensagem original.
- Home e navegação pública passam a apontar para Parcerias. Textos antigos de produção familiar removidos nas páginas tocadas.
- Conteúdo: estudo de 40 legendas e inspeção visual de 24 publicações de Vih; 12 rascunhos com rodízio de sabores e quatro campanhas finalizadas (8 imagens feed +4 Stories), ainda sem agendamento. Fontes, limites, legendas e download em `../marketing/instagram/research/2026-11-02-vih/`.

## Toolkit aplicado
Consultado `/Users/armaandaswani/Desktop/Webdesign/README.md`, find-skills, Taste (direção specimen-catalogue, preservando paleta e tipografia), Image to Code (mockups por seção antes da implementação), referência Starbucks da biblioteca DESIGN.md, Vercel Web Design Guidelines e Playwright CLI. Formulário Orbital local consultado como referência de progressão, sem transplantar identidade. Perfis locais de agentes usados para backend, editorial e revisão independente.

Imagem do hero e catálogo foram referências de direção. Uma saída de IA que inventou conteúdo de sabores foi rejeitada; o site usa somente catálogo e fotografias oficiais. Não há screenshot de interface incorporado como página.

## Validação
- `npm run check`: passou, inclui novo trade.js.
- `npm test`: API, qualificação/arquivo de leads, reservas, admin e loja passaram.
- `AUDIT_BASE_URL=http://127.0.0.1:4178 node scripts/public-regression.js`: passou com API local simulada. Cobre catálogo/CMS, filtro, hero, avanço por Enter, bloqueio de campos vazios, múltiplos públicos, Outro e limpeza, volta entre etapas, envio revenda/parceria, Instagram opcional profissional, home/rota legada e SEO.
- Playwright CLI: revenda/parcerias em 320,390,768,1440 px; oito capturas sem overflow horizontal. Revisão visual de ambas as páginas e das 12 artes. Foco, labels, fieldsets, aria-live e reduced-motion preservados.
- Revisão independente final: aprovado, sem achados pendentes. Limites de campos e arquivamento alinhados; testes de mensagem longa/idempotência incluídos.
- Não houve lead real, mensagem de WhatsApp, e-mail, publicação de Instagram ou mudança nos horários/calendários.

## Entrega
Screenshots em `research/*20261102.png`. Pacote de artes também copiado para Downloads/Kombu-Revenda-Parcerias-Previas.zip. `marketing/` e `research/` seguem excluídos do deploy público por `.vercelignore`; manual confidencial não integra a entrega pública.
