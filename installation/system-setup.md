##### Quota
Ref.: https://www.digitalocean.com/community/tutorials/how-to-set-filesystem-quotas-on-ubuntu-20-04

Skip step 2 of the reference

Installing on bare-meta ubuntu server 22.04

```bash
# Installing the Quota Tools
sudo su
apt update
apt install quota -y
quota --version

# Updating Filesystem Mount Options
vim /etc/fstab
# Add usrquota option to the mount point /. for example, update following line:
# /dev/disk/by-id/dm-uuid-LVM-wuyD4BzwAnaGztJ6frKFDjKjdgSCviOpA67WhOOLR7DkB8n1TxeOoWeXALpZpzbj / ext4 defaults 0 1
# With
# /dev/disk/by-id/dm-uuid-LVM-wuyD4BzwAnaGztJ6frKFDjKjdgSCviOpA67WhOOLR7DkB8n1TxeOoWeXALpZpzbj / ext4 defaults,usrquota 0 1
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

##### Zip - Unzip
```bash
apt install zip -y
apt install unzip -y
```