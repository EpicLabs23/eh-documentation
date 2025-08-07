---
sidebar_position: 2
---

# System Setup

### Project quota setup on EXT4
:::warning
Supports on ubuntu >= 24.04

Linux kernel version > 4.4
:::

#### Step 1: Enable project quota support in file system
For an existing EXT4 partition, asuming the partition name is `/dev/nvme0n1p2` and mount point is `/`

To enable quota, the partition or device should be in unmounted state.

Since this is mounted in `/` we need a ubuntu bootable USB drive, from that bootable USB drive run ubuntu as "Try Ubuntu" and run the following command

```bash
sudo tune2fs -O quota /dev/nvme0n1p2
sudo tune2fs -Q prjquota /dev/nvme0n1p2
```
Now project quota is enabled on `/dev/nvme0n1p2` partition.

#### Step 2: Set project quota
Enable project quota on mount point
```bash
sudo quotaon -Pv /
```
We need to control `/home` and `/var/lib/docker/..../diff` directories. so, set "P" attribute to these directories recursively. will enforce a hierarchical  structure  for project id's. for detail (man chattr)

```bash
sudo apt install e2fsprogs # for chattr
sudo chattr -R +P /home
```
EHM will set "P" for docker directory.


Rest of the steps, like `quotaon`, project name, project id, project directories these are done by EHM.

Some helpful commands to debug
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

#### Dependencies
```bash
sudo apt update
sudo apt install -y build-essential
```
##### Zip - Unzip
```bash
apt install zip -y
apt install unzip -y
```
##### Wget
```bash
apt install wget -y
```
##### Create a nonroot user to avoid some classic issue that conflicts with ECP user
```bash
useradd ehm
```

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

## Install Static web server
```bash
npm install -g serve
```