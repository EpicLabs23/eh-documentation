---
sidebar_position: 3
---

# Deploy from Git

## Create an app from a repository

**Apps > Add New > Clone From Git**. You can paste any clone URL, or connect your GitHub, GitLab or Bitbucket account and pick a repository from the list (if your provider has enabled that provider).

## Deploy on every push (webhooks)

Each app can have one webhook. When you push, the Git provider notifies ECP, and ECP runs the app's **Deploy Commands** in the app's folder (for example `git pull`, `npm ci`, `npm run build`), or a special command such as restarting or stopping the app.

Open the app and go to its **Webhook** section:

- **Branch** — only pushes to this branch trigger a deploy. Leave empty for any branch.
- **Deploy Commands** — the commands to run, in order.

There are two ways to connect it:

- **Automatic** — if the app came from a connected GitHub, GitLab or Bitbucket account with enough permission, ECP creates the webhook on the provider for you.
- **Manual** — works for any app. ECP shows a **URL** and a **Secret**; add them as a webhook in your repository's settings on the provider, for push events.

Every delivery is signed with the secret and checked, and repeated deliveries are ignored. You can see recent deliveries and their results in the webhook log. **Generate a new secret** if it may have leaked — the old one stops working immediately (automatic webhooks are updated for you; manual ones need the new secret pasted in).

If automatic setup isn't offered for a GitLab or Bitbucket app you connected a while ago, disconnect and reconnect your Git account to grant the newer permission.
