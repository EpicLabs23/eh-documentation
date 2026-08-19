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

### Corrupted file causing crash-loop / repeated errors (delete just that file)

Symptom: the container crash-loops, or writes/queries keep failing, and `docker logs influxdb` names one specific file it can't read — usually a WAL segment (`wal/<number>.wal`) left half-written by an unclean container kill or host crash, occasionally a persisted file under `dbs/`. Try this before wiping `./data` entirely: the admin token and catalog live outside these files, so deleting just the bad one doesn't touch auth or your other measurements.

1. Find the offending file from the logs:

   ```bash
   docker logs influxdb --tail 200 | grep -iE "error|corrupt|invalid|failed to (read|parse|replay)"
   ```

   The error names a path relative to the data dir, e.g. `wal/00000003652.wal`.

2. Stop the container so nothing else touches the directory while you edit it:

   ```bash
   docker compose down
   ```

3. Delete only that file (use the exact path the log named):

   ```bash
   sudo rm "data/ehm-influxdb/<path-from-log>"
   ```

4. Restart and confirm it comes up clean:

   ```bash
   docker compose up -d
   docker logs influxdb --tail 50
   ```

This only loses the handful of writes that were in the deleted segment — the admin token, the `ecp_metrics` database, and every other WAL/parquet file are untouched. If removing one file just uncovers the next corrupted one, repeat steps 1–4 file by file. If you're deleting more than two or three files, or the error points into `catalog/` itself rather than `wal/` or `dbs/`, stop — catalog-level corruption isn't safely fixable file-by-file — and fall back to the full reset below instead.

### Data corrupted / start fresh

If the targeted fix above isn't enough — `catalog/` itself is corrupted, or you're chasing an endless string of individual bad files — wipe `./data` and start clean:

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
