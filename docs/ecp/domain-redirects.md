---
sidebar_position: 4
---

# Domain Redirects

Send visitors from one of your domains to another domain or URL — for example `www.example.com` to `example.com`, or an old domain to a new one.

1. **Network > Domains**.
2. Choose **Redirect** on the domain you want to redirect.
3. Enter where it should go (a domain or a full `https://` address) and choose:
   - **Permanent (301)** — for moves you don't plan to undo. Search engines update to the new address.
   - **Temporary (302)** — for short-term redirects.

To stop redirecting, choose **Remove Redirect**; the domain goes back to serving normally.

Notes:

- Your account's primary domain can't be redirected.
- A domain that's currently serving an app can't be redirected; move the app to another domain first.
- Redirecting a domain removes any custom port mapping on it.
- The redirect works over HTTPS if the domain has a certificate, so request one for the redirected domain too.
