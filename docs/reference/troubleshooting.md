##### phpMyAdmin - Error You must set SignonURL!
This may happen for many reason. some are follwing.
* PhpMyAdmin cound't retrieve the right credentials of MySql. To trouble shoot this issue, uncomment the line `var_dump($apiData);die;` in `ehm-authentication/login.php` of PhpMyAdmin.

##### PhpMyAdmin - Warning: Trying to access array offset on value of type null in /var/www/html/ehm-authentication/login.php on line 55
* PhpMyAdmin couldn't find mysql user. To trouble shoot this issue, uncomment the line `var_dump($apiData);die;` in `ehm-authentication/login.php` of PhpMyAdmin.

##### EHM service is down, probably the host server restarted.
Run `pm2 resurrect` to start the EHM services from the last pm2 saved state.

##### Error: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.34' not found
OS / Node version mismatch between the build machine and the host machine.

##### ECP didn't start after creating new account.
Check `pm2 log` of host machine for EHM log. Possible reasons are:
* User disk quota exceeds.

Check user quota `sudo quota -vs <username>`

Find all the files owened by a user: `sudo find / -user <username>`

Find larger directory of files by this user: `sudo find / -user <username> -type d -exec du -h --max-depth=1 {} + | sort -rh | head -n 10`

##### Dev ecp authentication failse
Check in the terminal if it says `error:  JsonWebTokenError: invalid signature`

Most probable reason is, may be another dev account was created after this account, and that account replaced the `ECP_JWT_SECRET` value in .env with his new `personal-key.txt`.

##### DNS is not working as per expected
It can be for various reason, may be DNS server or may be Nginx host or guest configure issue.

- Check the DNS with `dig`
- Check the nGinx config settings.
- Check if there is any error in nGinx config with `nginx -t`

##### Nginx 502 Bad Gateway
- Check if host's Nginx is running. `service nginx status`
- Check if host's Nginx syntax is ok `sudo nginx -t`
- Exec into ECP container and:
-- check if returns 502 `curl localhost` 
-- check if Nginx is running `service nginx status` 
-- check if Nginx syntax is ok `sudo nginx -t`
-- check Nginx log: `/var/log/nginx/error.log`
-- Check if curresponding php-fpm is running `service php8.1-fpm status`