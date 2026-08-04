---
sidebar_position: 3
---

# Increasing Upload Size Limit (Per-Account)

Sometimes a customer requests a larger file upload limit than the default (e.g. for the ECP File Manager, or for their app's own upload endpoints). This doc explains where the limit is enforced today and how to raise it for a **single** account.

## Where the limit is enforced

The default limit is **1GB** (`1073741824` bytes / `1024M`), and it is currently hardcoded identically in three places:

1. **Host Nginx (the layer that actually gates File Manager uploads)**
   Generated per account by EHM API's `NginxService`, in `ehm-api/src/modules/nginx/nginx.service.ts`:
   ```ts
   client_max_body_size = '1024M';
   ```
   This is written into every account's primary-domain server block, including the reserved **ECP API port (2324)** block — so ECP's File Manager `/file-system/upload-recursive` endpoint is fronted directly by this host-level Nginx config. The generated file lives at:
   ```
   /etc/nginx/epiclabs23/{username}/sites_available/{host_port}_{domain}.conf
   ```

2. **ecp-go application (the hard ceiling)**
   `ecp-go/main.go`:
   ```go
   app := fiber.New(fiber.Config{
       BodyLimit: 1073741824, // 1GB
   })
   ```
   This is a **compile-time constant**, not read from an env var, and the same compiled binary/image is used by every account's container. Fiber rejects any request body over this size before the `/file-system/upload-recursive` handler (`ecp-go/router/file-system.go`) ever runs — no Nginx setting can override it.

3. **Container-internal Nginx (only relevant to the customer's own app/site, not the File Manager)**
   Each `ecp-docker/*/create_nginx_server_block.sh` template (ecp-base, wp-php, dotnet variants, etc.) hardcodes:
   ```
   client_max_body_size 1024M;
   ```
   This fronts the account's own website/app (PHP-FPM, etc.) inside the container — used if the customer's own upload form/app needs a larger limit, not ECP's File Manager.

None of these are currently parameterized per account — there is no DB field or env var for this today.

## How to raise it for one specific account (manual/interim)

### 1. Host Nginx
- Edit the account's generated conf on the **host**:
  ```
  /etc/nginx/epiclabs23/{username}/sites_available/{host_port}_{domain}.conf
  ```
- Bump `client_max_body_size` to the desired value (e.g. `5120M` for 5GB).
- Validate and reload:
  ```bash
  sudo nginx -t && sudo service nginx reload
  ```
- **Caveat:** this file is regenerated whenever the account's server blocks are recreated (domain re-assignment, account recreation, etc. — see `NginxService.createPrimaryDomainServerBlock`). The manual edit will be overwritten and must be reapplied.

### 2. ecp-go `BodyLimit` (hard ceiling)
Nginx alone won't help if the request is going to ECP's File Manager — Fiber's `BodyLimit` will still reject anything over 1GB. There is currently no way to raise this for a single account without a code change:
- Add support for reading the limit from an env var (e.g. `ECP_BODY_LIMIT`) in `ecp-go/main.go` instead of the hardcoded constant.
- Pass that env var per-container in `ehm-api/src/modules/docker/docker.service.ts`, where `SYSTEM_USER_ID`, `ECP_USERNAME`, and `ECP_PRIMARY_DOMAIN` are already injected per account via the `Env` array.
- Until that change exists, going beyond 1GB for the File Manager isn't possible for a single account without shipping a custom-built image for that account (not recommended).

### 3. Container-internal Nginx (customer's own app, not File Manager)
- Edit the per-account file on the **host** (bind-mounted into the container):
  ```
  /home/{username}/ecp/nginx/sites-available/{domain}.conf
  ```
  (mounted into the container at `/etc/nginx/sites-available`, see the `Binds` array in `docker.service.ts`).
- Bump `client_max_body_size`.
- Validate and reload **inside the container**:
  ```bash
  docker exec <container_name> nginx -t
  docker exec <container_name> service nginx reload
  ```
- Same regeneration caveat as step 1 — recreating the app's server block (e.g. via ECP's site/app management) reruns `create_nginx_server_block.sh` and overwrites the edit.

## Recommended follow-up (not yet implemented)

To support this as a real per-account setting instead of manual edits that get clobbered on regeneration:
- Add an `upload_max_size` field to the account/package model (default `1024M`).
- Have `NginxService.client_max_body_size` read from that per-account value instead of the hardcoded class property when generating server blocks.
- Make ecp-go's Fiber `BodyLimit` configurable via an `ECP_BODY_LIMIT` env var (default 1GB), sourced from the same per-account value and passed through `docker.service.ts`'s container `Env` array.
- This would turn "customer special request" changes into a DB update + account restart, instead of manual file edits that don't survive regeneration.
