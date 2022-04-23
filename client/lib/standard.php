<?php

// Εκκινούμε τα PHP προγράμματά μας με τον καθορισμό του character set
// encoding για τα ίδια τα program source files. Αυτός είναι ο λόγος
// που οι εν λόγω functions δεν εκτελούνται στη φάση του initialization.

mb_internal_encoding("UTF-8");
mb_regex_encoding("UTF-8");
mb_http_output("UTF-8");

// Το όνομα του κατασκευαστή και ιδιοκτήτη του κώδικα δίνεται σε
// συμβολική σταθερά.

define("IDIOKTITIS_ONOMA", "Panos Papadopoulos");

// Το email του κατασκευαστή και ιδιοκτήτη του κώδικα δίνεται σε
// συμβολική σταθερά.

define("IDIOKTITIS_EMAIL", "prefadoros@hotmail.com");

// Η συμβολική σταθερά "KENTRO_IPOSTIRIXIS" περιέχει το URL του κέντρου
// υποστήριξης της βίδας στο διαδίκτυο.

// define("KENTRO_IPOSTIRIXIS", "http://www.pexevida.net");
define("KENTRO_IPOSTIRIXIS", "http://www.pexevida.blogspot.com");

// Η συμβολική σταθερά "VIDA_ISTOLOGIO" περιέχει το URL του ιστολογίου
// της βίδας στο διαδίκτυο.

define("VIDA_ISTOLOGIO", "http://www.pexevida.blogspot.com");

// Η συμβολική σταθερά "VIDA_TWITTER" περιέχει το URL του Twitter
// της βίδας στο διαδίκτυο.

define("VIDA_TWITTER", "https://www.twitter.com/pexevida");

// Η συμβολική σταθερά "VIDA_FACEBOOK" περιέχει το URL της ομάδας
// της βίδας στο διαδίκτυο.

define("VIDA_FACEBOOK", "https://www.facebook.com/groups/595913033870651/");

// Η function "klise_fige" επιτελεί εργασίες ομαλού τερματισμού του PHP
// προγράμματος, π.χ. κλείσιμο της database connection. Είναι καλό όλα
// τα PHP προγράμματά μας να τερματίζονται μέσω της "klise_fige" και όχι
// βάναυσα μέσω των "die", "exit" κλπ. Γι' αυτό το σκοπό φροντίζουμε να
// κληθεί η "klise_fige" κατά το κλείσιμο ούτως ή άλλως.

register_shutdown_function("Globals::klise_fige");

Globals::init();

class Globals {
	// Η property "init_ok" δείχνει αν έτρεξε η μέθοδος "init".
	// Η μέθοδος πρέπει να τρέχει το πολύ μια φορά.

	private static $init_ok = FALSE;

	// Η property "session_ok" δείχνει αν έτρεξε η μέθοδος "session".
	// Η μέθοδος πρέπει να τρέχει το πολύ μια φορά.

	private static $session_ok = FALSE;

	// Η property "klise_fige_ok" δείχνει αν έτρεξε η μέθοδος "klise_fige".
	// Η μέθοδος πρέπει να τρέχει το πολύ μια φορά.

	private static $klise_fige_ok = FALSE;

	// Η property "server" περιέχει το URI του server μαζί με το root directory
	// της εφαρμογής, και πρέπει να λήγει σε "/", π.χ. "http://www.pexevida.gr/",
	// "http://localhost/pexevida/" κοκ.

	public static $server = NULL;

	// Η property "www" είναι το πλήρες pathname του βασικού directory της
	// εφαρμογής, και πρέπει να λήγει σε "/", π.χ. "/home/panos/apps/pexevida/".

	public static $www = NULL;

	// Η property "skiser" περιέχει το URL του node server στον οποίο βρίσκεται
	// η εφαρμογή. Πρόκειται για το URL του server ακολουθούμενο από τον αριθμό
	// της πόρτας στην οποία ο node server ακούει αιτήματα της εφαρμογής, π.χ.
	// "http://www.pexevida.gr:8899", "http://localhost:8899" κοκ.

