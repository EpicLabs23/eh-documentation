### ECP Mounted directories
##### For each php version
```bash
Source: `/home/${account_detail.username}/ecp/nginx/php/${version}/fpm/pool.d/zzz-ecp.conf`
Target: `/etc/php/${version}/fpm/pool.d/zzz-ecp.conf`

Source: `/home/${account_detail.username}/ecp/php/${version}/fpm/conf.d/30-ecp.ini`
Target: `/etc/php/${version}/fpm/conf.d/30-ecp.ini`

Source: `/home/${account_detail.username}/ecp/homedir`
Target: `/home/${account_detail.username}`

Source: `/home/${account_detail.username}/ecp/nginx/sites-available`
Target: '/etc/nginx/sites-available'  
```

#### External hosts
```bash
host.docker.internal:host-gateway,
mysql-db.server:172.1.0.6,
```

#### Checking ECP pm2 log
```bash
docker exec -it <container_name> bash
su <ecp_username>
PM2_HOME=/home/<ecp_username>/.pm2ecp pm2 log
```

#### Icrease max upload size
Max upload size controlled in many level, you have update all of them to make it work.
1. Host machine nginx config.
2. Account container nginx config.
3. ECP main.js file.
4. ECP nginx server blocks.
5. For PHP applications, php.ini settings