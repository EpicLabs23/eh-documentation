### Intro
All the deploy_types are individual git repository under: `https://github.com/orgs/EH-One-Click-App-Installer/repositories` this organization.
### Directory Structure
Oneclick apps directory: `/epiclabs23/eh/oneclick-apps/`

### New version release
Remove old version source code from: `/epiclabs23/eh/oneclick-apps/repos/<deploy-type>` but keep the `.git` directory.
Then get the targeted version of the deploy_type, paste the code and customize accordingly.
Make a zip file of the source code, keeping the source code in top directory. which means, if we extract, it shouldn't be in another folder.

Now prepare the db file and keep in correspondig directory like: `sql-files` this directory is mounted in mariadb server for sake of data import.

From Git create a new release, on the release add the zipped files and sql file with the naming conventios.
Also add the version number on the app installation version selection dropdown.