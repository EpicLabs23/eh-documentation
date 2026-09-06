---
sidebar_position: 9
---

# Install PostgreSQL

Optional — only needed if you want to offer PostgreSQL databases to ECP accounts.

```bash
cd /epiclabs23/eh/eh-services/postgresql
```

## Create .env file and set the superuser password

```bash
cp .env.sample .env
```

```bash
sed -i "s/^POSTGRES_SUPER_USER_PASSWORD=.*/POSTGRES_SUPER_USER_PASSWORD=$(openssl rand -hex 16)/" .env
```

## Existing installs upgrading from an EHM-managed container

Older EHM versions created and started this container themselves (via the "Postgresql Settings" page in EHM's UI), storing data at a fixed host path (`/epiclabs23/eh/postgres_data`). This compose file instead stores data in a named Docker volume (`postgres-data`), so a fresh `docker compose up -d` here starts with an empty database — it does not pick up that old host path. If you have existing databases there worth keeping, migrate them manually (e.g. `pg_dumpall`/`pg_restore`, or copy the old container's data directory into the new volume) before removing the old container:

```bash
docker stop postgresql && docker rm postgresql
```

Set `POSTGRES_SUPER_USER`/`POSTGRES_SUPER_USER_PASSWORD` in `.env` here to match whatever you originally set for that container (not a freshly generated one), or the new container won't be able to authenticate against migrated data.

## Run the container

```bash
docker compose up -d
```

## Running Postgres on a separate instance from EHM

Everything above assumes Postgres runs on the same host as EHM, using the `eh_network` Docker
bridge — that's a host-local network, so if Postgres runs on a different machine (same LAN;
cross-DC/region isn't supported), EHM has no route into it. `POSTGRES_IP=172.1.0.8` (the bridge
address) will not be reachable in that case. Instead:

1. On the Postgres host, set `POSTGRES_BIND_ADDRESS` in `.env` here to that host's real LAN IP
   (or `0.0.0.0`), not the default `127.0.0.1`.
2. Firewall `POSTGRES_PORT` on that host to only accept connections from the EHM host's IP.
3. In `ehm-api/.env`, set `POSTGRES_IP` to that host's real LAN IP — not `172.1.0.8`.

## Wire the config into EHM API

`eh-manager install-ehm`/`update-ehm` does not carry these values into EHM API's `.env` for you — set them manually, once:

```bash
# ehm-api/.env
POSTGRES_ENABLED=true
POSTGRES_IP=172.1.0.8   # or the Postgres host's LAN IP - see above
POSTGRES_PORT=5432
POSTGRES_SUPER_USER=<same value as postgresql/.env>
POSTGRES_SUPER_USER_PASSWORD=<same value as postgresql/.env>
```

Then restart EHM API:

```bash
pm2 restart ehm-api   # production, or:
# Ctrl-C and re-run `npm run start:dev` in a dev environment
```

If you don't want to offer PostgreSQL at all, skip this whole page and set `POSTGRES_ENABLED=false` in `ehm-api/.env` instead — EHM and ECP will both report it as unavailable rather than trying to reach it.
