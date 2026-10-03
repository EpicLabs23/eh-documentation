---
sidebar_position: 8
---

# Install BIND9 DNS

Optional. Install this if EH should host DNS zones for account domains. You can use Cloudflare instead, or manage DNS yourself (**System > Config > DNS Settings**).

The stack runs BIND9 plus a small management API (`bind9-api`) that EHM uses to edit zones. DNS (port 53) is public; the API (port 8053) only listens on localhost.

## 1. Free up port 53

Ubuntu's built-in resolver uses port 53. Build the image first (it needs DNS to download packages), then turn the resolver off:

```bash
cd /epiclabs23/eh/eh-services/dns
docker compose build
```

```bash
systemctl stop systemd-resolved
systemctl disable systemd-resolved
mv /etc/resolv.conf /etc/resolv.conf.backup
sudo lsof -i :53    # should print nothing
```

Give the server a resolver again:

```bash
cat > /etc/resolv.conf <<'CONF'
nameserver 127.0.0.1
nameserver 8.8.8.8
nameserver 1.1.1.1
search .
CONF
```

## 2. Start BIND9

Set your time zone under `environment: TZ` in `docker-compose.yml` if you like, then:

```bash
docker compose up -d
docker logs bind9-eh
```

Test it:

```bash
dig @127.0.0.1 www.example.local
```

## 3. Connect EHM

Read the management API's username and password:

```bash
docker exec bind9-eh cat /etc/bind9-api/config.yml
```

In EHM, **System > Config > DNS Settings**: enable BIND9, set the API base URL to `http://localhost:8053`, and enter that username and password. EHM then creates and updates zones for account domains itself.

Point your domain's nameservers (at your registrar) to this server, with glue records if the nameserver names are under the same domain.

## Managing BIND9 by hand

```bash
docker exec bind9-eh named-checkzone <zone> /etc/bind/zones/db.<zone>
docker exec bind9-eh rndc reload
docker compose restart
docker logs bind9-eh
```

Options such as forwarders are in `./etc/bind/named.conf.options`. Zone files are under `./etc/bind`, kept on the host.

## Undo

```bash
docker compose down
systemctl enable --now systemd-resolved
cp /etc/resolv.conf.backup /etc/resolv.conf
```
