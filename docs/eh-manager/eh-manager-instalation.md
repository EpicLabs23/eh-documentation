---
sidebar_position: 2
---

# EH Manager Installation

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
eh-manager install
eh-manager update
```
### Non-interactive use
```bash
eh-manager install -v v0.0.1 --dbpass drootp --apiurl http://localhost:2326 --os 24.04
eh-manager update --currentversion v0.0.1 --newversion v0.0.2 --dbpass drootp --apiurl http://localhost:2326 --os 24.04
```