---
sidebar_position: 6
---

# Install EHM

### Pre-requisite

1. [System Setup](./system-setup)
2. [Nginx Installation](./nginx-installation)
3. [Docker Installation](./docker-installation)
4. [EH Services Installation](../eh-services/intro)
5. [MariaDB Installation](../eh-services/install-mariadb)
6. [PhpMyAdmin Installation](../eh-services/install-phpmyadmin)
7. [EH Manager Installation](../eh-manager/eh-manager-instalation)
8. A domain / subdomain

:::warning
Please ask for the installation details to EpicLabs23
:::

### Interactive Installation

```bash
sudo su
eh-manager install-ehm
```

### Non-interactive Installation

```bash
sudo su
eh-manager install-ehm -v 0.0.1 --dbpass drootp --apiurl http://localhost:2326 --os 24.04
```

### Create first Admin user

```bash
node /epiclabs23/eh/ehm/<version>/ehm-api/prisma/create-admin.mjs
```

Example:

```bash
node /epiclabs23/eh/ehm/0.0.2/ehm-api/prisma/create-admin.mjs
```

### Access EHM UI

`http://<domain>:2325`

### Configure EHM

In EHM UI:

1. `System > Config > General Settings` update `Public IP`.
2. `System > Config > DNS Settings` update `Public IP`.

### Create packages

Go to `Packges > Create Package`

### DNS Setup

1. Go to `System > Config > DNS Settings` and update the `Public IP`
