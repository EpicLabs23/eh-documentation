---
slug: using-google-service-account-with-epic-backup
title: Using Google Service Account with Epic Backup
authors: mahmudur
tags: [google-drive, epic-backup]
time: 2025-01-08T09:19
---
To create a Google Service Account and use it for Google Drive API, follow these steps:

---

### **Step 1: Create a Google Cloud Project**
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project drop-down at the top and select **"New Project"**.
3. Enter a **project name** (e.g., `Drive API Project`).
4. Click **"Create"** and wait for the project to be created.

---

### **Step 2: Enable Google Drive API**
1. Inside the Google Cloud Console, go to **"APIs & Services" > "Library"**.
2. Search for **Google Drive API** and click on it.
3. Click **"Enable"**.

---

### **Step 3: Create a Service Account**
1. Go to **"IAM & Admin" > "Service Accounts"**.
2. Click **"Create Service Account"**.
3. Enter a **Service Account Name** (e.g., `drive-api-service`).
4. Click **"Create and Continue"**.
5. Assign the role **"Editor"** or **"Owner"** (or select **"Cloud Storage Admin"** if needed).
6. Click **"Continue"**, then **"Done"**.

<!-- truncate -->
---

### **Step 4: Generate JSON Key**
1. In the **Service Accounts** list, click on the created service account.
2. Go to the **"Keys"** tab.
3. Click **"Add Key"** > **"Create new key"**.
4. Select **"JSON"** and click **"Create"**.
5. A JSON file will be downloaded—this contains your **service account credentials**.

---

### **Step 5: Share Google Drive Access with Service Account**
1. Open [Google Drive](https://drive.google.com/).
2. Create a folder where the service account will store files.
3. Right-click on the folder > **"Share"**.
4. Copy the **email** from the service account JSON file (it looks like `your-service@your-project.iam.gserviceaccount.com`).
5. Paste it into the **Share with people and groups** field.
6. Set permissions to **"Editor"** and click **"Send"**.

---

### **Step 6: Use Service Account in Code**
You can now use the JSON key file in your application to authenticate with Google Drive API. 
