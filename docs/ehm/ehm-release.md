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

#### System requirements file

`public_github_release.js` publishes `/epiclabs23/eh/ehm/ehm-release/system-requirements/{version}_requirements.json` as a standalone asset on the GitHub release (falling back to the latest existing one if this version has none yet, same as the update script). `eh-manager` fetches this asset directly — before downloading the (much larger) release tarball — to check CPU/memory (warnings) and minimum Ubuntu/Node versions (hard requirements). Fields:

```json
{
  "cpuCores": 2,
  "memoryGb": 4,
  "ubuntuVersion": ">=22.4.0",
  "nodeVersion": ">=22.0.0"
}
```

`ubuntuVersion` and `nodeVersion` are checked with [`semver.satisfies()`](https://github.com/npm/node-semver#ranges), so they take a semver range, not just a bare version — e.g. `">=22.0.0 <24.0.0"` to also cap the maximum. A bare version like `"22.0.0"` means an *exact* match, so always use a range operator (`>=`, `^`, etc.) unless you really mean to pin an exact version.

Add a new file here only when the minimum requirements actually change for a release.

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
