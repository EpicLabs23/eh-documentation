---
sidebar_position: 5
---

# Release EHM

### Get ehm-release

```bash
cd /epiclabs23/eh/ehm
git clone https://github.com/EpicLabs23/ehm-release.git
```

### For Ubuntu 24.04

##### Build docker image to build EHM
```bash
cd /epiclabs23/eh/ehm/ehm-release/docker-files/ubuntu-24.04
docker build -t nahidacm/ehm-builder-ubuntu:24.04 -f Dockerfile . 
```
##### Make update script
Copy previous version script from `/epiclabs23/eh/ehm/ehm-release/update-scripts/*_update.sh`
With latest version number in the same directory. Make neccessary updates on the script if needed.

##### Now build EHM and push the to public build server
```bash
sudo su
cd /epiclabs23/eh/ehm/ehm-release
./distribute_ubuntu_24.04.sh
```

Above commands build and push the code to the version repository server. The updater or installer will pull the code from the server.

### For Ubuntu 22.04

##### Build docker image to build EHM
```bash
cd /epiclabs23/eh/ehm/ehm-release/docker-files/ubuntu-22.04
docker build -t nahidacm/ehm-builder-ubuntu:22.04 -f Dockerfile . 
```
##### Make update script
Copy previous version script from `/epiclabs23/eh/ehm/ehm-release/update-scripts/*_update.sh`
With latest version number in the same directory. Make neccessary updates on the script if needed.

##### Now build EHM and push the to public build server
```bash
sudo su
cd /epiclabs23/eh/ehm/ehm-release
./distribute_ubuntu_22.04.sh
```

### For Ubuntu 20.04
***************************************

##### Build docker image to build EHM
```bash
cd /epiclabs23/eh/ehm/ehm-release/docker-files/ubuntu-20.04
docker build -t nahidacm/ehm-builder-ubuntu:20.04 -f Dockerfile . 
```

##### Make update script
Copy previous version script from `/epiclabs23/eh/ehm/ehm-release/update-scripts/*_update.sh`
With latest version number in the same directory. Make neccessary updates on the script if needed.

##### Now build EHM and push the to public build server
```bash
sudo su
cd /epiclabs23/eh/ehm/ehm-release
./distribute_ubuntu_20.04.sh
```



### Installation / Update on live server
**In Live server:**
Follow the instruction here: https://github.com/EpicLabs23/ehm-installer