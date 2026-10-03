---
sidebar_position: 13
---

# Move Accounts to Another Server

There are two ways to move hosting accounts to a new server.

## Option 1: Move accounts one at a time (Export / Import)

Use this to move some or all accounts to a different EHM server.

1. Install EHM on the new server, at the **same or newer** version as the old one, and set it up fully (packages, DNS, SSL, storage.bd). See [Install on a fresh server](../getting-started/install-on-a-fresh-server.md).
2. On the old server: **Export / Import > ECP Export**, export the account, and download the file.
3. On the new server: **Export / Import > ECP Import**, upload the file.
4. Do the checklist below for each imported account.
5. Point the account's domains at the new server's IP.

**What an export includes:** the account and its settings, domains, ports, apps and custom commands, MySQL and PostgreSQL databases (with their users and grants), the whole home directory, and optionally a snapshot of the container.

**What it doesn't include — handle these by hand:**

- **MongoDB and MSSQL databases.** Back them up and restore them separately (the account's storage.bd backups cover all four engines).
- **SSL certificates and DNS records.** Request certificates again and recreate DNS records on the new server.
- **Git connections and push webhooks.** The customer reconnects their Git provider and recreates webhooks.
- **Resource history.**

**After each import:**

1. Don't restore the old container snapshot when moving to a newer EHM — let the new server create a fresh container, then press **Update** in the account's ECP (**System > Update**) so it runs the current image.
2. If the account had **Managed WordPress** sites, reinstall or repair them; their WordPress settings aren't restored by import.
3. Request SSL certificates and recreate DNS records.
4. Restore any MongoDB/MSSQL databases.

## Option 2: Move the whole server

Moving everything at once (EHM's own database, all accounts, all database engines, DNS, mail) needs care to keep IPs, users and volumes consistent. Epic Labs 23 offers this as a paid service — see [Introduction](../intro.md#paid-services-from-epic-labs-23).

If you do it yourself, the pieces that must come across are: EHM's database and `/ehm` folder (the [host backup](./host-backup.md) covers both), `/home` (account files), the data of every database engine in `eh-services` (MariaDB, PostgreSQL, MSSQL, MongoDB), BIND9 zones, and the `eh-services` `.env` files. Install the same EHM version on the new server before restoring.
