---
sidebar_position: 7.6
slug: /ehm/upgrading-to-1.1.4
---

# Upgrading from 1.1.3 to 1.1.4

:::info
No breaking database or Redis changes in this release — `eh-manager update-ehm` works the same way as before. The only new thing worth knowing about is the optional host packages for the new Host Benchmark feature; read [What's in this release](#whats-in-this-release) if you plan to use it.
:::

:::info
Updating **eh-manager itself**? `HOST_METRICS_ENABLED` is now carried forward from the previous `.env` (like `EHM_API_PUBLIC_URL`/`INFLUX_ENABLED`) instead of always resetting to `true`. This only takes effect once you're running an `eh-manager` build that includes the `hostMetricsEnabled` carry-forward (see `eh-manager` commit history) — an older `eh-manager` binary still won't pass it through, and the script falls back to `false` (not `true`) when nothing is carried.
:::

## What's in this release

- **Host Machine Benchmark** ("noisy neighbor" detector), under **Resource Monitor → Benchmark**, admin-only. Runs an on-demand ~30-90s suite (CPU steal/iowait, sysbench CPU/memory, `fio` disk IOPS/latency, network ping) to tell whether the underlying VPS is being starved by other tenants on the same host, and keeps results so a trend across runs can be seen. See [Host benchmark](../host-benchmark.md).
- **Host machine resource collection.** EHM now also collects host-wide (not just per-container) CPU/memory/disk/network into InfluxDB, gated by the new `HOST_METRICS_ENABLED` env var (defaults `true`, only takes effect when `INFLUX_METRICS_ENABLED=true`).
- **Resource monitor / alerting improvements:**
  - Usage notifications (email + in-app) now show an EMA-smoothed average percent instead of a raw instantaneous reading, so the number in the message better matches what the account actually experienced.
  - Notification banners can now be dismissed per-account; a dismissed banner re-shows automatically once the underlying severity/action actually changes, instead of staying dismissed forever.
  - Notifications gained `read-all`, `clear-all`, and single-delete endpoints.
  - Resource usage notification emails include more detail and better formatting (ECP URL, username).
  - New line charts for container metrics history.
- **Regenerate an integration client's secret** — rotate a client's secret in place (same client ID, name and permissions), and reactivate it if it had been revoked. This is the way to undo a revoke.
- **New account welcome email format** — cosmetic only, no action needed.

Every database change in this release is additive (new columns and a new table). There's no data migration step to run by hand; the normal update script applies them.

## Before you start

Nothing is required before running the update. Optionally, if you plan to use the new Host Benchmark page, the update script attempts to install its two dependencies for you:

```bash
sudo apt install -y sysbench fio
```

This is best-effort — the benchmark degrades gracefully per-step if a tool is missing (that step just reports "not installed" in the run instead of failing the whole benchmark), so a failed install here doesn't block the rest of the update. If your host has no internet access or the install fails for any other reason, install the packages by hand later whenever you want to use the feature.

## Step-by-step

Same as any other update — no new required flags:

```bash
sudo su
eh-manager update-ehm
```

or non-interactively:

```bash
sudo su
eh-manager update-ehm -v 1.1.4 --dbpass <your-mysql-root-password> --os 24.04 --influx false
```

`--apiurl` is intentionally omitted — when left out, `EHM_API_PUBLIC_URL` carries forward as-is from the
current `.env`. Only pass `--apiurl <url>` if you actually need to change it; passing the dev-default
`http://localhost:2326` on a production install would silently overwrite the real public URL (breaking
ECP callbacks / Git Integrations).

`1.1.4_update.sh` installs `sysbench`/`fio`, writes the `.env` (now including `HOST_METRICS_ENABLED`, carried forward from the previous `.env` by `eh-manager`), regenerates the JWT keypair, runs `prisma db push`, and restarts `ehm-api`/`ehm-ui` via `pm2` — the same shape as the 1.1.3 script, with those additions. It still carries forward the `REDIS_PASSWORD` requirement.

:::caution
Unlike the previous point, this script does **not** repeat 1.1.3's `User.role -> User.is_admin` data migration — that ran once, in `1.1.3_update.sh`, and 1.1.4 assumes it already happened. **If you're on 1.1.2 or earlier, update to `1.1.3` first**, then to `1.1.4` — don't jump straight from ≤1.1.2 to 1.1.4. Skipping 1.1.3 leaves the old `role` column in place for `prisma db push` to drop with no backfill, locking every existing admin out (`is_admin` defaults to `false`). See [Upgrading from 1.1.2 to 1.1.3](./upgrading-to-1.1.3) if you haven't done that step yet.
:::

## What to expect afterward

- **`HOST_METRICS_ENABLED` carries forward from your previous `.env`**, same as `EHM_API_PUBLIC_URL`/`INFLUX_ENABLED` — if you'd previously set it to `false`, it stays `false`. If your `.env` never had this key (any install before this release), it comes up as `false` by default rather than the `.env.sample` default of `true` — turn it on by hand in `/epiclabs23/eh/ehm/1.1.4/ehm-api/.env` (`HOST_METRICS_ENABLED=true`, then `pm2 restart ehm-api`) if you want host-wide metrics collection. This only matters when `INFLUX_METRICS_ENABLED=true` — otherwise the flag has no effect either way.
- **The Host Benchmark page will show every step as "not installed"** until `sysbench`/`fio` are present — expected if the apt install above didn't run or failed.
- **Existing integration clients are unaffected** — regenerating a secret is a new, opt-in action; nothing rotates automatically.

## More help

- Reading benchmark results: [Host benchmark](../host-benchmark.md).
- Resource monitoring and alerts: [Resource monitoring](../resource-monitoring.md).
- Integration clients: [Billing integration API](../../integrations/billing-api.md).
