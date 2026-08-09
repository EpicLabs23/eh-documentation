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
8. [EH Manager Installation](../eh-manager/eh-manager-instalation)
9. A domain / subdomain

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

### Create packages

Go to `Packges > Create Package`

### DNS Setup

1. Go to `System > Config > DNS Settings` and update the `Public IP`
