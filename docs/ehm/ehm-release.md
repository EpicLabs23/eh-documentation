---
sidebar_position: 5
---

# Release EHM

:::warning
This doc is only for developers.

Please skip if you are just installing EHM on production server.
:::

### Get ehm-release

```bash
cd /epiclabs23/eh/ehm
git clone https://github.com/EpicLabs23/ehm-release.git
```

#### Build docker image to build EHM

```bash
cd /epiclabs23/eh/ehm/ehm-release/docker-files/ubuntu-24.04
docker build -t nahidacm/ehm-builder-ubuntu:24.04 -f Dockerfile .
```

#### Make update script

Copy previous version script from `/epiclabs23/eh/ehm/ehm-release/update-scripts/*_update.sh`
With latest version number in the same directory. Make neccessary updates on the script if needed.

#### Git Tag

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

#### Now build EHM and publish the release to GitHub

Requires Node.js and the [GitHub CLI](https://cli.github.com/) (`gh`) installed
and authenticated (`gh auth login`) with an account that has push/admin access
to the public [EpicLabs23/ecp-ehm-free](https://github.com/EpicLabs23/ecp-ehm-free)
repo.

```bash
sudo su
cd /epiclabs23/eh/ehm/ehm-release
./public_github_release.js
```

The script looks up the latest release already published on the public repo
(falling back to `1.0.0` if none exist) and prompts for the new version number,
suggesting the next patch bump as a default (press Enter to accept it). It then
builds the release tarball and publishes it as a GitHub Release (tag = version
number) on the public `EpicLabs23/ecp-ehm-free` repo. The source code stays in
the private `ehm-release`/`ehm-api`/`ehm-ui` repos — the public repo only hosts
the compiled release assets that customers install/update from. If a release
for that version already exists, the tarball asset is re-uploaded (`--clobber`)
instead of failing.
