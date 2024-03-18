# Epic Host Documentation
### System and EHM Installation Steps
1. [Nginx Installation](installation/nginx-installation.md) 
2. [Docker Installation](installation/docker-installation.md)
3. [EH Services Installation](installation/eh-services-Installation.md)
3. [ehm-api Installation](installation/ehm-api-installation.md)
4. [ehm-ui Installation](installation/ehm-ui-installation.md)

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

**PhpMyAdmin:**
Running on docker container.
With local IP: `172.1.0.5`
Mapped with host port: `2329`

**EHM:**
Runs on host machine.
ehm-api uses port: `2326`
ehm-ui uses port: `2325`

**ECP:**
Runs on docker conainer.
ecp-api uses port: `2324`
ecp-ui uses port: `2323`