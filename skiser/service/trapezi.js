////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: trapezi');

Service.trapezi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.neo = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoKafenio())
	return;

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.trapezi.neo1(nodereq);
	});
};

Service.trapezi.neo1 = function(nodereq) {
	var query, kafenio;

	kafenio = nodereq.kafenioGet().kafenioKodikosGet();
	query = 'INSERT INTO `trapezi` (`kafenio`) VALUES (' + kafenio + ')';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows != 1) {
			conn.rollback();
			return nodereq.error('Απέτυχε η δημιουργία τραπεζιού');
		}

		nodereq.data.kafenio = kafenio;
		nodereq.data.trapezi = res.insertId;
		Service.trapezi.neo2(nodereq);

	});
};

Service.trapezi.neo2 = function(nodereq) {
	var query;

	nodereq.data.slogin = nodereq.loginGet().json();
	query = 'INSERT INTO `sinthesi` (`trapezi`, `pektis`, `thesi`) VALUES (' +
		nodereq.data.trapezi + ', ' + nodereq.data.slogin + ', 1)';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows == 1)
		return Service.trapezi.neo3(nodereq);

		conn.rollback();
		nodereq.error('Απέτυχε η τοποθέτηση παίκτη στο τραπέζι');
	});
};

Service.trapezi.neo3 = function(nodereq) {
	var query;

	query = 'REPLACE INTO `prosklisi` (`trapezi`, `apo`, `pros`, `epidosi`) VALUES (' +
		nodereq.data.trapezi + ', ' + nodereq.data.slogin + ', ' +
		nodereq.data.slogin + ', NOW())';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows < 1) {
			conn.rollback();
			return nodereq.error('Απέτυχε η αποστολή πρόσκλησης');
		}

		nodereq.data.bourloto = nodereq.pektisGet().pektisAgapimenoIsBelot();
		if (nodereq.data.bourloto)
		Service.trapezi.neo4(nodereq);

		else
		Service.trapezi.neo5(nodereq);

	});
};

Service.trapezi.neo4 = function(nodereq) {
	var query;

	query = 'INSERT INTO `trparam` (`trapezi`, `param`, `timi`) VALUES ' +
		"(" + nodereq.data.trapezi + ", 'ΒΙΔΑ', 'ΟΧΙ')";
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.trapezi.neo5(nodereq);

		conn.rollback();
		nodereq.error('Απέτυχε η εισαγωγή παραμέτρου "ΒΙΔΑ"');
	});
};

Service.trapezi.neo5 = function(nodereq) {
	var kinisiTrapezi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisiTrapezi = new Kinisi('NT');
	kinisiTrapezi.data = {
		trapezi: nodereq.data.trapezi,
		kafenio: nodereq.data.kafenio,
		pektis: nodereq.loginGet(),
	};

	if (nodereq.data.bourloto)
	kinisiTrapezi.data.bourloto = 1;

	kinisiProsklisi = new Kinisi('PL');
	kinisiProsklisi.data = {
		trapezi: nodereq.data.trapezi,
		apo: nodereq.loginGet(),
		pros: nodereq.loginGet(),
	};

	skiniko.
	skinikoKinisiProcess(kinisiTrapezi).
	skinikoKinisiProcess(kinisiProsklisi).
	skinikoKinisiPush(kinisiTrapezi, false).
	skinikoKinisiPush(kinisiProsklisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.epilogi = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('trapezi', true))
	return;

	nodereq.data.trapezi = skiniko.skinikoTrapeziGet(nodereq.parametrosGet('trapezi'));
	if (!nodereq.data.trapezi)
	return nodereq.error('Δεν βρέθηκε το τραπέζι');

	nodereq.data.kafenio = nodereq.data.trapezi.trapeziKafenioGet();
	if (!skiniko.skinikoKafenioGet(nodereq.data.kafenio))
	return nodereq.error('Ακαθόριστο καφενείο');

	nodereq.data.thesi = nodereq.data.trapezi.trapeziThesiPekti(nodereq.loginGet());

	if ((!nodereq.data.thesi) && nodereq.data.trapezi.trapeziIsPrive() &&
	nodereq.data.trapezi.trapeziOxiProsklisi(nodereq.loginGet()))
	return nodereq.error('Το τραπέζι είναι πριβέ');

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.trapezi.epilogi1(nodereq);
	});
};

Service.trapezi.epilogi1 = function(nodereq) {
	var query;

	query = "UPDATE `sinedria` SET `trapezi` = " + nodereq.parametrosGet('trapezi') +
		", `kafenio` = " + nodereq.data.kafenio;

	if (nodereq.data.thesi)
	query += ", `thesi` = " + nodereq.data.thesi + ", `simetoxi` = 'ΠΑΙΚΤΗΣ'";

	else
	query += ", `thesi` = 1, `simetoxi` = 'ΘΕΑΤΗΣ'";

	query += " WHERE `pektis` = " + nodereq.loginGet().json();
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows == 1)
		return Service.trapezi.epilogi2(nodereq, conn);

		conn.rollback();
		nodereq.error('Απέτυχε η επιλογή τραπεζιού');
	});
};

