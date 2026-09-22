---
sidebar_position: 2
---

# Install

storage.bd is two independent repos — `storage-bd-api` (NestJS + Prisma +
PostgreSQL) and `storage-bd-ui` (React + Vite) — plus a Postgres/Redis pair
the API depends on. It does **not** use `eh-manager` like EHM/Epic Backup do;
it's deployed as a plain `git clone` + `npm` + `systemd` app on its own box.

:::warning
This is a condensed walkthrough. `storage-bd-api/docs/` in the repo itself is
the source of truth and goes far deeper — read the specific doc linked in
each section below before troubleshooting a real deploy.
:::

## Local development setup

### Pre-requisite

1. [System Setup](../ehm/system-setup) (Node.js via nvm)
2. [Docker Installation](../ehm/docker-installation)
3. Access to the private `EpicLabs23/storage-bd-api` and `storage-bd-ui` repos

### 1. Backing services (Postgres + Redis)

`storage-bd-api` ships its own `docker-compose.yml` — a separate Postgres +
Redis pair on non-default host ports, deliberately not joined to EHM's
`eh_network`, so it can run alongside an EHM dev instance on the same machine
without colliding:

```bash
git clone https://<username>:<token>@github.com/EpicLabs23/storage-bd-api.git /epiclabs23/storage.bd/storage-bd-api
cd /epiclabs23/storage.bd/storage-bd-api
npm install
cp .env.sample .env
docker compose up -d db redis
```

Postgres lands on `127.0.0.1:5433`, Redis on `127.0.0.1:6380` — the `.env`
sample already points at both. Fill in real values for `POSTGRES_PASSWORD` /
`REDIS_PASSWORD` (used by both the compose file and `DATABASE_URL`/`REDIS_*`
below them in the same file — keep them in sync).

### 2. AWS — S3 bucket, IAM user, KMS key

Even for local dev, the proxy needs real S3 (and, if you're touching repo
password escrow, real KMS) — there's no local S3 stand-in. Full step-by-step
(bucket policy, least-privilege IAM user, S3 Inventory, KMS key + key policy):
`storage-bd-api/docs/aws-setup.md`. Fill the resulting values into `.env`:

```
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=
KMS_KEY_ARN=
```

A dev-scoped bucket/IAM user (`storage-bd-dev`, `storage-bd-proxy-dev`) keeps
this fully separate from production — see that doc's own per-environment
naming convention.

### 3. Push the schema, seed the first admin, run it

```bash
npx prisma db push
npx prisma db seed   # creates the first Admin row from ADMIN_SEED_* in .env
npm run start:dev
```

Listens on `STORAGE_BD_APP_PORT` (`3000` by default). `AuthModule` builds its
JWT signing keys unconditionally at bootstrap — if you haven't set
`STORAGE_BD_JWT_PRIVATE_KEY`/`_PUBLIC_KEY` in `.env`, it falls back to
`/storage-bd/jwt/{private,public}.pem` on disk, so generate that pair once:

```bash
sudo mkdir -p /storage-bd/jwt
openssl genrsa -out /storage-bd/jwt/private.pem 2048
openssl rsa -in /storage-bd/jwt/private.pem -pubout -out /storage-bd/jwt/public.pem
sudo chown -R $USER:$USER /storage-bd/jwt
```

### 4. Clone and run storage-bd-ui

```bash
git clone https://<username>:<token>@github.com/EpicLabs23/storage-bd-ui.git /epiclabs23/storage.bd/storage-bd-ui
cd /epiclabs23/storage.bd/storage-bd-ui
npm install
cp .env.sample .env    # VITE_API_BASE_URL already points at http://localhost:3010 — see note below
npm run dev
```

Runs on port `5174` by default. `storage-bd-api`'s `.env.sample` has
`CORS_ALLOWED_ORIGINS=http://localhost:5174` already set to match — if either
port is customized, keep both sides in sync or the UI's login will fail on
CORS, not a clearer error.

### 5. Log in

- Admin panel: `http://localhost:5174/admin` — `ADMIN_SEED_*` credentials from
  `.env` (step 3).
- Storefront / D2C: `http://localhost:5174` — register a new account, or use
  `POST /auth/register` directly.

### Feature-specific env vars

Only needed if you're touching that area — see `.env.sample` for the full
annotated list:

- `SMTP_*` — overage/failure notifications, D2C email verification and
  password reset. Skip for local dev unless you're testing those flows.
- `DGEPAY_*` (`BKASH_ENABLED`/`NAGAD_ENABLED`/`DGEPAY_ENABLED`) — D2C payment
  checkout. Full protocol + UAT sandbox credentials process in
  `storage-bd-api/docs/DGEPAY_PAYMENT_PLAN.md`.
- `S3_INVENTORY_DESTINATION_BUCKET`/`_PREFIX`/`_ID` — only needed to exercise
  the weekly quota-reconciliation job; reconciliation skips cleanly (not an
  error) while unset.

## Production installation

Production runs the app, Postgres, and Redis all on one EC2 instance (no
RDS/ElastiCache — see `ARCHITECTURE.md` §18 for why), fronted by Nginx +
Let's Encrypt, with `storage-bd-ui` served as a static build from the same
box. No CI/CD, no container registry — both apps build directly on the host.

Do these in order, each one a companion doc in the `storage-bd-api` repo with
the real commands:

1. **`storage-bd-api/docs/aws-setup.md`** — S3 bucket (private, encrypted,
   deny-all-except-proxy policy), least-privilege IAM user, S3 Inventory
   configuration, KMS key for repo-password escrow. Run once per environment.
2. **`storage-bd-api/docs/ec2-setup.md`** — launches the `t4g.small` instance,
   an IAM instance role (no static AWS keys on the box), Postgres + Redis via
   the same `docker-compose.yml` used in dev, the JWT signing keypair, the
   `systemd` unit for `storage-bd-api`, Nginx + certbot for both
   `api.storage.bd` and `storage.bd` (the UI's static build), and CORS.
3. **`storage-bd-api/docs/deploy.md`** — the day-2 loop for shipping updates
   to either app afterward (`git pull` → `npm ci` → `prisma db push` → build
   → restart, via `scripts/deploy.sh` in each repo). Read this before your
   first production deploy, not just the first time something breaks — it
   covers required `.env` diffing (a past incident: an unset public-URL var
   silently broke every DGePay call) and rollback.

:::warning
`npx prisma db push` has no migration history to roll back through. If it
reports it would drop a column/table on a production run, stop and look at
the diff before continuing.
:::
