---
sidebar_position: 2
---

# EH Manager Installation

```bash
cd /epiclabs23/eh
git clone https://github.com/EpicLabs23/eh-manager.git
cd /epiclabs23/eh/eh-manager
npm install
npm link
```
## Example Usage

### Interactive EHM Installation
```bash
eh-manager install
```
### Non-interactive EHM Installation
```bash
eh-manager install -v v0.0.1 --dbpass drootp --apiurl http://localhost:2326 --os 24.04
```