Service.trapezi.epilogi2 = function(nodereq, conn) {
	var kinisi;

	conn.commit();
	nodereq.end();

	kinisi = new Kinisi('ET');
	kinisi.data = {
		pektis: nodereq.loginGet(),
		trapezi: parseInt(nodereq.parametrosGet('trapezi')),
		kafenio: nodereq.data.kafenio,
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.exodos = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi())
	return;

	nodereq.data.trapezi = nodereq.trapeziGet();
	nodereq.data.trapeziKodikos = nodereq.data.trapezi.trapeziKodikosGet();
	nodereq.data.login = nodereq.loginGet();
	nodereq.data.slogin = nodereq.data.login.json();
	nodereq.data.thesi = nodereq.data.trapezi.trapeziThesiPekti(nodereq.data.login);

	if (!nodereq.trapeziKlidoma('trapeziExodos'))
	return;

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		if (nodereq.data.thesi)
		return Service.trapezi.exodosPektis(nodereq);

		Service.trapezi.exodosSinedria(nodereq);
	});
};

Service.trapezi.exodosPektis = function(nodereq) {
	var query;

	query = 'REPLACE `sinthesi` (`trapezi`, `thesi`, `pektis`, `exodos`) VALUES (' +
		nodereq.data.trapeziKodikos + ', ' + nodereq.data.thesi + ', ' +
		nodereq.data.slogin + ', NOW())';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.trapezi.exodosSinedria(nodereq);

		conn.rollback();
		nodereq.error('Απέτυχε η αποχώρηση παίκτη από το τραπέζι');
	});
};

Service.trapezi.exodosSinedria = function(nodereq) {
	var query;

	query = 'UPDATE `sinedria` SET `trapezi` = NULL, `thesi` = NULL, ' +
		'`simetoxi` = NULL WHERE `pektis` = ' + nodereq.data.slogin;
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.trapezi.exodosTelos(nodereq);

		nodereq.data.conn.rollback();
		nodereq.error('Απέτυχε η αποχώρηση από το τραπέζι');
	});
};

Service.trapezi.exodosTelos = function(nodereq) {
	var kinisi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('XT');
	kinisi.data = {
		pektis: nodereq.loginGet(),
		trapezi: nodereq.parametrosGet('trapezi'),
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.diataxi = function(nodereq) {
	var thesi;

	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi())
	return;

	if (nodereq.denPerastike('thesi1', true))
	return;

	if (nodereq.denPerastike('thesi2', true))
	return;

	nodereq.data.trapezi = nodereq.trapeziGet();
	nodereq.data.trapeziKodikos = nodereq.data.trapezi.trapeziKodikosGet();

	nodereq.data.pektis = nodereq.loginGet();
	if (nodereq.data.trapezi.trapeziOxiRithmisi(nodereq.data.pektis))
	return nodereq.error('Access denied!');

	thesi = nodereq.sinedriaGet().sinedriaThesiGet();
	if (!thesi)
	return nodereq.error('Ακαθόριστη θέση ρύθμισης');

	nodereq.data.thesi1 = parseInt(nodereq.parametrosGet('thesi1'));
	nodereq.data.thesi2 = parseInt(nodereq.parametrosGet('thesi2'));

	nodereq.data.pektis1 = nodereq.data.trapezi.trapeziPektisGet(nodereq.data.thesi1);
	nodereq.data.pektis2 = nodereq.data.trapezi.trapeziPektisGet(nodereq.data.thesi2);

	if (nodereq.data.pektis1 === nodereq.data.pektis2)
	return nodereq.end();

	if (!nodereq.trapeziKlidoma('trapeziDiataxi'))
	return;

	nodereq.data.conn = DB.connection();
	nodereq.data.conn.transaction(function(conn) {
		Service.trapezi.diataxi3(nodereq);
	});
};

Service.trapezi.diataxi3 = function(nodereq) {
	var query;

	query = 'REPLACE `sinthesi` (`trapezi`, `thesi`, `pektis`) VALUES (' +
		nodereq.data.trapeziKodikos + ', ' + nodereq.data.thesi1 + ', ' +
			(nodereq.data.pektis2 ? nodereq.data.pektis2.json() : 'NULL') + '), (' +
		nodereq.data.trapeziKodikos + ', ' + nodereq.data.thesi2 + ', ' +
			(nodereq.data.pektis1 ? nodereq.data.pektis1.json() : 'NULL') + ')';

	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows < 1) {
			nodereq.data.conn.rollback();
			return nodereq.end();
		}

		Service.trapezi.diataxi4(nodereq);
	});
};

