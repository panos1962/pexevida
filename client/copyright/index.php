<?php
define("COPYRIGHT_PAGE", TRUE);
require_once "../lib/selida.php";

Selida::head();
Selida::stylesheet("copyright/copyright");
Selida::javascript("copyright/copyright");

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_open();
require "copyright.html";
Selida::ofelimo_close();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();
?>
