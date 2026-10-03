---
sidebar_position: 1
---

# Intro

`eh-services` is a public repository of Docker Compose stacks for the services EHM uses. Each service is independent: install only the ones you need.

| Service | Needed? |
| :--- | :--- |
| [MariaDB](./install-mariadb) | Required — EHM's own database and the MySQL engine for accounts |
| [Redis](./install-redis) | Required — sign-in sessions and rate limiting |
| [phpMyAdmin](./install-phpmyadmin) | Recommended — one-click MySQL admin for accounts |
| [InfluxDB](./install-influxdb) | Optional — resource history charts |
| [PostgreSQL](./install-postgresql) and [pgAdmin](./install-pgadmin) | Optional — offer PostgreSQL |
| [MSSQL](./install-mssql) | Optional — offer MSSQL |
| [MongoDB](./install-mongodb) | Optional — offer MongoDB |
| [BIND9 DNS](./install-bind9-dns) | Optional — host DNS zones |

## Pre-requisite

[Install Docker](../ehm/docker-installation.md)

## Download

```bash
git clone https://github.com/EpicLabs23/eh-services.git /epiclabs23/eh/eh-services
```

## Create the Docker network

```bash
docker network create eh_network --subnet=172.1.0.0/16
```

Keeping the services current: [Update](./eh-services-update).
