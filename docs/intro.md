---
sidebar_position: 1
---

# Introduction

**Epic Host (EH)** turns a Linux server into a shared hosting server. It has two parts:

- **EHM (Epic Hosting Manager)** — the admin panel. The hosting provider uses it to manage the server, create hosting accounts, set packages and limits, and watch resource use.
- **ECP (Epic Control Panel)** — the customer panel. Every hosting account gets its own ECP, running in its own isolated container, to deploy apps, manage domains, databases, SSL and files.

## Free to use, not open source

EHM and ECP are free. You can install them on as many of your own servers as you like and create as many hosting accounts as you like, at no cost.

They are not open source: the source code is not published, and you may not modify, redistribute or reverse engineer it. The compiled releases are published at [EpicLabs23/ecp-ehm-free](https://github.com/EpicLabs23/ecp-ehm-free), and the full terms are in its `LICENSE.txt`.

## Paid services from Epic Labs 23

Everything in these docs is free to use. If you'd rather not do it yourself, Epic Labs 23 offers:

- **Support** — installation, upgrades, troubleshooting and customisation for your EHM servers.
- **Hosting infrastructure** — servers with EHM ready to use.
- **Related services** — business email (coming soon), domains, security, SMS, and [storage.bd](https://storage.bd) off-site backups.

Contact: nahidacm[at]gmail[dot]com, or WhatsApp +8801670603332.

## Where to start

| You want to… | Read |
| :--- | :--- |
| See what EH can do | [Features](./features) |
| Install EHM on a new server | [Requirements](./getting-started/requirements), then [Install on a fresh server](./install-in-a-fresh-server) |
| Update an existing install | [Update EHM](./ehm/ehm-update) |
| Use your hosting account's control panel | [ECP guide](./ecp/ecp-overview) |
| Connect billing software (WHMCS etc.) | [Billing integration API](./integrations/billing-api) |
| Fix something that's broken | [Troubleshooting](./reference/troubleshooting) |

## Get help

- Bug reports: [GitHub issues](https://github.com/EpicLabs23/ecp-ehm-free/issues)
- Questions and ideas: [GitHub discussions](https://github.com/EpicLabs23/ecp-ehm-free/discussions)
