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