Service.trapezi.diataxi4 = function(nodereq) {
	var kinisi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('DX');
	kinisi.data = {
		pektis: nodereq.data.pektis,
		trapezi: nodereq.data.trapeziKodikos,
		sinthesi: {},
	};

	if (!nodereq.data.pektis1)
	nodereq.data.pektis1 = '';

	if (!nodereq.data.pektis2)
	nodereq.data.pektis2 = '';

	kinisi.data.sinthesi[nodereq.data.thesi1] = nodereq.data.pektis2;
	kinisi.data.sinthesi[nodereq.data.thesi2] = nodereq.data.pektis1;

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.apontaOn = function(nodereq) {
	return Service.trapezi.trparam(nodereq, 'ΑΠΟΝΤΑ', 'ΝΑΙ');
};

Service.trapezi.apontaOff = function(nodereq) {
	return Service.trapezi.trparam(nodereq, 'ΑΠΟΝΤΑ', 'ΟΧΙ');
};

Service.trapezi.vidaOkto = function(nodereq) {
	return Service.trapezi.trparam(nodereq, 'ΟΚΤΩ', 'ΝΑΙ');
};

Service.trapezi.vidaDekaexi = function(nodereq) {
	return Service.trapezi.trparam(nodereq, 'ΟΚΤΩ', 'ΟΧΙ');
};

Service.trapezi.komeniDisallow = function(nodereq) {
	return Service.trapezi.trparam(nodereq, 'ΚΟΜΜΕΝΗ', 'ΟΧΙ');
};

Service.trapezi.komeniAllow = function(nodereq) {
	return Service.trapezi.trparam(nodereq, 'ΚΟΜΜΕΝΗ', 'ΝΑΙ');
};

Service.trapezi.dilosiDisallow = function(nodereq) {
	return Service.trapezi.trparam(nodereq, 'ΔΗΛΩΣΗ', 'ΟΧΙ');
};

Service.trapezi.dilosiAllow = function(nodereq) {
	return Service.trapezi.trparam(nodereq, 'ΔΗΛΩΣΗ', 'ΝΑΙ');
};

Service.trapezi.elefthero = function(nodereq) {
	return Service.trapezi.trparam(nodereq, 'ΙΔΙΟΚΤΗΤΟ', 'ΟΧΙ');
};

Service.trapezi.idioktito = function(nodereq) {
	return Service.trapezi.trparam(nodereq, 'ΙΔΙΟΚΤΗΤΟ', 'ΝΑΙ');
};

Service.trapezi.belot = function(nodereq) {
	return Service.trapezi.trparam(nodereq, 'ΒΙΔΑ', 'ΟΧΙ');
};

Service.trapezi.vida = function(nodereq) {
	return Service.trapezi.trparam(nodereq, 'ΒΙΔΑ', 'ΝΑΙ');
};

Service.trapezi.prive = function(nodereq) {
	return Service.trapezi.trparam(nodereq, 'ΠΡΙΒΕ', 'ΝΑΙ');
};

Service.trapezi.dimosio = function(nodereq) {
	return Service.trapezi.trparam(nodereq, 'ΠΡΙΒΕ', 'ΟΧΙ');
};

Service.trapezi.lixiSet = function(nodereq) {
	var lixi;

	if (nodereq.denPerastike('lixi'))
	return nodereq.error('Ακαθόριστη λήξη');

	lixi = nodereq.parametrosGet('lixi');
	if (isNaN(parseInt(lixi)))
	return nodereq.error('Λανθασμένη λήξη');

	return Service.trapezi.trparam(nodereq, 'ΛΗΞΗ', lixi); 
};

Service.trapezi.trparam = function(nodereq, param, timi) {
	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi())
	return;

	nodereq.data.trapezi = nodereq.trapeziGet();
	nodereq.data.trapeziKodikos = nodereq.data.trapezi.trapeziKodikosGet();

	nodereq.data.pektis = nodereq.loginGet();
	if (nodereq.data.trapezi.trapeziOxiRithmisi(nodereq.data.pektis))
	return nodereq.error('Access denied!');

	nodereq.data.param = param;
	nodereq.data.timi = timi;
	nodereq.data.conn = DB.connection();

	if (!nodereq.trapeziKlidoma('trapeziDiataxi'))
	return;

	nodereq.data.conn.transaction(function(conn) {
		Service.trapezi.trparam1(nodereq);
	});
};

Service.trapezi.trparam1 = function(nodereq) {
	var query;

	query = 'REPLACE `trparam` SET `trapezi` = ' + nodereq.data.trapeziKodikos +
		', `param` = ' + nodereq.data.param.json() + ', `timi` = ' + nodereq.data.timi.json();
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.trapezi.trparam2(nodereq);

		conn.rollback();
		nodereq.error('Απέτυχε η ενημέρωση παραμέτρου τραπεζιού');
	});
};

