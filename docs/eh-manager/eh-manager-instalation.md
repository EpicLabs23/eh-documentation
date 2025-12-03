---
sidebar_position: 2
---

# Install

## Pre-requisite

1. [Install NodeJS](https://docs.ecpanel.io/ehm/system-setup#install-nodejs-using-node-version-manager-nvm)

2. Install EH-Manager

```bash
sudo su
```

```bash
cd /epiclabs23/eh
```

```bash
git clone https://nahidacm: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@github.com/EpicLabs23/eh-manager.git
```

```bash
cd /epiclabs23/eh/eh-manager
```

```bash
npm install
```

```bash
npm link
```

## Example Usage

### Interactive use

```bash
sudo su
eh-manager install-ehm
eh-manager update-epic-backup
```

### Non-interactive use

```bash
sudo su
eh-manager install-ehm -v v0.0.1 --dbpass drootp --apiurl http://localhost:2326 --os 24.04
eh-manager update-epic-backup --apiurl http://localhost:2333 --targetDir /epiclabs23/eh-prod/epic-backup --newversion 0.0.1
```
