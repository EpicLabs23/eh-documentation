---
sidebar_position: 2
---

# Install MariaDB

```bash
cd /epiclabs23/eh/eh-services/mariadb
```

## Create .env file and change password in .env

```bash
cp .env.sample .env
```

## Run the container

```bash
docker compose up -d
```

## Running MariaDB on a separate instance from EHM

Everything above assumes MariaDB runs on the same host as EHM, using the `eh_network` Docker
bridge — that's a host-local network, so if MariaDB runs on a different machine (same LAN;
cross-DC/region isn't supported), EHM has no route into it. `MYSQL_HOST=172.1.0.6` (the bridge
address, in `ehm-api/.env`) will not be reachable in that case. Instead:

1. On the MariaDB host, set `MARIADB_BIND_ADDRESS` in `.env` here to that host's real LAN IP (or
   `0.0.0.0`), not the default `127.0.0.1`.
2. Firewall `MARIADB_PORT` on that host to only accept connections from the EHM host's IP.
3. In `ehm-api/.env`, set `MYSQL_HOST` to that host's real LAN IP — not `172.1.0.6`.

Since EHM's own database (`EHM_DATABASE_URL`) lives here too, EHM won't start at all until this is
wired up correctly — there's no graceful degradation for MariaDB the way there is for the optional
Postgres/MSSQL/MongoDB engines (see `ehm-api/docs/DB_TOPOLOGY.md`).
