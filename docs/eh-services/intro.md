---
sidebar_position: 1
---
# Intro

# Pre-requisite
[Install Docker](../ehm/docker-installation.md)

# Download source codes 
Clone repository from: https://github.com/EpicLabs23/eh-services
```bash
git clone https://nahidacm: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@github.com/EpicLabs23/eh-services.git /epiclabs23/eh/eh-services
```
# Create Docker network
```bash
docker network create eh_network --subnet=172.1.0.0/16
```