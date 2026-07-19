---
sidebar_position: 8
---

# Install Redis

```bash
cd /epiclabs23/eh/eh-services/redis
```

## Enable memory overcommit

```bash
sudo sysctl vm.overcommit_memory=1 && echo "vm.overcommit_memory = 1" | sudo tee -a /etc/sysctl.conf && sysctl vm.overcommit_memory
```

## Run the container

```bash
docker compose up -d
```
