---
sidebar_position: 2
---

# Install MariaDB

```bash
cd /epiclabs23/eh/eh-services/mariadb
# Create .env file and change password in .env
cp .env.sample .env
docker compose up -d
```