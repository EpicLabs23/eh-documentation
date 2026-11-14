---
sidebar_position: 4
---

# Install PhpMyAdmin

```bash
cd /epiclabs23/eh/eh-services/phpmyadmin
```

### Create .env file and make changes if required

```bash
cp .env.sample .env
```

### Run the container

```bash
docker compose up -d
```

phpMyAdmin publishes no port of its own. EHM's Nginx serves it over HTTPS on port `2329` of each
account's primary domain, with that domain's certificate, and ECP's **PhpMyAdmin** link opens it there.
Keep port `2329` open in your firewall and free on the host.

If you install phpMyAdmin after EHM is already running, restart EHM so it sets up the port:

```bash
cd /epiclabs23/eh/ehm/<version>/ehm-api  # your currently installed EHM version
pm2 restart ecosystem.config.js
```
