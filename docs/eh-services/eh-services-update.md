---
sidebar_position: 12
---

# Update

Unlike EHM/ECP, `eh-services` isn't a single versioned product — there's no `eh-manager update-*`
command for it and no version tags on the repo. Each service (MariaDB, Redis, InfluxDB, Bind9,
phpMyAdmin, Postgres, MSSQL, MongoDB) is its own independent `docker-compose` stack under this repo,
and "updating" just means pulling the latest source and re-applying whichever stacks you actually run.

## 1. Pull the latest source

```bash
cd /epiclabs23/eh/eh-services
git pull
```

## 2. Check for new required `.env` keys

Since there's no version-numbered release here, there's no changelog to check against — new required
`.env` keys land as ordinary commits (e.g. `REDIS_PASSWORD` becoming mandatory, or the
`*_BIND_ADDRESS` keys added for running a service on a separate host). Diffing against the sample is
the only reliable way to catch one you're missing:

```bash
diff redis/.env redis/.env.sample          # repeat per service you run
```

Add any new key to your real `.env`, filled with your own value — don't copy the sample's placeholder
as-is for anything secret.

## 3. Re-apply each service you use

Only touch the services you actually run — pulling this repo doesn't affect a service you don't have
running. **Recreating the container is required even for changes that don't touch the image** (e.g. a
compose-level logging limit or port binding) — `docker compose restart` doesn't pick those up, only
`up -d` does, because it re-reads the compose file.

**Services built from this repo's own Dockerfile** (`mariadb`, `dns`) — need a rebuild, not just a pull:

```bash
cd mariadb   # or dns
docker compose up -d --build
```

**Services running a public image** (`redis`, `influxdb`, `phpmyadmin`, `postgresql`, `mssql`, `mongodb`):

```bash
cd redis   # or whichever service
docker compose pull
docker compose up -d
```

Existing data is untouched by this — every service stores its data in a named volume or bind mount
that isn't removed when the container is recreated (see that service's own install page if you're
unsure which).

## 4. Update EHM if a value it reads changed

If you changed a password, host, port, or bind address that `ehm-api/.env` also has its own copy of
(Redis password; Postgres/MSSQL/MongoDB credentials or IP), update it there too:

```bash
pm2 restart ehm-api
```

## Verify

```bash
docker ps                          # confirm the container actually restarted (recent "Up" time)
docker compose logs -f <service>   # if anything looks wrong
```

## Questions this guide doesn't answer

- Moving a service off an old EHM-managed container onto this standalone stack for the first time, or
  running it on a separate host from EHM: that service's own install page (Install PostgreSQL / MSSQL
  / MongoDB / Redis / etc., in this same section).
- What EHM reads from each service and how it decides "configured" vs "reachable": `docs/DB_TOPOLOGY.md`
  in `ehm-api`.
