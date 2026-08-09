---
sidebar_position: 2
---

# Install in a fresh server

These are the exact steps I did to install EHM and related services in folloing server

```txt
Provider: Contabo
Description: Cloud VPS 40 NVMe (no setup)
Disk Space: 250 GB
CPU cores: 12
RAM: 48 GB
OS: Ubuntu 24.04.4 LTS
```

#### 1. Log into SSH terminal

```bash
ssh root@<server-ip>
```

#### 2. Enable user quota

```bash
curl -fsSL https://raw.githubusercontent.com/EpicLabs23/ecp-ehm-free/refs/heads/main/data/ehm/enable_user_quota_contabo_ubuntu_24.sh | bash
```

#### 3. Install NodeJS

Install NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

```bash
source ~/.bashrc
```

```bash
nvm install v24.13.0
```

Close and reopen your terminal to start using nvm.

#### 4. Install PM2

```bash
npm install -g pm2
```

```bash
pm2 startup
```

#### 5. Install static web server

```bash
npm install -g serve
```

#### 6. Nginx Intallation

```bash
apt update
```

```bash
apt install nginx -y
```

Include configuration directory of EHM accounts' server blocks

Add following line in `/etc/nginx/nginx.conf` file. This should be very last line of `http` block.

```bash
vim /etc/nginx/nginx.conf
```

```bash
.......
.......
http{
    ##
    # Virtual Host Configs
    ##
    ................
    ................
    include /etc/nginx/epiclabs23/*/sites_enabled/*.conf;
}
```

Now Restart the nginx service

```bash
service nginx restart
```

Generate self signed certificates to use as default certificate for ECP

Refference Guide: https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu

Creating TLS Certificate:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout /etc/ssl/private/nginx-selfsigned.key \
            -out /etc/ssl/certs/nginx-selfsigned.crt \
            -subj "/C=BD/ST=Dhaka/L=Dhaka/O=EpicLabs23/OU=EpicLabs"
```

Create a strong Diffie-Hellman (DH):

```bash
openssl dhparam -out /etc/nginx/dhparam.pem 2048
```

Creating a Configuration Snippet with Strong Encryption Settings

```bash
vim /etc/nginx/snippets/ssl-params.conf
```

File content:

```conf
ssl_protocols TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_dhparam /etc/nginx/dhparam.pem;
ssl_ciphers EECDH+AESGCM:EDH+AESGCM;
ssl_ecdh_curve secp384r1;
ssl_session_timeout  10m;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
# Disable strict transport security for now. You can uncomment the following
# line if you understand the implications.
#add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
```

#### 7. Install certbot

```bash
snap install --classic certbot
```

```bash
ln -s /snap/bin/certbot /usr/bin/certbot
```

#### 8. Docker Installation

```bash
apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl status docker
```

Add user to docker group

```bash
usermod -aG docker ${USER}
su - ${USER}
```

#### 9. Install EH Services

Download source codes

```bash
git clone https://github.com/EpicLabs23/eh-services.git /epiclabs23/eh/eh-services
```

Create Docker network

```bash
docker network create eh_network --subnet=172.1.0.0/16
```

#### 10. Install MariaDB

```bash
cd /epiclabs23/eh/eh-services/mariadb
```

Create .env file

```bash
cp .env.sample .env
```

Set Mariadb root password in .env

```bash
vim .env
```

Run the container

```bash
docker compose up -d
```

#### 11. Install PhpMyAdmin

```bash
cd /epiclabs23/eh/eh-services/phpmyadmin
```

Create .env file

```bash
cp .env.sample .env
```

And make changes if required

```bash
vim .env
```

Run the container

```bash
docker compose up -d
```

#### 12. Install Redis

```bash
cd /epiclabs23/eh/eh-services/redis
```

Enable memory overcommit

```bash
sysctl vm.overcommit_memory=1 && echo "vm.overcommit_memory = 1" | tee -a /etc/sysctl.conf && sysctl vm.overcommit_memory
```

Run the container

```bash
docker compose up -d
```

#### 13. Install InfluxDB

InfluxDB stores container CPU/memory/network time series metrics (`DockerMetricsService` in EHM API). This step is optional — EHM works without it, but historical metrics graphs and time-series queries require it. The container must be named `influxdb` — `eh-manager install-ehm`/`update-ehm` (step 17) exec into it by that name to create the admin token.

```bash
cd /epiclabs23/eh/eh-services/influxdb
```

Run the container

```bash
docker compose up -d
```

That's it for this step — leave the database/token creation to `eh-manager`. When you get to step 17 (`eh-manager install-ehm`), it will prompt **"Enable InfluxDB metrics history?"**; answer yes (or pass `--influx true`) and it creates the admin token and writes `INFLUX_METRICS_ENABLED=true` + `INFLUXDB_TOKEN` into EHM API's `.env` for you. The `ecp_metrics` database itself is created automatically on first write by `DockerMetricsService`, so it does not need to be created up front. If you skip this step entirely, just answer no (or omit `--influx`) at that prompt and EHM runs without Influx.

#### 14. Install EH-Manager

```bash
git clone https://github.com/EpicLabs23/eh-manager.git /epiclabs23/eh/eh-manager
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

#### 15. Prepare domains

- Decide the domain name you want use to access EHM.
- Point the domain to this server IP.

#### 16. Install Epic Backup

```bash
eh-manager install-epic-backup
```

#### 17. Install EHM

```bash
eh-manager install-ehm
```

#### 18. Enable https for ehm url

Replace `<your-ehm-domain>` below with the domain you pointed at this server in step 15.

Make sure the domain points to this server.

Create a bare server block for the domain first — certbot's nginx plugin needs an existing `server_name` match on port 80 to insert the ACME challenge into:

```bash
vim /etc/nginx/conf.d/<your-ehm-domain>.conf
```

```conf
server {
    listen 80;
    server_name <your-ehm-domain>;
}
```

```bash
nginx -t && service nginx reload
```

Request the certificate

```bash
certbot certonly --nginx -m <your-email> --agree-tos --no-eff-email -d <your-ehm-domain>
```

This issues the certificate to `/etc/letsencrypt/live/<your-ehm-domain>/{fullchain.pem,privkey.pem}`. Now replace the file's contents with the final config: redirect `80` to `443`, and terminate SSL for both the UI (`2325`) and the API/websocket (`2326`) behind a single domain, using the `/api` path prefix for API traffic:

```bash
vim /etc/nginx/conf.d/<your-ehm-domain>.conf
```

```conf
server {
    listen 80;
    server_name <your-ehm-domain>;

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name <your-ehm-domain>;

    ssl_certificate /etc/letsencrypt/live/<your-ehm-domain>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<your-ehm-domain>/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;

    client_max_body_size 1024M;

    # EHM API websocket (events gateway)
    location /socket.io/ {
        proxy_pass http://127.0.0.1:2326;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # EHM API
    location /api/ {
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://127.0.0.1:2326/;
    }

    # EHM UI
    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://127.0.0.1:2325;
    }
}
```

```bash
nginx -t && service nginx reload
```

#### 19. Create first Admin user

```bash
node /epiclabs23/eh/ehm/<version>/ehm-api/prisma/create-admin.mjs
```

#### 20. Configure EHM admin panel

Left Side Menu -> Config -> General Settings -> Public IP

Left Side Menu -> Config -> General Settings -> DNS Settings -> Default DNS Server

Left Side Menu -> Config -> General Settings -> Email Settings
