---
sidebar_position: 2
---

# New Release

### Build docker image to build application
```bash
cd /epiclabs23/eh/epic-backup/epic-backup-api/release/docker-files/nodejs-20
docker build -t nahidacm/epic-backup-build:nodejs-20 -f Dockerfile . 
```
### Build pacakage
```bash
cd /epiclabs23/eh/epic-backup/epic-backup-api
sudo ./release.sh
```