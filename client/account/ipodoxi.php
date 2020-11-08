<?php
// Το παρόν υποδέχεται τα στοιχεία του παίκτη από τη φόρμα εγγραφής/ενημέρωσης
// στοιχείων λογαριασμού και σκοπό έχει την εγγραφή/ενημέρωση των σχετικών στοιχείων
// του παίκτη στην database, καθώς επίσης και το ανέβασμα/αλλαγή αρχείου εικόνας
// προφίλ. Στα στοιχεία του παίκτη περιλαμβάνονται και στοιχεία που αποθηκεύονται
// στς παραμέτρους παίκτη, π.χ. χρώμα παιγνιοχάρτων, φόντο κλπ.

// Με το τέλος του παρόντος πρέπει να τρέξει κάποια function στη σελίδα της φόρμας.
// Αυτό το επτυγχάνουμε με ασφάλεια καταχωρώντας function που θα κληθεί στο τέλος
// του παρόντος.

register_shutdown_function('Ipodoxi::klisimo');
require_once "../lib/standard.php";

// Αρχικά ελέγχουμε την πληρότητα και την ορθότητα των στοιχείων της φόρμας που
// έχουμε παραλάβει.

Ipodoxi::check();

// Στα στοιχεί που παραλάβαμε περιλαμβάνεται και το mode της σελίδας της φόρμας,
// αν δηλαδή πρόκειται για εγγραφή ή για ενημέρωση στοιχείων λογαριασμού και
// κάνουμε τις ανάλογες ενέργειες.

// Αν πρόκειται για εγγραφή νέου παίκτη, θα πρέπει ο παίκτης να ενταχθεί στην
// database.

if (Ipodoxi::is_egrafi())
Ipodoxi::egrafi();

// Αλλιώς πρόκειται για ενημέρωση στοιχεών υπάρχοντος παίκτη, οπότε θα πρέπει
// να ενημερωθούν τα στοιχεία του παίκτη στην database.

else
Ipodoxi::enimerosi();

// Τέλος, ανεβάζουμε τυχόν φωτογραφία του παίκτη.

Ipodoxi::fotografia();

class Ipodoxi {
	private static $mode = NULL;

	private static $login = NULL;
	private static $onoma = NULL;
	private static $email = NULL;
	private static $agapimeno = NULL;
	private static $plati = NULL;
	private static $kodikos = NULL;

	public static function check() {
		self::$mode = Globals::perastike_must("mode");

		// Κατά την εγγραφή περνάμε ως παράμετρο το πεδίο "login", ενώ
		// κατά την ενημέρωση το πεδίο "login" είναι disabled.

		if (Globals::perastike("login"))
		self::$login = $_POST["login"];

		// Κατά την ενημέρωση το πεδίο "login" είναι disabled, αλλά μπορούμε
		// να προσπελάσουμε το login name του χρήστη μέσω του session cookie.

		else
		self::$login = Globals::session_fetch("pektis");

		if (!Globals::login_check(self::$login))
		Globals::klise_fige("Λανθασμένο login name");

		self::$onoma = Globals::perastike_must("onoma");

		self::$email = Globals::perastike_must("email");
		if ((self::$email !== "") && (!Globals::email_check(self::$email)))
		Globals::klise_fige("Λανθασμένο email");

		self::$agapimeno = Globals::perastike_must("agapimeno");
		self::$plati = Globals::perastike_must("plati");

		// Αν πρόκειται για εγγραφή, ή έχει περαστεί ο παλαιός κωδικός, τότε
		// πρέπει να έχει περαστεί μη κενός νέος κωδικός για τον παίκτη.

		if (self::is_egrafi() || Globals::perastike("sokidok")) {
			self::$kodikos = Globals::perastike_must("sokidok1");
			if (self::$kodikos === '')
			Globals::klise_fige("PAS");
		}
	}

	public static function egrafi() {
		$klidi = Globals::perastike_must("klidi");
		Globals::database();
		Globals::autocommit(FALSE);
		self::egrafi_pektis();
		self::egrafi_peparam();
		Globals::commit();
		Globals::session_set("pektis", self::$login);
		Globals::session_set("klidi", $klidi);
	}

