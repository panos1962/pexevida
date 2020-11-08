<?php
require_once "../lib/standard.php";
Globals::header_data();
Globals::session_init();

Globals::session_clear("pektis");
Globals::session_clear("klidi");

Globals::klise_fige(0);
?>
