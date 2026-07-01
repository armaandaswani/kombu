# Kombú Kombucha Website

Modern public website and operational admin prototype for Kombú Kombucha da Amazônia.

## Pages

- `index.html`: public institutional/catalog website in Brazilian Portuguese.
- `admin.html`: internal operational dashboard prototype.
- `ARCHITECTURE.md`: backend, database, SEO and deployment direction.

The admin includes a real product/EAN base from the provided Kombú spreadsheets, plus importable costing records for ingredients, packaging and 500ml recipes.

## Local Preview

```bash
python3 -m http.server 4173
```

Then open:

- http://127.0.0.1:4173/
- http://127.0.0.1:4173/admin.html

## Vercel

This is currently a static site with no build step. The root `index.html` can be deployed directly.

`vercel.json` adds clean routes:

- `/` -> `index.html`
- `/admin` -> `admin.html`

## Notes

The admin is protected by a temporary front-end password gate for prototype review. This is not production security because static front-end code can be inspected.

For production on Vercel, use Supabase or an equivalent backend for:

- Supabase Auth for real admin login.
- Postgres tables for products/EANs, ingredients, recipes, batches, stock, sales, expenses, partners and CMS.
- Supabase Storage for public product images and invoice/receipt uploads.
- Row-level security and role permissions.
- Server-side cost snapshots for historical batch accuracy.
