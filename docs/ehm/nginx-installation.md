---
sidebar_position: 2
---

# Nginx Intallation
Nginx is required for Epic Host to map domains with user applications.

#### Installation
```bash
sudo su
apt update
apt install nginx -y
```

#### Configuration
##### Include configuration directory of EHM accounts' server blocks
Add following line in `/etc/nginx/nginx.conf` file. This should be very last line of `http` block.
```bash
.......
.......
http{
    ##
    # Virtual Host Configs
    ##
    ................
    ................
    include /etc/nginx/epiclabs23/*/sites_enabled/*.conf;
}
```
Now Restart the nginx service `service nginx restart`

##### Generate self signed certificates to use as default certificate for ECP
Refference Guide: https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu

Creating TLS Certificate:
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout /etc/ssl/private/nginx-selfsigned.key \
            -out /etc/ssl/certs/nginx-selfsigned.crt \
            -subj "/C=BD/ST=Dhaka/L=Dhaka/O=EpicLabs23/OU=EpicLabs"
```
Create a strong Diffie-Hellman (DH):
```bash
openssl dhparam -out /etc/nginx/dhparam.pem 4096
```
Creating a Configuration Snippet with Strong Encryption Settings:

Create a file named `/etc/nginx/snippets/ssl-params.conf` with following contents:
```conf
ssl_protocols TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_dhparam /etc/nginx/dhparam.pem; 
ssl_ciphers EECDH+AESGCM:EDH+AESGCM;
ssl_ecdh_curve secp384r1;
ssl_session_timeout  10m;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
# Disable strict transport security for now. You can uncomment the following
# line if you understand the implications.
#add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
```
#### Install certbot
```bash
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```