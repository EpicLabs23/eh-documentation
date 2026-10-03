---
sidebar_position: 1
---

# Intro

`eh-manager` is a command-line tool that installs and updates EHM on your server. It downloads the release from [EpicLabs23/ecp-ehm-free](https://github.com/EpicLabs23/ecp-ehm-free), checks the server against the release's requirements, writes EHM's configuration and starts it under PM2.

| Command | What it does |
| :--- | :--- |
| `eh-manager install-ehm` | First install. See [Install EHM](../ehm/ehm-install). |
| `eh-manager update-ehm` | Update to a newer release. See [Update EHM](../ehm/ehm-update). |

Run it as root. It asks for anything it needs; every prompt also has a command-line flag for non-interactive use.
