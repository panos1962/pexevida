<?php
require_once "lib/selida.php";

Selida::head();
Selida::stylesheet('arena/arena');
Selida::stylesheet('arena/tsoxa');
//Selida::stylesheet('arena/debug');

Selida::javascript('lib/panel');
Selida::javascript('common/vida');
Selida::javascript('common/skiniko');
Selida::javascript('common/energia');
Selida::javascript('common/kinisi');
Selida::javascript('common/partida');
Selida::javascript('common/pliromi');
Selida::javascript('arena/arena');
Selida::javascript('arena/skiniko');
Selida::javascript('arena/online');
Selida::javascript('arena/trapezi');
Selida::javascript('arena/tsoxa');
Selida::javascript('arena/aeras');
Selida::javascript('arena/efoplismos');
Selida::javascript('arena/ego');
Selida::javascript('arena/kinisi');
Selida::javascript('arena/sizitisi');
Selida::javascript('arena/paraskinio');
Selida::javascript('arena/dialogos');
Selida::javascript('arena/diataxi');
Selida::javascript('arena/kafinfo');
Selida::javascript('arena/profinfo');
Selida::javascript('arena/apanel');
Selida::javascript('arena/mpanel');
Selida::javascript('arena/bpanel');
Selida::javascript('arena/kpanel');
Selida::javascript('arena/dpanel');
Selida::javascript('arena/tpanel');
Selida::javascript('arena/cpanel');
Selida::javascript('arena/lpanel');
Selida::javascript('arena/zpanel');
Selida::javascript('arena/epanel');
Selida::body();
Arena::diafimisi();
Selida::toolbar();
Selida::fyi_pano();
Selida::ofelimo_open();
Arena::pektis();
Arena::kafenio();
Arena::trapezi();
Arena::partida();
Arena::sizitisi();
Arena::kafinfo();
Arena::profinfo();
Arena::dialogos();
Selida::ofelimo_close();
Selida::fyi_kato();
Selida::ribbon();
Selida::telos();

class Arena {
	public static function diafimisi() {
		$diafimisi = "site/diafimisi.php";
		if (!file_exists(Globals::$www . "client/" . $diafimisi)) return;
		?>
		<div id="diafimisi">
			<?php Globals::diavase($diafimisi); ?>
		</div>
		<?php
	}

	public static function pektis() {
		?>
		<div id="pektisEnotita" class="enotita"></div>
		<?php
	}

	public static function kafenio() {
		?>
		<div id="mpanel" class="panelV"></div>
		<div id="kafenioEnotita" class="enotita"></div>
		<?php
	}

	public static function trapezi() {
		?>
		<div id="kpanel" class="panelV"></div>
		<div id="trapeziEnotita" class="enotita"></div>
		<?php
	}

	public static function partida() {
		?>
		<div id="tpanel" class="panelV"></div>
		<div id="pexnidiEnotita" class="enotita"></div>
		<?php
	}

	public static function sizitisi() {
		?>
		<div id="cpanel" class="panelV"></div>
		<div id="partidaEnotita" class="enotita"></div>
		<div id="epanel" class="panelV"></div>
		<?php
	}

	public static function kafinfo() {
		?>
		<div id="kafinfo"></div>
		<?php
	}

	public static function profinfo() {
		?>
		<div id="profinfo"></div>
		<?php
	}

	public static function dialogos() {
		?>
		<div id="dialogos"></div>
		<?php
	}
}
?>
