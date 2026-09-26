---
sidebar_position: 9.5
---

# Install pgAdmin

Optional — only needed if you want to give ECP accounts a one-click SSO login into pgAdmin for
their own PostgreSQL databases. Requires PostgreSQL (the previous page) to already be installed
and reachable. See `ehm-api/docs/PGADMIN.md` for the full design (this is SSO-login-only today —
accounts still add their own server connection by hand the first time).

```bash
cd /epiclabs23/eh/eh-services/pgadmin
```

## Create .env file and generate its secrets

```bash
cp .env.sample .env
```

```bash
sed -i "s/^PGADMIN_DEFAULT_PASSWORD=.*/PGADMIN_DEFAULT_PASSWORD=$(openssl rand -hex 16)/" .env
sed -i "s/^PGADMIN_SHARED_SECRET=.*/PGADMIN_SHARED_SECRET=$(openssl rand -hex 32)/" .env
```

`PGADMIN_DEFAULT_PASSWORD` is only pgAdmin's own bootstrap superuser login (for a staff member
opening the container directly, e.g. to check User Management) — no ECP account ever uses it, they
all arrive pre-authenticated. `PGADMIN_SHARED_SECRET` is the value pgAdmin checks to make sure the
identity header it receives really came from this stack's own nginx sidecar and not a client that
reached it directly — see `ehm-api/docs/PGADMIN.md`'s trust-boundary section.

## Run the containers

```bash
docker compose up -d
```

This starts two containers: `pgadmin` itself (no published port — only reachable from the sidecar
below) and `pgadmin-nginx`, published on `2331` — the only externally reachable port in this stack.
If `2331` is already in use on your host, change the published port in `docker-compose.yml`
(`ports: - '2331:80'` under `pgadmin-nginx`).

## Verify the identity header format

`docker-compose.yml` pins `dpage/pgadmin4:9.16` and `PGADMIN_CONFIG_WEBSERVER_REMOTE_USER` is
already confirmed working against that exact version. After bringing the stack up, click the
"PgAdmin" link from an ECP account and confirm it lands you inside pgAdmin already signed in, with
no login prompt. If it instead falls through to pgAdmin's own login page, switch
`PGADMIN_CONFIG_WEBSERVER_REMOTE_USER` in `docker-compose.yml` between `'HTTP_X_EHM_PGADMIN_USER'`
and `'X-Ehm-Pgadmin-User'` and re-run `docker compose up -d`.

## Bumping the pgAdmin version

`patches/databases-nodes.sql` and `patches/roles-nodes.sql` overwrite two of pgAdmin's own internal
SQL template files (see `ehm-api/docs/PGADMIN.md`'s "Cross-tenant tree filtering" section) so the
Databases/Login-Group-Roles tree doesn't list every other account's database/role by default.
They're tied byte-for-byte to pgAdmin `9.16`'s exact file paths/content — before changing the
pinned image tag, diff both files against the new version's stock templates
(`docker exec ehm-pgadmin cat <path>`, paths are the mount targets in `docker-compose.yml`) and
update the patches to match, or the mount will either fail to apply cleanly or silently stop
matching what the surrounding Python code expects.

If you don't want to offer pgAdmin at all, skip this whole page — nothing else depends on it.
Note that ECP's "PgAdmin" link is gated on **Postgres** being enabled/configured/reachable, not on
whether this stack is installed — if Postgres is on but you never install pgAdmin, the link will
still show in ECP and fail when clicked. There's no separate "is pgAdmin installed" check today.
