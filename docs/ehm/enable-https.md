---
sidebar_position: 8
---

# Enable HTTPS for EHM

EHM's own admin panel (UI on `2325`, API on `2326`) is **not** proxied by the per-account nginx config that EHM generates for hosted accounts — that automation only covers domains attached to hosted accounts. EHM's own URL needs its own manually created server block, fronted by a Let's Encrypt certificate.

### Pre-requisite

1. [Nginx Installation](./nginx-installation) (this also installs certbot)
2. [Install EHM](./ehm-install)
3. A domain pointed at this server

Replace `<your-ehm-domain>` below with that domain, and `<your-email>` with the address certbot should use for renewal notices.

### Create a bare server block

Certbot's nginx plugin needs an existing `server_name` match on port 80 to insert the ACME challenge into:

```bash
vim /etc/nginx/conf.d/<your-ehm-domain>.conf
```

```conf
server {
    listen 80;
    server_name <your-ehm-domain>;
}
```

```bash
nginx -t && service nginx reload
```

### Request the certificate

```bash
certbot certonly --nginx -m <your-email> --agree-tos --no-eff-email -d <your-ehm-domain>
```

This issues the certificate to `/etc/letsencrypt/live/<your-ehm-domain>/{fullchain.pem,privkey.pem}`.

### Configure nginx

Redirect `80` to `443`, and terminate SSL for both the UI (`2325`) and the API/websocket (`2326`) behind a single domain, using the `/api` path prefix for API traffic:

```bash
vim /etc/nginx/conf.d/<your-ehm-domain>.conf
```

```conf
server {
    listen 80;
    server_name <your-ehm-domain>;

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name <your-ehm-domain>;

    ssl_certificate /etc/letsencrypt/live/<your-ehm-domain>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<your-ehm-domain>/privkey.pem;
    include /etc/nginx/snippets/ssl-params.conf;

    client_max_body_size 1024M;

    # EHM API websocket (events gateway)
    location /socket.io/ {
        proxy_pass http://127.0.0.1:2326;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # EHM API
    location /api/ {
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://127.0.0.1:2326/;
    }

    # EHM UI
    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://127.0.0.1:2325;
    }
}
```

```bash
nginx -t && service nginx reload
```

`ehm-ui`'s frontend code (`src/app/init.js`) builds its API/websocket URLs from `window.location` at runtime — in a production build it targets `<origin>/api` for axios and `<origin>` (default `/socket.io` namespace) for sockets, so no `.env` edit is required for this to work once the nginx config above is in place.

### Access EHM

`https://<your-ehm-domain>`
