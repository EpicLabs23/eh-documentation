---
sidebar_position: 10
---

# Updating Existing Accounts

Updating EHM (`eh-manager update-ehm`) updates EHM itself. Each hosting account keeps running its current container image until that account is updated. Do this after every EHM release that ships a new ECP image — and in particular after moving from 1.1.x to 2.x, where PHP sites moved from PHP-FPM/nginx to OpenLiteSpeed.

## 1. Find accounts on unsupported PHP versions

The current images ship PHP **8.1, 8.3 and 8.4** only. PHP 7.4 was dropped in 2.0.0. A PHP or WordPress app set to a version the image doesn't have will stop working when its account is updated.

List affected accounts before you start (admin only). Get a token by signing in, then call the report:

```bash
TOKEN=$(curl -s -X POST https://<your-ehm-domain>/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"<admin username>","password":"<admin password>"}' | jq -r .access_token)

curl -s https://<your-ehm-domain>/api/ecp/system/php-compatibility-report \
  -H "Authorization: Bearer $TOKEN" | jq
```

For each app it lists, change the app's PHP version to 8.1 or newer in that account's ECP (the app's settings). Treat 7.4 → 8.1 as a real compatibility check for the site, not just a number change — test the site afterwards.

## 2. Update each account's container

Either:

- **From EHM:** open the account (**Account > Account List**, then the account), and choose **Update ECP** from its Action menu; or
- **From ECP:** the customer opens **System > Update** in their own control panel.

This replaces the account's container with the current image. Files, databases, domains and settings are kept. EHM then rebuilds the web server config for every PHP, static and WordPress app on the account. If an app's config can't be rebuilt (most often an unsupported PHP version), the update result names that app; fix it and update again.

## 3. One-time fix for very old apps

Apps created before the `php-nginx` app type was renamed to `php` may still carry the old name if they were imported from elsewhere. If any PHP app misbehaves after the update, run this once on EHM's database:

```sql
UPDATE App SET deploy_type = 'php' WHERE deploy_type = 'php-nginx';
```

## 4. Clean up and check

- Open each PHP/WordPress site to confirm it loads — not just that the container started.
- Accounts from 1.1.x leave old PHP-FPM/nginx folders (`/home/<user>/ecp/nginx` and `/home/<user>/ecp/php`) on disk. They can be removed once the account is updated — see [Disk cleanup](../disk-cleanup.md#old-php-fpmnginx-folders).

Nothing to do for: database names and users created before 2.0.0 (they keep working under their old names), cron jobs, process-based apps (Node.js, Python, etc.), or Nginx config for non-PHP apps (it is regenerated automatically on the next change).