Service.trapezi.trparam2 = function(nodereq) {
	var kinisi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('TP');
	kinisi.data = {
		pektis: nodereq.data.pektis,
		trapezi: nodereq.data.trapeziKodikos,
		param: nodereq.data.param,
		timi: nodereq.data.timi,
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.theatisPektis = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi())
	return;

	nodereq.data.login = nodereq.loginGet();
	nodereq.data.trapezi = nodereq.trapeziGet();
	nodereq.data.trapeziKodikos = nodereq.data.trapezi.trapeziKodikosGet();

	if (nodereq.data.trapezi.trapeziOxiProsklisi(nodereq.data.login))
	return nodereq.error('Δεν βρέθηκε πρόσκληση');

	if (nodereq.data.trapezi.trapeziThesiPekti(nodereq.data.login))
	return nodereq.error('Είστε ήδη παίκτης στο τραπέζι');

	nodereq.data.thesi = nodereq.sinedriaGet().sinedriaThesiGet();
	if (!nodereq.data.thesi)
	nodereq.data.thesi = nodereq.data.trapezi.trapeziKeniThesi();

	else if (nodereq.data.trapezi.trapeziPektisGet(nodereq.data.thesi))
	nodereq.data.thesi = nodereq.data.trapezi.trapeziKeniThesi();

	if (!nodereq.data.thesi)
	return nodereq.error('Δεν υπάρχει κενή θέση στο τραπέζι');

	if (!nodereq.trapeziKlidoma('theatisPektis'))
	return;

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.trapezi.theatisPektis1(nodereq);
	});
};

Service.trapezi.theatisPektis1 = function(nodereq) {
	var query, kafenio;

	query = 'REPLACE INTO `sinthesi` (`trapezi`, `pektis`, `thesi`) VALUES (' +
		nodereq.data.trapeziKodikos + ', ' + nodereq.data.login.json() + ', ' +
		nodereq.data.thesi + ')';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.trapezi.theatisPektis2(nodereq);

		nodereq.data.conn.rollback();
		nodereq.error('Απέτυχε η μετατροπή θεατή σε παίκτη');
	});
};

Service.trapezi.theatisPektis2 = function(nodereq) {
	var kinisi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('HP');
	kinisi.data = {
		trapezi: nodereq.data.trapeziKodikos,
		pektis: nodereq.data.login,
		thesi: nodereq.data.thesi,
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.pektisTheatis = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi())
	return;

	nodereq.data.login = nodereq.loginGet();
	nodereq.data.trapezi = nodereq.trapeziGet();
	nodereq.data.trapeziKodikos = nodereq.data.trapezi.trapeziKodikosGet();

	nodereq.data.thesi = nodereq.data.trapezi.trapeziThesiPekti(nodereq.data.login);
	if (!nodereq.data.thesi)
	return nodereq.error('Δεν είστε παίκτης στο τραπέζι');

	if (!nodereq.trapeziKlidoma('theatisPektis'))
	return;

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.trapezi.pektisTheatis1(nodereq);
	});
};

Service.trapezi.pektisTheatis1 = function(nodereq) {
	var query, kafenio;

	query = 'REPLACE INTO `sinthesi` (`trapezi`, `pektis`, `thesi`) VALUES (' +
		nodereq.data.trapeziKodikos + ', NULL, ' + nodereq.data.thesi + ')';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.trapezi.pektisTheatis2(nodereq);

		nodereq.data.conn.rollback();
		nodereq.error('Απέτυχε η μετατροπή παίκτη σε θεατή');
	});
};

Service.trapezi.pektisTheatis2 = function(nodereq) {
	var kinisi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('PH');
	kinisi.data = {
		trapezi: nodereq.data.trapeziKodikos,
		pektis: nodereq.data.login,
		thesi: nodereq.data.thesi,
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.apodoxi = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi())
	return;

	nodereq.data.login = nodereq.loginGet();
	nodereq.data.trapezi = nodereq.trapeziGet();
	nodereq.data.trapeziKodikos = nodereq.data.trapezi.trapeziKodikosGet();

	if ((!Debug.flagGet('apodoxiPanta')) && nodereq.data.trapezi.trapeziIsDianomi())
	return nodereq.error('Η παρτίδα έχει ήδη εκκινήσει');

	nodereq.data.thesi = nodereq.data.trapezi.trapeziThesiPekti(nodereq.data.login);
	if (!nodereq.data.thesi)
	return nodereq.error('Δεν είστε παίκτης στο τραπέζι');

	if (!nodereq.trapeziKlidoma('apodoxi'))
	return;

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.trapezi.apodoxi1(nodereq);
	});
};

