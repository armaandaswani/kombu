# Setting up a safe environment to test in

**Why this matters.** In Vercel, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are currently scoped to **"Production and Preview"**. Every preview deployment therefore reads and writes the **live** database. Right now there is nowhere to try a change before customers feel it, which is why every fix has gone straight to production and been verified afterwards. That is acceptable for small reversible changes. It is not acceptable for schema changes or for splitting the state document into real tables.

The goal: preview deployments talk to their own throwaway database, production is untouched.

Takes about twenty minutes. Nothing here changes production.

---

## 1. Create a second Supabase project

1. supabase.com → **New project**
2. Name it `kombu-preview` (any name; it must be a *different project*, not a branch of the live one)
3. Choose the same region as the live project so behaviour matches
4. Set a database password and keep it somewhere safe
5. Wait for provisioning to finish

## 2. Create the schema in the new project

Open the new project → **SQL Editor** → paste and run the contents of `supabase/schema.sql` from this repo.

That creates `app_state`, `email_events`, the `public-media` storage bucket and its read policy. It creates **no data**, which is what we want: an empty staging database.

Optionally seed it with a copy of production so previews have realistic data. In the **production** project's SQL editor:

```sql
select state from public.app_state where id = 'production';
```

Copy the JSON result, then in the **preview** project's SQL editor:

```sql
insert into public.app_state (id, state, updated_by)
values ('production', '<paste the JSON here>'::jsonb, 'seed-from-production')
on conflict (id) do update set state = excluded.state, updated_at = now();
```

Only do this if you are comfortable with a copy of your operational data living in a second project. A preview environment works fine empty.

## 3. Collect the new project's credentials

In the **preview** project: **Settings → API**

- **Project URL** → this is the new `SUPABASE_URL`
- **Project API keys → `service_role`** (the secret one, **not** `anon`/`public`) → this is the new `SUPABASE_SERVICE_ROLE_KEY`

## 4. Re-scope the variables in Vercel

Vercel → the **kombu** project → **Settings → Environment Variables**.

For **`SUPABASE_URL`** and **`SUPABASE_SERVICE_ROLE_KEY`**, do this to each:

1. Open the existing entry (the `...` menu → Edit)
2. Change **Environments** from "Production and Preview" to **Production** only
3. Save
4. **Add** a new variable with the same key, the **preview project's** value, and Environments set to **Preview** only

You should end up with two entries per key: one scoped to Production holding the live values, one scoped to Preview holding the new project's values.

Do the same for **`SUPABASE_PUBLIC_MEDIA_BUCKET`** (value stays `public-media`; it just needs a Preview-scoped entry so previews do not fall back to the production one).

**Leave `ADMIN_PORTAL_PASSWORD`, `ADMIN_SESSION_SECRET`, `RESEND_API_KEY` and `CRON_SECRET` alone for now** — see the notes below.

## 5. Confirm it worked

Push any branch, or redeploy an existing preview, then open the preview URL (Vercel → Deployments → any deployment labelled **Preview**) and visit:

```
<preview-url>/api/public-state
```

- `"configured": true` → the preview has its own Supabase wired up
- `"exists": false` (or your seeded data) → it is **not** the production database

Compare against `https://www.kombukombucha.com.br/api/public-state`. If the two return different data, you are done. **If they return identical data, the preview is still pointing at production — stop and recheck step 4.**

Tell me once this is done and I will start using preview deployments for verification instead of production.

---

## Notes and gotchas

**Do not reuse the production admin password for preview.** A preview URL is public and unlisted rather than private. Once the above works, consider adding a Preview-scoped `ADMIN_PORTAL_PASSWORD` with a different value, and a separate `ADMIN_SESSION_SECRET`. If you do not set them, previews inherit the production values and anyone who finds a preview URL can log in with the production password.

**Resend.** If you leave `RESEND_API_KEY` shared, testing a lead form on preview sends real email from your live sender and burns real quota. Either set an empty Preview-scoped value (the code already handles a missing key — it returns `202` with `emailSent: false` and still persists the lead) or use a separate Resend key.

**`CRON_SECRET`.** Crons only run on production deployments, so this does not need a preview value. Separately: it is currently **not set at all**, which is why `/api/cron/payment-reminders` returns `cron_not_configured` and the daily receivables email has never gone out. If you want that job to run, generate a secret (`openssl rand -base64 48`) and add it as a Production variable.

**Storage.** The preview project gets its own `public-media` bucket from `schema.sql`, so CMS image uploads on preview will not touch production media.

**The preview database is disposable.** That is the point. Reset it, corrupt it, run destructive migrations against it. Nothing there is real.
