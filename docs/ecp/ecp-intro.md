---
sidebar_position: 1
---

# Intro

ECP is actually a docker image. That contains ECP-API, ECP-UI and other programs needed for ECP.

Some of the programs are:
- ECP-API
- ECP-UI
- PHP
- NodeJS
- Python
- Git
And many more.

Whatever we need to execute user apps, we add those in ECP Dockerfile.

You may check the Dockerfile for details.

Currently we are maintaining two Docker images for ECP:
- ecp-base
- ecp-base-dev

Both container has same programs installed, but only difference is, `ecp-base` is production ready and `ecp-base-dev` is for developers.

So, you can chose `ecp-base-dev` in account creation. which will mount your local `ecp-api` and `ecp-ui `source code directories in docker container.

And you will have to exec in container and start the ecp-api and ecp-ui services manually in dev mode.

All the ECP docker files and scripts are available in: 
[github](https://github.com/nahidacm/ecp-docker).

Local: `/epiclabs23/eh/ecp/ecp-docker`