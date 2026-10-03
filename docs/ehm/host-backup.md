---
sidebar_position: 6.1
---

# Host Backup and Restore

EHM backs up **itself** to storage.bd every night at 02:00: its MySQL database, plus JWT keys, all account data (`/ehm/userdata`), the Nginx config, BIND9 zones, and any extra paths you add. This is separate from each customer's own account backups.

Set it up first: [storage.bd backup setup](./storage-bd-setup.md).

## Install restic

EHM runs restic as root, so install a pinned, checksum-verified binary rather than whatever `apt` or `restic self-update` provides — those can change the version underneath a running install.

```bash
cd /tmp
VERSION=0.19.1   # check https://github.com/restic/restic/releases for the latest
curl -LO "https://github.com/restic/restic/releases/download/v${VERSION}/restic_${VERSION}_linux_amd64.bz2"
curl -LO "https://github.com/restic/restic/releases/download/v${VERSION}/SHA256SUMS"
curl -LO "https://github.com/restic/restic/releases/download/v${VERSION}/SHA256SUMS.asc"

# Verify the signature on the checksum file (restic's release key)
curl -s https://restic.net/gpg-key-alex.asc | gpg --import
gpg --verify SHA256SUMS.asc SHA256SUMS
# Expect "Good signature from ... Alexander Neumann ...",
# fingerprint CF8F 18F2 8445 7597 3F79 D4E1 91A6 868B D3F7 A907

# Verify the binary
sha256sum --ignore-missing -c SHA256SUMS   # expect: restic_..._linux_amd64.bz2: OK

# Install
bunzip2 "restic_${VERSION}_linux_amd64.bz2"
sudo install -o root -g root -m 0755 "restic_${VERSION}_linux_amd64" /usr/bin/restic
restic version
```

To upgrade later, repeat with a new `VERSION`.

## Check status and run a backup

**System > Host Backup** shows the schedule, the restic version, recent jobs and their status, and has a **Run Backup Now** button.

| Status | Meaning |
| :--- | :--- |
| `succeeded` | All good. |
| `succeeded_with_warnings` | Some files changed or couldn't be read during the run. Worth a look, not urgent. |
| `failed` | Read the error message on the job. |
| `running` | A backup is in progress. A second one can't start until it finishes. |

## Restore

There is no restore button for the host backup. Restore is done with `restic` as root on the server, and is meant for disaster recovery.

### 1. Gather what you need

- The repository password: `sudo cat /ehm/storage-bd/host-backup-restic-password`. **Keep a copy of this file somewhere off the server.** Without it the backup can't be decrypted.
- The **Base URL**, **Host Backup Tenant ID**, **Install ID** and **Client Secret** from **System > Config > Storage.bd Settings** (or from your own records if EHM is down).

### 2. Get a short-lived access token

```bash
BASE_URL="<base url>"
TENANT_ID="<host backup tenant id>"
INSTALL_ID="<host backup install id>"
INSTALL_SECRET="<host backup client secret>"

TOKEN=$(curl -s -X POST "$BASE_URL/auth/data-token" \
  -H 'Content-Type: application/json' \
  -d "{\"tenant_id\":\"$TENANT_ID\",\"install_id\":\"$INSTALL_ID\",\"install_secret\":\"$INSTALL_SECRET\"}" \
  | jq -r .access_token)

HOST="${BASE_URL#http://}"; HOST="${HOST#https://}"
export RESTIC_REPOSITORY="rest:http://user:${TOKEN}@${HOST}/repo/"
export RESTIC_PASSWORD_FILE="/ehm/storage-bd/host-backup-restic-password"
```

The token lasts about 15 minutes. If a command starts failing part-way, get a new token and re-run it — restic restores can safely be re-run.

### 3. Find a snapshot

```bash
sudo -E restic snapshots
```

Snapshots tagged `ehm-host` hold files; snapshots tagged `ehm-host-db` hold the database dump (`ehm-db.sql`). Filter with `--tag ehm-host` or `--tag ehm-host-db`.

### 4. Restore files

Always restore to a scratch folder first and copy back only what you need:

```bash
sudo -E restic restore <snapshot_id> --target /tmp/ehm-host-restore

# or just one account's data:
sudo -E restic restore <snapshot_id> --target /tmp/ehm-host-restore --include /ehm/userdata/<username>
```

Then review and `rsync` the files into place. Don't restore straight to `/`.

### 5. Restore the database

This replaces the whole EHM database. Stop EHM first (`pm2 stop all`) so nothing writes during the restore.

```bash
sudo -E restic dump <snapshot_id> ehm-db.sql > /tmp/ehm-db-restore.sql
# review the file, then:
mysql -h 172.1.0.6 -u root -p <ehm database name> < /tmp/ehm-db-restore.sql
```

The database name is the last part of `EHM_DATABASE_URL` in EHM API's `.env`. Start EHM again with `pm2 start all` (or `pm2 resurrect`).

## Lost the password file?

A copy of the repository password is held in escrow by storage.bd, for recovery only. Getting it back is a deliberately slow, audited process. Contact Epic Labs 23 support. Once you have it back, change the password straight away (`restic key passwd`), save the new one to `/ehm/storage-bd/host-backup-restic-password`, and delete `/ehm/storage-bd/host-backup-restic-password.escrowed` so the next backup escrows the new password.

## Troubleshooting

- **A backup is stuck as `running`** after EHM crashed mid-backup: new backups won't start until that job is cleared. Contact support.
- **Error mentions `config file already exists`**: that's restic saying the repository already exists; the real error is elsewhere in the message.
