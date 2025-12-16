---
sidebar_position: 2
---

# Release

## Production (ecp-base)

**In the Dev PC:**

### Update version file

update the `/epiclabs23/eh/ecp/ecp-go/version.json` with the new release number and time.

#### Update version number in footer

```bash
/epiclabs23/eh/ecp/ecp-ui/src/layouts/partials/Footer.tsx
```

### Git Tag

Before tagging, make sure all the changes are committed and pushed to the remote repository.

```bash
cd /epiclabs23/eh/ecp/ecp-go
git tag -a <version> -m "<message>"
git push origin <version>
```

```bash
cd /epiclabs23/eh/ecp/ecp-ui
git tag -a <version> -m "<message>"
git push origin <version>
```

### Build and push

This will build both the api and ui

```bash
sudo su
cd /epiclabs23/eh/ecp/ecp-docker/ecp-base
./release.sh
```

## Dev (ecp-go-dev)

**Step 1:** Build Final Dev Image

```bash
cd /epiclabs23/eh/ecp/ecp-docker/ecp-go-dev/
docker build -t nahidacm/ecp-go-dev:latest -f Dockerfile .
```

**To start development / debugging of ecp-api and ecp-ui**

1. Make an ECP account from `ehm` panel using `ECP go Dev` Hosting environment.
2. The container for this account should mount `/epiclabs23/eh/ecp/ecp-go:/epic-apps/ecp/ecp-go` and `/epiclabs23/eh/ecp/ecp-ui:/epic-apps/ecp/ecp-ui`
3. `docker exec` on the container and run the `ecp-go` and `ecp-ui` in dev mode.
4. Make changes on the host machine files, since they are mounted in the container.
5. Run dev setup script

```bash
docker exec -it <ecp_username>_container bash
su <ecp_username>
/epiclabs23/eh/ecp/dev-setup.sh
source ~/.bashrc
```
