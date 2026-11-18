---
sidebar_position: 2
---

# Troubleshooting

## EHM is down after a server restart

```bash
pm2 resurrect
```

This starts EHM from PM2's last saved state. Run `pm2 save` after any change to what PM2 runs, so a restart brings it back.

## Logins fail with "500 Internal Server Error"

Almost always the Redis password in EHM API's `.env` doesn't match `eh-services/redis/.env`. See [Install Redis](../eh-services/install-redis.md#wire-the-password-into-ehm-api).

## Can't create accounts

Load the image list first: **System > Config > Docker Images > Load Image List**. If loading fails, check the server can reach GitHub (`curl` the `DOCKER_IMAGES_REMOTE_URL` value from EHM API's `.env`) and try again.

## A new account's control panel doesn't start

Check EHM's log (`pm2 logs`, or **System > PM2 Logs**). A common cause is the account's disk quota being full:

```bash
sudo quota -vs <username>
# largest folders owned by the user:
sudo find / -user <username> -type d -exec du -h --max-depth=1 {} + 2>/dev/null | sort -rh | head -n 10
```

## Account provisioning fails with "nginx -t failed"

Symptom: creating an account fails with `Account provisioning failed: ... nginx -t failed - change reverted, nginx was never reloaded`. Older EHM versions put the real reason only in `~/.pm2/logs/ehm-api-out.log`, among many `ssl_stapling` warnings. Look for the `[emerg]` line:

```
[emerg] could not build variables_hash, you should increase variables_hash_bucket_size: 64
```

Cause: nginx's hash tables for variables or server names are full. Every account adds vhosts, so a server with enough accounts outgrows nginx's default sizes. The new account's config is fine, but `nginx -t` fails for the whole server.

Fix: add these lines to the `http` block of `/etc/nginx/nginx.conf`, or raise them if they are already there:

```nginx
variables_hash_max_size 2048;
variables_hash_bucket_size 128;
server_names_hash_max_size 4096;
server_names_hash_bucket_size 128;
```

Then run `nginx -t`. It should pass with no `could not build` warning. Run `systemctl reload nginx` and create the account again. If `nginx -t` reports that a directive is duplicate, it is also set in `/etc/nginx/conf.d/eh-hash-sizes.conf`. Remove the line from one of the two files.

From EHM 2.0.11, EHM sets these values itself in `/etc/nginx/conf.d/eh-hash-sizes.conf` at startup (only the ones you haven't set), raises them once on this error, and puts the `[emerg]` line in the error message.

Early sign: `nginx -t` passes but prints `could not build optimal variables_hash` (or `server_names_hash`). That means the table is almost full and provisioning will fail soon, so raise the sizes now. EHM 2.0.11+ logs this as a warning.

## Error: `GLIBC_2.34' not found`

The server's OS is older than the release was built for. Check the [requirements](../getting-started/requirements.md).

## A site shows "502 Bad Gateway"

1. On the server: `service nginx status` and `nginx -t`.
2. Inside the account's container (`docker exec -it <username>_container bash`): check the app is running (ECP **System > Service Manager**, or the app's logs in ECP), and `curl localhost` returns a page.
3. For PHP/WordPress sites after an update, check the app's PHP version is one the image supports (8.1, 8.3, 8.4) — see [Updating existing accounts](../ehm/upgrade-notes/updating-existing-accounts.md).

## A domain doesn't resolve or goes to the wrong place

- `dig <domain>` — does it point at the server's public IP?
- If EH hosts the DNS: check the zone in ECP's **Zone Editor**, and that BIND9 is running.
- `nginx -t` for config errors.

## phpMyAdmin says "You must set SignonURL!" or shows an "array offset on value of type null" warning

phpMyAdmin couldn't get the account's MySQL credentials from EHM. Check that EHM API is running and that the account has a MySQL user.

## Charts are empty or InfluxDB keeps restarting

See [Install InfluxDB](../eh-services/install-influxdb.md#resetting).

## Still stuck?

Ask in [GitHub discussions](https://github.com/EpicLabs23/ecp-ehm-free/discussions), report bugs in [issues](https://github.com/EpicLabs23/ecp-ehm-free/issues), or get paid support from Epic Labs 23.
