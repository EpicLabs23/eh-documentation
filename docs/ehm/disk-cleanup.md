---
sidebar_position: 9
---

# Disk Cleanup

A hosting server slowly fills up with things nothing else removes: old Docker images, export archives, old EHM release files, resource events and large Nginx logs. **System > Disk Cleanup** finds them and frees the space.

Nothing is deleted automatically. The page shows a report (a dry run) of what can be removed in each area and how much space it frees; you then clean an area, or all of them, yourself. A daily scan logs the same report but never deletes anything.

## Areas

| Area | What it removes |
| :--- | :--- |
| Docker | Untagged images, snapshot images and old MySQL volumes left by deleted accounts, and old build cache. Only things EHM itself created are touched. |
| Export archives | Export files of deleted accounts (after a grace period) and exports past the retention period. |
| EHM release versions | Old downloaded EHM releases beyond the newest few. |
| Resource-monitor events | Event records older than the retention set in [Resource monitoring](./resource-monitoring.md). Frees database rows, not disk. |
| Nginx logs | Per-domain Nginx logs over the size limit are emptied in place. Nginx's main logs are never touched. |

## Old PHP-FPM/nginx folders

Accounts created before 2.0.0 keep their old PHP-FPM/nginx config folders (`/home/<user>/ecp/nginx`, `/home/<user>/ecp/php`) after their container is updated. This area isn't on the page yet; use the API (admin token as in [Updating existing accounts](./upgrade-notes/updating-existing-accounts.md#1-find-accounts-on-unsupported-php-versions)):

```bash
# see what would be removed
curl -s https://<your-ehm-domain>/api/maintenance/cleanup/ols-migration-leftovers/report -H "Authorization: Bearer $TOKEN" | jq
# remove it
curl -s -X POST https://<your-ehm-domain>/api/maintenance/cleanup/ols-migration-leftovers/execute -H "Authorization: Bearer $TOKEN" | jq
```

It only lists folders for accounts whose running container no longer uses them, so it is safe to run before every account has been updated.

## Not covered

- Uploaded account-import files under `/epiclabs23/imports/ehm/accounts/tmp` are not cleaned yet. Delete old files there by hand when no import is running.
- PM2's own logs are rotated by `pm2-logrotate`, installed by the update script.
