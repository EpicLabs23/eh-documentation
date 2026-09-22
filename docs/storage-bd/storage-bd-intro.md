---
sidebar_position: 1
---

# Intro

**storage.bd** is an independent backup platform — restic + AWS S3, client-side
encrypted — that EHM/ECP integrate with as an external service. It's its own
product with its own paying customers, not an EHM subsystem: EHM is simply the
first (and biggest) reseller of it.

Two apps:

- **storage-bd-api** — the control plane (tenants, billing, quota, admin) and a
  restic REST-server-compatible data-plane proxy in front of S3. Local:
  `/epiclabs23/storage.bd/storage-bd-api`.
- **storage-bd-ui** — one app, three faces: the public storefront
  (`storage.bd`), a direct-to-customer dashboard, and the internal admin
  panel. Local: `/epiclabs23/storage.bd/storage-bd-ui`.

Full design rationale for every decision below lives in
[`storage-bd-api/docs/ARCHITECTURE.md`](https://github.com/EpicLabs23/storage-bd-api/blob/main/docs/ARCHITECTURE.md)
(§00–§19) — this page is a feature overview, not the source of truth for *why*.

## Who actually backs up what

**ECP accounts.** The agent lives inside `ecp-go` itself, not as a separate
host-level daemon — an account's own container user already has full access
to its own site files and databases, so backup just runs as that user (no
root, no host bind-mount translation). File/directory selection + database
selection (MySQL/Postgres) in ECP's UI, restic under the hood, real-time job
output over the existing websocket pattern. Database backup specifically
shells out through `ehm-api` (`mysqldump`/`pg_dump` piped into
`restic backup --stdin`) since `ecp-go` holds no DB credentials.

**EHM's own host.** EHM's own config/DB is backed up separately — raw restic
invoked directly from `ehm-api` (no separate agent binary), modeled as just
another storage.bd tenant like anyone else's.

**Direct-to-customer (D2C).** Anyone can sign up on the storefront with no
reseller involved, generate a connect credential, and point their own restic
client at it. No packaged client is shipped for this path — bring your own
restic, same as "bring your own restic-compatible backend" is the answer on
the ECP side for a destination other than storage.bd.

## Tenant & payer model

One `Tenant` per thing being backed up. Every tenant is paid for by exactly
one of two payer types:

- an **`IntegrationClient`** — a reseller (EHM, or any third-party
  billing/provisioning system) authenticating via OAuth2 client-credentials,
  drawing down a **prepaid balance** (ledger-backed: a `BalanceTransaction`
  row per credit/debit, balance is the sum, never a bare mutable number).
  EHM auto-provisions a tenant per hosting account at account-creation time —
  zero manual customer action to connect.
- a direct **`Account`** — D2C, email/password login, its own prepaid
  balance funded by a real payment gateway (DGePay — bKash/Nagad rails are
  wired for but not yet enabled).

## Billing & quota

- **Per-GB dynamic pricing**, no fixed tiers — a global rate with optional
  per-reseller overrides, exposed unauthenticated at `GET /public/pricing` so
  the storefront never hardcodes a number that can drift from what admin
  configured.
- **Live quota enforcement** — Redis-backed counters checked on every write,
  reconciled weekly against real AWS S3 Inventory reports (drift beyond a
  threshold is flagged, never silently auto-corrected).
- **Restore-bandwidth metering** — a per-cycle byte cap plus a request-rate
  limit on presigned restore URLs, both admin-tunable.
- **Overage vs. balance exhaustion, handled differently.** Storage overage
  gets a grace window (the tenant can self-remedy by pruning data). Balance
  exhaustion does not — there's nothing to prune your way out of, so it's a
  hard block at tenant creation and a hard suspend at the monthly renewal
  cron.
- **Monthly renewal billing**, automatic, per tenant, debited from whichever
  balance (reseller or account) backs it.

## Security

- Backups are restic-encrypted client-side before anything leaves the
  account's own environment — storage.bd's S3 bucket never sees plaintext.
- The S3 bucket denies every principal except the proxy's own IAM identity
  and a break-glass role gated on MFA — out-of-band writes/deletes are
  prevented, not just detected after the fact.
- **Repo-password escrow (optional, opt-in per repo):** a copy of each
  restic repo password is KMS-envelope-encrypted and stored, so support can
  help a customer recover access if their local copy is lost. Recovery is a
  cooldown-gated, single-use, fully audited flow — every decrypt is logged
  (KMS calls land in CloudTrail automatically), and there's an admin
  emergency override for the cooldown, separately audited.

## Admin panel

Tenant lookup/support (status, payer, plan, usage), reseller management
(create, credit balance, view ledger — resellers don't get a self-service
panel of their own in v1, admin manages them), pricing config (global +
per-reseller), manual tenant lifecycle actions (activate/suspend/cancel with
a required reason), and manual cron triggers (renewal, purge) as buttons
instead of raw `curl`.

## Storefront & D2C dashboard

Public landing + live pricing page (prerendered at build time for
crawlers/answer-engines — Nginx serves real static HTML on `/` and
`/pricing`, not an empty JS shell), self-service register/login with email
verification and password reset, a dashboard to create a tenant, pay via
DGePay's hosted checkout, reveal the one-time connect credential, and see
*why* a tenant is suspended (never activated, balance exhausted, or an
admin's own reason — each shown distinctly, with an Activate button only
where self-service actually fixes it).

## Notifications

Backup/restore failures reach the account owner through EHM's existing
in-app + email notification system — no separate storage.bd-specific alert
channel to build or watch.

## Not (yet) in scope

- No self-service reseller panel — resellers are admin-managed only.
- No packaged D2C backup client — D2C is bring-your-own-restic.
- bKash/Nagad payment rails exist in schema/config but aren't enabled; DGePay
  is the only live gateway.
