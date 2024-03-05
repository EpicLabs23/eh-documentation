# EHM Installation
#### Install depenent softwares
[NodeJS Ref](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-22-04#option-3-installing-node-using-the-node-version-manager)

Install Latest LTS version.

```bash
sudo su
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install v20.10.0
npm install --global yarn
yarn global add pm2
yarn global add serve
mkdir -p /epiclabs23/eh/ehm
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
yarn prisma db push
yarn prisma db seed
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
### ehm-api & ehm-ui Production
======================================================
Production / Release documentation avalable in: https://github.com/EpicLabs23/ehm-release
