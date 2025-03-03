---
slug: cloudflare-api-token-and-account-id
title: Cloudflare API Token and Account ID
authors: mahmudur
tags: [cloudflare, DNS, epic-backup]
time: 2025-01-07T09:19
---

To get your **Cloudflare API Token** and **Account ID**, follow these steps:

---

### 🔹 **Getting the Cloudflare API Token**
1. **Log in to Cloudflare**  
   Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) and log in.

2. **Go to API Tokens**  
   - Click on your profile icon (top-right corner).  
   - Select **My Profile**.  
   - Navigate to the **API Tokens** tab.

3. **Create a Custom API Token**  
   - Click **Create Token**.  
   - Choose a **template** (e.g., "Edit DNS" for DNS management or "Create Custom Token").  
   - If using a custom token:
     - **Permissions**: Choose the required permissions (e.g., Zone → DNS → Edit).
     - **Zone Resources**: Choose "All zones" or a specific domain.
     - **Save & Generate Token**.

4. **Copy and Store the Token**  
   - Once generated, **copy and save it securely**, as it won’t be shown again.
<!-- truncate -->
---

### 🔹 **Getting the Cloudflare Account ID**
1. **Go to Cloudflare Dashboard**  
   - Log in at [dash.cloudflare.com](https://dash.cloudflare.com/).

2. **Select Your Site**  
   - Click on the domain you want to manage.

3. **Find the Account ID**  
   - Scroll down in the **Overview** tab.  
   - You will see the **Account ID** under the "API" section.
