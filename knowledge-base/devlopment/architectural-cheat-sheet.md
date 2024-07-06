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

### External hosts
```bash
host.docker.internal:host-gateway,
mysql-db.server:172.1.0.6,
```