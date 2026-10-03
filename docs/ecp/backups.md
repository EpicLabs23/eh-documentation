---
sidebar_position: 5
---

# Backups

Backups go to [storage.bd](https://storage.bd), encrypted before they leave your account. Your hosting provider usually sets this up for you when your account is created. If you see a message asking you to set it up, go to **System > Config > Storage.bd**, or ask your provider.

You can also use your own storage.bd account instead of your provider's by entering its details there.

## Files

- **Back up:** in the file manager, right-click a file or folder and choose **Backup Now**. The output is shown as it runs.
- **Restore:** **Backups** lists your snapshots. Choose **Restore Snapshot** on the one you want.

## Databases

In **Database**, open a database's **Backups** to back it up now or restore an earlier backup. This works for MySQL/MariaDB, PostgreSQL, MongoDB, and MSSQL (MSSQL only when your provider runs it on the same server).

## Not included

Domain and web server settings, SSL certificates, DNS records and Git connections are not part of these backups. Your provider keeps a separate backup of the server itself.
