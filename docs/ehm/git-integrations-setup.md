---
sidebar_position: 6.1
---

# Git Integrations Setup (GitHub / GitLab / Bitbucket)

:::info
Optional. Skip this if you don't need ECP accounts to import apps directly from a GitHub/GitLab/Bitbucket
repo via OAuth. Nothing else in EHM depends on this.
:::

Each EHM install registers its **own** OAuth app per provider — there's no shared/central broker, since
OAuth providers require a fixed callback URL and ECP tenant domains differ per install. Full design in
`docs/GIT_INTEGRATIONS.md` in `ehm-api`; this page is just the setup steps.

## 1. Set `EHM_ENCRYPTION_KEY`

Required before saving any provider's client secret (it's what encrypts `client_secret_enc` at rest). If
you haven't set it already:

```bash
openssl rand -hex 32
```

Add the result to `ehm-api/.env` as `EHM_ENCRYPTION_KEY`, then restart `ehm-api` (`pm2 restart ehm-api`).

## 2. Register an OAuth app with each provider you want

The callback URL is the same shape for all three, built from your install's `EHM_API_PUBLIC_URL`:

```
${EHM_API_PUBLIC_URL}/account-git/<provider>/callback
```

e.g. `https://ehm.example.com/api/account-git/github/callback` — in production, `EHM_API_PUBLIC_URL` points
at the `/api` path behind the reverse proxy (frontend and backend share the default HTTPS port), not a
bare host with a `:2326` port like local dev.

- **GitHub**: create an OAuth App at `github.com/settings/developers` → note the Client ID and generate a
  Client Secret.
- **GitLab**: create an application at `https://gitlab.com/-/user_settings/applications` (or your self-hosted instance's
  equivalent) with the `api` scope (or narrower, per your needs) → note the Application ID and Secret. If
  self-hosted, you'll also set `base_url` in step 3.
- **Bitbucket**: create an OAuth consumer under your workspace's settings → note the Key (client_id) and
  Secret. Bitbucket fixes scopes on the consumer itself, not at authorize time.
  Create OAuth Client: `https://bitbucket.org/<bitbucket-username>/workspace/settings/oauth-clients`

## 3. Store the credentials in EHM

In EHM UI: `System > Config > Git Providers`. For each provider you registered in step 2:

1. Toggle **Enabled**.
2. Paste **Client ID** and **Client Secret** from step 2.
3. For self-hosted GitLab or Bitbucket Server, also set **Base URL** (defaults to `gitlab.com` if left
   blank; Bitbucket has no self-hosted variant in practice but the field exists for parity).
4. **Default Scopes** is optional — leave blank to use the provider strategy's built-in default.
5. Save.

Leaving **Client Secret** blank on a later edit keeps the currently saved secret rather than clearing
it — the form shows a "Secret set" tag once one exists, and clears the field itself after each load so
you never see the secret again once saved (needs the `git-provider-config:manage` permission — an admin
account has it).

Prefer the API? `PATCH /git-provider-config/:provider` with a staff bearer token takes the same fields
(`enabled`, `client_id`, `client_secret`, `base_url`, `default_scopes`) — this is what the UI calls under
the hood.

## 4. Verify

The **Git Providers** tab should show an "Enabled" and "Secret set" tag for each configured provider.
From ECP, the "Connect GitHub/GitLab/Bitbucket" option on app creation should now work end-to-end.

## Troubleshooting

- **OAuth popup redirects but nothing happens / ECP shows no result**: check `EHM_API_PUBLIC_URL` is the
  exact public origin ECP's JWT claims expect — the callback page's `postMessage` is validated by origin
  on the ECP side (see `docs/GIT_INTEGRATIONS.md`), so a mismatch here silently drops the result.
  Confirm the callback URL registered with the provider matches it exactly, including scheme and port.
- **"invalid client" from the provider**: double check the `client_id`/`client_secret` were saved for the
  right provider key (`github`/`gitlab`/`bitbucket`, lowercase) and that `enabled` is `true`.
  `EHM_ENCRYPTION_KEY` missing or changed after the secret was saved will also break decryption — check
  `ehm-api` logs for a decryption error.
