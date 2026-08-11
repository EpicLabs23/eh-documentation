---
sidebar_position: 7
---

# Install InfluxDB

:::info
Optional. InfluxDB stores container CPU/memory/network time series metrics. EHM works without it — skip this if you don't need historical metrics graphs.
:::

```bash
cd /epiclabs23/eh/eh-services/influxdb
```

## Fix bind-mount ownership

The image runs as a non-root user (`influxdb3`, uid `1500`), but Docker creates bind-mounted host directories as `root` on first run. Without this, the container crash-loops with `PermissionDenied` trying to write its catalog:

```bash
sudo mkdir -p data plugins
sudo chown -R 1500:1500 data plugins
```

## Run the container

```bash
docker compose up -d
```

Confirm it's actually up, not crash-looping:

```bash
docker ps --filter "name=influxdb" --format "table {{.Names}}\t{{.Status}}"
```

The container must be named `influxdb` — [EHM installation](../ehm/ehm-install) execs into it by that name to create the admin token when you answer yes to the InfluxDB prompt (or pass `--influx true`). Leave the token/database creation to that step; there's nothing else to configure here.

## Resetting

InfluxDB 3 stores exactly one admin token, named `_admin`, and its hash lives inside the same on-disk catalog as your metrics data (`./data`). That has two consequences worth knowing before you touch either one:

- **You cannot list, delete, or create a new `_admin` token without already holding a valid token** — `show tokens` and `delete token` both fail with `401 Unauthorized` if you don't pass one.
- **`influxdb3 create token --admin` does NOT refuse to run if `_admin` already exists** — it silently regenerates it and invalidates the old one everywhere it's in use. Never run it "just to check" or as a health probe; only run it when you deliberately intend to rotate the token.

### Lost or invalid admin token

Symptom: EHM API logs `401 Unauthorized` from InfluxDB on metrics writes/queries (`docker-metrics.service.ts`), or you simply no longer have the token that's supposed to be in `ehm-api/.env`.

Because you can't auth to delete the old token if you've lost it, and `create token --admin` regenerates in place rather than blocking, recovery is a single step:

```bash
docker exec influxdb influxdb3 create token --admin
```

This prints a new token and immediately invalidates the previous one — any other consumer still holding the old token starts failing the instant you run this. Copy the printed token into `INFLUXDB_TOKEN` in EHM API's `.env`:

```bash
# ehm-api/.env
INFLUXDB_TOKEN="<new token>"
```

Then restart the EHM API process so it picks up the new value (the InfluxDB client is constructed once at startup from `process.env`, so a live-reload/watch restart of the process is required — editing `.env` alone isn't enough):

```bash
pm2 restart ehm-api   # production, or:
# Ctrl-C and re-run `npm run start:dev` in a dev environment
```

If EHM was installed via `eh-manager`, the updater reads `INFLUXDB_TOKEN` out of the current `.env` and carries it forward automatically — there's no flag for it. It only generates a fresh token when that value is blank, so this manual fix (or blanking `INFLUXDB_TOKEN` in `.env` before running an update) is the way to force a rotation through `eh-manager` — see [EHM installation](../ehm/ehm-install).

### Data corrupted / start fresh

If `./data` is corrupted (container crash-loops, queries error out beyond just auth) and you want to wipe it and start clean:

```bash
docker compose down
sudo rm -rf data/* plugins/*
sudo chown -R 1500:1500 data plugins
docker compose up -d
```

Wiping `./data` destroys the catalog, which means the `_admin` token and the `ecp_metrics` database go with it — this is equivalent to a first-time install. Recreate the admin token and update `ehm-api/.env` exactly as in the [lost token](#lost-or-invalid-admin-token) steps above; the database itself (`INFLUXDB_DATABASE=ecp_metrics`) is created automatically on first write, no separate step needed.

### Deleting just the metrics database (keep the token)

To clear historical metrics without touching auth:

```bash
docker exec influxdb influxdb3 delete database ecp_metrics --token "<current admin token>" --yes
```

EHM API recreates it automatically on its next write — no restart needed.
