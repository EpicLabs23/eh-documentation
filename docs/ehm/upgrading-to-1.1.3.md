---
sidebar_position: 7.5
---

# Upgrading from 1.1.2 to 1.1.3

:::danger
This release includes a breaking database schema change (existing admins are locked out unless a data migration runs) and a breaking Redis change (login/refresh tokens/rate limiting fail without it). Read this guide before running `eh-manager update-ehm` — the update script now handles the schema migration automatically, but the Redis password and the `eh-services` container updates still need action from you.
:::

## What's in this release

Everything below landed between the `1.1.2` release cut and now. It's a large batch — a full authorization rewrite plus a dedicated security-hardening pass — not the usual incremental update:

- **Authorization rewritten from roles to fine-grained permissions.** `User.role` ("admin"/"user") is gone, replaced by `User.is_admin` (boolean) plus a permission-catalog system (`@RequirePermissions(...)`). Every route now requires an explicit permission — a route with none is unreachable, where previously it was reachable by any authenticated caller.
- **New `/integration/*` API** for external billing/provisioning systems (WHMCS-style): OAuth 2.0 Client Credentials, `IntegrationClient` management via `/auth/clients`, full audit log. Replaces the old irrevocable, ~100-year `access_token`/`integration_token` columns, which are removed entirely.
- **A dedicated security pass** found and fixed several **confirmed, live-exploitable** issues, not just hardening:
  - Command injection reachable by any hosting account (no admin needed) in several `ecp/*` modules (`oneclick`, `ecp-cli`, `ecp-nginx`, `ssl`, `php`, DNS host-file editing) — all fixed by moving off raw shell strings to argv-array `spawn` calls, plus input validation.
  - SQL injection reachable by any hosting account in the MySQL database/user management endpoints — fixed via identifier allowlisting and parameterized queries.
  - `eh-services` (Redis, InfluxDB, phpMyAdmin) were reachable from the public internet with no authentication.
  - `CryptoService` (account secrets: MySQL passwords, git tokens) migrated from unauthenticated AES-256-CBC to authenticated AES-256-GCM.
  - `eh-config` secrets (Bind9 password, Cloudflare token, Postgres superuser password) are now encrypted at rest instead of plaintext.
  - Rate limiting added to auth endpoints and to every generated Nginx server block.
  - `ecp-go`: per-account JWT/container binding fixed (a valid JWT for one account no longer works against another account's container), GitHub webhook signature verification no longer fails open, `CreateFromGit` shell injection fixed.
  - Container-to-container network isolation (`DOCKER-USER` iptables rule) — new requirement for existing servers, see step 6 below.

Full details of every fix: `docs/SECURITY_CHECKLIST.md` in the `ehm-api` repo.

## Before you start

1. **Back up your database.** The update tooling has no automated backup step — it never has. Take a `mysqldump` of the `ehm` database before proceeding.
2. **Note your current admin users**, so you can sanity-check after the migration:
   ```sql
   SELECT username, email FROM User WHERE role = 'admin';
   ```
3. **Make sure you can reach a terminal with both `eh-services` and `ehm-api`/`eh-manager` access** — this update touches both.

## Step-by-step

### 1. Update `eh-services` first

```bash
cd /epiclabs23/eh/eh-services
git pull
```

**Redis** now requires a password (it previously ran with none, reachable from the public internet):

```bash
cd redis
cp .env.sample .env
sed -i "s/^REDIS_PASSWORD=.*/REDIS_PASSWORD=$(openssl rand -hex 32)/" .env
docker compose up -d
cat .env   # copy this value — you'll need it in step 2
```

**InfluxDB** and **phpMyAdmin** just need a restart to pick up their new configs (localhost-only binding for InfluxDB; the arbitrary-server login form removed from phpMyAdmin — no values to set):

```bash
cd ../influxdb && docker compose up -d
cd ../phpmyadmin && docker compose up -d
```

**Bind9 DNS**, only if you run it — restart to restrict its management API to localhost (DNS itself, port 53, stays public):

```bash
cd ../dns && docker compose up -d
```
If you run Bind9, confirm `bind9_api_base_url` in EHM's admin panel (**Config → General Settings → DNS Settings**) points at `localhost:8053`, not a container/public IP — the update doesn't change this value, but it's worth checking since the port is now restricted to localhost.

### 2. Export `REDIS_PASSWORD` before running the updater

The updater script writes your `ehm-api/.env` from scratch — it needs the same Redis password you just set, or it'll leave Redis unconfigured and every login will start failing.

```bash
export REDIS_PASSWORD="<the value from redis/.env in step 1>"
```

Keep this exported in the same shell session you run `eh-manager update-ehm` from next.

### 3. Run the updater

```bash
sudo su
eh-manager update-ehm
```

or non-interactively:

```bash
sudo su
eh-manager update-ehm -v 1.1.3 --dbpass <your-mysql-root-password> --apiurl http://localhost:2326 --os 24.04 --influx false
```

This version's update script (`1.1.3_update.sh`) now does the critical data migration automatically, **before** it touches the schema:

```sql
ALTER TABLE User ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;
UPDATE User SET is_admin = true WHERE role = 'admin';
ALTER TABLE User DROP COLUMN IF EXISTS role;
ALTER TABLE User DROP COLUMN IF EXISTS access_token;
ALTER TABLE User DROP COLUMN IF EXISTS integration_token;
ALTER TABLE Account DROP COLUMN IF EXISTS access_token;
```

Then it runs `prisma db push` (schema sync — should hit no destructive changes at this point, since the risky columns are already handled above; if it still prompts for confirmation, something unexpected changed — stop and look before confirming), regenerates the JWT signing keypair, and restarts `ehm-api`/`ehm-ui` via `pm2`.

If you didn't export `REDIS_PASSWORD` in step 2, the script prints a loud warning and continues — you can still fix it after the fact (step 4 covers this).

### 4. Verify

```bash
# Confirm your admins survived the migration
mysql -h 172.1.0.6 -u root -p ehm -e "SELECT username, is_admin FROM User;"

# Confirm Redis auth actually worked - log in via the UI, or:
curl -i -X POST http://localhost:2326/auth/login -H "Content-Type: application/json" \
  -d '{"username":"<your admin username>","password":"<your password>"}'
# A working login returns a Set-Cookie: refresh_token=... header and a 200.
# A 500 here almost always means REDIS_PASSWORD is missing/mismatched.
```

If `REDIS_PASSWORD` didn't make it into `ehm-api/.env` (you forgot step 2, or it was blank):

```bash
vim /epiclabs23/eh/ehm/1.1.3/ehm-api/.env   # set REDIS_PASSWORD= to match eh-services/redis/.env
pm2 restart ehm-api
```

### 5. If you use the `/integration/*` API today

There's no "today" to migrate from — this API is new in this release. Skip this step unless a billing/provisioning system integration is planned; see `docs/INTEGRATIONS.md` in `ehm-api` to set one up (`POST /auth/clients` to create a client, then the client authenticates via `POST /auth/token`).

**If anything external was using the old long-lived `access_token`/`integration_token` bearer credentials** (the "API Cred." feature that used to be on the Users screen), it stops working — those columns are dropped, not just deprecated. There is no automatic migration path for this, because those tokens couldn't be revoked or scoped in the first place; issue a proper `IntegrationClient` via `/auth/clients` instead and update the external system's credentials.

### 6. Apply the `DOCKER-USER` iptables rule (once per server, if not already applied)

New this release: account containers on `eh_network` are no longer allowed to reach each other directly (previously a compromised container could reach every sibling account's container). This needs a one-time host firewall rule — full commands and verification steps are in [Install in a fresh server](./ehm-install), step 9. Existing servers need this applied by hand; it isn't part of `eh-manager update-ehm`.

## What to expect afterward

- **Non-admin staff users lose access to some screens they may have previously been able to reach**: Docker management, DNS zone admin, Nginx port-mapping, system info, `eh-config`, export/import are now Admin-only. This closes a real bug (they were reachable by any authenticated staff member purely because the old permission check failed open, not by design). If a non-admin staff member legitimately needs one of these, an admin can grant it directly on their user (permission list), or promote them to admin.
- **Existing Nginx configs don't get rate limiting until they're regenerated.** New server blocks (new accounts, or any action that re-renders an existing one — SSL changes, port-map updates) get the new `limit_req`/`limit_conn` protection automatically; untouched configs keep working exactly as before, just without it, until next regenerated.
- **Refresh tokens issued before the update still work** (they're opaque Redis-stored strings, unaffected by the schema change) — but if Redis was reachable from the internet before this update, consider it compromised and flush it: `redis-cli -a <password> FLUSHALL` forces everyone to log in again.

## Questions this guide doesn't answer

- Full per-endpoint permission list: `permission-catalog.ts` in `ehm-api` (`ALL_PERMISSIONS` / `ROLE_DEFAULT_PERMISSIONS`).
- Full list of every fix in the security pass, with severity and verification notes: `docs/SECURITY_CHECKLIST.md` in `ehm-api`.
- Setting up the new Integration API: `docs/INTEGRATIONS.md` in `ehm-api`.
