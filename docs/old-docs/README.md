# Old Docs
### System and EHM Installation Steps
1. [System Setup](installation/system-setup.md) 
2. [Nginx Installation](installation/nginx-installation.md) 
3. [Docker Installation](installation/docker-installation.md)
4. [EH Services Installation](installation/eh-services-Installation.md)
5. [ehm-api Installation](installation/ehm-api-installation.md)
6. [ehm-ui Installation](installation/ehm-ui-installation.md)

### ECP Installation
1. [Build ECP Image](https://github.com/nahidacm/ecp-docker/blob/main/README.md)

### Release new EHM version
https://github.com/EpicLabs23/ehm-release

### Releas new ECP version
https://github.com/nahidacm/ecp-docker/blob/main/README.md

### Updated Existing production system
https://github.com/EpicLabs23/ehm-release?tab=readme-ov-file#update

### Services, Ports and IPs
**EH MariDB:** 
Running on docker container.
With local IP: `172.1.0.6`
Mapped with host port: `3306`

**MongoDB**
Running on docker container.
With local IP: `172.1.0.7`
Mapped with host port: `27017`

**PostgreSQL**
Running on docker container.
With local IP: `172.1.0.8`
Mapped with host port: `5432`

**ECP:**
Runs on docker conainer.
ecp-ui uses port: `2323`
ecp-api uses port: `2324`

**EHM:**
Runs on host machine.
ehm-ui uses port: `2325`
ehm-api uses port: `2326`

**PhpMyAdmin:**
Running on docker container.
With local IP: `172.1.0.5`
Mapped with host port: `2329`

**Backup System:**
Rclone rcd uses port: `5572`
Epic backup API uses port: `2330`
Epic backup UI uses port: `2331`

**EH System Monitor:**
Running on docker container.
cAdvisor uses port: 2332
Prometheus uses port: 2333
Grafana uses port: 2334
