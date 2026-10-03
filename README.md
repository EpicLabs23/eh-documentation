# eh-documentation

Public documentation for EHM and ECP, published at https://docs.ecpanel.io. Built with [Docusaurus](https://docusaurus.io/).

**This repository is public.** Everything here is readable by anyone, including its git history.

## What belongs here

Only what customers and hosting providers need to **install, operate and use** EHM/ECP:

- install, update and upgrade guides; configuration of features through the UI and `.env`
- the ECP guide for hosting customers
- public APIs (the billing integration API)
- troubleshooting, ports, requirements

## What does not belong here

- Anything about the source code: file names, class/function names, internal design, code-change proposals.
- Developer workflows: dev setup, building and releasing EHM/ECP images, tagging source repos.
  These live in the private repos (e.g. `ehm-api/docs/`, `ehm-release/docs/RELEASE.md`, `ecp-docker/docs/`).
- Security review notes, internal sales notes, pricing drafts.
- Real credentials, tokens, server IPs or hostnames. Use placeholders like `<your-ehm-domain>`.
- Links to private repos or their docs. If a public page needs that information, write a public version of it here.

## Local development

```bash
npm install
npm start        # dev server with live reload
npm run build    # static site into build/ — also checks for broken links
```
