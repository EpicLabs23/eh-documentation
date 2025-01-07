---
sidebar_position: 2
---

# API Installation

## Install epic-backup-api production version

```bash
# Create the directory if it does not exist
mkdir -p /epiclabs23/eh/epic-backup/epic-backup-api
cd /epiclabs23/eh/epic-backup/epic-backup-api

# Run from Local to upload the built files.
scp /epiclabs23/eh/epic-backup/epic-backup-api/epic-backup-api-0.0.1.tar.gz root@84.247.150.42:/epiclabs23/eh/epic-backup/epic-backup-api/

# In remote server extract the tar.gz file
tar -xvzf epic-backup-api-0.0.1.tar.gz

#Make necessary changes in .env

# Install dependencies
npm install --omit=dev

# npx prisma generate --schema=./dist/prisma/schema.prisma
npx prisma db push --schema=./dist/prisma/schema.prisma
# Run the seed
node dist/prisma/seed.js

pm2 delete epic-backup-api
pm2 start "node dist/main" --name epic-backup-api
```

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