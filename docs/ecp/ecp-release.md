---
sidebar_position: 2
---

# Release

## Production (ecp-base)

**In the Dev PC:**

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

Note: Release doc for various ecp images are availble under corresponding docker directory under:

```bash
/epiclabs23/eh/ecp/ecp-docker/*
```

This will build `ecp-base`s both the api and ui

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
```

Make some files and directories writable by both the non root host machine user and `ecp_username` from conside of the container. For dev pupose only.

```bash
chmod 777 /epiclabs23/eh/ecp/ecp-ui/node_modules/ -R
chmod 777 /epiclabs23/eh/ecp/ecp-ui/package-lock.json
chmod 777 /epiclabs23/eh/ecp/ecp-go/tmp
```

Now setup dev specific environments

```bash
su <ecp_username>
/epiclabs23/eh/ecp/dev-setup.sh
source ~/.bashrc
```

Adjust the `CORS_ALLOW_ORIGINS` in `.env` accordingly

Start ecp golang based api backend in dev mode

```bash
su <ecp_username>
cd /epiclabs23/eh/ecp/ecp-go
air
```

Start ecp frontend in new terminal from inside the docker container with the `ecp_username` in very same way of ecp-go

```bash
su <ecp_username>
cd /epiclabs23/eh/ecp/ecp-ui
npm run dev
```
