---
sidebar_position: 1
---

# System Setup

## Quota setup on ext4

:::warning
Tested on Ubuntu 24.04 with ext4. Needs Linux kernel 4.4 or newer.

On Contabo's Ubuntu 24.04 images you can run the ready-made script instead: see step 2 of [Install on a fresh server](../getting-started/install-on-a-fresh-server.md).
:::

EHM limits each account's disk use with ext4 user quotas, so quotas must be on before you create accounts.



Reference: https://www.tecmint.com/set-filesystem-disk-quotas-on-ubuntu/

### 1. Install quota tools

```bash
sudo apt update
sudo apt install quota
```


### Installing the Module for Quota Kernel

For those running a **cloud-based virtual system**, the default Ubuntu installation may be missing the kernel modules that support the use of quota. You must confirm using the find tool and ensure that the two modules, quota_v1, and quota \_v2, are inside the /lib/modules directory.

```bash
find /lib/modules/`uname -r` -type f -name '*quota_v*.ko*'
```

Expected output is something like:

```bash
/lib/modules/6.8.0-90-generic/kernel/fs/quota/quota_v2.ko.zst
/lib/modules/6.8.0-90-generic/kernel/fs/quota/quota_v1.ko.zst
```

Do not worry about the kernel versions as long as the two modules are present. If not found, use the following command to install quota kernel modules as shown.

```bash
apt install linux-image-extra-virtual
```

### 2. Enable quotas in `/etc/fstab`

Edit:

```bash
sudo nano /etc/fstab
```

Find your main filesystem line (e.g. `/dev/sda1` or `/`) and add `usrquota,grpquota` to the mount options:

```
UUID=xxxx-xxxx  /  ext4  defaults,usrquota,grpquota  0  1
```

Then remount:

```bash
sudo mount -o remount /
```


### 3. Create quota files

```bash
sudo quotacheck -cum /
```

Creates:

```
/aquota.user
```


### 4. Turn quotas on

```bash
sudo quotaon -v /
```

Output should say:

```
/dev/sda1 [/]: user quotas turned on
```


### 5. Verify quotas are active

```bash
sudo repquota -a
```

or for one user:

```bash
sudo quota -u username
```


### 6. (Optional) Set a user quota by hand

```bash
sudo setquota -u username 2000000 2500000 0 0 /
```

(soft = 2 GB, hard = 2.5 GB)


### 7. View a user's quota

```bash
quota -u username
```

---

Helpful commands for debugging:

```bash
df -Th # show file system type and mount point
lsblk # list block devices
fdisk -l # list partitions
lsattr # list file attributes
edquota # list project quota
setquota # set project quota
repquota # show project quota
du -sh # show disk usage
quotaon -ap # show quota status
```

## Dependencies

```bash
sudo apt update
sudo apt install -y build-essential
```

### Zip - Unzip

```bash
apt install zip -y
apt install unzip -y
```

### Wget

```bash
apt install wget -y
```

### Host Benchmark (sysbench, fio)

Powers the on-demand host benchmark under Resource Monitor -> Benchmark in EHM (CPU, memory, and disk I/O tests used to detect an oversold/noisy-neighbor host). Optional — if skipped, those specific tests show as "not installed" but the rest of EHM works normally.

```bash
sudo apt update
sudo apt install -y sysbench fio
```

### Database clients (import & restore)

EHM runs the database command-line clients on the host for the control
panel's database **Import** and **Restore** features. These run the clients
in a hardened mode, so specific versions are required — with an older or
missing client, import/restore is refused (the rest of EHM works normally,
and EHM logs a clear warning at startup saying which client to fix).

- **MariaDB client** — required (MySQL import/restore use its `--sandbox`
  option, which the Oracle MySQL client does not have):

  ```bash
  sudo apt install -y mariadb-client
  ```

- **PostgreSQL client 18** — required only if you offer PostgreSQL to
  accounts. It must be new enough to have the `\restrict` command
  (PostgreSQL 18, or an August-2025-or-later minor of 17/16/15/14/13).
  Ubuntu's default `postgresql-client` is usually too old, so install 18
  from the PostgreSQL apt repository, matching the PostgreSQL server version
  EHM uses:

  ```bash
  sudo apt install -y curl ca-certificates
  sudo install -d /usr/share/postgresql-common/pgdg
  sudo curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc \
    --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc
  echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] \
    https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
    | sudo tee /etc/apt/sources.list.d/pgdg.list
  sudo apt update
  sudo apt install -y postgresql-client-18
  ```

  Confirm `psql --version` reports 18.x (or a supported back-patched minor).

### Create a non-root `ehm` user

```bash
useradd ehm
```

## Install Node.js using nvm {#install-nodejs-using-node-version-manager-nvm}

EHM needs Node.js 24 or newer.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 24
```

EHM runs under PM2 and serves its UI with `serve`.

## Install PM2

```bash
npm install -g pm2
```

```bash
pm2 startup
```

## Install Static web server

```bash
npm install -g serve
```
