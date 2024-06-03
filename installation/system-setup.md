##### Quota
Ref.: https://www.digitalocean.com/community/tutorials/how-to-set-filesystem-quotas-on-ubuntu-20-04

Skip step 2 of the reference

Installing on bare-meta ubuntu server 22.04

```bash
# Installing the Quota Tools
sudo su
apt update
apt install quota
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

##### Zip - Unzip
```bash
apt install zip
apt install unzip
```