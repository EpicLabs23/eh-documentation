---
sidebar_position: 1
---

# Requirements

For the current EHM release (2.0.x):

| | Minimum | Notes |
| :--- | :--- | :--- |
| OS | Ubuntu 22.04 or 24.04 | `eh-manager` refuses older versions. The step-by-step guide uses 24.04. |
| CPU | 2 cores | More if you host many accounts. `eh-manager` warns below this. |
| Memory | 4 GB | `eh-manager` warns below this. |
| Disk | ext4 with user quotas enabled | Disk quotas per account need ext4 quotas. See [System setup](../ehm/system-setup). |
| Node.js | 24 or newer | Installed with nvm in the install guide. |
| Access | root (or sudo) | EHM creates system users and containers. |
| Network | A public IP and a domain for the EHM panel | Account domains point at the same IP. |

Optional, depending on what you offer:

- **InfluxDB** for resource history charts.
- **PostgreSQL, MSSQL, MongoDB** if accounts should be able to use them. MariaDB is always required.
- **BIND9** if EH should host DNS zones. You can use Cloudflare or your own DNS instead.
- **storage.bd** account for backups. See [storage.bd backup setup](../ehm/storage-bd-setup).
- `sysbench` and `fio` for the [host benchmark](../ehm/host-benchmark).

Next: [Install on a fresh server](./install-on-a-fresh-server.md).
