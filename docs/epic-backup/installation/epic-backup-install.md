---
sidebar_position: 2
---

# Epic Backup Installation

## Install epic-backup-api production version

**Pre-requisite:** [Install eh-manager](../../eh-manager/eh-manager-instalation)

:::warning
During dependency installation, if installer gets stuck or shows error, try running the command again.
:::
:::warning
if you see following error:

✖ Error: Unexpected token '>', "
>>>> In-me"... is not valid JSON

Run this command: `pm2 update`
:::


### Interactive Installation
```bash
sudo su
eh-manager install-epic-backup
```

### Non-interactive Installation
```bash
sudo su
eh-manager install-epic-backup --version 0.0.1 --apiurl http://localhost:2330 --targetDir /epiclabs23/eh-prod/epic-backup
```
`--targetDir` is optional default value is `/epiclabs23/eh/epic-backup`

### Create first Admin user
```bash
node <path-to-epic-backup-api>/dist/prisma/create-admin.mjs
```
:::info
Default path-to-epic-backup-api is `/epiclabs23/eh/epic-backup/<version>/epic-backup-api`

Ex: `/epiclabs23/eh/epic-backup/0.0.1/epic-backup-api`
:::

### Access the UI
By default frontend runs on port `2331` e.g: `http://localhost:2331`

If your firewall does not allow you to access port `2330` and `2331` then you can create 2 subdomain and use nginx proxy_pass to map the ports. 

# Update epic-backup-api production version
@ToDo: Following is a temporary installation solution. We will automate this process in the future. That will let user update from UI. Currently it does not have any relation with the release script

```bash
# Keep backup of .env and database.db file
# Delete everything else from /epiclabs23/eh/epic-backup/epic-backup-api
# Upload and extract the code as per above
# Restore the .env and database.db file
# then continue from Installation section
```

## Dev Installation
This application must run as `root`
```bash
cd /epiclabs23/eh/epic-backup
git clone https://github.com/nahidacm/epic-backup-api.git
cd /epiclabs23/eh/epic-backup/epic-backup-api
npm install
cp .env-sample .env
npx prisma db push
npm run start:dev
```

# Troubleshooting
(In backend) AxiosError: Request failed with status code 401
probably rclone is not running or the username or password is wrong