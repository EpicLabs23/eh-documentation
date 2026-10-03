# Services, Ports and IPs

**Ports that should be open for public access:**

| Service | Port |
| --- | --- |
| ehm-ui | 2325 |
| ehm-api | 2326 |
| ecp-ui | 2323 |
| ecp-api | 2324 |
| PhpMyAdmin | 2329 |


**EH MariDB:** 

Running on docker container.

With local IP: `172.1.0.6`

Mapped with host port: `3306`

---

**MongoDB**

Running on docker container.

With local IP: `172.1.0.7`

Mapped with host port: `27017`

---

**PostgreSQL**

Running on docker container.

With local IP: `172.1.0.8`

Mapped with host port: `5432`

---

**ECP:**

Runs on docker conainer.

ecp-ui uses port: `2323`

ecp-api uses port: `2324`

---

**EHM:**

Runs on host machine.

ehm-ui uses port: `2325`

ehm-api uses port: `2326`

If HTTPS is enabled for EHM's own domain (see [Enable HTTPS for EHM](../../ehm/enable-https)), nginx terminates SSL on `443` and reverse-proxies to `2325`/`2326` locally — `443` (and `80` for the redirect) become the actual publicly reachable ports, and `2325`/`2326` no longer need to be open externally.

---

**PhpMyAdmin:**

Running on docker container.

With local IP: `172.1.0.5`

Mapped with host port: `2329`

---

**Backup System:**

Rclone rcd uses port: `5572`

Epic backup API uses port: `2330`

Epic backup UI uses port: `2331`

---

**EH System Monitor:**

Running on docker container.

cAdvisor uses port: 2332

Prometheus uses port: 2333

Grafana uses port: 2334
