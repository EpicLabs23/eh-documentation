---
sidebar_position: 10
---

# Install MSSQL

Optional — only needed if you want to offer MSSQL databases to ECP accounts. There is no per-account provisioning UI for MSSQL yet; this only makes the engine reachable and reported as available.

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

## Wire the config into EHM API

`eh-manager install-ehm`/`update-ehm` does not carry this value into EHM API's `.env` for you — set it manually, once:

```bash
# ehm-api/.env
MSSQL_ENABLED=true
MSSQL_IP=172.1.0.10   # or the MSSQL host's LAN IP - see above
MSSQL_PORT=1433
MSSQL_SA_PASSWORD=<same value as mssql/.env>
```

Then restart EHM API:

```bash
pm2 restart ehm-api   # production, or:
# Ctrl-C and re-run `npm run start:dev` in a dev environment
```

If you don't want to offer MSSQL at all, skip this whole page and set `MSSQL_ENABLED=false` in `ehm-api/.env` instead — EHM and ECP will both report it as unavailable rather than trying to reach it.
