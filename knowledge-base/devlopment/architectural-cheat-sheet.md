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

### Authentication system
EHM authentication system is regular. But, ECP is complicated.

During the ECP account creation from EHM, we generate an unique personal key for each each account.
We store the key in: `/ehm/userdata/<ecp_username>/personal-key.txt` 
The use of this personal-key:
1. Authentication.
2. Encoding-Decoding.

**Authentication:** this key is identical to the `ECP_JWT_SECRET` in ECP `.env` file. When ECP makes any request to EHM, EHM validates the request using this personal-key.
**Encoding-Decoding:** We store some sensitive data in DB, like MySql password. Those sensitive data are encoded with this personal-key.

This directory also stores SSL certificates of this user in the directory: `/ehm/userdata/<ecp_username>/ssl-certificates/`.

### Required directory structure of the services
#### Dev PC
/epiclabs23/eh
/epiclabs23/eh/ehm
/epiclabs23/eh/ehm/ehm-api
/epiclabs23/eh/ehm/ehm-ui
/epiclabs23/eh/ehm/ehm-release
/epiclabs23/eh/ehm/ehm-installer

/epiclabs23/eh/ecp
/epiclabs23/eh/ecp/ecp-api
/epiclabs23/eh/ecp/ecp-ui
/epiclabs23/eh/ecp/ecp-docker

/epiclabs23/eh/eh-services
/epiclabs23/eh/oneclick-apps

#### Live server
/epiclabs23/eh
/epiclabs23/eh/ehm
/epiclabs23/eh/ehm/ehm-api
/epiclabs23/eh/ehm/ehm-ui
~/ehm-installer

/epiclabs23/eh/ecp
/epiclabs23/eh/ecp/ecp-api
/epiclabs23/eh/ecp/ecp-ui

/epiclabs23/eh/eh-services
/epiclabs23/eh/oneclick-apps
