# Kombu Backend Setup

This repo now supports a real backend on Vercel using Supabase and Resend.

## Services Needed

1. Supabase
   - Database for the admin state.
   - Storage for CMS/product images.
   - Later: Supabase Auth can replace the temporary password gate.

2. Resend
   - Email notifications for new leads.
   - Daily payment reminder emails from the scheduled cron route.

3. Vercel
   - Hosts the static public/admin site.
   - Runs the API routes in `/api`.
   - Runs the daily cron route for payment reminders.

## Supabase

1. Create a new Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Copy the project URL and service role key.

Use the service role key only in Vercel environment variables. Never expose it in client-side code.

## Resend

1. Create a Resend account.
2. Create an API key.
3. For production, verify a sender/domain and use it in `LEAD_FROM_EMAIL`.

Temporary sender fallback works with `onboarding@resend.dev`, but a verified Kombu sender is better for deliverability.

## Vercel Environment Variables

Add these in Vercel Project Settings -> Environment Variables. Do not paste `KEY=value` into one field. Put the key name in `Key` and the matching value in `Value`.

| Key | Value |
| --- | --- |
| `ADMIN_PORTAL_PASSWORD` | `Rssb2010` |
| `ADMIN_SESSION_SECRET` | A long random secret, for example from `openssl rand -base64 48` |
| `SUPABASE_URL` | Your Supabase project URL, like `https://abcxyz.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key, not the anon/public key |
| `SUPABASE_PUBLIC_MEDIA_BUCKET` | `public-media` |
| `RESEND_API_KEY` | Your Resend API key, usually starts with `re_` |
| `LEAD_NOTIFY_EMAIL` | `armaandaswani@icloud.com` |
| `LEAD_FROM_EMAIL` | A verified Resend sender, for example `Kombu <leads@kombukombucha.com.br>` |
| `CRON_SECRET` | A second long random secret, for example from `openssl rand -base64 48` |

After setting variables, redeploy on Vercel.

## Sync Diagnosis

If desktop and mobile do not show the same admin/CMS data, open
`/api/public-state` on the production domain.

- Expected healthy response: `ok:true`, `configured:true`.
- If it returns `supabase_schema_missing`, run `supabase/schema.sql` in the Supabase SQL Editor.
- If it returns `supabase_credentials_invalid`, replace the Vercel key with the Supabase `service_role` secret key, not the public anon key.
- If it returns `missing_supabase_env`, add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel and redeploy.

## What Becomes Real After This

- Admin data syncs across devices through `/api/state`.
- Leads from the public site are saved to the admin state and emailed.
- CMS image uploads are resized in the browser, uploaded to Supabase Storage, and turned into public URLs.
- Public site reads CMS/partners from `/api/public-state`.
- Payment reminders are checked daily by `/api/cron/payment-reminders`.

## Current Security Model

The admin now supports server-side login through `/api/auth/login`, which sets an httpOnly cookie for API routes.

The visible password gate falls back to the static password only in local preview. In production, login goes through the Vercel API and the admin data only syncs across devices after Supabase is configured.
