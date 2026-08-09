---
sidebar_position: 9
---

# EHM Local Development Setup

:::warning
This doc is for developers running EHM locally to work on the `ehm-api` / `ehm-ui` codebase. Skip it if you're installing EHM on a server — see [Install EHM](./ehm-install) instead.
:::

### Pre-requisite

1. [System Setup](./system-setup) (Node.js via nvm)
2. [Docker Installation](./docker-installation)
3. Access to the private `EpicLabs23/ehm-api` and `ehm-ui` repos

Most account-related flows (`useradd`, container creation, etc.) shell out to commands that need root, so run `ehm-api` as root even in dev.

## 1. Backing services

Clone `eh-services` and create the Docker network EHM's services expect, if you haven't already:

```bash
git clone https://github.com/EpicLabs23/eh-services.git /epiclabs23/eh/eh-services
docker network create eh_network --subnet=172.1.0.0/16
```

Start MariaDB and Redis — the two hard requirements to boot `ehm-api`:

```bash
cd /epiclabs23/eh/eh-services/mariadb
cp .env.sample .env
docker compose up -d
```

```bash
cd /epiclabs23/eh/eh-services/redis
sudo sysctl vm.overcommit_memory=1 && echo "vm.overcommit_memory = 1" | sudo tee -a /etc/sysctl.conf
docker compose up -d
```

Everything else is optional — only start it if you're actively working on that feature area:

- [PhpMyAdmin](../eh-services/install-phpmyadmin) — browse the dev database at `http://localhost:2329`
- [InfluxDB](../eh-services/install-influxdb) — container CPU/memory/network metrics history
- [Bind9 DNS](../eh-services/install-bind9-dns) — DNS zone management
- Postgres / MSSQL — these are started on demand from the EHM UI (`System > Config`) once EHM is running, not via `eh-services`; see [Postgres Setup](./postgres-setup)

## 2. Clone and configure ehm-api

```bash
git clone https://<username>:<token>@github.com/EpicLabs23/ehm-api.git /epiclabs23/eh/ehm/ehm-api
cd /epiclabs23/eh/ehm/ehm-api
npm install
cp .env.sample .env
```

The sample already points at the services started above (`MYSQL_HOST=172.1.0.6`, `REDIS_HOST=localhost`) — no edits needed unless you changed a password in step 1.

Generate the RSA keypair EHM uses to sign JWTs (writes to `/ehm/jwt/private.pem` and `/ehm/jwt/public.pem` by default):

```bash
node src/utils/generate-jwt-keys.mjs
```

Push the Prisma schema and seed a test admin user (`alice` / `haveapass` — the same credentials `ehm-ui`'s Playwright config expects):

```bash
npx prisma db push
npx prisma db seed
```

Start the API in watch mode:

```bash
sudo su
npm run start:dev
```

It listens on `EHM_APP_PORT` (`2326` by default).

## 3. Clone and configure ehm-ui

```bash
git clone https://<username>:<token>@github.com/EpicLabs23/ehm-ui.git /epiclabs23/eh/ehm/ehm-ui
cd /epiclabs23/eh/ehm/ehm-ui
npm install
cp .env.sample .env
npm run start
```

It listens on port `2325` and the sample `.env` already points at `http://localhost:2326` for the API.

## 4. Log in

`http://localhost:2325` — `alice` / `haveapass` from the seed step above.

To create a different admin instead of using the seeded one:

```bash
node src/prisma/create-admin.mjs
```

### Feature-specific env vars

Only needed if you're touching the relevant module — see `.env.sample` for the full list:

- `ECP_DIR` — path to a checked-out `ecp-go`/`ecp-ui`, needed by anything that shells out to the ECP CLI
- `EHM_ENCRYPTION_KEY` — 32-byte hex key (`openssl rand -hex 32`), needed by the `account-git` module to encrypt OAuth client secrets
- `INFLUX_METRICS_ENABLED` / `INFLUXDB_*` — needed for container metrics history, see [Install InfluxDB](../eh-services/install-influxdb)
