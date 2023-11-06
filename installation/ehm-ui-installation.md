### ehm-ui DEV
#### Installation
```bash
cd /epiclabs23/eh/ehm
git clone https://nahidacm:github.com/nahidacm/ehm-ui.git
cd /epiclabs23/eh/ehm/ehm-ui
yarn install
cp .env.sample .env
## Now update .env variables accordingly
```
#### Run in dev mode
```bash
PORT=2325 yarn start
```
OR with pm2
```bash
./run.sh
```
#### Run in production mode
```bash
yarn build
```
@ToDO Write detail production document later