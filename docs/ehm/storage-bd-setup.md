---
sidebar_position: 6.2
---

# Storage.bd Backup Setup

:::info
Optional, but recommended. Without this, neither EHM's own host backup nor per-account (ECP tenant)
backup will work — accounts simply have no backup coverage until it's configured.
:::

storage.bd is the backup platform EHM uses both for **its own host-level backup** (DB + a fixed set of
host paths) and, separately, as a **reseller** provisioning a backup tenant per ECP account. These are two
independent credential pairs against the same storage.bd account — see `docs/HOST_BACKUP.md` and
`docs/BACKUP.md` in `ehm-api` for the full architecture; this page is just the setup steps.

## 1. Install the `restic` binary

Host backup and per-account database backups both shell out to a pinned `restic` binary (not resolved off
`$PATH` — this runs as root, so an unpinned path would be a privilege-escalation surface):

```bash
# Ubuntu
sudo apt update
sudo apt install -y restic
which restic   # confirm the path, typically /usr/bin/restic
```

Set `RESTIC_BINARY_PATH` in `ehm-api/.env` to that path (already defaulted to `/usr/bin/restic` in
`.env.sample`) and restart `ehm-api`.

## 2. Get storage.bd credentials

You need a storage.bd account with:

- A **reseller** Tenant/Install (client_id/secret) — used only to provision a new backup tenant for each
  ECP account as it's created.
- A **host backup** Tenant/Install (client_id/secret) — a separate Tenant used solely for EHM's own
  host-level backup. Keep this distinct from the reseller credential; they are not interchangeable.

Obtain both from your storage.bd account/dashboard (or from EpicLabs23 if storage.bd access is being
provisioned for you).

## 3. Configure in EHM UI

`System > Config > Storage.bd Settings`:

- **Base URL** — your storage.bd API base (e.g. `https://api.storage.bd`).
- **Reseller Client ID** / **Reseller Client Secret** — from step 2.
- **Host Backup Client ID** / **Host Backup Client Secret** — from step 2.

Save. Host backup runs nightly at 02:00 server time automatically once these are set — no further action
needed for EHM's own backup.

## 4. Extra host backup paths (optional)

A fixed set of paths (JWT keys, all account userdata, Nginx config, Bind9 zones) is always included. Add
anything else you want covered under the same `Storage.bd Settings` tab's **Host Backup — Backup Paths**
list.

## 5. MSSQL backup/restore (optional, only if MSSQL is enabled)

MSSQL's native `BACKUP DATABASE` writes to the *container's own filesystem*, so it can't stream over the
network like the other engines' dump tools. If MSSQL runs on the **same host** as EHM, set
`MSSQL_BACKUP_HOST_DIR` in `ehm-api/.env` to the host path `eh-services/mssql/docker-compose.yml` bind-mounts
to `/var/opt/mssql/backup` (default `eh-services/mssql/backup`). If MSSQL runs on a separate instance,
leave this unset — MSSQL backup/restore is simply unavailable in that topology, everything else still
works.

## 6. New installs vs. upgrading from 1.x

- **New install**: every new ECP account automatically gets a backup tenant provisioned at creation
  time — nothing further to do once steps 1–3 above are complete.
- **Upgrading from 1.1.x**: storage.bd didn't exist before 2.0.0, so **existing accounts have no backup
  tenant** even after you complete steps 1–3. Backfill them explicitly:

  ```bash
  cd ehm-api
  # Preview first
  npx ts-node -r tsconfig-paths/register scripts/backfill-storage-bd-tenants.ts --storage-gb=5 --dry-run
  # Then run for real
  npx ts-node -r tsconfig-paths/register scripts/backfill-storage-bd-tenants.ts --storage-gb=5
  ```

  This is idempotent (skips accounts that already have a tenant), so it's safe to re-run. See
  `docs/BACKUP.md` in `ehm-api` for scoping to specific accounts (`--only=12,13`).

## Troubleshooting

- **"RESTIC_BINARY_PATH" errors / backups fail immediately**: confirm the env var is set and points at an
  actually-installed binary (`which restic`), then restart `ehm-api` — this value is read once at
  process start.
- **Host backup shows `failed` in `System > Maintenance` (or via `GET /storage-bd/host-backup/status`)**:
  check the job's `error` field first. `"config file already exists"` is restic's normal wording for "repo
  already initialized," not a real error — look past it for the actual failure underneath. Full runbook
  in `docs/HOST_BACKUP.md`.
- **A specific account can't back up / "Backup Now" fails in ECP**: confirm that account actually has a
  `storage_bd_tenant_id` — pre-2.0.0 accounts need the backfill script in step 6 above.
