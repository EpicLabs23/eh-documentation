---
sidebar_position: 8
---

# Resource Monitoring and Limits

Each account's limits come from its package: CPU, memory, disk, bandwidth, and database count and size per engine. Some limits are hard caps (CPU and memory are capped by Docker, disk by ext4 quotas). The resource monitor adds fair-use enforcement on top: it watches each account against its limits and, if an account stays over, escalates step by step.

It is **off by default**. Turn it on under **System > Config > Resource Monitor** (**Resource Monitor Enabled**).

## What happens to an account that goes over

| Resource | Steps |
| :--- | :--- |
| CPU, memory, bandwidth | notify → throttle → suspend |
| Disk, database size and count, container storage | notify → suspend |

- **Notify**: the customer gets an email and an in-app notice saying what is over, by how much, and how to fix it. Reminders repeat (every **Notify Cooldown** minutes, default 60) while the problem lasts.
- **Throttle**: CPU or memory is cut to a share of the normal allowance (**Throttle CPU %** / **Throttle Memory %**, default 50%) without restarting anything. Bandwidth is rate-limited.
- **Suspend**: the account's container is stopped. For a database over its size limit, only that database is made read-only; the rest of the account keeps running.
- **Recovery**: once usage stays under the threshold for **Recovery Cycles Required** minutes, the account is restored automatically and the customer is told.

Short spikes don't trigger anything: each step needs several consecutive over-limit checks (one check per minute; see **Cycles Before Throttle** and **Cycles Before Suspend**).

A database count limit is also enforced up front: ECP refuses to create a database once the account is at its limit.

## Settings

All under **System > Config > Resource Monitor**:

- **Collectors** — turn each resource on or off (disk, database, CPU, memory, bandwidth, container storage). Container storage is watch-only; there's no hard cap for it.
- **Thresholds** — warning and critical percentages for disk/database, and sustained warning/critical percentages for CPU and memory.
- **Escalation** — how many minutes over the limit before throttling or suspending, and how long to stay under before restoring.
- **Actions** — email and in-app notices, admin alerts (emails every admin on throttle/suspend and restore), and whether throttling and suspension are allowed at all. Leave throttling and suspension off to only send warnings.
- **Bandwidth** — the day of the month usage resets, and the throttle rate.
- **Retention** — how long resource events are kept.

## Bandwidth counting

Bandwidth is counted with iptables rules on each account's container IP. The counting rules don't change what traffic is allowed. After a reboot, EHM recreates them on the next check; only the count since the last check is lost.

## Seeing and resolving

- **Resource Monitor > Events** — every notify, throttle, suspend and restore, per account.
- **Resource Monitor > Metrics** — usage charts (history needs InfluxDB).
- The **account's detail page** shows its current resource status and lets an admin lift a throttle or suspension straight away.
- Customers see their own status in ECP (**System > Resource Usage**) and in their notifications.

A suspension you make by hand is never undone by the monitor, and unsuspending an account by hand clears the monitor's state for it.
