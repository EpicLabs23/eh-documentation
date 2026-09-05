---
sidebar_position: 11
---

# Install MongoDB

Optional — only needed if you want to offer MongoDB databases to ECP accounts.

```bash
cd /epiclabs23/eh/eh-services/mongodb
```

## Create .env file and set the root password

```bash
cp .env.sample .env
```

```bash
sed -i "s/^MONGO_ROOT_PASSWORD=.*/MONGO_ROOT_PASSWORD=$(openssl rand -hex 16)/" .env
```

## Existing installs upgrading from an EHM-managed container

Older EHM versions created and started this container themselves (via the "MongoDB Settings" page in EHM's UI), and older `ecp-mongodb.service.ts` versions had the root credentials hardcoded (`admin`/`adminpassword`) rather than reading them from config. If you already have a `mongodb` container running that way, stop and remove it first — your data is preserved in the named Docker volume `mongo-data`, which isn't deleted along with the container:

```bash
docker stop mongodb && docker rm mongodb
```

Set `MONGO_ROOT_USER`/`MONGO_ROOT_PASSWORD` in `.env` here to match whatever your existing container was actually running with — `admin`/`adminpassword` if you never customized it, otherwise the value you set when creating it — or the new container won't be able to authenticate against the existing data volume.

## Run the container

```bash
docker compose up -d
```

## Running MongoDB on a separate instance from EHM

Everything above assumes MongoDB runs on the same host as EHM, using the `eh_network` Docker
bridge — that's a host-local network, so if MongoDB runs on a different machine (same LAN;
cross-DC/region isn't supported), EHM has no route into it. `MONGO_HOST=172.1.0.7` (the bridge
address) will not be reachable in that case. Instead:

1. On the MongoDB host, set `MONGO_BIND_ADDRESS` in `.env` here to that host's real LAN IP (or
   `0.0.0.0`), not the default `127.0.0.1`.
2. Firewall `MONGO_PORT` on that host to only accept connections from the EHM host's IP.
3. In `ehm-api/.env`, set `MONGO_HOST` to that host's real LAN IP — not `172.1.0.7`.

## Wire the config into EHM API

`eh-manager install-ehm`/`update-ehm` does not carry these values into EHM API's `.env` for you — set them manually, once:

```bash
# ehm-api/.env
MONGO_ENABLED=true
MONGO_HOST=172.1.0.7   # or the MongoDB host's LAN IP - see above
MONGO_PORT=27017
MONGO_ROOT_USER=<same value as mongodb/.env>
MONGO_ROOT_PASSWORD=<same value as mongodb/.env>
```

Then restart EHM API:

```bash
pm2 restart ehm-api   # production, or:
# Ctrl-C and re-run `npm run start:dev` in a dev environment
```

If you don't want to offer MongoDB at all, skip this whole page and set `MONGO_ENABLED=false` in `ehm-api/.env` instead — EHM and ECP will both report it as unavailable rather than trying to reach it.
