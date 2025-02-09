---
sidebar_position: 2
---

# New Release

### Build docker image to build application
```bash
cd /epiclabs23/eh/epic-backup/epic-backup-api/release/docker-files/nodejs-20
docker build -t nahidacm/epic-backup-build:nodejs-20 -f Dockerfile . 
```
### Build API and UI
:::info
Though the build script is under api folder, but this will build both the api and ui
:::
```bash
sudo su
```
```bash
cd /epiclabs23/eh/epic-backup/epic-backup-api
./release.sh
```