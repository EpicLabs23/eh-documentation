---
sidebar_position: 1
---

# Your Control Panel (ECP)

ECP is the control panel for your hosting account. Your hosting provider gives you its address and your username and password. Everything in your account runs in its own private container: other accounts on the same server can't see your files, databases or apps.

## What's in the menu

| Menu | What you do there |
| :--- | :--- |
| **Dashboard** | Overview of your account. |
| **WordPress** | [Managed WordPress](./managed-wordpress) sites: install, caching, security. |
| **Apps** | Create and manage apps: from Git, upload, FTP, an empty app, a quick-start template, or [from cPanel](./import-from-cpanel). Each app has its own domain, PHP version, commands, logs and [push-to-deploy webhook](./deploy-from-git). |
| **Network** | Domains and subdomains (with SSL and [redirects](./domain-redirects)), port maps, port status, and the DNS zone editor (when your provider manages DNS). |
| **Terminal** | A shell inside your own container. |
| **Backups** | [Back up and restore](./backups) your files. |
| **Code Editor** / file manager | Browse, edit, upload, download, zip and unzip files. |
| **Database** | SQL databases (MySQL/MariaDB, PostgreSQL, MSSQL — whichever your provider offers) and MongoDB, with a data browser, export/import, backups, and one-click phpMyAdmin/pgAdmin. |
| **Tool Manager** | Install language runtimes and versions (Node.js, Python and more). |
| **Advanced** | Cron jobs. |
| **System** | Service manager, logs and log cleanup, resource usage, updates, settings (including storage.bd backups), and the web application firewall (WAF). |

## Limits

Your plan sets limits on CPU, memory, disk, bandwidth and databases. If you stay over a limit, you'll get an email and a notice in ECP explaining what's over and how to fix it; if it continues, your account may be slowed down or paused until usage drops. **System > Resource Usage** shows where you stand.

## Updates

When your provider publishes a new version, **System > Update** shows it. Updating replaces your account's container with the new version and keeps your files, databases, domains and settings.

## AI assistant (MCP)

Your account can also be managed by an AI assistant through the open-source [ECP MCP server](https://github.com/EpicLabs23/ecp-mcp-server). It can manage apps, domains, databases, files and more, but deliberately can't run arbitrary shell commands. Ask your provider whether they support it.
