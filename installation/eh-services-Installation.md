## eh-services Instalation

#### Description
The service includes `Mariadb` and `PhpMyAdmin` for now.
This `Maridb` is mostly used by the`EHM`.
And this `PhpMyAdmin` is using by `EHM` and `ECP` to access DB.

This `Mariadb` and `PhpMyAdmin` are running in seperate container but same network with fixed local IP.

#### Installation

```bash
sudo su
mkdir -p /epiclabs23/eh
```

#### Mariadb Installation
```bash
cd /epiclabs23/eh
git clone https://github.com/EpicLabs23/eh-services.git
cd /epiclabs23/eh/eh-services/mariadb
cp .env.sample .env
# Then update .env file accordingly

docker network create \
  --driver=bridge \
  --subnet=172.1.0.0/16 \
  --gateway=172.1.255.254 \
  eh_network
```
**In Dev:** `docker compose up -d`

**In Production:**  
```bash
docker run -d \
  --name ehm-db-container \
  --restart unless-stopped \
  -v ./dbdata:/var/lib/mysql \
  --network eh_network \
  --ip 172.1.0.6 \
  --env-file .env \
  mariadb
```

#### PhpMyAdmin Installation in DEV environment
```bash
cd /epiclabs23/eh/eh-services/phpmyadmin
cp .env.sample .env
# Then update .env file accordingly
```
**In Dev:** `docker compose up -d`

**In Production:**
```bash
docker run -d \
  --name ehm-phpmyadmin \
  --restart unless-stopped \
  -p 2329:80 \
  --env-file .env \
  -e PMA_ARBITRARY=1 \
  --add-host host.docker.internal:host-gateway \
  --network eh_network \
  --network-alias phpmyadmin \
  --ip 172.1.0.5 \
  -v /sessions \
  -v ./config.user.inc.php:/etc/phpmyadmin/config.user.inc.php \
  -v ./ehm-authentication:/var/www/html/ehm-authentication/ \
  -v ./theme/:/www/themes/theme/ \
  phpmyadmin/phpmyadmin:latest
```