	private static function egrafi_pektis() {
		$query = "INSERT INTO `pektis` (`login`, `onoma`, `email`, `kodikos`) VALUES (" .
			Globals::asfales_sql(self::$login) . "," . Globals::asfales_sql(self::$onoma) . "," .
			Globals::asfales_sql(self::$email) . "," . Globals::asfales_sql(sha1(self::$kodikos)) . ")";
		Globals::$db->query($query);

		if (Globals::affected_rows() !== 1)
		Globals::klise_fige("DUP");
	}

	private static function egrafi_peparam() {
		$login = Globals::asfales_sql(self::$login);
		$query = "INSERT INTO `peparam` (`pektis`, `param`, `timi`) VALUES " .
			"(".$login.",".Globals::asfales_sql("ΠΛΑΤΗ").",".Globals::asfales_sql(self::$plati)."),".
			"(".$login.",".Globals::asfales_sql("ΑΓΑΠΗΜΕΝΟ").",".Globals::asfales_sql(self::$agapimeno).")";
		Globals::$db->query($query);

		if (Globals::affected_rows() !== 2)
		Globals::klise_fige("PRM");
	}

	public static function enimerosi() {
		Globals::database();
		Globals::autocommit(FALSE);
		self::enimerosi_pektis();
		self::enimerosi_peparam();
		Globals::commit();
	}

	private static function enimerosi_pektis() {
		// Σε περίπτωησ ενημέρωσης στοιχείων υπάρχοντος λογαριασμού, ελέγχουμε
		// πρώτα τα διαπιστευτήρια του παίκτη.

		$query = "SELECT `login` FROM `pektis` WHERE `login` LIKE " . Globals::asfales_sql(self::$login);
		if (Globals::perastike("sokidok"))
		$query .= " AND `kodikos` = BINARY " . Globals::asfales_sql(sha1($_POST["sokidok"]));
		$row = Globals::first_row($query);

		// Αν τα στοιχεία εισόδου του παίκτη δεν είναι ορθά, τότε δεν βρέθηκε
		// παίκτης με αυτά τα στοιχεία και επιστρέφουμε κωδικό λάθους πρόσβασης.

		$row || Globals::klise_fige("AUT");

		// Τα στοιχεία εισόδου του παίκτη είναι ορθά και προχωρούμε στην
		// ενημέρωση των στοιχείων στην database.

		$query = "UPDATE `pektis` SET `onoma` = " . Globals::asfales_sql(self::$onoma) . "," .
			"`email` = " . Globals::asfales_sql(self::$email);

		// Αν έχει περαστεί και ο τρέχων κωδικός παίκτη, τότε στα στοιχεία
		// της φόρμας ενημέρωσης στοιχείων λογαριασμού περιλαμβάνεται και
		// νέος κωδικός πρόσβασης.

		if (Globals::perastike("sokidok"))
		$query .= ", `kodikos` = " . Globals::asfales_sql(sha1(self::$kodikos));

		$query .= " WHERE `login` LIKE " . Globals::asfales_sql(self::$login);
		Globals::query($query);
	}

	private static function enimerosi_peparam() {
		$login = Globals::asfales_sql(self::$login);
		$query = "REPLACE INTO `peparam` (`pektis`, `param`, `timi`) VALUES " .
			"(".$login.",".Globals::asfales_sql("ΠΛΑΤΗ").",".Globals::asfales_sql(self::$plati)."),".
			"(".$login.",".Globals::asfales_sql("ΑΓΑΠΗΜΕΝΟ").",".Globals::asfales_sql(self::$agapimeno).")";
		Globals::query($query);
	}

	public static function fotografia() {
		if (!isset($_FILES))
		return;

		$foto = $_FILES["photo"];
		if (!$foto["tmp_name"])
		return;

		if ($foto["error"])
		Globals::klise_fige("IFE");

		if (!exif_imagetype($foto["tmp_name"])) {
			unlink($foto["tmp_name"]);
			Globals::klise_fige("IMG");
		}

		if ($foto["size"] > 100000) {
			unlink($foto["tmp_name"]);
			Globals::klise_fige("HIF");
		}

		$pektis = (new Pektis())->login_set(self::$login);
		$file = $pektis->photo_file();
		move_uploaded_file($foto["tmp_name"], "../" . $file);
	}

	public static function is_egrafi() {
		return(self::$mode === "egrafi");
	}

	public static function klisimo() {
		?>@EOD@<script type="text/javascript">parent.Account.ipodoxiCheck();</script><?php
	}
}
?>
