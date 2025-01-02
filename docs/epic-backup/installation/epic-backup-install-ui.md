---
sidebar_position: 3
---

# UI Installation

### Build

```bash
mkdir -p /epiclabs23/eh/epic-backup/epic-backup-ui
cd /epiclabs23/eh/epic-backup/epic-backup-ui
npm install

# Update the .env.production file

npm run build
tar -czvf epic-backup-ui-0.0.1.tar.gz build
# Run from local to upload the built files.
scp /epiclabs23/eh/epic-backup/epic-backup-ui/epic-backup-ui-0.0.1.tar.gz root@84.247.150.42:/epiclabs23/eh/epic-backup/epic-backup-ui/

# extract the tar.gz file
tar -xvzf epic-backup-ui-0.0.1.tar.gz
npm install -g serve
pm2 delete epic-backup-ui
pm2 start "serve -s build -l 2332" --name epic-backup-ui
```

### Update epic-backup-ui production version
- Build the code as per above
- Delete everything else from /epiclabs23/eh/epic-backup/epic-backup-ui
- Upload and extract the code as per above
- Run the build as per above