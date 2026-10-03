---
sidebar_position: 6
---

# Managed WordPress

Managed WordPress sites run on OpenLiteSpeed with caching and security already set up, and are kept updated for you. Your provider offers it as its own hosting type; if your account has it, you'll see **WordPress** in the menu.

## Create a site

**WordPress > Add New**. Enter the domain, site title, and the WordPress admin username, email and password; the app name, folder and database are filled in for you. The installation log shows progress. When it's done, **WordPress Admin** signs you straight in to wp-admin.

## Managing a site

Open it from **WordPress > All Sites**:

- **Status** and **Events** — whether the site is up, and what has happened to it (updates, problems found).
- **Cache Mode** — turn the LiteSpeed page cache on or off, or purge it.
- **XML-RPC** — off unless you need it (some apps and plugins use it).
- **Login Rate Limit** — limits repeated wp-admin login attempts.
- **File Integrity** — checks WordPress's own files against the official copies.
- **File Permissions** — checks file permissions are safe.
- **Reset WordPress Admin Password**.
- **Danger Zone** — delete the site.

## Updates

- WordPress security and minor releases are applied automatically.
- Major WordPress releases are not applied automatically; they show up so you can apply them when ready.
- The plugins installed with the site (LiteSpeed Cache, Wordfence, Yoast SEO) update automatically. Plugins you add yourself are flagged when an update is available rather than updated automatically.
- Before an automatic update, files and database are snapshotted for a quick rollback, and the site is checked afterwards.

Editing theme and plugin files from inside wp-admin is turned off, for security.
