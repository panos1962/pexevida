<?php
require_once "../lib/selida.php";

Selida::head();
Isodos::init();

Selida::stylesheet('isodos/isodos');
Selida::javascript('isodos/isodos');

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_open();
Isodos::forma();
Selida::ofelimo_close();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

class Isodos {
	// Η μέθοδος "init" καλείται στην αρχή του head section της σελίδας εισόδου
	// και σκοπό έχει την ενδεχόμενη απευθείας μετάβαση του χρήστη στην  κεντρική
	// σελίδα της εφαρμογής.

	public static function init() {
		// Αν ο παίκτης έχει διαπιστευτήρια cookies, προχωρούμε στην κεντρική
		// σελίδα, όπου εφόσον το επιθυμεί μπορεί να επιχειρήσει έξοδο και
		// επανείσοδο.

		if (Globals::is_session("pektis"))
		self::susami();

		// Αν έχει δοθεί η παράμετρος "susami" στο url, προχωρούμε στην κεντρική
		// σελίδα. Αυτό το τέχνασμα χρησιμοποιείται στη δεύτερη φάση της εισόδου.

		if (Globals::perastike("susami"))
		self::susami();
	}

	// Η μέθοδος "susami" χρησιμοποιείται για να μας περάσει στην κεντρική σελίδα τής
	// εφαρμογής. Θα μπορούσαμε να περάσουμε με αμεσότερο τρόπο, υπάρχει όμως ένα
	// σημαντικό πρόβλημα: στις επαναφορτώσεις ερωτάται ο χρήστης σχετικά με τα post
	// data της φόρμας εισόδου.

	private static function susami() {
		?>
		<meta http-equiv="refresh" content="0;URL=<?php print Globals::$server; ?>" />
		</head>
		<body>
		</body>
		</html>
		<?php
		Globals::klise_fige();
	}

	public static function forma() {
		self::forma_open();

		self::pedio_login();
		self::pedio_kodikos();

		self::forma_panel();

		self::button_isodos();
		self::button_reset();
		self::button_akiro();

		self::forma_close();
	}

	private static function forma_open() {
		?>
		<div style="padding: 20px;">
		<form id="isodosForma" action="?susami" method="post">
		<div class="formaSoma">
		<div class="formaTitlos">
			Φόρμα Εισόδου
		</div>
		<table>
		<?php
	}

	private static function pedio_login() {
		?>
		<tr>
		<td class="formaPrompt">
			Login
		</td>
		<td class="formaPedio">
			<input id="login" name="login" type="text" />
		</td>
		</tr>
		<?php
	}

	private static function pedio_kodikos() {
		?>
		<tr>
		<td class="formaPrompt">
			Κωδικός
		</td>
		<td class="formaPedio">
			<input id="kodikos" name="kodikos" type="password" />
		</td>
		</tr>
		<?php
	}

	private static function forma_panel() {
		?>
		</table>
		</div>
		<div class="formaPanel">
		<?php
	}

	private static function button_isodos() {
		?>
		<button class="formaButton" type="submit">Είσοδος</button>
		<?php
	}

	private static function button_reset() {
		?>
		<button class="formaButton" type="reset">Reset</button>
		<?php
	}

	private static function button_akiro() {
		?>
		<button id="akiroButton" class="formaButton" type="button">Άκυρο</button>
		<?php
	}

	private static function forma_close() {
		?>
		</div>
		</form>
		</div>
		<?php
	}
}
?>
