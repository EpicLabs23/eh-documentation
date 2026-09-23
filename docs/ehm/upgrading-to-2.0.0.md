---
sidebar_position: 7.7
---

# Upgrading from 1.1.x to 2.0.0

:::danger
2.0.0 is a **major version bump**, not a point release. OpenLiteSpeed replaces PHP-FPM/nginx for app hosting (PHP 7.4 support dropped, 8.1+ only), and Postgres/MSSQL/MongoDB are no longer containers EHM creates and manages itself — they're standalone `eh-services` you point EHM at. Read this whole guide before running `eh-manager update-ehm`, especially if you have Postgres/MSSQL/MongoDB enabled or any accounts still running PHP 7.4.
:::

## What's in this release

- **Postgres/MSSQL/MongoDB become independent, external engines.** EHM no longer creates or owns these containers via `docker.sock` — they run as their own `eh-services` compose stacks, and EHM just needs `.env` values to reach them (`POSTGRES_IP`/`MSSQL_IP`/`MONGO_HOST` etc). If you have any of these enabled today, see [Before you start](#before-you-start) — this needs action, it doesn't happen for you. See `docs/DB_TOPOLOGY.md` in `ehm-api`.
- **Per-account database jailing.** MySQL/Postgres/MSSQL database users are now jailed to their own account's databases (previously an account's DB user could see/touch other accounts' databases on the same server), with reserved-keyword filtering and an `a<account_id>_` naming prefix for anything newly created. Existing databases/users keep working under their old names — nothing is renamed for you.
- **Database count/size quotas** for MySQL and Postgres, enforced per-account.
- **OpenLiteSpeed replaces PHP-FPM/nginx** for `php`/`static`/`wordpress` apps. The `php-nginx` deploy type was renamed to `php`, and **PHP 7.4 support was dropped** — the current image ships lsphp 8.1/8.3/8.4 only. This is the change most likely to break an existing account if not handled — see Step 3 below.
- **Nginx conf generation became on-demand, transactional, and drift-detected** — configs regenerate from DB state instead of being hand-maintained files. See `docs/NGINX.md` in `ehm-api`.
- **storage.bd backup**, both EHM's own host-level backup and a per-account reseller-provisioned backup tenant (MySQL/Postgres/MSSQL/MongoDB). Existing accounts don't get a backup tenant automatically — see Step 4. If you haven't configured storage.bd at all yet, start with [Storage.bd Backup Setup](./storage-bd-setup).
- **Git provider integrations** (GitHub/GitLab/Bitbucket OAuth, so ECP accounts can import apps directly from a repo). Opt-in, no impact on existing accounts if skipped — see [Git Integrations Setup](./git-integrations-setup).
- **Managed WordPress Hosting** — a new opt-in product on the same OpenLiteSpeed/lsphp stack. Nothing to do unless you plan to offer it.
- **Certificate management moved into the Domains menu** in the admin UI (previously its own top-level menu) — cosmetic, no action needed.
- **A disk-cleanup subsystem** (Docker images/volumes, export archives, old `ehm-release` versions, resource-monitor events, and leftover host directories from the old nginx/PHP-FPM architecture) — dry-run report + admin-triggered execute, under **Maintenance** in the admin UI. See `docs/CLEANUP_POLICY.md`.
- **`POST /account/export` was removed.** It was an older, simpler export path with no import counterpart and no Postgres/Mongo/MSSQL support. Use the export-import module instead (`POST /export-import/ecp-exports` / `POST /export-import/ecp-import`) — see `docs/UPGRADE_GUIDE.md` in `ehm-api` for what it does and doesn't cover.
- PM2 log rotation for `ehm-api`/`ehm-ui` is now set up automatically by the update script (previously unbounded log growth under `~/.pm2/logs`).

## Before you start

**If you don't have Postgres/MSSQL/MongoDB enabled today**, skip straight to [Step-by-step](#step-by-step) — none of the database-engine changes above apply to you.

**If you do**, each engine now needs its own `eh-services` stack running *before* you run `eh-manager update-ehm`, and the updater needs the same credentials your existing container already has (it does not read them out of the old `EhConfig`-stored values for you):

1. Follow [Install PostgreSQL](../eh-services/install-postgresql), [Install MSSQL](../eh-services/install-mssql), and/or [Install MongoDB](../eh-services/install-mongodb) — each has an **"Existing installs upgrading from an EHM-managed container"** section that walks through stopping the old EHM-managed container and pointing the new standalone one at the same data volume, so nothing is lost.
2. Note the resulting password for each engine you use (`POSTGRES_SUPER_USER_PASSWORD`, `MSSQL_SA_PASSWORD`, `MONGO_ROOT_PASSWORD`) — you'll export these before running the updater in Step 2 below.

This is the same shape as the `REDIS_PASSWORD` requirement from 1.1.3 — the updater writes `ehm-api/.env` from scratch, so anything it doesn't already know has to be handed to it.

## Step-by-step

### 1. Update `eh-services` engines you use (if any)

Covered above — do this first if you have Postgres/MSSQL/MongoDB enabled.

### 2. Export credentials before running the updater

```bash
export REDIS_PASSWORD="<from eh-services/redis/.env>"
# Only the ones you actually use:
export POSTGRES_SUPER_USER_PASSWORD="<from eh-services/postgresql/.env>"
export MSSQL_SA_PASSWORD="<from eh-services/mssql/.env>"
export MONGO_ROOT_PASSWORD="<from eh-services/mongodb/.env>"
```

Keep these exported in the same shell session you run `eh-manager update-ehm` from next. Anything you skip comes up unconfigured in `ehm-api/.env` — fixable by hand afterward, but the engine reports as unavailable until you do.

### 3. Run the updater

```bash
sudo su
eh-manager update-ehm
```

or non-interactively:

```bash
sudo su
eh-manager update-ehm -v 2.0.0 --dbpass <your-mysql-root-password> --apiurl http://localhost:2326 --os 24.04 --influx false
```

`2.0.0_update.sh` writes the new `.env` (including `POSTGRES_ENABLED`/`MSSQL_ENABLED`/`MONGO_ENABLED`, each defaulting `true` since reaching this script means the feature was already active), regenerates the JWT keypair, runs `prisma db push` (this release's schema changes are additive, so it should hit no destructive-change prompt — if it does, stop and look before confirming), restarts `ehm-api`/`ehm-ui` via `pm2`, and installs `pm2-logrotate`.

### 4. Bring existing accounts up to date

Updating EHM itself does **not** touch existing accounts' containers or apps — that's a separate, per-account step covered in full in **`docs/UPGRADE_GUIDE.md` in the `ehm-api` repo**. In short:

- `GET /ecp/system/check-for-update` lists accounts whose container image is behind the current tag.
- `POST /ecp/system/update` reimages an account's container onto the current OpenLiteSpeed/lsphp stack, and (as of this release) automatically regenerates every app's vhost from its own stored domain/docroot/PHP version as part of that reimage — check the response's `vhostRegen` array, since regeneration is best-effort per app.
- `GET /ecp/system/php-compatibility-report` proactively lists every account with a vhost-served app whose `php_version` isn't in the current image's supported set (**8.1/8.3/8.4** — 7.4 is gone). Treat remapping an old PHP 7.4 app to 8.1+ as a real compatibility check, not just a version bump.
- One-time SQL for any account whose `App.deploy_type` is still the old `php-nginx` string: `UPDATE App SET deploy_type = 'php' WHERE deploy_type = 'php-nginx';` — most accounts already got this from earlier 1.1.x update scripts, this only catches ones imported/created outside that path.

The full guide also covers cross-install migration (export-import) gaps if you're moving an account to a different EHM install rather than upgrading in place.

### 5. Backfill storage.bd tenants for existing accounts (optional)

Requires storage.bd already configured ([Storage.bd Backup Setup](./storage-bd-setup)) — if you haven't
set up storage.bd at all, do that first. New accounts get a storage.bd backup tenant automatically;
existing accounts don't, until you run:

```bash
cd ehm-api
npx ts-node -r tsconfig-paths/register scripts/backfill-storage-bd-tenants.ts --storage-gb=5 --dry-run
npx ts-node -r tsconfig-paths/register scripts/backfill-storage-bd-tenants.ts --storage-gb=5
```

Until this runs, an existing account simply has no backup coverage — it isn't broken, just unprotected. See `docs/BACKUP.md` in `ehm-api`.

## What to expect afterward

- **Postgres/MSSQL/MongoDB report as "not configured"** until you've completed [Before you start](#before-you-start) for each one you use — this is expected, not a bug, if you skipped exporting a credential.
- **Existing accounts keep running on their old container image** until you reimage them (Step 4) — nothing forces this automatically, so plan a maintenance window per account rather than expecting it to happen on its own.
- **Any account still on PHP 7.4 will fail vhost regeneration** on reimage until you remap it to a supported version — `GET /ecp/system/php-compatibility-report` tells you which accounts these are ahead of time.
- **`POST /account/export` now 404s** if anything external was still calling it — switch to the export-import module.

## Questions this guide doesn't answer

- Full per-account upgrade path (container reimage, PHP compatibility, cross-install export/import gaps): `docs/UPGRADE_GUIDE.md` in `ehm-api`.
- DB engine topology, per-account jailing/quotas: `docs/DB_TOPOLOGY.md` in `ehm-api`.
- Nginx/OpenLiteSpeed architecture and on-demand conf generation: `docs/NGINX.md` in `ehm-api`.
- Per-account backup via storage.bd: `docs/BACKUP.md` in `ehm-api`, or [Storage.bd Backup Setup](./storage-bd-setup) for initial configuration.
- Disk cleanup subsystem: `docs/CLEANUP_POLICY.md` in `ehm-api`.
- Setting up Git provider OAuth apps: [Git Integrations Setup](./git-integrations-setup), or `docs/GIT_INTEGRATIONS.md` in `ehm-api` for the underlying design.