	public static $skiser = NULL;

	// Η property "db" είναι ο database handler μέσω του οποίου προσπελαύνουμε
	// την database της εφαρμογής.

	public static $db = NULL;

	// Η property "titlos" δείχνει τον τίτλο που θα εμφανίζεται στο επάνω μέρος
	// των σελίδων της εφαρμογής.

	public static $titlos = "Βίδα";

	// Η μέθοδος "init" καλείται άπαξ και θέτει διάφορες properties της ίδιας της
	// κλάσης, π.χ. το login name του τρέχοντος παίκτη, το όνομα του server κλπ.

	public static function init() {
		if (self::$init_ok) self::klise_fige("Globals::init: already called");
		self::$init_ok = TRUE;

		// Το array "_SERVER" πρέπει να έχει ήδη στηθεί, αλλιώς δεν μπορούμε να
		// προχωρήσουμε.

		if (!isset($_SERVER)) self::klise_fige("_SERVER: not set");
		if (!is_array($_SERVER)) self::klise_fige("_SERVER: not an array");

		// Ανιχνεύουμε το URI του server μας μέσω της "HTTP_HOST" property της
		// λίστας "_SERVER", περιοριζόμαστε δε σε συγκεκριμένες εγκαταστάσεις
		// μέσω του domain.

		switch ($_SERVER["HTTP_HOST"]) {
		case "localhost":
		case "127.0.0.1":
			self::$server = "http://" . $_SERVER["HTTP_HOST"] . "/pexevida/";
			self::$titlos = "Μισθοδοσία";
			break;
		case "www.pexevida.gr":
		case "www.pexevida.eu":
		case "www.pexevida.com":
			self::$server = "http://" . $_SERVER["HTTP_HOST"] . "/";
			break;
		case "pexevida.gr":
		case "pexevida.eu":
		case "pexevida.com":
			self::$server = "http://www." . $_SERVER["HTTP_HOST"] . "/";
			break;
		case "opasopa.net":
		case "www.opasopa.net":
		case "prefadoros.win":
		case "www.prefadoros.win":
			self::$server = "http://" . $_SERVER["HTTP_HOST"] . "/vida/";
			break;
		default:
			self::klise_fige($_SERVER["HTTP_HOST"] . ": unknown server");
		}

		// Ανιχνεύουμε την τοποθεσία της εφαρμογής μέσα στον hosting server μέσω
		// του pathname του παρόντος source file.

		self::$www = preg_replace("/client\/lib\/standard.php$/", "", __FILE__);

		// Στο βασικό directory της εφαρμογής υπάρχει subdirectory ".mistiko" στο
		// οποίο διατηρούμε ευαίσθητα δεδομένα και πληροφορίες που περιγράφουν
		// κομβικά σημεία της εφαρμογής, π.χ. το όνομα της database, την πόρτα
		// που «ακούει» ο server σκηνικού κλπ.

		// Η πόρτα στην οποία «ακούει» ο server σκηνικού είναι γραμμένη στο file
		// "sport" σε αυτό το directory.

		$sport = preg_replace("/[^0-9]/", "", file_get_contents(self::$www . "misc/.mistiko/sport"));
		if (!$sport) self::klise_fige("Αδυναμία αναγνώρισης πόρτας server σκηνικού");

		// Έχοντας ανιχνεύσει την πόρτα σκηνικής ενημέρωσης δημιουργούμε το πλήρες
		// URI για τα αιτήματα προς τον server σκηνικού.

		self::$skiser = "http://" . $_SERVER["HTTP_HOST"] . ":" . $sport . "/";
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	// Η μέθοδος "session_init" ενεργοποιεί το session και είναι καλό να καλείται
	// στην αρχή του PHP script.

	public static function session_init() {
		if (self::$session_ok) return;
		self::$session_ok = TRUE;

		// 24 * 7 * 3600 = 604800 (μια εβδομάδα)
		ini_set("session.gc_maxlifetime", "604800");
		session_set_cookie_params(604800);
		session_start();

		if (!isset($_SESSION)) self::klise_fige("_SESSION: not set");
		if (!is_array($_SESSION)) self::klise_fige("_SESSION: not an array");
	}

	// Η μέθοδος "session_set" δέχεται ως παράμετρο ένα key/value pair και θέτει
	// το σχετικό cookie.

	public static function session_set($tag, $val) {
		self::session_init();
		$_SESSION[$tag] = $val;
	}

	// Η μέθοδος "session_clear" δέχεται ως παράμετρο ένα string και διαγράφει
	// το σχετικό cookie.

	public static function session_clear($tag) {
		self::session_init();
		unset($_SESSION[$tag]);
	}

	// Η μέθοδος "is_session" δέχεται ως παράμετρο ένα string και επιστρέφει
	// TRUE εφόσον υπάρχει το αντίστοιχο session cookie.

	public static function is_session($tag) {
		self::session_init();
		return array_key_exists($tag, $_SESSION);
	}

	// Η μέθοδος "oxi_session" δέχεται ως παράμετρο ένα string και επιστρέφει
	// TRUE εφόσον ΔΕΝ υπάρχει το αντίστοιχο session cookie.

	public static function oxi_session($tag) {
		self::session_init();
		return !self::is_session($tag);
	}

	// Η μέθοδος "session" δέχεται ως παράμετρο ένα string και επιστρέφει
	// την τιμή του αντίστοιχου στοιχείου από το session array.

	public static function session_get($tag) {
		self::session_init();
		return $_SESSION[$tag];
	}

	// Η μέθοδος "session_fetch" δέχεται ως παράμετρο ένα string και επιστρέφει
	// την τιμή του αντίστοιχου στοιχείου από το session array. Αν δεν υπάρχει
	// σχετική τιμή, τότε το πρόγραμμα σταματά.

	public static function session_fetch($tag) {
		self::session_init();
		if (self::is_session($tag))
		return self::session_get($tag);

		Globals::klise_fige($tag . ": undefined session value");
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	// Η function "is_pektis" μας δείχνει αν γίνεται επώνυμη χρήση, αν δηλαδή
	// το πρόγραμμα «τρέχει» μέσω http κλήσης και αν υπάρχει στοιχείο "pektis"
	// στο session cookie.

	public static function is_pektis() {
		return self::is_session("pektis");
	}

	// Η function "oxi_pektis" μας δείχνει αν γίνεται ανώνυμη χρήση και έχει
	// νόημα μόνο εφόσον το πρόγραμμα «τρέχει» μέσω http κλήσης και όχι τοπικά
	// όπου έτσι κι αλλιώς δεν υφίσταται το sesssion cookie.

	public static function oxi_pektis() {
		return !self::is_pektis();
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	// Η function "url" δέχεται ένα string και το εμπλουτίζει με το URI του server
	// στον οποίον τρέχει η εφαρμογή, π.χ. για το "ikona/panel/enalagi.png" θα
	// επιστραφεί "http://www.pexexvida.gr/ikona/panel/enalagi.png", εφόσον η
	// εφαρμογή τρέχει στο "www.pexevida.gr".

	public static function url($s = "") {
		return self::$server . $s;
	}

	// Η "print_url" είναι παρόμοια με την "url" με μόνη διαφορά ότι αντί να
	// επιστρέφει το επίμαχο URL, το τυπώνει.

	public static function print_url($s = "") {
		print self::url($s);
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	// Η function "pathname" δέχεται ένα string και το μετασχηματίζει σε full pathname
	// του server στον οποίον τρέχει η εφαρμογή, π.χ. για το "ikona/panel/test.png"
	// θα επιστραφεί "/apps/pexevida/client/ikona/panel/text.png".

	public static function pathname($s) {
		return self::$www . $s;
	}

	// Η "print_www" είναι παρόμοια με την "www" με μόνη διαφορά ότι αντί να
	// επιστρέφει το επίμαχο pathname, το τυπώνει.

	public static function print_pathname($s) {
		print self::pathname($s);
	}

	// Η μέθοδος "diavase" είναι ήσσονος σημασίας καθώς υποκαθιστά την "require" και
	// μόνο σκοπό έχει την απλοποίηση των pathnames.

	public static function diavase($file) {
		require self::$www . "client/" . $file;
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	// Η μέθοδος "database" μας συνδέει με την database και την καλούμε όποτε υπάρχει
	// ανάγκη σύνδεσης με την database.

	public static function database() {
		if (self::$db)
		return;

		$dbhost = "localhost";
		$dbname = "pexevida";
		$dbuser = "pexevida";

		switch (self::$server) {
		case "http://127.0.0.1/pexevida/";
		case "http://localhost/pexevida/";
		case "http://opasopa.net/vida/";
		case "http://prefadoros.win/vida/";
		case "http://www.pexevida.gr/":
		case "http://www.pexevida.eu/":
		case "http://www.pexevida.com/":
			break;
		default:
			if (self::$server) print self::$server . ": ";
			self::klise_fige("unknown server (database)");	
		}

		$bekadb = preg_replace("/[^a-zA-Z0-9]/", "", @file_get_contents(self::$www . "misc/.mistiko/bekadb"));
		self::$db = @new mysqli($dbhost, $dbuser, $bekadb, $dbname);
		if (self::$db->connect_errno) {
			print "database connection failed (" . self::$db->connect_error . ")";
			self::$db = NULL;
			die(2);
		}
		@self::$db->set_charset("utf8") || self::klise_fige("cannot set character set (database)");
	}

	// Η μέθοδος "query" δέχεται ως πρώτη παράμετρο ένα SQL query και το εκτελεί.
	// Αν υπάρξει οποιοδήποτε δομικό πρόβλημα (όχι σχετικό με την επιτυχία ή μη
	// του query), τότε εκτυπώνεται μήνυμα λάθους και το πρόγραμμα σταματά.

	public static function query($query) {
		$result = self::$db->query($query);
		if ($result) return $result;

		print "SQL ERROR: " . $query . ": " . self::sql_error();
		self::klise_fige(2);
	}

	public static function sql_errno() {
		return self::$db->errno;
	}

	public static function sql_error() {
		return self::$db->error;
	}

	// Η μέθοδος "first_row" τρέχει ένα query και επιστρέφει την πρώτη γραμμή των
	// αποτελεσμάτων απελευθερώνοντας τυχόν άλλα αποτελέσματα.

	public static function first_row($query, $idx = MYSQLI_BOTH) {
		$result = self::query($query);
		while ($row = $result->fetch_array($idx)) {
			$result->free();
			break;
		}

		return $row;
	}

	public static function insert_id() {
		return self::$db->insert_id;
	}

	public static function affected_rows() {
		return self::$db->affected_rows;
	}

	public static function autocommit($on_off) {
		self::$db->autocommit($on_off) || self::klise_fige("autocommit failed");
	}

	public static function commit() {
		self::$db->commit() || self::klise_fige("commit failed");
	}

	public static function rollback() {
		self::$db->rollback() || self::klise_fige("rollback failed");
	}

	// Η μέθοδος "klidoma" επιχειρεί να θέσει κάποιο database lock που καθορίζεται
	// από το tag που περνάμε ως πρώτη παράμετρο. By default η μέθοδος θεωρεί ότι
	// δεν μπορεί να κλειδώσει εφόσον το κλείδωμα αποτύχει για 2 δευτερόλεπτα, αλλά
	// μπορούμε να περάσουμε μεγαλύτερο ή μικρότερο χρονικό διάστημα ως δεύτερη
	// παράμετρο.
	//
	// Η μέθοδος επιστρέφει TRUE εφόσον το κλείδωμα επιτύχει, αλλιώς επιστρέφει
	// FALSE.

	public static function klidoma($tag, $timeout = 2) {
		$query = "SELECT GET_LOCK(" . self::asfales_sql($tag) . ", " . $timeout . ")";
		$row = self::first_row($query, MYSQLI_NUM);
		if (!$row) return FALSE;
		return($row[0] == 1);
	}

	// Η μέθοδος "xeklidoma" ξεκλειδώνει κάποιο κλείδωμα που θέσαμε με την μέθοδο
	// "klidoma". Το tag του κλειδώματος που θα ξεκλειδωθεί περνιέται ως πρώτη
	// παράμετρος, ενώ ως δεύτερη παράμετρος μπορεί να περάσει TRUE/FALSE value
	// που δείχνει αν πριν το ξεκλείδωμα θα γίνει commit ή rollback αντίστοιχα.
	// Αν δεν περαστεί δεύτερη παράμετρος, τότε δεν γίνεται ούτε commit ούτε
	// rollback, οπότε μπορούμε να συνεχίσουμε στα πλαίσια της τρέχουσας
	// transaction.

	public static function xeklidoma($tag, $commit = NULL) {
		if (isset($commit)) {
			if ($commit) self::$db->commit();
			else self::$db->rollback();
		}

		$query = "DO RELEASE_LOCK(" . self::asfales_sql($tag) . ")";
		self::$db->query($query);
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	// Η μέθοδος "perastike" δέχεται ως παράμετρο ένα string και επιστρέφει
	// TRUE εφόσον έχει περαστεί αντίστοιχη GET/POST παράμετρος.

	public static function perastike($key) {
		return(isset($_REQUEST) && is_array($_REQUEST) && array_key_exists($key, $_REQUEST));
	}

	public static function den_perastike($key) {
		return !self::perastike($key);
	}

	// Η μέθοδος "perastike_must" επιτάσσει να έχει περαστεί η GET/POST παράμετρος που
	// περνάμε ως πρώτη παράμετρο. Αν έχει περαστεί η παράμετρος, τότε επιστρέφεται η
	// τιμή της παραμέτρου, αλλιώς το πρόγραμμα σταματά.

	public static function perastike_must($key, $msg = NULL) {
		if (self::perastike($key))
		return(is_string($_REQUEST[$key]) ? urldecode($_REQUEST[$key]) : $_REQUEST[$key]);

		Globals::header_error(isset($msg) ? $msg : $key . ": δεν περάστηκε παράμετρος");
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	// Η μέθοδος "asfales_sql" δέχεται ένα string και επιστρέφει το ίδιο string
	// αλλά τροποποιημένο ώστε να μην τίθεται θέμα SQL injection. Γίνεται επίσης
	// και διαφυγή των quotes. Το string επιστρέφεται μαζί με τα quotes που το
	// περικλείουν, εκτός και αν περάσουμε δεύτερη (false) παράμετρο.

	public static function asfales_sql($s, $string = TRUE) {
		if (get_magic_quotes_gpc()) $s = stripslashes($s);
		if (isset(self::$db)) $s = self::$db->real_escape_string($s);
		return($string ? "'" . $s . "'" : $s);
	}

	// Η μέθοδος "asfales_json" δέχεται ως παράμετρο ένα string και το επιστρέφει
	// τροποιημένο ώστε να μπορεί με ασφάλεια να ενταχθεί ως rvalue σε json objects
	// μαζί με τα quotes.

	public static function asfales_json($s) {
		$s = str_replace('\\', '\\\\', $s);
		return "'" . str_replace("'", "\'", $s) . "'";
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	public static function header_data() {
		header('Content-type: text/plain; charset=utf-8');
	}

	public static function header_json() {
		header('Content-Type: application/json; charset=utf-8');
	}

	public static function header_html() {
		header('Content-type: text/html; charset=utf-8');
	}

	public static function header_error($msg = "Server error") {
		header("HTTP/1.1 500 " . $msg);
		Globals::klise_fige($msg);
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	public static function login_check($login) {
		return preg_match("/^[a-zA-Z][a-zA-Z0-9!@#$%-+=:._]*$/", $login);
	}

	public static function email_check($email) {
		return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : NULL;
	}

	// Η μέθοδος "random_string" επιστρέφει ένα string συγκεκριμένου μήκους, αποτελούμενο
	// από χαρακτήρες που λαμβάνονται από παλέτα.

	public static function random_string($mikos, $paleta =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {
		$s = "";
		$n = strlen($paleta) - 1;
		for ($i = 0; $i < $mikos; $i++) {
			$s .= $paleta[mt_rand(0, $n)];
		}

		return $s;
	}

	public static function klise_fige($msg = 0) {
		if (self::$klise_fige_ok)
		return;

		self::$klise_fige_ok = TRUE;

		if (($msg !== 0) && array_key_exists("HTTP_HOST", $_SERVER))
		header("HTTP/1.1 500 Server error");

		if (isset(self::$db)) {
			self::$db->kill(self::$db->thread_id);
			self::$db->close();
		}

		while (@ob_end_flush());
		exit($msg);
	}
}

class Pektis {
	static $peparam_list = array(
		"DEVELOPER" => "ΟΧΙ",
		"ΑΓΑΠΗΜΕΝΟ" => "ΒΙΔΑ",
		"ΠΛΑΤΗ" => "ΜΠΛΕ",
	);

	public function __construct() {
		$this->login = NULL;
		$this->onoma = NULL;
		$this->email = NULL;
		$this->kodikos = NULL;
		$this->peparam = NULL;
	}

	public function dbfetch_pektis($login, $kodikos = NULL) {
		$query = "SELECT * FROM `pektis` WHERE `login` LIKE '" . $login . "'";
		if (isset($kodikos)) $query .= " AND `kodikos` = '" . sha1($kodikos) . "'";

		$row = Globals::first_row($query, MYSQLI_ASSOC);
		if (!$row) return $this;

		$this->login = $row["login"];
		$this->onoma = $row["onoma"];
		$this->email = $row["email"];
		$this->kodikos = $row["kodikos"];

		return $this;
	}

	public function dbfetch_peparam() {
		$this->peparam = array();
		$query = "SELECT `param`, `timi` FROM `peparam` WHERE `pektis` LIKE '" . $this->login . "'";
		$result = Globals::query($query);
		while ($row = $result->fetch_array(MYSQLI_NUM)) {
			$this->peparam[$row[0]] = $row[1];
		}
		$result->free();

		return $this;
	}

	public function login_set($login) {
		$this->login = $login;
		return $this;
	}

	public function peparam_get($param) {
		if (!isset($this->peparam))
		return self::$peparam_list[$param];

		if (!array_key_exists($param, $this->peparam))
		return self::$peparam_list[$param];

		return $this->peparam[$param];
	}

	public function agapimeno_get() {
		return $this->peparam_get("ΑΓΑΠΗΜΕΝΟ");
	}

	public function plati_get() {
		return $this->peparam_get("ΠΛΑΤΗ");
	}

	public function is_developer() {
		return($this->peparam_get("DEVELOPER") === "ΝΑΙ");
	}

	public function paraskinio_get() {
		return $this->peparam_get("ΠΑΡΑΣΚΗΝΙΟ");
	}

	public function photo_file() {
		return "photo/" . strtolower(substr($this->login, 0, 1)) . "/" . $this->login;
	}

	public function photo_src() {
		$no_photo = Globals::url("ikona/pektis/offline.png");
		if (!$this->login)
		return $no_photo;

		$file = $this->photo_file();
		$path = Globals::pathname("client/" . $file);
		return file_exists($path) ? Globals::url($file) . "?mt=" . filemtime($path) : $no_photo;
	}
}
?>
