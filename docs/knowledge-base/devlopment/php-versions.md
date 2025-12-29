### Adding new php version to ECP

- Update ECP `ecp-docker/ecp-base/Dockerfile` to install the expected PHP version.
- Update `/epiclabs23/eh/ehm/ehm-api/src/modules/docker/docker_images.ts` to add the new PHP version.Under curresponding image definition.
- Add supervisor config files under `ecp-docker/ecp-base/supervisor/php` for new PHP version.
- Update `ecp-docker/ecp-base/supervisor/php/groups.conf` file to add new PHP version under the group `php`.
- Update php version list in `ecp-docker/ecp-base/config_php_fpm.sh` this script generates mounted file contents.
- Rebuild the ECP Docker image.
- Update ECP account.
