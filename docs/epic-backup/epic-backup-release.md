---
sidebar_position: 2
---

# New Release

### Build docker image to build application

```bash
cd /epiclabs23/eh/epic-backup/epic-backup-api/release/docker-files/nodejs-22
docker build -t nahidacm/epic-backup-build:nodejs-22 -f Dockerfile .
```

### Git Tag

```bash
cd /epiclabs23/eh/epic-backup/epic-backup-api
git tag -a <version> -m "<message>"
git push origin <version>
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
