---
sidebar_position: 1
---

# Billing Integration API

Billing and provisioning software (WHMCS, Blesta, HostBill, or your own system) can manage hosting accounts on EHM automatically: list packages, create an account when an order is placed, check when it's ready, and suspend, unsuspend or cancel it.

All paths below are relative to your EHM API address, `https://<your-ehm-domain>/api`.

## 1. Create a client (admin, once)

In EHM: **Integration > Create Client**. Give it a name and tick only the permissions it needs. A new client has **no** permissions until you grant them.

| Permission | Allows |
| :--- | :--- |
| `package:read` | List packages |
| `public-ip:read` | Get the server's public IP |
| `accounts:create` | Create accounts |
| `accounts:read` | Read account status |
| `accounts:suspend` / `accounts:unsuspend` | Suspend / reinstate |
| `accounts:cancel` | Delete an account completely |

Save the **client ID** and **client secret**. The secret is shown once. From **Integration > Client List** you can change a client's permissions, revoke it, and regenerate its secret (which also reactivates a revoked client).

Use one client per billing system. A client can only see and act on accounts it created itself.

## 2. Get an access token

```bash
curl -X POST https://<your-ehm-domain>/api/auth/token \
  -H "Content-Type: application/json" \
  -d '{"grant_type":"client_credentials","client_id":"<id>","client_secret":"<secret>"}'
# → { "access_token": "...", "expires_in": 3600 }
```

Send it as `Authorization: Bearer <access_token>`. Tokens last one hour; request a new one when it expires.

## Endpoints

| Method and path | Permission | Purpose |
| :--- | :--- | :--- |
| `GET /integration/packages` | `package:read` | List packages |
| `GET /integration/public-ip` | `public-ip:read` | The server's public IP, for the customer's DNS A record |
| `POST /integration/accounts` | `accounts:create` | Create an account |
| `GET /integration/accounts/:username` | `accounts:read` | Account and provisioning status |
| `PATCH /integration/accounts/:username/suspend` | `accounts:suspend` | Suspend (e.g. unpaid) |
| `PATCH /integration/accounts/:username/unsuspend` | `accounts:unsuspend` | Reinstate |
| `DELETE /integration/accounts/:username` | `accounts:cancel` | Delete the account, its container, system user, DNS and databases |

## Create an account

```bash
curl -X POST https://<your-ehm-domain>/api/integration/accounts \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{
    "username": "acmecorp",
    "password": "a-strong-password",
    "email": "billing@acmecorp.example",
    "primary_domain": "acmecorp.example",
    "package_id": 2
  }'
# → 201 { "username": "acmecorp", "provisioning_status": "provisioning" }
```

Required: `username` (3–32 characters, lowercase letters, digits, `_` or `-`, starting with a letter), `password`, `email`, `primary_domain`, `package_id`.

Optional: `name`, `hosting_environment` and `hosting_version` (which ECP image to use; defaults apply), and per-engine database limits — `max_db_count`/`max_db_size` (MySQL), `max_pg_db_count`/`max_pg_db_size` (PostgreSQL), `max_mssql_db_count`/`max_mssql_db_size` (MSSQL), `max_mongo_db_count`/`max_mongo_db_size` (MongoDB). Counts default to 5 and sizes to 1024 MB per database. Pass `0` to turn an engine off for this account.

## Wait until it's ready

The response comes back straight away; the container, SSL, DNS and web server are set up in the background. Poll the account:

```bash
curl https://<your-ehm-domain>/api/integration/accounts/acmecorp -H "Authorization: Bearer $TOKEN"
```

| `provisioning_status` | Meaning |
| :--- | :--- |
| `provisioning` | Still being set up — poll again. |
| `active` | Ready. |
| `failed` | Setup failed. Don't retry with the same username; check with the server admin. |

Setup usually takes 15–30 seconds, longer the first time a server pulls a new image. Poll every 2–5 seconds, then back off. There's no callback.

There is no separate order object: the account is the order. Invoices and order history belong in your billing software.

## Suspend, reinstate, cancel

```bash
curl -X PATCH https://<your-ehm-domain>/api/integration/accounts/acmecorp/suspend \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"reason":"non-payment"}'
```

## Errors

| Status | Meaning |
| :--- | :--- |
| `400` | Invalid request (e.g. bad username, missing field) |
| `401` | Missing, invalid or expired token, or the client was revoked |
| `403` | The client doesn't have the permission for this action |
| `404` | No such account, or it wasn't created by this client |
| `409` | Username or domain already taken |

Every call, successful or not, is recorded in the client's audit log — check it first when an action didn't take effect. It isn't shown in the EHM UI yet; an admin can read it with an admin token (see [Updating existing accounts](../ehm/upgrade-notes/updating-existing-accounts.md#1-find-accounts-on-unsupported-php-versions) for getting one):

```bash
curl https://<your-ehm-domain>/api/auth/clients/<client_id>/audit-log -H "Authorization: Bearer $ADMIN_TOKEN"
```
