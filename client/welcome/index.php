<?php
require_once "lib/selida.php";

Selida::head();
Selida::javascript('welcome/welcome');
Selida::body();
Selida::toolbar();
Selida::fyi_pano();
Selida::ofelimo_open();
?>
Welcome!
<?php
Selida::ofelimo_close();
Selida::fyi_kato();
Selida::ribbon();
Selida::telos();
?>
