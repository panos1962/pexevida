<html>

<head>
<title>Reset server</title>
</head>

<body>
<?php

// Θα προσπαθήσουμε να τρέξουμε το πρόγραμμα "skiser/reset.sh" το οποίο
// ελέγχει την κατάσταση του server σκηνικού και, εφόσον διαπιστώσει ότι
// ο server σκηνικού δεν είναι ενεργός, επιχειρεί να εκκαθαρίσει την
// database και να επανεκκινήσει τον server σκηνικού.
//
// Το πρόγραμμα δέχεται ως παράμετρο έναν κωδικό με όνομα παραμέτρου "code"
// και τιμή ένα string το οποίο κατέχει αυτός που επιχειρεί την επανεκκίνηση.
// Εφόσον ο κωδικός είναι ορθός (αρχείο "misc/.mistiko/reset.codes"), το
// πρόγραμμα επανεκκινεί τον server σκηνικού.

if (!array_key_exists("code", $_GET))
die("reset code missing");

$reset_code = $_GET["code"];

?><p><?php

// Στο σημείο αυτό επιχειρούμε να τρέξουμε το πρόγραμμα επανεκκίνησης του
// server σκηνικού.

system("../../skiser/reset.sh " . $reset_code, $ret);

?></p><?php

// Αν η διαδικασία επανεκκίνησης δεν πήγε καλά, τότε τυπώνουμε σχετικό
// μήνυμα και διακόπτουμε την όλη διαδικασία.

if ($ret)
die("<p>Reset failed (status " . $ret . ")</p>");

// Στο σημείο αυτό ο server σκηνικού δείχνει να έχει επανεκκινήσει σωστά,
// οπότε καταργούμε τυχόν ενεργό session και φορτώνουμε τη βασική σελίδα
// του παιχνιδιού.

session_start();

if (is_array($_SESSION))
unset($_SESSION["pektis"]);

$url = "http://" .
	$_SERVER["SERVER_NAME"] .
	preg_replace("/\/reset.*/", "", $_SERVER["PHP_SELF"]);

header("Location: " . $url);
exit(0);

?>
</body>
