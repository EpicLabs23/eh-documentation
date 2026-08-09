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

## Run the container

```bash
docker compose up -d
```

The container must be named `influxdb` — [EHM installation](../ehm/ehm-install) execs into it by that name to create the admin token when you answer yes to the InfluxDB prompt (or pass `--influx true`). Leave the token/database creation to that step; there's nothing else to configure here.
