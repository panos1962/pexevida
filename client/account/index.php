<?php
require_once "../lib/selida.php";

Selida::head();
Selida::stylesheet('account/account');
Selida::javascript('account/account');
Account::init();

Selida::body();
Selida::toolbar();
Selida::fyi_pano();

Selida::ofelimo_open();
Account::forma();
Selida::ofelimo_close();

Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

class Account {
	public static $pektis = NULL;

	public static function init() {
		self::$pektis = new Pektis();

		if (Globals::oxi_pektis())
		return;

		Globals::database();
		self::$pektis->
		dbfetch_pektis($_SESSION["pektis"])->
		dbfetch_peparam();

		if (self::$pektis->is_developer()) {
			?>
			<script type="text/javascript">
			Account.developer = true;
			</script>
			<?php
		}
	}

	public static function forma() {
		self::forma_open();

		self::pedio_login();
		self::pedio_onoma();
		self::pedio_email();
		self::pedio_agapimeno();
		self::pedio_plati();
		self::pedio_photo();
		self::pedio_kodikos();
		self::fotografia();

		self::forma_panel();

		self::button_egrafi();
		self::button_reset();
		self::button_akiro();

		self::forma_close();

		self::ipodoxi_iframe();
	}

	private static function forma_open() {
		?>
		<div id="formaContainer">
		<form id="accountForma" method="post" enctype="multipart/form-data"
			target="ipodoxi" action="ipodoxi.php">
		<div id="formaSoma" class="formaSoma">
		<div class="formaTitlos">
			<?php print Globals::is_pektis() ?
			"Ενημέρωση στοιχείων" : "Δημιουργία"; ?> λογαριασμού
		</div>
		<input id="mode" name="mode" type="hidden" value="<?php
			print Globals::is_pektis() ? "enimerosi" : "egrafi"; ?>" />
		<input id="klidi" name="klidi" type="hidden" value="" />
		<input id="sokidok" name="sokidok" type="hidden" value="" />
		<input id="sokidok1" name="sokidok1" type="hidden" value="" />
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
			<input id="login" name="login" type="text" value="<?php
				if (Globals::is_pektis()) print self::$pektis->login; ?>" />
		</td>
		</tr>
		<?php
	}

	private static function pedio_onoma() {
		?>
		<tr>
		<td class="formaPrompt">
			Ονοματεπώμυμο
		</td>
		<td class="formaPedio">
			<input id="onoma" name="onoma" type="text" value="<?php
				print self::$pektis->onoma; ?>" />
		</td>
		</tr>
		<?php
	}

	private static function pedio_email() {
		?>
		<tr>
		<td class="formaPrompt">
			Email
		</td>
		<td class="formaPedio">
			<input id="email" name="email" type="text" value="<?php
				print self::$pektis->email; ?>" />
		</td>
		</tr>
		<?php
	}

	private static function pedio_agapimeno() {
		?>
		<tr>
		<td class="formaPrompt">
			Αγαπημένο παιχνίδι
		</td>
		<td class="formaPedio">
			<select name="agapimeno"><?php
			self::agapimeno_option("ΒΙΔΑ");
			self::agapimeno_option("ΜΠΟΥΡΛΟΤΟ");
			?></select>
		</td>
		</tr>
		<?php
	}

	private static function agapimeno_option($epilogi) {
		?><option value="<?php print $epilogi; ?>"<?php
			if (self::$pektis->agapimeno_get() === $epilogi)
			print " selected";
		?>><?php print $epilogi; ?></option><?php
	}

	private static function pedio_plati() {
		?>
		<tr>
		<td class="formaPrompt">
			Χρώμα παιγνιοχάρτων
		</td>
		<td class="formaPedio">
			<select name="plati"><?php
			self::plati_option("ΚΟΚΚΙΝΟ");
			self::plati_option("ΜΠΛΕ");
			self::plati_option("ΤΥΧΑΙΟ");
			?></select>
		</td>
		</tr>
		<?php
	}

	private static function plati_option($epilogi) {
		?><option value="<?php print $epilogi; ?>"<?php
			if (self::$pektis->plati_get() === $epilogi)
			print " selected";
		?>><?php print $epilogi; ?></option><?php
	}

	private static function pedio_photo() {
		?>
		<tr>
		<td class="formaPrompt">
			Φωτογραφία
		</td>
		<td class="formaPedio">
			<input id="fotofile" name="photo" type="file" />
		</td>
		</tr>
		<?php
	}

	private static function pedio_kodikos() {
		if (Globals::is_pektis()) {
			?>
			<tr id="kodikosAlagiRow">
			<td class="formaPrompt">
				<a id="kodikosAlagi" href="#">Αλλαγή κωδικού</a>
			</td>
			<td class="formaPedio">
			</td>
			</tr>
			<?php
		}

		?>
		<tr id="kodikos1Row">
		<td class="formaPrompt">
			<?php print Globals::is_pektis() ? "Νέος Κωδικός" : "Κωδικός"; ?>
		</td>
		<td class="formaPedio">
			<input id="kodikos1" name="kodikos1" type="password" />
		</td>
		</tr>

		<tr id="kodikos2Row">
		<td class="formaPrompt">
			Επανάληψη
		</td>
		<td class="formaPedio">
			<input id="kodikos2" name="kodikos2" type="password" />
		</td>
		</tr>
		<?php

		if (Globals::is_pektis()) {
			?>
			<tr id="kodikosRow">
			<td class="formaPrompt">
				Τρέχων κωδικός
			</td>
			<td class="formaPedio">
				<input id="kodikos" name="kodikos" type="password" />
			</td>
			</tr>
			<?php
		}
	}

	private static function fotografia() {
		?>
		<div id="fotoContainer">
		<img id="fotoIcon" src="<?php print self::$pektis->photo_src(); ?>" />
		</div>
		<?php
	}

	private static function forma_panel() {
		?>
		</tbody>
		</table>
		</div>
		<div class="formaPanel">
		<?php
	}

	private static function button_egrafi() {
		?>
		<button class="formaButton" type="submit"><?php print Globals::is_pektis() ?
			"Ενημέρωση" : "Εγγραφή"; ?></button>
		<?php
	}

	private static function button_reset() {
		?>
		<button id="reset" class="formaButton" type="reset">Reset</button>
		<?php
	}

	private static function button_akiro() {
		?>
		<button id="akiroButton" class="formaButton" type="button"><?php
			print Globals::is_pektis() ? "Επιστροφή" : "Άκυρο";?></button>
		<?php
	}

	private static function forma_close() {
		?>
		</div>
		</form>
		</div>
		<?php
	}

	// Το iframe που ακολουθεί είναι το target της φόρμας εγγραφής/ενημέρωσης, πράγμα
	// που σημαίνει ότι η action σελίδα της φόρμας θα εμφανιστεί μέσα σε αυτό το frame.
	// Θα μπορούσαμε να κάνουμε όλη τη δουλειά μέσω Ajax αλλά προτιμούμε αυτή τη μέθοδο
	// προκειμένου να διαχειριστούμε πιο εύκολα τα δεδομένα που ανεβάζει ο χρήστης, κυρίως
	// τη φωτογραφία προφίλ.
	//
	// Το iframe είναι αόρατο by default, αλλά μπορούμε να το κάνουμε ορατό μέσω του CSS
	// για το debugging.

	private static function ipodoxi_iframe() {
		?>
		<iframe id="ipodoxi" name="ipodoxi"></iframe>
		<?php
	}
}
?>
