<?php
require_once "../lib/selida.php";

Selida::head("Error!", "ikona/vida/error");
Selida::javascript('error/error');
Selida::body();
?>
<div>
<?php print Globals::perastike("minima") ? $_REQUEST["minima"] : "ERROR"; ?>
</div>
<hr />
<div>
<button onclick="self.location=Selida.server;">Επανείσοδος</button>
</div>
<?php
Selida::telos();
?>
