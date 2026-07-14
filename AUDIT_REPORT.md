# Kombú Platform Audit

Audit completed on 2026-07-14 across the public website, admin portal, Vercel API routes, Supabase integration and Resend notification path.

## Executive Summary

The current application is a static HTML/CSS/JavaScript frontend served by Vercel, with serverless API routes for authentication, shared state, public CMS data, media uploads, leads and payment reminders. Supabase stores the shared operational state and public media; Resend sends notifications.

This pass fixed the highest-risk functional and security gaps that could be handled safely without migrating the data model. Automated reservation remains the default, while an administrator can now override an order's reserved quantity with a mandatory reason. Dashboard partner shortcuts now open the exact partner record in the Parceiros module. Damaged, expired or otherwise unusable bottles can be written off without consuming reserved stock.

The application is operational at the current scale, but it should not be treated as a mature multi-user ERP yet. The monolithic JSON state and client-side role selector are the two main structural limitations.

## Architecture

### Frontend

- `index.html` and `assets/public.js`: public catalog, CMS content, partner map, reseller and contact leads.
- `admin.html` and `assets/admin.js`: dashboard, products, ingredients, purchases, recipes, production, stock, sales, orders, partners, CRM, reports and CMS.
- `assets/kombu.css`: shared responsive design system.

### Backend

- `api/auth/*`: server-validated admin login and HttpOnly session cookie.
- `api/state.js`: authenticated shared-state reads and writes.
- `api/public-state.js`: sanitized public CMS and partner state.
- `api/lead.js`: atomic lead persistence and Resend notification.
- `api/media/upload.js`: authenticated image upload.
- `api/cron/payment-reminders.js`: protected daily reminder job.

### Data and Services

- Supabase `app_state`: current JSONB operational state.
- Supabase `email_events`: notification event history.
- Supabase Storage `public-media`: public product and CMS images.
- Resend: lead and payment reminder email delivery.
- Vercel: hosting, API execution, environment variables and cron.

## Module Integration

- Purchases update ingredient or packaging stock, calculated unit cost and expenses.
- Recipes use ingredient and packaging records to calculate cost per bottle.
- Approved production batches consume recipe inputs and add finished bottles.
- Open orders create demand; approved stock is automatically allocated in order priority.
- Manual reservation targets reconcile immediately without exceeding real stock.
- Sales and write-offs reduce finished stock and feed financial reporting.
- Partners and recurring customers are linked to orders and sales history.
- Public leads persist into CRM and trigger an admin email notification.
- CMS and partner visibility are read by the public site through a sanitized API.

## Fixes Delivered

### Reservation and Stock

- Preserved automatic order allocation by available stock and order priority.
- Added a per-order manual reservation target for each flavor.
- Prevented allocations above produced stock.
- Recalculated available stock immediately after every adjustment.
- Required an adjustment reason and recorded user, timestamp, previous value and new value.
- Added permanent write-off for expired, damaged, unsuitable, internal-use or other stock.
- Prevented write-off from taking bottles already reserved to a customer.

### Dashboard and Partners

- Added dashboard `Editar parceiro` action.
- The action changes to the Parceiros module and opens the exact selected record.
- No duplicate inline editor and no second partner search are required.

### Public Website

- Corrected all purchase CTAs to the official Google Maps viewer.
- Removed conflicting nested card interaction in the flavor catalog.
- Kept the compact three-flavor mobile grid; tapping a flavor opens details and its purchase CTA.
- Lead forms now prevent duplicate submissions.
- Success is shown only when the lead was actually persisted, except in explicit localhost preview.
- Added manifest, robots and sitemap metadata.

### Security and Reliability

- Removed the real admin password from tracked documentation and examples.
- Required separate admin password and session-signing secrets.
- Kept the password out of the URL and browser JavaScript.
- Added timing-safe password comparison and secure HttpOnly cookie behavior.
- Made missing authentication and cron secrets fail closed.
- Added request-size limits, state-shape validation and optimistic state conflict handling.
- Made public lead append atomic to reduce lost updates.
- Restricted uploads by size and supported image MIME type.
- Added no-cache rules for stateful pages/assets and no-index rules for admin routes.
- Added HSTS, frame blocking, MIME sniffing protection and restrictive permissions headers.

## Verification

Automated checks cover:

- Admin password visibility toggle and local login behavior.
- Automatic 4/4 reservation, manual change to 3/4 and audit details.
- Exact dashboard-to-partner edit navigation.
- Damaged bottle write-off with reservation preservation.
- Fail-closed login and cron behavior.
- Secure session cookie and state authorization.
- Public purchase links, mobile flavor details and navigation.
- Single lead submission with confirmed server persistence.
- State validation and JavaScript syntax.
- 76 public/admin page and viewport combinations at 375, 430, 768 and 1440 pixels.

The responsive sweep found no page-level horizontal overflow, clipped elements, unlabeled controls or runtime errors after remediation.

## Remaining Structural Risks

### High: Named users and real roles

The role selector in the browser changes interface permissions but is not a complete server-side RBAC system. Add Supabase Auth, named user accounts, role claims and row-level policies before granting access to multiple staff members.

### High: Monolithic JSONB state

The app stores most operations in one JSON document. Atomic mutations and optimistic conflict checks reduce immediate risk, but concurrent operations and long-term reporting will outgrow this design. Normalize orders, order items, allocations, batches, movements, purchases, expenses, customers and audit events into relational tables.

### Medium: Server-owned business rules

Several calculations still run in the browser. During normalization, move stock allocation, production consumption, COGS and financial totals into transactional server functions so no client can submit inconsistent derived values.

### Medium: Backup and operational monitoring

Confirm Supabase point-in-time recovery or scheduled backups, create a restore drill, and add centralized Vercel/Supabase error alerts. Email delivery also depends on a verified Resend sender and valid production environment variables.

## Recommended Migration Order

1. Add named Supabase Auth users and server-enforced roles.
2. Normalize stock movements, allocations, orders and production in PostgreSQL transactions.
3. Normalize purchases, recipes, costs, customers and financial events.
4. Migrate the dashboard and reports to database views.
5. Add backup verification, error monitoring and an end-to-end production smoke test.

The current JSON state can remain as a compatibility snapshot during this migration, then become read-only and eventually be removed.
