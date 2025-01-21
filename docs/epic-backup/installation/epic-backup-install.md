---
sidebar_position: 2
---

# Epic Backup Installation

## Install epic-backup-api production version
Pre-requisite: [Install eh-manager](../../eh-manager/eh-manager-instalation)

:::warning
During dependency installation, if installer gets stuck or shows error, try running the command again.
:::

### Interactive Installation
```bash
sudo su
eh-manager install-epic-backup
```

### Non-interactive Installation
```bash
sudo su
eh-manager install-epic-backup --version 0.0.1 --apiurl http://localhost:2333 --targetDir /epiclabs23/eh-prod/epic-backup
```
`--targetDir` is optional default value is `/epiclabs23/eh/epic-backup`

### Create first Admin user
```bash
node <path-to-epic-backup-api>/prisma/create-admin.mjs
```

### Access the UI
By default this runs on port `2333` e.g: `http://localhost:2333`

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