# Epic Host Documentation
### System and EHM Installation Steps
1. [Nginx Installation](installation/nginx-installation.md) 
2. [Docker Installation](installation/docker-installation.md)
3. [EH Services Installation](installation/eh-services-Installation.md)
3. [ehm-api Installation](installation/ehm-api-installation.md)
4. [ehm-ui Installation](installation/ehm-ui-installation.md)

### ECP Installation
1. [Build ECP Image](https://github.com/nahidacm/ecp-docker/blob/main/README.md)

### Release new version
https://github.com/EpicLabs23/ehm-release

### Updated Existing system
1. Login to the client server with root.
2. Git pull in EHM-API and EHM-UI.
3. Compile and run the the EHM-API and EHM-UI.
4. Docker pull latest ECP image.

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