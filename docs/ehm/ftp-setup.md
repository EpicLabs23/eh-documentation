---
sidebar_position: 10
---

# FTP Setup
If you like to provide FTP support for your customers, you can install and configure FTP server.

Currently it does not have any dependency on EHM or vice versa.

### Install vsFTP
```bash
sudo su
apt update
apt install vsftpd
```

### Configuration to Set Custom Root Directories
1. Backup the default configuration:
```bash
cp /etc/vsftpd.conf /etc/vsftpd.conf.bak
```

2. Edit the configuration file:
```bash
vim /etc/vsftpd.conf
```
Modify or add these settings:
```bash
anonymous_enable=NO

# Allow local users to log in
local_enable=YES
write_enable=YES

# Lock users in their home directories
chroot_local_user=YES
allow_writeable_chroot=YES

# Define a custom home directory for users
user_sub_token=$USER
local_root=/home/$USER/ecp/homedir

# Enable passive mode (required for some FTP clients)
pasv_enable=YES
pasv_min_port=40000
pasv_max_port=50000
```

3. Restart the FTP server:
```bash
systemctl restart vsftpd
systemctl enable vsftpd
```


## Security setup (Optional)
To enhance the security of your **vsFTP (Very Secure FTP Daemon)** configuration, follow these steps:

---

## **3. Secure VSFTP Configuration**
Edit the **vsftpd.conf** file:
```bash
sudo nano /etc/vsftpd.conf
```
Update or add the following settings:

### **Basic Security Settings**
```ini
anonymous_enable=NO         # Disable anonymous login
local_enable=YES            # Allow local users to login
write_enable=YES            # Allow file uploads
chroot_local_user=YES       # Restrict users to their home directory
allow_writeable_chroot=YES  # Allow writing inside chroot
```

### **Passive Mode & Firewall Configuration**
To allow Passive Mode, add:
```ini
pasv_enable=YES
pasv_min_port=40000
pasv_max_port=50000
```
Then, allow these ports in the firewall:
```bash
sudo ufw allow 40000:50000/tcp
```

### **Limit Number of Connections**
```ini
max_clients=10       # Maximum simultaneous clients
max_per_ip=2         # Max connections per IP
```

### **Disable FTP Commands That Can Be Exploited**
```ini
deny_email_enable=YES
banned_email_file=/etc/vsftpd.banned_emails
```
Create the banned email list:
```bash
sudo nano /etc/vsftpd.banned_emails
```
Add unwanted email addresses.

---

## **4. Secure with SSL/TLS**
Enable encryption to prevent passwords from being sent in plain text.

### **Generate SSL Certificate**
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/vsftpd.pem -out /etc/ssl/private/vsftpd.pem
```

### **Configure VSFTP for SSL**
Add to **vsftpd.conf**:
```ini
ssl_enable=YES
rsa_cert_file=/etc/ssl/private/vsftpd.pem
rsa_private_key_file=/etc/ssl/private/vsftpd.pem
ssl_tlsv1=YES
ssl_sslv2=NO
ssl_sslv3=NO
require_ssl_reuse=NO
force_local_logins_ssl=YES
force_local_data_ssl=YES
```

---

## **5. Restart and Enable VSFTP**
```bash
sudo systemctl restart vsftpd
sudo systemctl enable vsftpd
```

---

## **6. Test Your FTP Server**
Test using **FileZilla** or **lftp**:
```bash
lftp -u your_ftp_user ftp://your-server-ip
```

---

## **7. Additional Hardening (Optional)**
- **Disable root login:** Ensure **root** cannot use FTP.
  ```bash
  echo "root" | sudo tee -a /etc/ftpusers
  ```
- **Use Fail2Ban to prevent brute force attacks:**
  ```bash
  sudo apt install fail2ban -y
  ```

---

### ✅ **Your VSFTP server is now secure!**