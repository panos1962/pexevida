<?php
require_once "../lib/standard.php";
Globals::header_data();
Globals::session_init();

Globals::session_clear("pektis");
Globals::session_clear("klidi");

// Είμαστε σε κανονική λειτουργία του παρόντος script, οπότε πρέπει
// να έχουν περαστεί τα στοιχεία εισόδου και το κλειδί της μελλούμενης
// συνεδρίας.

$login = Globals::perastike_must("login");
$kodikos = Globals::perastike_must("kodikos");
$klidi = Globals::perastike_must("klidi");

// Συνδεόμαστε με την database και προχωρούμε σε έλεγχο ορθότητας των
// στοιχείων εισόδου.

Globals::database();
$query = "SELECT `login` FROM `pektis` " .
	"WHERE (`login` LIKE " . Globals::asfales_sql($login) . ") " .
	"AND (`kodikos` = BINARY " . Globals::asfales_sql(sha1($kodikos)) . ")";
$pektis = Globals::first_row($query);

// Αν δεν εντοπίστηκε ο παίκτης με τα δοθέντα στοιχεία εισόδου, τότε
// έχουμε απόπειρα εισβολής.

if (!$pektis) {
	print "Access denied";
	Globals::klise_fige();
}

// Δόθηκαν ορθά στοιχεία εισόδου, επομένως δημιουργούμε διαπιστευτήρια
// στο session cookie.

Globals::session_set("pektis", $login);
Globals::session_set("klidi", $klidi);
Globals::klise_fige();
?>
