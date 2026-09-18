### Adding new php version to ECP

Every ecp-docker image is OpenLiteSpeed + lsphp now (no PHP-FPM/nginx images) - see
`ehm-api/docs/MANAGED_WORDPRESS.md`.

- Update ECP `ecp-docker/ecp-base/Dockerfile` (and `ecp-docker/managed-wordpress/Dockerfile`) to
  install the new `lsphpNN` package (plus its `-common`/`-mysql`/`-curl`/`-redis`/`-opcache`
  companions).
- Add the new version to the `php_versions` array in `ecp-docker/ecp-base/configure_lsphp_ini.sh`
  (and `managed-wordpress/configure_lsphp_ini.sh`) so opcache/redis/upload-size defaults get baked
  into that version's `php.ini` at build time.
- Rebuild and release the ECP Docker image(s) (`ecp-docker/*/release.js` or `release-all.js`).
- Register the new PHP version against the image in EHM's admin-managed docker images list (the
  image registry is DB/EhConfig-backed at runtime, refreshed via `DockerImagesService` - not a
  static file in `ehm-api`).
