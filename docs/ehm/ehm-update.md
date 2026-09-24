---
sidebar_position: 7
---
# Update EHM

:::danger
Updating to **2.0.0**? Read [Upgrading from 1.1.x to 2.0.0](./upgrading-to-2.0.0) first — this is a major version with breaking changes (OpenLiteSpeed replaces PHP-FPM/nginx, PHP 7.4 dropped, Postgres/MSSQL/MongoDB become standalone `eh-services` instead of EHM-managed containers) that need action before/during this command if they apply to you.
:::

:::info
Updating to **1.1.4**? Read [Upgrading from 1.1.3 to 1.1.4](./upgrading-to-1.1.4) — non-breaking from 1.1.3, but if you're still on **1.1.2 or earlier, update to 1.1.3 first**: 1.1.4's script no longer repeats 1.1.3's admin-preserving data migration, and skipping straight to 1.1.4 would lock out existing admins.
:::

:::info
Updating to **1.1.3**? Read [Upgrading from 1.1.2 to 1.1.3](./upgrading-to-1.1.3) first — that release has a breaking database schema change and a breaking Redis change that need action before/during this command.
:::

### Pre-requisite
- [EH Manager Installation](../eh-manager/eh-manager-instalation)

### Interactive Installation
```bash
sudo su
eh-manager update-ehm
```

This also prompts **"Enable InfluxDB metrics history?"**, defaulting to whatever the current install already has set.

### Non-interactive Installation
```bash
sudo su
eh-manager update-ehm -v 0.0.1 --dbpass drootp --os 24.04 --influx false
```

`--apiurl` is omitted above on purpose: when left out, `EHM_API_PUBLIC_URL` is carried forward as-is from
the current `.env`. Only pass `--apiurl <url>` if you actually need to change it — passing the dev-default
`http://localhost:2326` on a production install would silently overwrite the real public URL (breaking
ECP callbacks / Git Integrations) with every update.