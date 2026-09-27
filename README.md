# St. Mark Coptic Orthodox Center — Web Platform & PWA

The web platform for `saintmarkcenter.org`: a Next.js App Router application with an
embedded Payload CMS, PWA/offline support, live-stream detection, kitchen ordering,
iCalendar subscriptions, daily Coptic readings, and online giving.

## Stack

- **Next.js 15** (App Router, Server Components, TypeScript)
- **Payload CMS 3** (embedded in Next.js, single-container deployment)
- **PostgreSQL 16** (via `@payloadcms/db-postgres`)
- **Local disk media storage** (no cloud account; persisted via a Docker volume)
- **Docker Compose + Caddy** (automatic TLS)
- **Serwist** service worker for PWA caching + Web Push

## Prerequisites

- Node.js 20.9+ (Node 22 recommended)
- Docker (for the production stack) and optionally a local PostgreSQL

## Local development

```bash
cp .env.example .env      # then fill in values as needed
npm install
npm run generate:importmap # first run only / after adding admin components
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/admin for the CMS.
The first visit to `/admin` prompts you to create the initial administrator account.

The app boots without external credentials: live streams, giving, and push notifications
degrade gracefully when their keys are absent, and pages fall back to defaults if the
database is unreachable.

### Optional local services

```bash
# PostgreSQL only (exposed on host port 5433; set DATABASE_URI accordingly)
docker compose up -d postgres
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run generate:types` | Regenerate `src/payload-types.ts` |
| `npm run generate:importmap` | Regenerate the Payload admin import map |
| `npm run migrate` | Apply pending database migrations |
| `npm run migrate:create -- <name>` | Generate a new migration |
| `npm run migrate:status` | Show migration status |
| `npm run icons` | Regenerate PWA icons |

## Environment variables

See `.env.example`. Highlights:

- `DATABASE_URI`, `PAYLOAD_SECRET` — required.
- `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_IDS` — live stream detection.
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — online giving.
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` — web push (`npx web-push generate-vapid-keys`).
- `KATAMEROS_API_URL` — optional Coptic readings API; a curated fallback is used otherwise.

Uploads are written to `./media` locally, and to the `media_data` Docker volume in
production. No S3/R2 credentials are needed.

## Volunteer roles (RBAC)

Manage users under **Administration → Users** in the admin panel:

- **Administrator** — full access.
- **Church Secretariat** — all content (bulletins, events, media).
- **Media Team** — content plus site & live-stream settings.
- **Kitchen Lead** — kitchen ordering settings only.

Marking a bulletin **Urgent** sends a web push to every subscribed device.

## Deployment

```bash
cp .env.example .env   # set production values
docker compose up -d --build
```

`docker compose up` runs a one-shot **migrate** service (`payload migrate`) before the app
starts, then Caddy terminates TLS for `saintmarkcenter.org` and reverse-proxies the app
container.

### Database migrations

Production never auto-pushes schema (Payload only pushes in development), so schema changes
are applied through migrations. The initial migration lives in `src/migrations/`.

```bash
npm run migrate:create -- <name>   # generate a migration after changing collections/fields
npm run migrate                    # apply pending migrations
npm run migrate:status             # show applied / pending
```

Commit everything under `src/migrations/`. In Docker, the `migrate` service applies them
automatically on each `docker compose up`.

## PWA behavior

- App shell, fonts, icons, and static assets: cache-first.
- Bulletins / schedule / kitchen pages: network-first with a cached fallback.
- Offline fallback route: `/~offline` (includes the direct kitchen SMS option).
- Web Push: subscriptions are stored in the `push-subscriptions` collection and used for
  urgent announcements.
