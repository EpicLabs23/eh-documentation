---
sidebar_position: 2
---

# System Setup

### Quota setup on EXT4

:::warning
Supports on ubuntu >= 24.04

Linux kernel version > 4.4
:::

Here’s a concise summary for **enabling and checking user quotas** on an **Ubuntu 24 Server using ext4** 👇

---

## 🧩 **Enable & Check User Quotas (ext4, Ubuntu 24)**

### Reference: https://www.tecmint.com/set-filesystem-disk-quotas-on-ubuntu/

### **1️⃣ Install quota tools**

```bash
sudo apt update
sudo apt install quota
```

---

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

### **2️⃣ Enable quotas in `/etc/fstab`**

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

---

### **3️⃣ Create quota files**

```bash
sudo quotacheck -cum /
```

Creates:

```
/aquota.user
```

---

### **4️⃣ Turn quotas on**

```bash
sudo quotaon -v /
```

✅ Output should say:

```
/dev/sda1 [/]: user quotas turned on
```

---

### **5️⃣ Verify quotas are active**

```bash
sudo repquota -a
```

or for one user:

```bash
sudo quota -u username
```

---

### **6️⃣ (Optional) Set user quota**

```bash
sudo setquota -u username 2000000 2500000 0 0 /
```

(soft = 2 GB, hard = 2.5 GB)

---

### **7️⃣ View user quota**

```bash
quota -u username
```

---

✅ **Summary:**

1. Install quota tools
2. Add `usrquota` to `/etc/fstab`
3. `quotacheck` to create quota files
4. `quotaon` to activate
5. Use `quota` / `repquota` to check usage

---

Would you like me to add a short script to **automate these steps** for new Ubuntu servers?

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
