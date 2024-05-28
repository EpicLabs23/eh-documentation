##### phpMyAdmin - Error You must set SignonURL!
This may happen for many reason. some are follwing.
* PhpMyAdmin cound't retrieve the right credentials of MySql. To trouble shoot this issue, uncomment the line `var_dump($apiData);die;` in `ehm-authentication/login.php` of PhpMyAdmin.
##### PhpMyAdmin - Warning: Trying to access array offset on value of type null in /var/www/html/ehm-authentication/login.php on line 55
* PhpMyAdmin couldn't find mysql user. To trouble shoot this issue, uncomment the line `var_dump($apiData);die;` in `ehm-authentication/login.php` of PhpMyAdmin.