## eh-services Instalation

#### Description
The service includes `Mariadb` and `PhpMyAdmin` for now.
This `Maridb` is mostly used by the`EHM`.
And this `PhpMyAdmin` is using by `EHM` to access DB as root. `ECP` accounts also uses this very same `PhpMyAdmin` to access datbase server inside `ECP` containers.

This `Mariadb` and `PhpMyAdmin` are running in seperate container but same network with fixed local IP.

#### Installation

```bash
sudo su
mkdir -p /epiclabs23/eh
```

#### Mariadb Installation in DEV environment
```bash
cd /epiclabs23/eh/eh-services
git clone https://github.com/EpicLabs23/eh-services.git
cd /epiclabs23/eh/eh-services/mariadb
cp .env.sample .env
docker network create \
  --driver=bridge \
  --subnet=172.1.0.0/16 \
  --gateway=172.1.255.254 \
  eh_network
docker compose up -d
```

#### Mariadb Installation in Production environment
In production, use `docker run` with the parameters in the `docker-compose.yml` file.

#### PhpMyAdmin Installation in DEV environment
```bash
cd /epiclabs23/eh/eh-services/phpmyadmin
cp .env.sample .env
docker compose up -d
```