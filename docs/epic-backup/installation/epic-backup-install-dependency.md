---
sidebar_position: 1
---

# Depenecy Installation

## Dependencies
- Ubuntu
- Nodejs 20
- PM2
- Rclone
- mysqldump
- mariadb-dump
- pg_dump

### Install Nodejs using Node Version Manager (NVM)
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-22-04#option-3-installing-node-using-the-node-version-manager


This application dpends of PM2 and Rclone

## Install PM2
```bash
npm install -g pm2
```

## Install Rclone
```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```
Reference: https://rclone.org/install/

## rclon start
Set you own passowd on the command.
```bash
pm2 start "rclone rcd --rc-user=nahid --rc-pass=SwitchKnif --rc-addr=:5572" --name rclone-daemon
```

## mariadb-dump
```bash
sudo apt-get install mariadb-client
```

## mysqldump
```bash
sudo apt-get install mysql-client
```

## pg_dump
```bash
sudo apt-get install postgresql-client
```