Service.trapezi.apodoxi1 = function(nodereq) {
	var query, kafenio;

	query = 'REPLACE INTO `sinthesi` (`trapezi`, `thesi`, `pektis`, `apodoxi`) VALUES (' +
		nodereq.data.trapeziKodikos + ', ' + nodereq.data.thesi +
		', ' + nodereq.data.login.json() + ", 'ΝΑΙ')";
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.trapezi.apodoxi2(nodereq);

		nodereq.data.conn.rollback();
		nodereq.error('Απέτυχε η αποδοχή όρων παιχνιδιού');
	});
};

Service.trapezi.apodoxi2 = function(nodereq) {
	var query, dealer;

	if (nodereq.data.trapezi.trapeziApodoxiLow())
	return Service.trapezi.apodoxi9(nodereq);

	nodereq.data.dealer = (nodereq.data.trapezi.dianomiArray.length % Vida.thesiMax) + 1;

	query = 'INSERT INTO `dianomi` (`trapezi`, `dealer`) VALUES (' +
		nodereq.data.trapeziKodikos + ', ' + nodereq.data.dealer + ')';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows <= 0) {
			nodereq.data.conn.rollback();
			return nodereq.error('Απέτυχε η δημιουργία πρώτης διανομής');
		}

		nodereq.data.dianomi = res.insertId;
		Service.trapezi.apodoxi3(nodereq);
	});
};

Service.trapezi.apodoxi3 = function(nodereq) {
	var trapoula, query;

	trapoula = new filajsDeck({min:'7'}).shuffle();
	nodereq.data.fila = trapoula.toString();
	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		nodereq.data.dianomi + ', ' + nodereq.data.dealer + ", 'ΔΙΑΝΟΜΗ', " +
		nodereq.data.fila.json() + ')';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows <= 0) {
			nodereq.data.conn.rollback();
			return nodereq.error('Απέτυχε η δημιουργία ενέργειας πρώτης διανομής');
		}

		nodereq.data.energia = res.insertId;
		Service.trapezi.apodoxi9(nodereq);
	});
};

Service.trapezi.apodoxi9 = function(nodereq) {
	var kinisi, dealer;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('AX', {
		trapezi: nodereq.data.trapeziKodikos,
		pektis: nodereq.data.login,
		thesi: nodereq.data.thesi,
	});

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi, false);

	if (!nodereq.data.dianomi)
	return skiniko.skinikoKinisiEnimerosi();

	dealer = (nodereq.data.trapezi.dianomiArray.length % 4) + 1;
	kinisi = new Kinisi('DN', {
		trapezi: nodereq.data.trapeziKodikos,
		kodikos: nodereq.data.dianomi,
		dealer: dealer,
	});

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi, false);

	kinisi = new Kinisi('EG', {
		trapezi: nodereq.data.trapeziKodikos,
		dianomi: nodereq.data.dianomi,
		kodikos: nodereq.data.energia,
		pektis: dealer,
		idos: 'ΔΙΑΝΟΜΗ',
		data: nodereq.data.fila,
	});

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiEnimerosi();
	nodereq.data.trapezi.partidaReplay();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.ixodopa = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi())
	return;

	nodereq.data.login = nodereq.loginGet();
	nodereq.data.trapezi = nodereq.trapeziGet();
	nodereq.data.trapeziKodikos = nodereq.data.trapezi.trapeziKodikosGet();

	nodereq.data.thesi = nodereq.data.trapezi.trapeziThesiPekti(nodereq.data.login);
	if (!nodereq.data.thesi)
	return nodereq.error('Δεν είστε παίκτης στο τραπέζι');

	if (!nodereq.trapeziKlidoma('ixodopa'))
	return;

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.trapezi.ixodopa1(nodereq);
	});
};

Service.trapezi.ixodopa1 = function(nodereq) {
	var query, kafenio;

	query = 'REPLACE INTO `sinthesi` (`trapezi`, `thesi`, `pektis`, `apodoxi`) VALUES (' +
		nodereq.data.trapeziKodikos + ', ' + nodereq.data.thesi +
		', ' + nodereq.data.login.json() + ", 'ΟΧΙ')";
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.trapezi.ixodopa2(nodereq);

		nodereq.data.conn.rollback();
		nodereq.error('Απέτυχε η διαπραγμάτευση όρων παιχνιδιού');
	});
};

