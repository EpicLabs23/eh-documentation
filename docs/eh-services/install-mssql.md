---
sidebar_position: 10
---

# Install MSSQL

Optional — only needed if you want to offer MSSQL databases to ECP accounts. Per-account database/login provisioning and count/size quota enforcement are available via the `ecp-mssql` API (see `ehm-api`'s `docs/RESOURCE_MONITORING.md`); there's no ecp-ui panel for it yet, only the API.

```bash
cd /epiclabs23/eh/eh-services/mssql
```

## Create .env file and set the SA password

MSSQL enforces a password complexity policy (at least 8 characters, from at least three of: uppercase, lowercase, digit, symbol) — `docker compose up` will fail at startup if it's too weak.

```bash
cp .env.sample .env
```

```bash
sed -i "s/^MSSQL_SA_PASSWORD=.*/MSSQL_SA_PASSWORD=$(openssl rand -base64 16)Aa1!/" .env
```

## Existing installs upgrading from an EHM-managed container

Older EHM versions created and started this container themselves (via the "MSSQL Settings" page in EHM's UI). If you already have an `mssql` container running that way, stop and remove it first — your data is preserved in the named Docker volume `mssql-data`, which isn't deleted along with the container:

```bash
docker stop mssql && docker rm mssql
```

Set `MSSQL_SA_PASSWORD` in `.env` here to match whatever you originally set for that container (not a freshly generated one), or the new container won't be able to authenticate against the existing data volume.

## Run the container

```bash
docker compose up -d
```

## Running MSSQL on a separate instance from EHM

Everything above assumes MSSQL runs on the same host as EHM, using the `eh_network` Docker
bridge — that's a host-local network, so if MSSQL runs on a different machine (same LAN;
cross-DC/region isn't supported), EHM has no route into it. `MSSQL_IP=172.1.0.10` (the bridge
address) will not be reachable in that case. Instead:

1. On the MSSQL host, set `MSSQL_BIND_ADDRESS` in `.env` here to that host's real LAN IP (or
   `0.0.0.0`), not the default `127.0.0.1`.
2. Firewall `MSSQL_PORT` on that host to only accept connections from the EHM host's IP.
3. In `ehm-api/.env`, set `MSSQL_IP` to that host's real LAN IP — not `172.1.0.10`.

Database/login provisioning and quota still work fine over this LAN connection (they're plain
T-SQL over the wire protocol). One-click backup/restore does not — see "One-click backup/restore"
below — leave `MSSQL_BACKUP_HOST_DIR` unset in this topology.

## One-click backup/restore (same host as EHM only)

Account databases can be backed up to storage.bd via `POST /ecp-mssql/backup-to-storage-bd` /
`restore-from-storage-bd`, using T-SQL's own `BACKUP DATABASE`/`RESTORE DATABASE` under the hood —
which always write/read **server-side**, inside this container. `docker-compose.yml` here already
bind-mounts a `./backup` directory into the container at `/var/opt/mssql/backup` for exactly this,
so EHM (running on the same host) can read the backup file straight off disk instead of needing a
network file-transfer step. This means **MSSQL backup/restore only works when MSSQL runs on the
same host as EHM** — unlike Postgres/MySQL/MongoDB's backup (which stream over the wire protocol
and don't care about topology), there's no equivalent for a separate-instance MSSQL install today.

Nothing to create manually — `./backup` is created automatically as part of the bind mount the
first time `docker compose up` runs here.

## Wire the config into EHM API

`eh-manager install-ehm`/`update-ehm` does not carry these values into EHM API's `.env` for you — set them manually, once:

```bash
# ehm-api/.env
MSSQL_ENABLED=true
MSSQL_IP=172.1.0.10   # or the MSSQL host's LAN IP - see above
MSSQL_PORT=1433
MSSQL_SA_PASSWORD=<same value as mssql/.env>
# Same-host installs only (see "One-click backup/restore" above) - the host
# path to this directory's own ./backup, e.g.:
MSSQL_BACKUP_HOST_DIR=/epiclabs23/eh/eh-services/mssql/backup
```

Then restart EHM API:

```bash
pm2 restart ehm-api   # production, or:
# Ctrl-C and re-run `npm run start:dev` in a dev environment
```

If you don't want to offer MSSQL at all, skip this whole page and set `MSSQL_ENABLED=false` in `ehm-api/.env` instead — EHM and ECP will both report it as unavailable rather than trying to reach it.
