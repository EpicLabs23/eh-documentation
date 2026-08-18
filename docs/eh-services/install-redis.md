---
sidebar_position: 6
---

# Install Redis

```bash
cd /epiclabs23/eh/eh-services/redis
```

## Enable memory overcommit

```bash
sudo sysctl vm.overcommit_memory=1 && echo "vm.overcommit_memory = 1" | sudo tee -a /etc/sysctl.conf && sysctl vm.overcommit_memory
```

## Create .env file and set a password

The container is bound to `127.0.0.1` only (not reachable from outside this host), but `requirepass` is required regardless — `docker compose up` fails without it.

```bash
cp .env.sample .env
```

```bash
sed -i "s/^REDIS_PASSWORD=.*/REDIS_PASSWORD=$(openssl rand -hex 32)/" .env
```

## Run the container

```bash
docker compose up -d
```

## Wire the password into EHM API

Unlike MariaDB's root password or InfluxDB's token, `eh-manager install-ehm`/`update-ehm` does not carry this value into EHM API's `.env` for you — set it manually, once, whenever you (re)generate it here:

```bash
# ehm-api/.env
REDIS_PASSWORD=<same value as redis/.env>
```

Then restart EHM API so it picks up the new value (the Redis client is constructed once at startup, so editing `.env` alone isn't enough):

```bash
pm2 restart ehm-api   # production, or:
# Ctrl-C and re-run `npm run start:dev` in a dev environment
```

Symptom if you skip this or the values drift out of sync: logins, refresh tokens, and rate limiting all fail with `500 Internal Server Error`, since EHM API can no longer authenticate to Redis.
