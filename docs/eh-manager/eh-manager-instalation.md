---
sidebar_position: 2
---

# Install

## Pre-requisite

Node.js 24 or newer (see [System setup](../ehm/system-setup#install-nodejs-using-node-version-manager-nvm)).

## Install EH-Manager

```bash
sudo su
```

```bash
cd /epiclabs23/eh
```

```bash
git clone https://github.com/EpicLabs23/eh-manager.git
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
eh-manager update-ehm
```

### Non-interactive use

```bash
sudo su
eh-manager install-ehm -v <version> --dbpass <mariadb-root-password> --apiurl http://localhost:2326 --os 24.04 --influx false
eh-manager update-ehm -v <version> --dbpass <mariadb-root-password> --os 24.04 --influx false
```
