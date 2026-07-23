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

#### 13. Install EH-Manager

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

#### 14. Prepare domains

- Decide the domain name you want use to access EHM.
- Point the domain to this server IP.

#### 15. Install Epic Backup

```bash
eh-manager install-epic-backup
```
