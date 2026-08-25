---
sidebar_position: 11
---

# Deny Host Shell Access for Hosting Accounts

Every hosting account created by EHM is also a real Linux system user on the host (see
[System Setup](./system-setup.md)). Historically that account got a normal, unrestricted login
shell — any customer who knew their SSH/system password could SSH straight into the **host
machine itself**, not just their own container, and read anything a normal Linux user can read
(`cat /etc/passwd`, other accounts' world-readable files, host processes, etc.).

This page documents the fix: hosting accounts are denied host shell access entirely. If/when a
replacement, container-scoped access method is added, it will be documented separately — as of
this writing there isn't one, by design, until it's decided.

:::warning
`DenyGroups` in `sshd_config` is a manual, per-host step — EHM does not manage `sshd_config`.
You need to apply it yourself on every EHM host, following the steps below.
:::

## What EHM already does automatically

As of the version that includes this fix, `SystemUserService.createSystemUser` (`ehm-api`) does
two things for every **newly created** hosting account, with no manual step required:

1. Sets the account's login shell to `/usr/sbin/nologin` (`useradd -s /usr/sbin/nologin ...`) —
   blocks interactive login, `su`, and running a remote command over SSH (`ssh user@host 'cmd'`).
2. Adds the account to a shared secondary group, `ecp-accounts` (`groupadd -f` + `useradd -G
   ecp-accounts ...`), so the host's sshd can identify and deny every hosting account with one
   rule, independent of the shell field.

`nologin` alone is **not** sufficient on its own: it only intercepts SSH's "shell" and "exec"
request types. The **`sftp` subsystem is dispatched by sshd directly**, without ever consulting
the user's configured shell — so a `nologin` account can still fully use SFTP to browse and
download files, including world-readable host files, unless the host is also configured to deny
the group at the sshd level. That's what the manual step below closes.

## Manual step required on the host: `DenyGroups`

Run this on the actual EHM host (needs root/sudo). It's safe to re-run.

```bash
# 1. Back up sshd_config first
sudo cp -a /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%Y%m%d%H%M%S)

# 2. Deny the whole group at the sshd level — blocks shell, exec, AND the sftp subsystem
echo "DenyGroups ecp-accounts" | sudo tee -a /etc/ssh/sshd_config

# 3. Validate the config BEFORE touching the running daemon — a typo here can lock out
#    every account, not just hosting accounts, so never skip this
sudo sshd -t && echo "config OK"

# 4. Only if step 3 printed "config OK": reload (not restart), so it doesn't drop
#    any other currently-active SSH sessions
sudo systemctl reload sshd || sudo systemctl reload ssh
```

## Retroactive fix for accounts created before this version

Any account created before the EHM version with this fix still has a normal shell and isn't in
`ecp-accounts`. Fix each one:

```bash
sudo groupadd -f ecp-accounts
sudo usermod -s /usr/sbin/nologin -aG ecp-accounts <username>
```

Or loop over every hosting account on the box (adjust the `awk` filter to match your actual UID
range / excluded accounts, e.g. your own admin login):

```bash
for u in $(awk -F: '$3>=1000 && $3<60000 {print $1}' /etc/passwd); do
  sudo usermod -s /usr/sbin/nologin -aG ecp-accounts "$u"
done
```

## Verifying it worked

Check group membership and shell:

```bash
getent group ecp-accounts
getent passwd <username> | awk -F: '{print $1, $7}'   # shell should be /usr/sbin/nologin
```

Attempt a connection as a denied account and check the server log — you should see the request
rejected before authentication even completes:

```bash
ssh -o BatchMode=yes <username>@<host>
# server-side (journalctl -u sshd, or /var/log/auth.log):
#   User <username> from <ip> not allowed because a group is listed in DenyGroups
```

If you instead see a normal authentication failure (no `DenyGroups` message), the account either
isn't in `ecp-accounts` yet or the `sshd_config` change wasn't reloaded.
