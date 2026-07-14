# Kombú New Site - Architecture Notes

This folder contains the Kombú operational web application built from the Stitch base:

- `index.html`: public institutional/catalog site in Brazilian Portuguese.
- `admin.html`: internal operating dashboard.
- `assets/kombu.css`: shared visual system based on the Amazonian Vitality Stitch palette.
- `assets/public.js`: public flavor cards, partner locator, forms and flavor detail views.
- `assets/admin.js`: operational workflows, cost calculations, admin modules and CSV export.
- `api/lead.js`: Vercel serverless endpoint for new leads, Supabase persistence and Resend notifications.
- `api/state.js`: authenticated admin state sync endpoint backed by Supabase.
- `api/public-state.js`: sanitized public CMS/partners endpoint for the public site.
- `api/media/upload.js`: authenticated CMS image upload endpoint backed by Supabase Storage.
- `api/cron/payment-reminders.js`: daily payment reminder email job for delivered unpaid orders.

## Product Shape

The public side is intentionally not direct ecommerce. CTAs route users to:

- Partner locator.
- WhatsApp.
- Reseller lead form.
- General contact form.
- External sales links later, if approved.

The admin side is structured as the business operating system for Kombú:

- Dashboard geral.
- Produtos / EAN.
- Ingredientes.
- Compras.
- Fornecedores.
- Receitas e versões.
- Calculadora de custo por garrafa.
- Lotes de produção.
- Estoque.
- Embalagens.
- Vendas.
- Leads CRM.
- Parceiros.
- Despesas.
- Relatórios.
- CMS público.
- Arquitetura/schema.

## Calculation Rules

The cost engine in `assets/admin.js` already models:

- Product/EAN links to recipes, batches and sales.
- Unit conversion between `kg/g`, `l/ml` and `un`.
- Ingredient cost per used quantity.
- Packaging cost per bottle.
- Labor, utilities, other variable costs and loss percentage.
- Batch cost.
- Cost per bottle.
- Cost per liter.
- Wholesale and retail margin.
- Sales COGS by batch.
- Gross profit, gross margin and estimated net result.

Historical costing rule for a real backend:

Each production batch must store a snapshot of recipe version, ingredient costs, packaging costs and assumptions at the time of production. Future price changes must update future estimates only.

## Suggested Database Entities

- Users
- Roles
- Products
- Product Barcodes / EAN-13
- Product Variants
- Ingredients
- Ingredient Categories
- Suppliers
- Purchases
- Purchase Items
- Packaging Materials
- Recipes
- Recipe Ingredients
- Recipe Versions
- Production Batches
- Batch Ingredients Used
- Finished Product Stock
- Stock Movements
- Flavors
- Partners
- Sales
- Sale Items
- Leads
- Lead Status History
- Expenses
- Expense Categories
- Cost Assumptions
- Reports
- CMS Pages
- Media Library
- Audit Logs

## Security Direction

For production, Supabase is required because this site needs shared database state and image/file storage. The current static password gate remains only as a local fallback; production API access uses a server-side login cookie.

- Server-side password login for `/admin` API routes now; Supabase Auth later for named users.
- Role-based permissions with row-level security.
- Supabase Storage for product images, invoices and receipts.
- Audit log for edits and deletions.
- No public access to cost, sales, stock or financial data.
- Server-side validation for all calculations.

## Lead Notifications

The public reseller and contact forms call `/api/lead`.

On Vercel, email delivery uses Resend:

- `RESEND_API_KEY`: required to send.
- `LEAD_NOTIFY_EMAIL`: optional recipient override. Default is `armaandaswani@icloud.com`.
- `LEAD_FROM_EMAIL`: optional sender address. For production, this should be a verified sender/domain in Resend.
- `CRON_SECRET`: protects the scheduled reminder endpoint.

The endpoint returns `emailSent: false` when `RESEND_API_KEY` is missing, so local/static previews keep working. With Supabase configured, leads persist into the admin state even if email is temporarily unavailable.

## SEO Plan

Priority pages and search intent:

- Home: `Kombú Kombucha Premium | Refrigerante Saudável Natural em Manaus`
- Sabores: `Sabores Kombú | Kombucha artesanal premium da Amazônia`
- Each flavor: `Kombucha de [Sabor] 500ml | Kombú Manaus`
- Benefícios: `Benefícios da Kombucha | Bebida funcional clean label`
- O que é Kombucha: `O que é Kombucha? Guia simples da Kombú`
- Onde Encontrar: `Onde comprar Kombú Kombucha em Manaus`
- Seja Revendedor: `Revenda Kombú | Bebida saudável para cafés, empórios e restaurantes`
- Sobre: `Sobre a Kombú | Kombucha premium feita em Manaus`
- Contato: `Contato Kombú Kombucha da Amazônia`

Target keyword clusters:

- kombucha em Manaus
- kombucha artesanal Manaus
- kombucha premium Amazonas
- refrigerante saudável Manaus
- bebida funcional Manaus
- kombucha natural
- kombucha probiótica
- kombucha clean label
- kombucha revenda Manaus
- bebida saudável para revenda
- kombucha para cafés e restaurantes
- bebida funcional para empórios

Schema:

- `LocalBusiness` on the public site.
- `Product` or `ItemList` for flavor pages.
- `FAQPage` for "O que é Kombucha?" after final copy is approved.

## CTA Strategy

Public CTAs:

- Primary: `Onde encontrar`
- Secondary: `Conhecer sabores`
- Commercial: `Seja revendedor`
- Support: `WhatsApp`

Admin CTAs:

- `Nova venda`
- `Registrar compra`
- `Novo lote`
- `Novo ingrediente`
- `Salvar simulação`
- `Exportar CSV`

## Next Production Steps

1. Create a Supabase project and run `supabase/schema.sql`.
2. Add the Vercel env vars listed in `SETUP.md`.
3. Redeploy Vercel and log into `/admin` once to seed the cloud state.
4. Verify lead form email delivery through Resend.
5. Verify CMS image upload into Supabase Storage.
6. Move from JSONB state sync to normalized tables once daily operations stabilize.
7. Add Supabase Auth and named role permissions.
8. Add analytics events and ad pixels after consent strategy is defined.
