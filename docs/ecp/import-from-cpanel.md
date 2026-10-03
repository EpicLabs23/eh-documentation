---
sidebar_position: 2
---

# Import Sites from cPanel

Copy websites from a cPanel server into your account. Each site becomes an app here, with its files, its MySQL database, and (for WordPress) an updated `wp-config.php`. Nothing on the cPanel server is changed.

This moves **sites**, not a whole cPanel account.

## What you need

- SSH access to the cPanel account (host, port, username).
- An SSH private key that the cPanel account accepts. Add the matching public key in cPanel under **SSH Access > Manage SSH Keys** and authorize it.

## Steps

1. **Apps > Add New > From cPanel**.
2. Enter the cPanel host, port, username and private key, and connect. ECP lists the sites it finds (main, addon and subdomains), their folders, PHP versions, and whether each is WordPress. Check the server's key fingerprint matches your cPanel server.
3. Pick the sites to import. For each you can set the app name and folder, and whether to attach the domain here.
4. For WordPress sites, the database details are read from `wp-config.php`. For other sites with a database, enter the database name, user and password, or skip the database.
5. Start the import and watch each site's progress. One import runs at a time.

PHP versions are matched to the nearest version available here at or above the old one (for example 7.4 becomes 8.1). Test each site afterwards.

## Not imported

Email accounts and mail, FTP accounts, cron jobs, SSL certificates (attach the domain and request a new certificate), PostgreSQL databases, parked domains, and a non-WordPress site's database unless you give its credentials.

When you're happy with the copy, point the domain's DNS at this server.
