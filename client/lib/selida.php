<?php
if (!class_exists("Globals"))
require_once "standard.php";

Selida::init();

// Η κλάση "Selida" χρησιμοποιείται ως namespace για δομές και funtions που
// αφορούν στη μορφοποίηση των σελίδων της εφαρμογής.

class Selida {
	// Η property "init_ok" δείχνει αν έχει τρέξει ήδη η μέθοδος "init".
	// Η μέθοδος πρέπει να τρέχει το πολύ μια φορά.

	private static $init_ok = FALSE;

	private static $titlos;

	public static function init() {
		if (self::$init_ok)
		Globals::klise_fige("Selida::init: already called");
		self::$init_ok = TRUE;

		Globals::session_init();
	}

	public static function head($titlos = NULL, $icon = NULL) {
		if ($titlos === NULL)
		$titlos = Globals::$titlos;

		self::$titlos = $titlos;

		if ($icon === NULL)
		$icon = self::favicon_set();
		?>
		<!DOCTYPE html>
		<html>
		<head>

		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="description" content="Παίξτε βίδα on-line!" />
		<meta name="keywords" content="βίδα,μπελότ,μπουρλότο" />
		<meta name="author" content="<?php print IDIOKTITIS_ONOMA; ?>" />
		<meta name="copyright" content="Copyright by <?php print IDIOKTITIS_ONOMA; ?>. All Rights Reserved." />
		
		<link rel="icon" type="image/png" href="<?php Globals::print_url($icon . "64.png"); ?>" />
		<link rel="shortcut icon" href="<?php Globals::print_url($icon . "32.ico"); ?>" />
		<link rel="icon" href="<?php Globals::print_url($icon . "32.ico"); ?>" />
		<link rel="icon" type="image/vnd.microsoft.icon" href="<?php Globals::print_url($icon . "32.ico"); ?>" />
		<link rel="icon" type="image/x-icon" href="<?php Globals::print_url($icon . "32.ico"); ?>" />

		<link rel="canonical" href="http://www.pexevida.gr" />
		<title><?php print self::$titlos; ?></title>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.1/jquery.min.js"></script>
		<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css" />
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
		<script src="https://www.google.gr/coop/cse/brand?form=cse-search-box&lang=el"></script>

		<?php
		$debug = TRUE;
		$debug = FALSE;
		self::stylesheet("filajs/lib/filajs", $debug);
		self::stylesheet("lib/selida", $debug);

		if (file_exists("site/Boss!"))
		self::stylesheet("filajs/lib/filajsBoss", $debug);

		self::javascript("filajs/lib/filajs");
		self::javascript("filajs/lib/filajsDOM");
		self::javascript("common/globals");
		self::javascript("lib/selida");
		self::javascript("common/rcLocal");
		self::javascript("rcLocal");

		self::javascript_begin();
		?>
		Selida.server = <?php print Globals::asfales_json(Globals::$server); ?>;
		Selida.skiser = <?php print Globals::asfales_json(Globals::$skiser); ?>;
		Selida.timeDif = <?php print time(); ?> - Globals.tora();
		Selida.session = {};
		<?php
		foreach ($_SESSION as $tag => $val) {
			?>
			Selida.session[<?php print Globals::asfales_json($tag); ?>] = <?php
				print Globals::asfales_json($val); ?>;
			<?php
		}
		self::javascript_end();
	}

	private static function favicon_set() {
		$icon = "ikona/vida/vida";

		if (Globals::oxi_pektis())
		return $icon;

		Globals::database();
		$pektis = (new Pektis())->
		dbfetch_pektis($_SESSION["pektis"])->
		dbfetch_peparam();

		if ($pektis->agapimeno_get() === "ΜΠΟΥΡΛΟΤΟ")
		$icon = "ikona/belot/belot";

		return $icon;
	}

	public static function body() {
		?>
		</head>
		<body>
		<?php
	}

	public static function telos() {
		?>
		</body>
		</html>
		<?php
	}

