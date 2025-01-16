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

### Non-interactive Installation
```bash
sudo su
eh-manager update-ehm -v v0.0.1 --dbpass drootp --apiurl http://localhost:2326 --os 24.04
```