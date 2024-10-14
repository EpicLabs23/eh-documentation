# EHM Installation
#### Install depenent softwares
[NodeJS Ref](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-22-04#option-3-installing-node-using-the-node-version-manager)

Install Latest LTS version.

```bash
sudo su
apt update
apt install build-essential
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
npm install --global yarn
yarn global add pm2
pm2 startup
yarn global add serve
mkdir -p /epiclabs23/eh/ehm
```

### EHM-API & EHM-UI Production
======================================================
```bash
cd /epiclabs23/eh/ehm
git clone https://github.com/EpicLabs23/ehm-installer.git
cd ehm-installer
./ehm-update_ubuntu_<OS_version>.sh
# supported ubuntu versions are 20.04, 22.04
```

Seed users:
```bash
cd /epiclabs23/eh/ehm/<ehm-version-number>/ehm-api/dist/prisma
node seed.js
```

### ehm-api DEV
============================================================
##### Installation
```bash
cd /epiclabs23/eh/ehm
git clone https://github.com/nahidacm/ehm-api.git
cd /epiclabs23/eh/ehm/ehm-api
yarn install
cp .env.sample .env
# Update DB and URLs in .env file
yarn prisma generate
yarn prisma db push
yarn init-data
```
##### Run
This application must run as `root`

```bash
sudo su

# development
yarn start

# watch mode
yarn start:dev

# production mode
yarn start:prod

# Dev With PM2
./run.sh

# Prod With PM2
./run-prod.sh
```

