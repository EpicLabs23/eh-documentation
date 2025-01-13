---
sidebar_position: 2
---

# Installation

```bash
sudo su
cd /epiclabs23/eh
git clone https://github.com/EpicLabs23/eh-manager.git
cd /epiclabs23/eh/eh-manager
npm install
npm link
```
## Example Usage

### Interactive use
```bash
sudo su
eh-manager install-ehm
eh-manager update-epic-backup
```
### Non-interactive use
```bash
sudo su
eh-manager install-ehm -v v0.0.1 --dbpass drootp --apiurl http://localhost:2326 --os 24.04
eh-manager update-epic-backup --currentversion v0.0.1 --newversion v0.0.2 --dbpass drootp --apiurl http://localhost:2326 --os 24.04
```