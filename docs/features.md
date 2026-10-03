---
sidebar_position: 2
---

# Features

## How it works

Each hosting account is a separate Linux user with its own Docker container. The account's apps, control panel (ECP) and files live in that container, so one account can't see or reach another. CPU, memory, disk and database limits are set per account from its package.

## EHM — for the hosting provider

**Accounts and packages**
- Create, edit, suspend and delete hosting accounts; search and filter the account list.
- Packages set each account's disk, memory, CPU and bandwidth limits, and how many databases (and how large) it may create per engine.
- Staff users with fine-grained permissions; only admins have full access.

**Resource monitoring**
- Live CPU, memory, disk and network charts for the server and for each account, with history (optional InfluxDB).
- Automatic fair-use enforcement: an account over its limits is notified, then throttled, then suspended, and restored when usage drops. Each step emails the customer with what happened and how to fix it. See [Resource monitoring](./ehm/resource-monitoring).
- On-demand host benchmark to spot an oversold or noisy VPS. See [Host benchmark](./ehm/host-benchmark).

**Server care**
- Encrypted off-site backup of EHM itself, and per-account backups, through [storage.bd](./ehm/storage-bd-setup).
- Disk cleanup tool for old images, exports, release files and logs. See [Disk cleanup](./ehm/disk-cleanup).
- Account export and import to move accounts between servers.
- Updates through `eh-manager`; each account can then update its own container from ECP.

**Networking, DNS and SSL**
- Nginx routing for every account domain, generated automatically.
- DNS through BIND9, Cloudflare, or none (point records yourself).
- Let's Encrypt, self-signed or uploaded certificates.
- Port mapping, so an account can serve an app on a port you allow.

**Integration**
- [Billing integration API](./integrations/billing-api) for WHMCS-style software: create, suspend, unsuspend and cancel accounts automatically.

## ECP — for the hosting customer

**Apps**
- Deploy PHP, Node.js, Python, .NET and static sites, or any app that runs in the container.
- Source from Git (GitHub, GitLab, Bitbucket, with one-click connect), upload, or [import sites from cPanel](./ecp/import-from-cpanel).
- [Deploy on every push](./ecp/deploy-from-git) with signed Git webhooks.
- Separate app root and web root (for frameworks like Laravel), per-app PHP version, custom build and start commands, app logs.
- [Managed WordPress](./ecp/managed-wordpress): one-click install with caching, hardening and automatic updates.

**Domains**
- Add domains and subdomains, [redirect](./ecp/domain-redirects) one domain to another, edit DNS zones (when DNS is managed by EH), request and renew SSL certificates.

**Databases**
- MariaDB/MySQL, PostgreSQL, MSSQL and MongoDB (whichever the provider enables), each account isolated to its own databases.
- Built-in data browser, export and import, one-click phpMyAdmin and pgAdmin sign-in.

**Tools**
- File manager and code editor, web terminal, cron jobs, process (service) manager, PHP ini editor, web application firewall (WAF) settings, [backups](./ecp/backups), resource usage view, self-service update.

## Requirements

Ubuntu 22.04 or 24.04, 2+ CPU cores and 4 GB+ RAM. Full list: [Requirements](./getting-started/requirements).
