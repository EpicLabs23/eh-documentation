---
sidebar_position: 1
---

# Depenecy Installation

## Dependencies
- Ubuntu
- Nodejs 20
- PM2
- Rclone
- mysqldump (Optional)
- mariadb-dump (Optional)
- pg_dump (Optional)

:::tip
You may install dependencies manually, using following steps.

Also, you can install automatically during the installation process.

You may skip to the next step for automation [Installation](./epic-backup-install)
:::

### Install Nodejs using Node Version Manager (NVM)
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-22-04#option-3-installing-node-using-the-node-version-manager


This application dpends of PM2 and Rclone

## Install PM2
```bash
npm install -g pm2
```
```bash
pm2 startup
```

## Install Rclone
```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```
Reference: https://rclone.org/install/

## rclon start
:::warning
Set your own user ( `--rc-user` ) and passowd ( `--rc-pass` ) on the command.
:::
```bash
pm2 start "rclone rcd --rc-user=nahid --rc-pass=SwitchKnif --rc-addr=:5572" --name rclone-daemon
pm2 save
```

## mariadb-dump (Optional)
```bash
sudo apt-get install mariadb-client
```

## mysqldump (Optional)
```bash
sudo apt-get install mysql-client
```

## pg_dump (Optional)
```bash
sudo apt-get install postgresql-client
```