---
sidebar_position: 6
---

# storage.bd Backup Setup

:::info
Optional, but recommended. Without this, neither EHM's own host backup nor per-account backup works —
accounts simply have no backup coverage until it's configured.
:::

[storage.bd](https://storage.bd) is an encrypted off-site backup service (restic on S3) run by Epic Labs 23. EHM uses it in two separate ways:

- **Host backup** — EHM backs up its own database and key host folders every night. See [Host backup and restore](./host-backup.md).
- **Account backups** — EHM acts as a reseller and gives every hosting account its own backup space, which the customer uses from ECP. See [Backups (ECP)](../ecp/backups.md).

The two use separate credentials against the same storage.bd account.

## 1. Install restic

Both kinds of backup run `restic`. Install a checksum-verified binary at `/usr/bin/restic` — the steps are in [Host backup and restore](./host-backup.md#install-restic), and EHM shows the same steps under **System > Host Backup** if restic is missing.

`RESTIC_BINARY_PATH` in EHM API's `.env` must point at it (the default, `/usr/bin/restic`, matches). Restart EHM API after changing it:

```bash
cd /epiclabs23/eh/ehm/<version>/ehm-api
pm2 restart ecosystem.config.js
```

## 2. Get storage.bd credentials

You need a storage.bd reseller account with two sets of credentials:

- **Reseller** client ID and secret — used to create a backup space for each new hosting account.
- **Host backup** tenant ID, install ID and client secret — a separate space used only for EHM's own backup. Keep it distinct from the reseller credentials; they are not interchangeable.

Contact Epic Labs 23 to get a storage.bd reseller account.

## 3. Configure in EHM

**System > Config > Storage.bd Settings**:

- **Base URL** — the storage.bd API address you were given (e.g. `https://api.storage.bd`).
- **Reseller Client ID** / **Reseller Client Secret**.
- **Host Backup Tenant ID** / **Host Backup Install ID** / **Host Backup Client Secret**.

Save. New accounts get a backup space automatically when they are created, and the host backup runs nightly at 02:00 server time — nothing else to do for EHM's own backup.

## 4. Extra host backup paths (optional)

JWT keys, all account data, the Nginx config and BIND9 zones are always included. Add anything else under **System > Host Backup > Backup Paths**.

## 5. MSSQL backups (only if you offer MSSQL)

MSSQL writes its backup files inside its own container, so EHM must be able to read them from disk. If MSSQL runs on the **same server** as EHM, set `MSSQL_BACKUP_HOST_DIR` in EHM API's `.env` to the folder `eh-services/mssql` mounts for backups (default `/epiclabs23/eh/eh-services/mssql/backup`). If MSSQL runs on another server, leave it unset — MSSQL backup and restore are unavailable in that setup; everything else still works.

## Troubleshooting

- **Backups fail immediately / restic errors**: confirm `RESTIC_BINARY_PATH` points at an installed binary (`restic version`), then restart EHM API — the value is read once at start-up.
- **Host backup shows `failed` under System > Host Backup**: read the job's error message. `"config file already exists"` is restic's wording for "repository already set up", not the real error — look past it for the actual failure.
