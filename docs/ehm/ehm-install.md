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
cd /epiclabs23/eh/epic-backup/<version>/epic-backup-api/dist/prisma
node  create-admin.mjs
```
Example: 
```bash 
cd /epiclabs23/eh/ehm/0.0.1/ehm-api/prisma
node create-admin.mjs
```
