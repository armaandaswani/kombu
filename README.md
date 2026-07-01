# Kombú Kombucha Website

Modern public website and operational admin prototype for Kombú Kombucha da Amazônia.

## Pages

- `index.html`: public institutional/catalog website in Brazilian Portuguese.
- `admin.html`: internal operational dashboard prototype.
- `ARCHITECTURE.md`: backend, database, SEO and deployment direction.

The admin includes a real product/EAN base from the provided Kombú spreadsheets, plus importable costing records for ingredients, packaging and 500ml recipes.
The public lead forms write into the admin CRM prototype and call `/api/lead` for email notifications to `armaandaswani@icloud.com`.

## Local Preview

```bash
python3 -m http.server 4173
```

Then open:

- http://127.0.0.1:4173/
- http://127.0.0.1:4173/admin.html

## Vercel

This is currently a static site with no build step. The root `index.html` can be deployed directly, and Vercel will also serve the serverless function in `api/lead.js`.

`vercel.json` adds clean routes:

- `/` -> `index.html`
- `/admin` -> `admin.html`

For lead email notifications, configure these Vercel environment variables:

- `RESEND_API_KEY`: required for production email delivery.
- `LEAD_NOTIFY_EMAIL`: optional, defaults to `armaandaswani@icloud.com`.
- `LEAD_FROM_EMAIL`: optional sender identity, but production should use a verified Resend sender/domain.

## Notes

The admin is protected by a temporary front-end password gate for prototype review. This is not production security because static front-end code can be inspected.

For production on Vercel, use Supabase or an equivalent backend for:

- Supabase Auth for real admin login.
- Postgres tables for products/EANs, ingredients, recipes, batches, stock, sales, leads, expenses, partners and CMS.
- Supabase Storage for public product images and invoice/receipt uploads.
- Row-level security and role permissions.
- Server-side cost snapshots for historical batch accuracy.
