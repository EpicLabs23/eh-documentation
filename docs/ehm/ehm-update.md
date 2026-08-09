---
sidebar_position: 7
---
# Update EHM

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