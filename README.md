# Kombú Kombucha Website

Modern public website and operational admin system for Kombú Kombucha da Amazônia.

## Pages

- `index.html`: public institutional/catalog website in Brazilian Portuguese.
- `admin.html`: internal operational dashboard.
- `ARCHITECTURE.md`: backend, database, SEO and deployment direction.

The admin includes a real product/EAN base from the provided Kombú spreadsheets, plus importable costing records for ingredients, packaging and 500ml recipes.
The public lead forms write into the admin CRM and call `/api/lead` for email notifications to `armaandaswani@icloud.com`.

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

For production setup, follow [SETUP.md](/Users/armaandaswani/Desktop/Kombucha/Kombu New Site/SETUP.md).

Required services:

- Supabase: shared admin data, public CMS state and CMS image storage.
- Resend: lead notifications and payment reminders.
- Vercel: hosting, API routes and daily cron.

Configure these Vercel environment variables:

- `RESEND_API_KEY`: required for production email delivery.
- `LEAD_NOTIFY_EMAIL`: optional, defaults to `armaandaswani@icloud.com`.
- `LEAD_FROM_EMAIL`: optional sender identity, but production should use a verified Resend sender/domain.
- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only Supabase service role key.
- `ADMIN_PORTAL_PASSWORD`: private admin password configured only in Vercel.
- `ADMIN_SESSION_SECRET`: optional long secret used to sign the admin cookie. When omitted, the server derives an isolated signing key from `SUPABASE_SERVICE_ROLE_KEY`.
- `CRON_SECRET`: secret used by the scheduled payment reminder route.

## Notes

The admin password is never shipped to the browser. Production login fails closed when `ADMIN_PORTAL_PASSWORD` is missing. A local static preview accepts any non-empty password because it cannot serve the Vercel authentication API; this behavior is limited to `localhost`, `127.0.0.1` and `file:` previews.

For production on Vercel, Supabase is now the expected backend for:

- Shared admin state across devices.
- Public CMS/partner data for the live website.
- Supabase Storage for public product images and invoice/receipt uploads.
- Future Supabase Auth and role permissions.
- Server-side cost snapshots for historical batch accuracy.
