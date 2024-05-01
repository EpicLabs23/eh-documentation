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