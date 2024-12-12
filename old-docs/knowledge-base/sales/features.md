# Features

## EHM Features
### Simple and modern UI
The UI is so comfortable, and let your Server Management Scarcity goes away.

### ECP Account
Create and manage ECP accounts with comfort.

View resource usage by ECP accounts.

Add/Remove additinal domains for accounts.

Update ECP version of each users from EHM.

### Port Mapping
Assign and map port to accounts.

Manage which ports should be accesible for which accounts.

With this feature, a single account can run application on any port that we allow. This feature is very powerfull because your users are not bund to the default ports like 80 or 443.

### EHM user
Manage EHM panel user and define roles for those users.

### Package
You can create unlimited combination of resources to offer your customer / uesrs.

You may control following resources:
1. Disk Space.
2. RAM Limit.
3. CPU Usage priority.
4. Bandwidth Limitation (WIP)

### DNS Server
EHM offers you multiple DNS server option like BIND9, CloudFlare etc.


## ECP Features

### App management
The whole purpose of this software is to provide a Faster, Easier and Secured way of deploying application in a shared environment.

1. Need just few clicks to deploy an application.
2. Predefined language and framework templates.
3. Mulitple option to import the source codes.
    a. Clone from private and public Git repository.
    b. Drag & Drop source codes.
    c. Upload via built in uploader.
    d. One click installation of popular CMS and frameworks.
4. Application root directory and Web root directory can be different.
5. Manage running applications.
6. Define PHP version in application level, instead of account level.
7. Chose the domain name from your multiple domains that where should the application run.
8. Custom commands to adjust you special applications.
9. Application log view.
10. Web hook (WIP).
11. Very simple CI/CD for shared environment (WIP).
12. Open app in file manager.
13. Open app in terminal.

### Domain Management
Subdomains can be add / remove from the panel.
If the DNS is managed my EH, then the domain and subdomains will be added on the zone file automatically, othewise, you will have to point them to the public IP of the server from your own domain registerer.

### Port Mapping
Allows you to map your domains public ports that allowed from EHM with you application local port.

You can run HTTPS on non standard ports.

### Port status
To avoid conflict in your local application ports, you may check whether a port is available or not. you can also release a port from an existing service.

### Zone Editor
You can edit your domains' DNS records from your ECP account, if the zone is managing by EH DNS.

### Web Terminal
A web based terminal that has no limitation on commands. yet fully secured. 
Because of this lmit less terminal, If sometimes you feel something is missing from UI that you needed for your application to run in better, you can achieve that via terminal.

### Web based file manager
1. Beautiful relavant icon based on file type.
2. Browse through your files and folders smoothly like desktop.
3. Open files in powerful code editor.
4. Show hide hidden files.
5. Zip-Unzip files and folders.
6. Upload files.
7. Download files.
8. Add, remove, rename, move, copy, paste files and folders.
9. Change files and folder permission.
10. Bulk action.

### SSL Certificate
Multiple option for SSL certificate.
1. Free Lets Encrypt Certificate.
2. Free Self signed Certificate.
3. Upload 3rd party certificates (WIP)

For each of your domain and subdomain:
You can request new certificate, aplly existing certificate and update those certificates. all of them are in just couple clicks.
EH takes care of underlying complicated processes for you.

### Code Editor
Beautiful yet lightyweight code editor.

### PHP
1. Support of multiple available PHP versions.
2. Choose prefered PHP version in application level. instead of account level.
3. PHP .ini editor.

### Database
Support for all the popular Databases.
1. MySql
2. MongoDB (Optional)
3. PostgreSQL (WIP)

Shared DB server. But unlimited database and database user for each eaccount.

PhpMyAdmin with direct login. PhpMyadmin gives you full freedom to manage your data in databses.

### Cronjob (WIP)
### Email (WIP)

### Global Log
ECP logs allow you to view and flush logs.

### Resource Usage
Let you see your resource usage like, disk, DB etc.

### Update
Let you do self system update with latest version of ECP release.


## General Features
1. Cheaper license fee: comparing to other compatitors and features.
2. Awesome support: direct support from Epic labs, that ensures faster, quality and stabile support.
3. Highly secured: EH is using latest cutting edge technolgies to ensure security.
4. Tested for Ubuntu only, but, by architecture it should run on other Linux OS.
