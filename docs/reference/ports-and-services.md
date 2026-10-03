---
sidebar_position: 1
---

# Ports and Services

## Ports to open to the internet

| Port | Used by |
| :--- | :--- |
| 80, 443 | Account websites, and the EHM panel once [HTTPS is enabled](../ehm/enable-https.md) |
| 2324 | ECP (each account's control panel), at `https://<account domain>:2324` |
| 2329 | phpMyAdmin (one-click sign-in from ECP) |
| 2331 | pgAdmin (one-click sign-in from ECP), only if installed |
| 53 (TCP and UDP) | BIND9 DNS, only if EH hosts your DNS |
| Ports you map | Any custom ports you allow accounts to use (**Network > Port Mapping**) |

EHM's own UI (2325) and API (2326) only need to be reachable directly before HTTPS is set up. Afterwards, Nginx serves them on 443 and you can close 2325/2326 to the outside.

## Services on the server

| Service | Where it runs | Address | Port |
| :--- | :--- | :--- | :--- |
| EHM UI | Host (PM2) | — | 2325 |
| EHM API | Host (PM2) | — | 2326 |
| MariaDB | Container | `172.1.0.6` | 3306, localhost only |
| MongoDB (optional) | Container | `172.1.0.7` | 27017, localhost only |
| PostgreSQL (optional) | Container | `172.1.0.8` | 5432, localhost only |
| MSSQL (optional) | Container | `172.1.0.10` | 1433, localhost only |
| phpMyAdmin | Container | `172.1.0.5` | 2329 |
| pgAdmin (optional) | Container | — | 2331 |
| Redis | Container | — | 6379, localhost only |
| InfluxDB (optional) | Container | — | 8181, localhost only |
| BIND9 (optional) | Container | — | 53; management API 8053, localhost only |
| Each account | Container | its own IP on `eh_network` (`172.1.0.0/16`) | 2324 for ECP |

`172.1.0.0/27` is reserved for shared services; accounts get addresses above it. Accounts can reach the shared services but not each other (see step 9 of [Install on a fresh server](../getting-started/install-on-a-fresh-server.md)).

The database engines can also run on a separate server on the same LAN — see each engine's page under **EH Services**.
