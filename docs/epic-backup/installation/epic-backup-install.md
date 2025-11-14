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

> > > > In-me"... is not valid JSON

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

`--apiurl` may seem confusing, because now, this is the `baseUrl`. In productionfrontend and backend both are running in same port, api is jsut with a prefix `/api`

### Create first Admin user

```bash
node /epiclabs23/eh/epic-backup/<version>/epic-backup-api/dist/prisma/create-admin.mjs
```

Example:

```bash
node /epiclabs23/eh/epic-backup/0.0.1/epic-backup-api/dist/prisma/create-admin.mjs
```

# Update epic-backup-api production version

```bash
sudo su
eh-manager update-epic-backup
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
