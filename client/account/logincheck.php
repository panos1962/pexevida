<?php
require_once "../lib/standard.php";
Globals::database();

$query = "SELECT `login` FROM `pektis` WHERE `login` LIKE " . Globals::asfales_sql($_REQUEST["login"] . "%");
if (Globals::first_row($query, MYSQLI_NUM))
print "Η εγγραφή υπάρχει ήδη στην database";
