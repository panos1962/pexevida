<?php
require_once "../lib/standard.php";
Globals::header_data();
Globals::session_init();

Diataxi::init();

if (Globals::perastike("kodikos"))
Diataxi::sose_nea();

elseif (Globals::perastike("lista"))
Diataxi::sose_oles();

elseif (Globals::perastike("diagrafi"))
Diataxi::diagrafi();

else
Diataxi::fere_data();

/*
TX BEGIN
DELETE
INSERT
TX END
*/

Globals::klise_fige();

class Diataxi {
	private static $pektis = NULL;

	public static function init() {
		if (Globals::oxi_pektis())
		Globals::klise_fige();

		self::$pektis = Globals::session_get("pektis");
		Globals::database();
	}

	public static function sose_oles() {
		$lista = Globals::perastike_must("lista");
		$n = count($lista);

		$pektis = Globals::asfales_sql(self::$pektis);
		$keep = array();

		for ($i = 0; $i < $n; $i++) {
			$query = "SELECT `onomasia`, `data` FROM `diataxi` " .
				"WHERE (`pektis` = " . $pektis . ") AND (`taxinomisi` = " .
				$lista[$i] . ")";
			$keep[$i] = Globals::first_row($query, MYSQLI_NUM);
		}

		Globals::autocommit(FALSE);

		$query = "DELETE FROM `diataxi` WHERE `pektis` = " . $pektis;
		Globals::query($query);

		for ($i = 0; $i < $n; $i++) {
			$query = "INSERT INTO `diataxi` (`pektis`, `taxinomisi`, `onomasia`, `data`) " .
				"VALUES (" . $pektis . "," . ($i + 1) . "," .
				Globals::asfales_sql($keep[$i][0]) . "," .
				Globals::asfales_sql($keep[$i][1]) . ")";
			Globals::query($query);
		}

		Globals::commit();

		self::fere_data();
	}

	public static function sose_nea() {
		$kodikos = Globals::perastike_must("kodikos");
		$onomasia = Globals::perastike_must("onomasia");
		$data = Globals::perastike_must("data");

		Globals::autocommit(FALSE);
		$query = "INSERT INTO `diataxi` (`pektis`, `taxinomisi`, `onomasia`, `data`) VALUES (" .
			Globals::asfales_sql(self::$pektis) . ",0," . Globals::asfales_sql($onomasia) .
			"," . Globals::asfales_sql($data) . ")";
		Globals::query($query);

		self::taxinomisi();
		Globals::commit();

		self::fere_data();
	}

	public static function fere_data() {
		$query = "SELECT `taxinomisi`, `onomasia`, `data` FROM `diataxi` WHERE `pektis` LIKE " .
			Globals::asfales_sql(self::$pektis) . " ORDER BY `taxinomisi`";

		$result = Globals::query($query);
		while ($row = $result->fetch_array(MYSQLI_NUM)) {
			print "{k:" . $row[0] . ",o:" . Globals::asfales_json($row[1]) .
				",d:" . Globals::asfales_json($row[2]) . "},";
		}
		$result->free();
	}

	public static function diagrafi() {
		$kodikos = Globals::perastike_must("diagrafi");

		Globals::autocommit(FALSE);
		$query = "DELETE FROM `diataxi` WHERE (`pektis` LIKE " . Globals::asfales_sql(self::$pektis) .
			") AND (`taxinomisi` = " .  $kodikos . ")";
		Globals::query($query);

		self::taxinomisi();
		Globals::commit();

		self::fere_data();
	}

	private static function taxinomisi() {
		$query = "SET @idx := 0";
		Globals::query($query);

		$query = "UPDATE `diataxi` SET `taxinomisi` = (SELECT @idx := @idx + 1) WHERE `pektis` LIKE " .
			Globals::asfales_sql(self::$pektis) . " ORDER BY `taxinomisi`";
		Globals::query($query);
	}
}
?>
