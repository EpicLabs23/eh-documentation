---
sidebar_position: 2
---

# Release

## Production (ecp-base)

**In the Dev PC:**

**Step 1:** update the `/epiclabs23/eh/ecp/ecp-api/version.json` with the new release number and time.

**Step 2:** Build and push
```bash
sudo su
cd /epiclabs23/eh/ecp/ecp-docker/ecp-base
./release.sh
```

## Dev (ecp-base-dev)

**Step 1:** Build Final Dev Image

```bash
cd /epiclabs23/eh/ecp/ecp-docker/ecp-base-dev/
docker build -t nahidacm/ecp-base-dev:latest -f Dockerfile . 
```
**To start development / debugging of ecp-api and ecp-ui** 
1. Make an ECP account from `ehm` panel using `ECP Base Dev` Hosting environment.
2. The container for this account should mount `/epiclabs23/eh/ecp/ecp-api:/epic-apps/ecp/ecp-api` and `/epiclabs23/eh/ecp/ecp-ui:/epic-apps/ecp/ecp-ui`
3. `docker exec` on the container and run the `api` and `ui` in dev mode.
4. Make changes on the host machine files, since they are mounted in the container.