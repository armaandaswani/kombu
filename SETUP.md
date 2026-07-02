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

Add these in Vercel Project Settings -> Environment Variables:

```bash
ADMIN_PORTAL_PASSWORD=Rssb2010
ADMIN_SESSION_SECRET=<long random secret>
SUPABASE_URL=<supabase project url>
SUPABASE_SERVICE_ROLE_KEY=<supabase service role key>
SUPABASE_PUBLIC_MEDIA_BUCKET=public-media
RESEND_API_KEY=<resend api key>
LEAD_NOTIFY_EMAIL=armaandaswani@icloud.com
LEAD_FROM_EMAIL=Kombu <leads@your-verified-domain.com>
CRON_SECRET=<long random secret>
```

After setting variables, redeploy on Vercel.

## What Becomes Real After This

- Admin data syncs across devices through `/api/state`.
- Leads from the public site are saved to the admin state and emailed.
- CMS image uploads are resized in the browser, uploaded to Supabase Storage, and turned into public URLs.
- Public site reads CMS/partners from `/api/public-state`.
- Payment reminders are checked daily by `/api/cron/payment-reminders`.

## Current Security Model

The admin now supports server-side login through `/api/auth/login`, which sets an httpOnly cookie for API routes.

The visible static password gate remains as a fallback for local preview. For production-grade staff accounts, the next step is Supabase Auth with role-based permissions.
