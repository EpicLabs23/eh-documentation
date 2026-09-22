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

`ecp-docker` (the Dockerfiles/release scripts below) is its own repo too — tag it the same way. Its
per-image Docker Hub tags (managed by `release.js`/`release-all.js` below) are a separate thing from
this git tag; this just marks the exact source state of the Dockerfiles/release tooling itself:

```bash
cd /epiclabs23/eh/ecp/ecp-docker
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
./release.js
```

### Releasing multiple images at once

Each `ecp-docker/*` directory has its own standalone `release.js`, but `release-all.js` (in `ecp-docker/`) can drive several of them in one run, prompting for a version for each as it goes:

```bash
sudo su
cd /epiclabs23/eh/ecp/ecp-docker

# Release everything
./release-all.js all

# Release specific images by name
./release-all.js ecp-base managed-wordpress

# Interactive: pick by number or name, or type "all"
./release-all.js

# List available targets
./release-all.js --help
```

The default version it suggests for each image is the next patch version after the latest tag published on Docker Hub (e.g. `1.1.2` → `1.1.3`) — press Enter to accept it, or type a different version.

If `dotnet-3` is among the selected targets, it prints a reminder that `ecp-go` must already be built separately for Ubuntu 20.04 (see `dotnet-3/README.md`) and asks for confirmation before proceeding; declining just skips `dotnet-3` and continues with the rest.

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
