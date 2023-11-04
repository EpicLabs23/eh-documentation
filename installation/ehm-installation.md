# EHM Installation
```bash
mkdir /epiclabs23/eh/ehm
npm install --global yarn
```
### ehm-api DEV
#### Installation
```bash
cd /epiclabs23/eh/ehm
git clone https://github.com/nahidacm/ehm-api.git
cd /epiclabs23/eh/ehm/ehm-api
yarn install
cp .env.sample .env
yarn prisma db push
yarn prisma db seed
```
#### Run
This application must run as `root`

[Install `NVM`, `NodeJS 18` and `Yarn` using `nvm` for `root` user (if needed)](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-22-04#option-3-installing-node-using-the-node-version-manager)

```bash
sudo su

# development
yarn start

# watch mode
yarn start:dev

# production mode
yarn start:prod

# With PM2
./run.sh
```
### ehm-api installation in Productoin environment
Build the application, and make the easy intallation.
Detail documentaion in @ToDo
