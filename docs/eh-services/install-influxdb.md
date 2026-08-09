---
sidebar_position: 7
---

# Install InfluxDB

:::info
Optional. InfluxDB stores container CPU/memory/network time series metrics. EHM works without it — skip this if you don't need historical metrics graphs.
:::

```bash
cd /epiclabs23/eh/eh-services/influxdb
```

## Fix bind-mount ownership

The image runs as a non-root user (`influxdb3`, uid `1500`), but Docker creates bind-mounted host directories as `root` on first run. Without this, the container crash-loops with `PermissionDenied` trying to write its catalog:

```bash
sudo mkdir -p data plugins
sudo chown -R 1500:1500 data plugins
```

## Run the container

```bash
docker compose up -d
```

Confirm it's actually up, not crash-looping:

```bash
docker ps --filter "name=influxdb" --format "table {{.Names}}\t{{.Status}}"
```

The container must be named `influxdb` — [EHM installation](../ehm/ehm-install) execs into it by that name to create the admin token when you answer yes to the InfluxDB prompt (or pass `--influx true`). Leave the token/database creation to that step; there's nothing else to configure here.
