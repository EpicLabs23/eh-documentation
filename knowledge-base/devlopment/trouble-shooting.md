##### phpMyAdmin - Error You must set SignonURL!
This may happen for many reason. some are follwing.
* PhpMyAdmin cound't retrieve the right credentials of MySql. To trouble shoot this issue, uncomment the line `var_dump($apiData);die;` in `ehm-authentication/login.php` of PhpMyAdmin.
##### PhpMyAdmin - Warning: Trying to access array offset on value of type null in /var/www/html/ehm-authentication/login.php on line 55
* PhpMyAdmin couldn't find mysql user. To trouble shoot this issue, uncomment the line `var_dump($apiData);die;` in `ehm-authentication/login.php` of PhpMyAdmin.
##### EHM service is down, probably the host server restarted.
Run `pm2 resurrect` to start the EHM services from the last pm2 saved state.
##### Error: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.34' not found
OS / Node version mismatch between the build machine and the host machine.