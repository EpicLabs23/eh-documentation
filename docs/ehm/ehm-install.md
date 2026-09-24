---
sidebar_position: 6
---

# Install EHM

### Pre-requisite

1. [System Setup](./system-setup)
2. [Nginx Installation](./nginx-installation)
3. [Docker Installation](./docker-installation)
4. [EH Services Installation](../eh-services/intro)
5. [MariaDB Installation](../eh-services/install-mariadb)
6. [PhpMyAdmin Installation](../eh-services/install-phpmyadmin)
7. [InfluxDB Installation](../eh-services/install-influxdb) (optional, for historical metrics)
8. [PostgreSQL Installation](../eh-services/install-postgresql) (optional, to offer Postgres databases to ECP accounts)
9. [MSSQL Installation](../eh-services/install-mssql) (optional, to offer MSSQL databases to ECP accounts)
10. [MongoDB Installation](../eh-services/install-mongodb) (optional, to offer MongoDB databases to ECP accounts)
11. [EH Manager Installation](../eh-manager/eh-manager-instalation)
12. A domain / subdomain

:::warning
Please ask for the installation details to EpicLabs23
:::

### Interactive Installation

```bash
sudo su
eh-manager install-ehm
```

This also prompts **"Enable InfluxDB metrics history?"**. Answer yes only if you completed the optional [InfluxDB Installation](../eh-services/install-influxdb) step above — it creates the InfluxDB admin token and writes it into EHM API's `.env` for you. Answer no (the default) to skip it; EHM runs fine without InfluxDB.

### Non-interactive Installation

```bash
sudo su
eh-manager install-ehm -v 0.0.1 --dbpass drootp --apiurl http://localhost:2326 --os 24.04 --influx false
```

Pass `--influx true` instead if InfluxDB is installed and running.

`--apiurl` is just a bootstrap value at this point — the domain and HTTPS reverse proxy don't exist yet.
Once you've completed [Enable HTTPS for EHM](./enable-https), come back and set `EHM_API_PUBLIC_URL` in
`ehm-api`'s `.env` to the real public URL (`https://<your-ehm-domain>/api`, **with** the `/api` prefix —
not a bare domain or the dev `:2326` port), then `pm2 restart ehm-api`. This value is embedded in account
JWTs and used for the Git Integrations OAuth callback, so ECP calls back to the wrong place until it's
corrected.

### Create first Admin user

```bash
node /epiclabs23/eh/ehm/<version>/ehm-api/prisma/create-admin.mjs
```

Example:

```bash
node /epiclabs23/eh/ehm/0.0.2/ehm-api/prisma/create-admin.mjs
```

### Access EHM UI

`http://<domain>:2325`

This is a plain HTTP address, reachable directly on the port EHM listens on. See [Enable HTTPS for EHM](./enable-https) to front it with a domain and a Let's Encrypt certificate before using it in production.

### Configure EHM

In EHM UI:

1. `System > Config > General Settings` update `Public IP`.
2. `System > Config > DNS Settings` update `Public IP`.

### Load Docker Images

EHM ships with no built-in docker image list. Go to `System > Config > Docker Images` and click **Load Image List** — this is required before any account/package can be created.

It fetches from `DOCKER_IMAGES_REMOTE_URL` (set in ehm-api's `.env`) on the server. If it fails, this is usually a transient network issue reaching GitHub, not a bug — on the server, run `curl <DOCKER_IMAGES_REMOTE_URL>` (see the value in ehm-api's `.env`) to confirm it's reachable, then retry from the UI.

### Create packages

Go to `Packges > Create Package`

### DNS Setup

1. Go to `System > Config > DNS Settings` and update the `Public IP`

### Configure Storage.bd Backups (optional, recommended)

Without this, neither EHM's own host backup nor per-account backup works. See
[Storage.bd Backup Setup](./storage-bd-setup).

### Configure Git Integrations (optional)

Only needed if ECP accounts should be able to import apps from GitHub/GitLab/Bitbucket via OAuth instead
of a manual clone URL. See [Git Integrations Setup](./git-integrations-setup).
