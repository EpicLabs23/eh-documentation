---
sidebar_position: 5.1
---

# Default page for unconfigured domains

When a domain points to your server but hasn't been added to any account yet, nginx shows its stock **"Welcome to nginx!"** page. Over HTTPS it's worse: nginx answers with the first site it loaded, so visitors see another site's certificate and content, often your EHM panel or one of your customers' sites.

Run this once per server to fix both:

```bash
sudo su
eh-manager nginx-default-page
```

After that:

- **HTTP:** visitors see a plain, unbranded **"No website here yet"** page. It tells the domain owner to add the domain in their control panel. It's sent with a 404 status and `noindex`, so search engines don't list parked domains.
- **HTTPS:** nginx refuses the connection instead of showing someone else's site. This needs nginx 1.19.4 or newer (Ubuntu 24.04 ships 1.24). On older nginx, such as Ubuntu 22.04's 1.18, only the HTTP part is set up and the command says so.

Once a domain is added to an account, its own site replaces the page as usual.

### What it changes

- It writes `/etc/nginx/conf.d/eh-default-server.conf` (port 80) and `/etc/nginx/conf.d/eh-default-server-ssl.conf` (port 443).
- It disables `/etc/nginx/sites-enabled/default`, but only if it's the untouched file from the nginx package. `/etc/nginx/sites-available/default` is kept.
- If you already set up your own default site (any `listen ... default_server;` in `conf.d` or `sites-enabled`), that port is left alone.
- Every change is checked with `nginx -t` before nginx is reloaded. If the check fails, the change is undone and nginx keeps running as before.

Running it again is safe: it rewrites the same files.

### Preview or undo

```bash
eh-manager nginx-default-page --dry-run   # show what would change
eh-manager nginx-default-page --undo      # remove both files and re-enable the stock default page
```

### Cloudflare

A domain behind Cloudflare with SSL mode **Full** that has no site on your server now shows Cloudflare error 525 instead of another site's content. Add the domain to an account, or switch it to **Flexible** until you do.
