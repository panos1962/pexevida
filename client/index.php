<?php

require_once "lib/selida.php";

if (Globals::is_pektis())
require_once "arena/index.php";

else
require_once "welcome/index.php";
?>
