### Adding new php version to ECP

- Update ECP `ecp-docker/ecp-base/Dockerfile` to install the expected PHP version.
- Update `ehm-api/src/modules/docker/docker.service.ts:startContainer` function to mount the fpm configuration pool and default php-ini
- Add supervisor config files under `ecp-docker/ecp-base/supervisor/php`
- Update `ecp-docker/ecp-base/config_php_fpm.sh` to keep the php config change synced.
- Rebuild the ECP Docker image.
- Update ECP account.
