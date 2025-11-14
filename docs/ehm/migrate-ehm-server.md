---
sidebar_position: 15
---

# Migrate EHM Server

This section will guide you through the process of migrating your EHM server to a new server.

### Step 1: Backup Your Data

- Backup `ehm-db-container` data directory.
- Backup `postgresql` data directory.
- Any other DB services like MsSQL, MongoDB etc that was running on the server.
- If Bind9, Email Server is running, backup their data.
- Backup `/ehm` directory.
- Backup `/epiclabs23` directory.
- Backup `/home` directory.
- Backup `supervisor` data directory.

### Step 2: Install EHM on the new server

- Install EHM on the new server.
- Configure EHM on the new server.
- Configure FTP server on the new server.
- Configure DNS server on the new server.
- Configure Email server on the new server.
- Install EHB on the new server.
- Configure EHB on the new server.
