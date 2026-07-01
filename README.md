# Kombú Kombucha Website

Modern public website and operational admin prototype for Kombú Kombucha da Amazônia.

## Pages

- `index.html`: public institutional/catalog website in Brazilian Portuguese.
- `admin.html`: internal operational dashboard prototype.
- `ARCHITECTURE.md`: backend, database, SEO and deployment direction.

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

The admin uses localStorage for prototype persistence. Production should replace that with authenticated backend storage, role-based permissions, protected uploads and server-side cost snapshots.

