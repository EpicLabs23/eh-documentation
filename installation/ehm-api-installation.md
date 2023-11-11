# EHM Installation
#### Install depenent softwares
[Ref: ](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-22-04#option-3-installing-node-using-the-node-version-manager)

```bash
sudo su
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install v20.9.0
npm install --global yarn
mkdir -p /epiclabs23/eh/ehm
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
