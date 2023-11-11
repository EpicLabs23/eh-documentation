# Epic Host Documentation
### Installation Steps
1. [Nginx Installation](installation/nginx-installation.md) 
2. [Docker Installation](installation/docker-installation.md)
3. [ehm-api Installation](installation/ehm-api-installation.md)
4. [ehm-ui Installation](installation/ehm-ui-installation.md)

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
ecp-api uses port:
ecp-ui uses port: