---
sidebar_position: 3
---

# Update

### Interactive update
```bash
sudo eh-manager update-epic-backup
```
### Non Interactive update
```bash
sudo eh-manager update-epic-backup --apiurl http://localhost:2330 --newversion 0.0.1
```
### Non Interactive update with targetDir
```bash
sudo eh-manager update-epic-backup --apiurl http://localhost:2330 --targetDir /epiclabs23/eh-prod/epic-backup --newversion 0.0.1
```