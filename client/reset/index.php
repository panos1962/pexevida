<?php

if (!array_key_exists("code", $_GET))
die("reset code missing");

$reset_code = $_GET["code"];

system("../../skiser/reset.sh " . $reset_code);

?>
