---
sidebar_position: 7.8
slug: /ehm/upgrading-to-2.0.9
---

# Upgrading from 2.0.5 to 2.0.9

You can go straight from 2.0.5 to 2.0.9. You don't need to install 2.0.6, 2.0.7 and 2.0.8 first: the 2.0.9 updater makes every database change those releases made.

:::warning
Two things need action from you:

- **Epic DNS must be set up.** From 2.0.6, every new account and domain gets a DNS zone on Epic DNS. If Epic DNS isn't configured, creating an account or adding a domain fails. See [Before you start](#before-you-start).
- **Update every account right after EHM.** From 2.0.7, EHM only accepts signed requests from account control panels (ECP). Until an account is updated to the current image, its git push deploys, git webhook deliveries and process manager (Supervisor) actions fail. Its websites keep working.
:::

## What changed since 2.0.5

**DNS (2.0.6)**
- Epic DNS replaces the Cloudflare, BIND9 and hosts-file DNS options. There's nothing to choose any more. Every domain gets an Epic DNS zone when it's added.
- From 2.0.9, a new domain's zone also gets an `A` record pointing at your server, so the site loads as soon as the domain's nameservers point at Epic DNS.
- Domains that existed before the update don't get an Epic DNS zone automatically. Their DNS keeps working wherever it's hosted now (for example Cloudflare). EHM no longer changes records there.
- ECP's **DNS Settings** tab is gone. **Add Subdomain** now shows for every domain.

**Security (2.0.6 – 2.0.8)**
- SQL imports and restores (DB Manager upload, storage.bd restore) now run the database clients in a locked-down mode. This needs the MariaDB client and a recent `psql` on the host. See [Before you start](#before-you-start).
- Changing an account's password signs that account out of every open session.
- ECP must sign the requests it sends to EHM (see the warning above).
- The current account images fix a flaw that let PHP sites run shell commands.

**New features**
- **Per-account upload limit** (2.0.8). Set it on the account in EHM. The limit for EHM's own web server applies straight away. The PHP and control panel parts only apply once the account runs the current image. Until then, EHM saves the value and tells you which part it couldn't apply.
- **Bandwidth usage** for the billing cycle, shown in ECP (2.0.8).
- **Pull latest** for apps deployed from git (2.0.8). It brings in the newest code from the app's branch, including from private repositories. Apps added from a pasted repository address remember their login, stored encrypted.
- **Billing system lookups** (2.0.9). Billing systems connected through the integration API can now read their own accounts' domains, disk use, databases, SSL certificates and apps.
- The admin dashboard was redesigned. The API client list shows newest first and has a search box.

Server requirements are the same as 2.0.5: Node.js 24 or later, Ubuntu 22.04 or later.

## Before you start

### 1. Back up the server

Take a full backup first. See [Host backup and restore](../host-backup.md).

### 2. Install the database clients

Do this if you offer MySQL or PostgreSQL databases. Without these clients, SQL import and restore are refused. Nothing else breaks.

- MariaDB client: `sudo apt install -y mariadb-client`
- PostgreSQL client 18, from the PostgreSQL apt repository

The full steps are in [System Setup → Database clients](../system-setup.md#database-clients-import--restore). The updater warns you if either client is missing or too old.

### 3. Get your Epic DNS connection details

You need five values: the **Epic DNS Server** address, a **Client ID**, a **Client Secret**, and **Nameserver 1** and **Nameserver 2**. Your Epic DNS provider gives you these. You'll enter them right after the update (step 2 below).

### 4. Plan a maintenance window

Pick a time to update EHM and then every account, one after the other. Updating an account restarts its container, so its sites are down for a short time.

## Step-by-step

### 1. Update EHM

```bash
sudo su
eh-manager update-ehm
```

Choose **2.0.9** when asked for the version. To run it without prompts:

```bash
sudo su
eh-manager update-ehm --nv 2.0.9 --dbpass <mariadb-root-password> --os 24.04 --influx false
```

Leave out `--apiurl`. The current public API address is kept as it is. Use `--influx true` if you use InfluxDB metrics history now.

The updater keeps your encryption key and settings. It removes two old, unused DNS columns from the database and then applies the new database structure. It shouldn't ask you to confirm any data loss. **If it does, stop and don't confirm.** Something on your server differs from what this release expects.

### 2. Configure Epic DNS

Sign in to EHM and go to **System Configuration → Epic DNS Settings**. Enter the five values from [Before you start](#3-get-your-epic-dns-connection-details) and save.

To check it works, add a test domain to an account, or create a test account. If Epic DNS isn't reachable, it fails with an Epic DNS error.

### 3. Update every account

For each account, either:

- **in EHM**, open the account (**Account → Account List**, then the account) and choose **Update ECP** from its **Action** menu; or
- **in ECP**, have the customer open **System → Update**.

The current images are `ecp-base` 2.0.6, and `managed-wordpress`, `dotnet-6` and `dotnet-3` 2.0.5. Files, databases, domains and settings are kept. See [Updating existing accounts](./updating-existing-accounts.md) for details.

### 4. Check

- Open a few sites, including at least one PHP or WordPress site.
- On an account that uses git push deploys, push a commit and check that the deploy runs.
- If you offer databases, try a small SQL import from DB Manager.

## Can't update every account straight away?

Until an account is updated, its git push deploys, webhook deliveries and Supervisor actions fail. If you have many accounts, you can go in two steps to keep most of these working:

1. Update EHM to **2.0.6** (`--nv 2.0.6`). It accepts requests from ECP with or without a signature. Configure Epic DNS.
2. Update every account. Take as long as you need. On EHM 2.0.6, accounts get `ecp-base` 2.0.5, which signs its requests.
3. Update EHM to **2.0.9**, then update every account again.

Between steps 3 and the second account update, only git push deploys fail. Each account restarts twice this way, so the direct path above is better when you can update every account in one window.

## Troubleshooting

- **"Please configure the Epic DNS Server…" when creating an account or adding a domain.** Epic DNS isn't set up. Do [step 2](#2-configure-epic-dns).
- **"Epic DNS server authentication failed".** The Client ID or Client Secret is wrong, or the client was suspended. Check them with your Epic DNS provider.
- **Git push deploys end in "Not found", or Supervisor actions fail in ECP.** The account is still on an older image. Update it ([step 3](#3-update-every-account)).
- **SQL import or restore is refused.** Install the database clients ([Before you start, step 2](#2-install-the-database-clients)).
- **The upload limit you set doesn't apply to PHP sites.** The account is still on an older image. Update it.

## More help

- [Update EHM](../ehm-update.md)
- [Updating existing accounts](./updating-existing-accounts.md)
- [Host backup and restore](../host-backup.md)
- [Update EH services](../../eh-services/eh-services-update.md)
