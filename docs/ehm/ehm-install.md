---
sidebar_position: 6
---
# Install EHM

### Pre-requisite
- [System Setup](./system-setup)
- [Nginx Installation](./nginx-installation)
- [Docker Installation](./docker-installation)
- [MariaDB Installation](../eh-services/install-mariadb)
- [PhpMyAdmin Installation](../eh-services/install-phpmyadmin)
- [EH Services Installation](../eh-services/intro)
- [EH Manager Installation](../eh-manager/eh-manager-instalation)

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