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
```
### Quota (Obsolated)
Ref.: 
https://www.digitalocean.com/community/tutorials/how-to-set-filesystem-quotas-on-ubuntu-20-04

:::tip
User Quota is highly dependent on the file system and OS version.

Taking help from ChatGPT to install quota tools is a very good idea.

Example: https://chatgpt.com/share/67886a9a-5d74-8000-99ee-eaa8388475c4
:::

#### Quota setup on ubuntu 24.04
```bash
sudo cp /etc/fstab /etc/fstab.bak
vim /etc/fstab
# Add usrquota option to the mount point /. for example, update following line:
# /dev/disk/by-id/dm-uuid-LVM-wuyD4BzwAnaGztJ6frKFDjKjdgSCviOpA67WhOOLR7DkB8n1TxeOoWeXALpZpzbj / ext4 defaults 0 1
# With
# /dev/disk/by-id/dm-uuid-LVM-wuyD4BzwAnaGztJ6frKFDjKjdgSCviOpA67WhOOLR7DkB8n1TxeOoWeXALpZpzbj / ext4 defaults,usrquota 0 1
sudo mount -o remount /

# Enabling Quotas
quotacheck -um /
quotaon -v /
repquota -s /
```
Installing on bare-meta ubuntu server 22.04

```bash
# Installing the Quota Tools
sudo su
apt update
apt install quota -y
quota --version

# Updating Filesystem Mount Options
cp /etc/fstab /etc/fstab.bak
vim /etc/fstab
# Add usrquota option to the mount point /. for example, update following line:
# /dev/disk/by-id/dm-uuid-LVM-wuyD4BzwAnaGztJ6frKFDjKjdgSCviOpA67WhOOLR7DkB8n1TxeOoWeXALpZpzbj / ext4 defaults 0 1
# With
# /dev/disk/by-id/dm-uuid-LVM-wuyD4BzwAnaGztJ6frKFDjKjdgSCviOpA67WhOOLR7DkB8n1TxeOoWeXALpZpzbj / ext4 defaults,usrquota 0 1
# If the /etc/fstab contents look different ask ChatGpt with the file content and ask how do you add usrquota

mount -o remount /

# Enabling Quotas
quotacheck -um /
quotaon -v /
repquota -s /
```

Installing on Contabo cloud server ubuntu server 20.04
```bash
# Installing the Quota Tools
sudo su
apt update
apt install quota -y
quota --version

# Updating Filesystem Mount Options
vim /etc/fstab
# Add usrquota option to the mount point /. for example, update following line:
# UUID=02328cc3-b55a-428a-8176-572b596997c6 /               ext4    errors=remount-ro 0       0
# With
# UUID=02328cc3-b55a-428a-8176-572b596997c6 /               ext4    usrquota,errors=remount-ro 0       0
mount -o remount /

# Enabling Quotas
quotacheck -um /
quotaon -v /
repquota -s /
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