Service.trapezi.ixodopa2 = function(nodereq) {
	var kinisi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('XA');
	kinisi.data = {
		trapezi: nodereq.data.trapeziKodikos,
		pektis: nodereq.data.login,
		thesi: nodereq.data.thesi,
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.neaDianomi = function(trapezi) {
	var data = {};

	data.trapeziKodikos = trapezi;
	data.trapezi = skiniko.skinikoTrapeziGet(trapezi);
	if (!trapezi)
	return;

	data.conn = DB.connection().
	transaction(function(conn) {
		Service.trapezi.neaDianomi1(data);
	});
};

// Πριν δημιουργήσουμε νέα διανομή ενημερώνουμε την τελευταία διανομή όσον
// αφορά το σκορ.

Service.trapezi.neaDianomi1 = function(data) {
	var query;

	// Το property "pliromi" είναι η τελευταία διανομή πριν την επικείμενη
	// διανομή. Αυτή η διανομή πρέπει να ενημερωθεί οσον αφορά το σκορ. Αν
	// δεν υπάρχει τέτοια διανομή, προχωρούμε αμέσως στην (πρώτη) διανομή.

	data.pliromi = data.trapezi.trapeziTelefteaDianomi();
	if (!data.pliromi)
	return Service.trapezi.neaDianomi3(data);

	// Κρατάμε τον κωδικό της τελευταίας διανομής, καθώς θα μας χρειαστεί
	// αρκετές φορές από εδώ και στο εξής. Παίρνουμε το ήδη καταχωρημένο
	// σκορ για να ελέγξουμε μήπως αυτό είναι ήδη ενημερωμένο.

	data.pliromiKodikos = data.pliromi.dianomiKodikosGet();
	query = 'SELECT `skor13`, `skor24`, `kremamena` FROM `dianomi` WHERE `kodikos` = ' + data.pliromiKodikos;
	data.conn.query(query, function(conn, res) {
		if (res.length != 1) {
			data.conn.rollback();
			return Globals.consoleError('Ακαθόριστη τελευταία διανομή κατά την επαναδιανομή');
		}

		data.skor13 = res[0]['skor13'];
		data.skor24 = res[0]['skor24'];
		data.kremamena = res[0]['kremamena'];

		Service.trapezi.neaDianomi2(data);
	});
};

Service.trapezi.neaDianomi2 = function(data) {
	var query, skor13, skor24, kremamena;

	// Παίρνουμε το σκορ που προέκυψε μετά το replay της διανομής.

	skor13 = data.pliromi.dianomiSkorGet('13');
	skor24 = data.pliromi.dianomiSkorGet('24');
	kremamena = data.pliromi.dianomiKremamenaGet();

	// Αν το καταχωρημένο σκορ της διανομής είναι ίδιο με το υπολογισμένο,
	// προχωρούμε άμεσα στη νέα διανομή, διαγράφουμε όμως την πληρωμή της
	// τελευταίας διανομής προκειμένου να μην αποσταλεί ως κίνηση, εφόσον
	// είναι ήδη ενημερωμένη.

	if ((skor13 === data.skor13) && (skor24 === data.skor24) && (kremamena === data.kremamena)) {
		delete data.pliromi;
		return Service.trapezi.neaDianomi3(data);
	}

	// Η τελευταία διανομή πριν την επικείμενη διανομή θα πρέπει να ενημερωθεί
	// όσον αφορά το σκορ. Κρατάμε, λοιπόν, το υπολογισμένο σκορ στα αντίστοιχα
	// properties και επιτελούμε την ενημέρωση.

	data.skor13 = skor13;
	data.skor24 = skor24;
	data.kremamena = kremamena;

	query = 'UPDATE `dianomi` SET `skor13` = ' + skor13 + ', `skor24` = ' + skor24 +
		', `kremamena` = ' + kremamena + ' WHERE `kodikos` = ' + data.pliromiKodikos;
	data.conn.query(query, function(conn, res) {
		if (res.affectedRows <= 0) {
			data.conn.rollback();
			return Globals.consoleError('Απέτυχε η ενημέρωση πόντων διανομής');
		}

		Service.trapezi.neaDianomi3(data);
	});
};

Service.trapezi.neaDianomi3 = function(data) {
	var query, dealer;

	data.dealer = (data.trapezi.dianomiArray.length % Vida.thesiMax) + 1;

	query = 'INSERT INTO `dianomi` (`trapezi`, `dealer`) VALUES (' +
		data.trapeziKodikos + ', ' + data.dealer + ')';
	data.conn.query(query, function(conn, res) {
		if (res.affectedRows <= 0) {
			data.conn.rollback();
			return Globals.consoleError('Απέτυχε η δημιουργία διανομής');
		}

		data.dianomi = res.insertId;
		Service.trapezi.neaDianomi4(data);
	});
};

Service.trapezi.neaDianomi4 = function(data) {
	var trapoula, query;

	trapoula = new filajsDeck({min:'7'}).shuffle();
	data.fila = trapoula.toString();
	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		data.dianomi + ', ' + data.dealer + ", 'ΔΙΑΝΟΜΗ', " + data.fila.json() + ')';
	data.conn.query(query, function(conn, res) {
		if (res.affectedRows <= 0) {
			data.conn.rollback();
			return Globals.consoleError('Απέτυχε η δημιουργία ενέργειας διανομής');
		}

		data.energia = res.insertId;
		Service.trapezi.neaDianomi5(data);
	});
};

Service.trapezi.neaDianomi5 = function(data) {
	var kinisi;

	data.conn.commit();

	kinisi = new Kinisi('DN', {
		trapezi: data.trapeziKodikos,
		kodikos: data.dianomi,
		dealer: data.dealer,
	});

	// Αν επιτελέστηκε ενημέρωση σκορ της προηγούμενης διανομής, τότε
	// αποστέλλουμε και τα στοιχεία της πληρωμής.

	if (data.pliromi) {
		kinisi.data.pliromi = data.pliromiKodikos;
		kinisi.data.skor13 = data.skor13;
		kinisi.data.skor24 = data.skor24;
		kinisi.data.kremamena = data.kremamena;
	}

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi, false);

	kinisi = new Kinisi('EG', {
		trapezi: data.trapeziKodikos,
		dianomi: data.dianomi,
		kodikos: data.energia,
		pektis: data.dealer,
		idos: 'ΔΙΑΝΟΜΗ',
		data: data.fila,
	});

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiEnimerosi();
	data.trapezi.partidaReplay();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.trapezi.klidomaCheck = function() {
	var tora;

	tora = Globals.torams();

	skiniko.skinikoTrapeziWalk(function() {
		var klidoma;

		klidoma = this.trapeziKlidomaGet();
		if (!klidoma)
		return;

		if (tora - klidoma < 3000)
		return;

		this.trapeziXeklidoma();
		Globals.consoleLog(this.trapeziKodikosGet() + ': ξεκλείδωμα τραπεζιού');
	});
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Service.trapezi.kenoTimeout = 1 * 60;
Service.trapezi.oxiKenoTimeout = 3 * 60;

/*
Service.trapezi.kenoTimeout = 1 * 6;
Service.trapezi.oxiKenoTimeout = 3 * 6;
*/

// Από καιρού εις καιρόν και μέσω των διαδικασιών περιπόλου ελέγχονται τα τραπέζια
// προκειμένου κάποια από να αρχειοθετηθούν. Δεν κλειδώνουμε τα τραπέζια καθώς κάτι
// τέτοιο δημιουργεί περιπλοκές.

Service.trapezi.check = function() {
	var tora, arxio, arxio2;

	tora = Globals.tora();
	if (Debug.flagGet('trapeziCheck'))
	Globals.consoleLog('Περίπολος: trapezi.check: (' + Service.trapezi.kenoTimeout +
		', ' + Service.trapezi.oxiKenoTimeout + ')');

	// Κρατάμε στη λίστα "arxio" τα τραπέζια που αρχειοθετούνται
	// λόγω μεγάλου χρόνου αδράνειας.

	arxio = {};

	skiniko.skinikoTrapeziWalk(function() {
		var trapeziKodikos;

		if (this.trapeziSeXrisi(tora))
		return;

		trapeziKodikos = this.trapeziKodikosGet();
		Globals.consoleLog(trapeziKodikos + ': ανενεργό τραπέζι');
		arxio[trapeziKodikos] = true;
	});

	// Αρχειοθετούμε στην database τα τραπέζια που έκλεισαν λόγω
	// μεγάλου χρόνου αδράνειας. Παράλληλα δημιουργούμε δεύτερη
	// λίστα με τα τραπέζια που αρχειοθετούνται επιτυχώς στην
	// database.

	arxio2 = {};
	Service.trapezi.arxiothetisi(arxio, arxio2);
};

// Η μέθοδος "trapeziSeXrisi" ελέγχει αν οι παίκτες του τραπεζιού έχουν αποχωρήσει
// από το τραπέζι και το τραπέζι έχει μείνει χωρίς online επισκέπτες για μεγάλο
// χρονικό διάστημα.

Trapezi.prototype.trapeziSeXrisi = function(tora) {
	var timeout, thesi, pektis;

	// Ελέγχουμε κατ' αρχάς αν υπάρχει παίκτης στο τραπέζι που δεν έχει
	// αποχωρήσει ακόμη, προκειμένου να αποφασίσουμε το χρόνο που το
	// τραπέζι θα θεωρηθεί ανενεργό. Αν υπάρχει έστω και ένας παίκτης
	// στο τραπέζι δίνουμε περισσότερο χρόνο.

	timeout = Service.trapezi.kenoTimeout;

	for (thesi = 1; thesi <= Vida.thesiMax; thesi++) {
		if (!this.trapeziPektisGet(thesi))
		continue;

		// Εφόσον υπάρχει παίκτης ξεχασμένος στο τραπέζι αυξάνουμε
		// το χρόνο αδράνειας.

		timeout = Service.trapezi.oxiKenoTimeout;
		break;
	}

	if (tora === undefined)
	tora = Globals.tora();

	if (tora - this.trapeziPollGet() < timeout)
	return true;

	// Το poll timestamp του τραπεζιού δείχνει ότι το τραπέζι είναι
	// ανανεργό. Ωστόσο, υπάρχει περίπτωση κάποιος από τους παίκτες
	// του τραπεζιού να παρακολουθεί, ή να παίζει σε άλλο τραπέζι.
	// Σενάριο: Ανοίγω τραπέζι, προσκαλώ δύο φίλους και μέχρι να
	// έρθουν αυτοί παρακολουθώ σε κάποιο άλλο τραπέζι. Σ' αυτή την
	// περίπτωση τα pollings που κάνω ενημερώνουν το poll timestamp
	// στο τραπέζι που παρακολουθώ και έτσι το κυρίως τραπέζι μου
	// θα φανεί ανενεργό και θα δρομολογηθεί προς αρχειοθέτηση,
	// πράγμα που δεν είναι σωστό.

	for (thesi = 1; thesi <= Vida.thesiMax; thesi++) {
		pektis = this.trapeziPektisGet(thesi);
		if (!pektis) continue;

		// Αν οποιοσδήποτε παίκτης του τραπεζιού έχει ενεργή
		// συνεδρία, τότε το τραπέζι θεωρείται ενεργό.

		if (skiniko.skinikoSinedriaGet(pektis))
		return true;
	}

	// Είναι πια η ώρα το τραπέζι να θεωρηθεί ανενεργό.

	return false;
};

// Η function "arxiothesisi" δέχεται μια λίστα τραπεζιών και επιχειρεί να τα
// αρχειοθετήσει στην database, δηλαδή να ενημερώσει το timestamp αρχειοθέτησης
// σε καθένα από αυτά τα τραπέζια. Ως δεύτερη παράμετρο περνάμε μια αρχικά κενή
// λίστα και εισάγουμε σ' αυτήν τη λίστα τα τραπέζια τα οποία αρχειοθετήθηκαν
// επιτυχώς στην database, προκειμένου αμέσως μετά να ενημερώσουμε τους clients
// ότι αυτά τα τραπέζια έχουν αρχειοθετηθεί.

Service.trapezi.arxiothetisi = function(lista, lista2) {
	var trapeziKodikos;

	for (trapeziKodikos in lista) {
		delete lista[trapeziKodikos];
		DB.connection().transaction(function(conn) {
			Service.trapezi.arxiothetisiTrapezi(conn, trapeziKodikos, lista, lista2);
		});
		return;
	}

	// Η λίστα έχει εξαντληθεί και εκκινούμε τις διαδικασίες κλεισίματος
	// της αρχειοθέτησης τραπεζιών.

	Service.trapezi.arxiothetisiTelos(lista2);
};

Service.trapezi.arxiothetisiTrapezi = function(conn, trapeziKodikos, lista, lista2) {
	var query;

	query = 'UPDATE `trapezi` SET `arxio` = NOW() WHERE `kodikos` = ' + trapeziKodikos;
	conn.query(query, function(conn) {
		if (conn.affectedRows !== 1) {
			conn.rollback();
			Globals.consoleError(trapeziKodikos + ': απέτυχε η αρχειοθέτηση του τραπεζιού');
			Service.trapezi.arxiothetisi(lista, lista2);
			return;
		}

		Service.trapezi.diagrafiProsklisi(conn, trapeziKodikos, lista, lista2);
	});
};

Service.trapezi.diagrafiProsklisi = function(conn, trapeziKodikos, lista, lista2) {
	var query;

	query = 'DELETE FROM `prosklisi` WHERE `trapezi` = ' + trapeziKodikos;
	conn.query(query, function(conn) {
		Service.trapezi.diagrafiSizitisi(conn, trapeziKodikos, lista, lista2);
	});
};

Service.trapezi.diagrafiSizitisi = function(conn, trapeziKodikos, lista, lista2) {
	var query;

	query = 'DELETE FROM `sizitisi` WHERE `trapezi` = ' + trapeziKodikos;
	conn.query(query, function(conn) {
		Service.trapezi.diagrafiSimetoxi(conn, trapeziKodikos, lista, lista2);
	});
};

Service.trapezi.diagrafiSimetoxi = function(conn, trapeziKodikos, lista, lista2) {
	var query;

	query = 'DELETE FROM `simetoxi` WHERE `trapezi` = ' + trapeziKodikos;
	conn.query(query, function(conn) {
		conn.commit(function() {
			conn.free();
			lista2[trapeziKodikos] = true;
			Service.trapezi.arxiothetisi(lista, lista2);
		});
	});
};

Service.trapezi.arxiothetisiTelos = function(lista) {
	var trapeziKodikos, kinisi;

	kinisi = null;
	for (trapeziKodikos in lista) {
		kinisi = new Kinisi({
			idos: 'AT',
			data: {
				trapezi: trapeziKodikos,
			}
		});

		skiniko.
		skinikoKinisiProcess(kinisi).
		skinikoKinisiPush(kinisi, false);
	}

	if (kinisi)
	skiniko.skinikoKinisiEnimerosi();
};