	public static function stylesheet($css, $debug = FALSE) {
		$file = Globals::$www . "client/" . $css . ".css";
		if (!file_exists($file))
		return;

		$mtime = filemtime($file);
		?><link rel="stylesheet" type="text/css" href="<?php Globals::print_url($css); ?>.css?mt=<?php
			print $mtime; ?>" /><?php

		if (!$debug)
		return;

		$file = Globals::$www . "client/" . $css . ".debug.css";
		if (!file_exists($file))
		return;

		$mtime = filemtime($file);
		?><link rel="stylesheet" type="text/css" href="<?php Globals::print_url($css); ?>.debug.css?mt=<?php
			print $mtime; ?>" /><?php
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	// Η μέθοδος "javascript" δέχεται το όνομα ενός JavaScript source file και
	// παράγει το HTML script tag με το οποίο θα ενσωματώσουμε τον κώδικα στη
	// σελίδα μας. Η function προσθέτει το modification timestamp ως παράμετρο
	// στο URL του αρχείου, ώστε να αποφύγουμε το caching σε περίπτωση μεταβολής
	// του αρχείου. Επίσης, ελέγχει αν υπάρχει νεότερη minified version αυτού
	// του αρχείου και αν ναι, τότε προτιμά την minified version. Ως minified
	// version του αρχείου θεωρούμε το ίδιο αρχείο με κατάληξη ".min.js"

	public static function javascript($script) {
		$file = Globals::$www . "client/" . $script . ".js";
		if (!file_exists($file))
		return;

		$mtime = filemtime($file);
		$file1 = Globals::$www . "client/" . $script . ".min.js";
		if (file_exists($file1)) {
			$mtime1 = filemtime($file1);
			if ($mtime1 > $mtime) {
				$script .= ".min";
				$mtime = $mtime1;
			}
		}

		?><script type="text/javascript" src="<?php Globals::print_url($script); ?>.js?mt=<?php
			print $mtime; ?>" charset="UTF-8"></script><?php
	}

	public static function javascript_begin() {
		?>
		<script type="text/javascript" charset="UTF-8">
		//<![CDATA[
		<?php
	}

	public static function javascript_end() {
		?>
		//]]>
		</script>
		<?php
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	public static function fyi_pano() {
		?>
		<div id="fyiPano" class="fyi">
		</div>
		<?php
	}

	public static function fyi_kato() {
		?>
		<div id="fyiKato" class="fyi">
		</div>
		<?php
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	public static function tab_open() {
		?><div class="tab sinefo"><?php
	}

	public static function tab_close() {
		?></div><?php
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	public static function toolbar() {
		?>
		<div id="toolbar" class="zelatina perigrama">
			<table style="width: 100%;">
			<tbody>
			<tr>
			<td id="toolbarLeft"></td>
			<td id="toolbarCenter">
				<a target="kiv" href="<?php print KENTRO_IPOSTIRIXIS; ?>">
					<div id="toolbarCenterTitlos" class="sinefo">
						Μπουρλότο &#x2736; Βίδα
					</div>
				</a>
			</td>
			<td id="toolbarRight"></td>
			</tr>
			</tbody>
			</table>
		</div>
		<?php
	}

	public static function ribbon() {
		?>
		<div id="ribbon" class="zelatina perigrama">
			<table style="width: 100%;">
			<tbody>
			<tr>
			<td id="ribbonLeft">
				<a target="facebook" href="<?php print VIDA_FACEBOOK; ?>"><img class="ribbonIcon"
					src="<?php Globals::print_url("ikona/external/facebook.jpg"); ?>" /></a>
				<a target="twitter" href="<?php print VIDA_TWITTER; ?>"><img class="ribbonIcon"
					src="<?php Globals::print_url("ikona/external/twitter.png"); ?>" /></a>

				<?php
				/*
				<div id="donate" title="Buy me a beer!">
				<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
				<input type="hidden" name="cmd" value="_s-xclick" />
				<input type="hidden" name="hosted_button_id" value="HH23FLREGTKW4" />
				<input id="donateIcon" type="image" border="0" name="submit"
					src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
					alt="PayPal - The safer, easier way to pay online!" />
				<img alt="" border="0" width="1" height="1"
					src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" />
				</form>
				</div>
				*/
				?>
			</td>
			<td id="ribbonCenter">
				<?php self::tab_open(); ?>
				<a target="blog" href="<?php print VIDA_ISTOLOGIO; ?>">Ιστολόγιο</a>
				<?php self::tab_close(); ?>

				<?php self::tab_open(); ?>
				<a target="<?php print defined("COPYRIGHT_PAGE") ? "_self" : "copyright"; ?>"
					href="<?php Globals::print_url("copyright"); ?>">Copyright</a>
				<?php self::tab_close(); ?>
			</td>
			<td id="ribbonRight" class="sinefo">
				<div id="toolbarCopyright">
					&copy;<?php print IDIOKTITIS_ONOMA; ?>
					<span style="white-space: nowrap;">
					[<a target="_blank" title="Send email to &quot;<?php print IDIOKTITIS_EMAIL;
					?>&quot;" href="mailto:<?php print IDIOKTITIS_EMAIL; ?>"><img
					id="toolbarEmailIcon" src="<?php
					Globals::print_url("ikona/misc/email.png"); ?>" /></a>]</span> 2015&ndash;
				</div>
				<div id="toolbarFortos"></div>
			</td>
			</tr>
			</tbody>
			</table>
		</div>
		<?php
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////@

	public static function ofelimo_open() {
		?>
		<div id="ofelimo">
		<?php
	}

	public static function ofelimo_close() {
		?>
		</div>
		<?php
	}
}
?>
