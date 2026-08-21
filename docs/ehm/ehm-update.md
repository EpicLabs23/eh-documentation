---
sidebar_position: 7
---
# Update EHM

:::info
Updating to **1.1.4**? Read [Upgrading from 1.1.3 to 1.1.4](./upgrading-to-1.1.4) — non-breaking from 1.1.3, but if you're still on **1.1.2 or earlier, update to 1.1.3 first**: 1.1.4's script no longer repeats 1.1.3's admin-preserving data migration, and skipping straight to 1.1.4 would lock out existing admins.
:::

:::info
Updating to **1.1.3**? Read [Upgrading from 1.1.2 to 1.1.3](./upgrading-to-1.1.3) first — that release has a breaking database schema change and a breaking Redis change that need action before/during this command.
:::

### Pre-requisite
- [EH Manager Installation](../eh-manager/eh-manager-instalation)

### Interactive Installation
```bash
sudo su
eh-manager update-ehm
```

This also prompts **"Enable InfluxDB metrics history?"**, defaulting to whatever the current install already has set.

### Non-interactive Installation
```bash
sudo su
eh-manager update-ehm -v 0.0.1 --dbpass drootp --apiurl http://localhost:2326 --os 24.04 --influx false
```