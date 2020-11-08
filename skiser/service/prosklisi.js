////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: prosklisi');

Service.prosklisi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.prosklisi.epidosi = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('pektis', true))
	return;

	if (nodereq.denPerastike('trapezi', true))
	return;

	nodereq.parametrosSet('trapezi', parseInt(nodereq.parametrosGet('trapezi')));
	if (isNaN(nodereq.parametrosGet('trapezi')))
	return nodereq.error('ακαθόριστος κωδικός τραπεζιού');

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.prosklisi.epidosi1(nodereq);
	});
};

Service.prosklisi.epidosi1 = function(nodereq) {
	var query, trapezi;

	query = 'REPLACE INTO `prosklisi` (`trapezi`, `apo`, `pros`) VALUES (' +
		nodereq.parametrosGet('trapezi') + ', ' + nodereq.loginGet().json() + ', ' +
		nodereq.parametrosGet('pektis').json() + ')';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.prosklisi.epidosi2(nodereq);

		nodereq.data.conn.rollback();
		nodereq.error('Απέτυχε η επίδοση πρόσκλησης');
	});
};

Service.prosklisi.epidosi2 = function(nodereq) {
	var kinisi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('PL');
	kinisi.data = {
		trapezi: nodereq.parametrosGet('trapezi'),
		apo: nodereq.loginGet(),
		pros: nodereq.parametrosGet('pektis'),
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.prosklisi.diagrafi = function(nodereq) {
	var login;

	if (nodereq.isvoli())
	return;

	nodereq.parametrosSet('trapezi', parseInt(nodereq.parametrosGet('trapezi')));
	if (isNaN(nodereq.parametrosGet('trapezi')))
	return nodereq.error('ακαθόριστος κωδικός τραπεζιού');

	nodereq.data.trapezi = skiniko.skinikoTrapeziGet(nodereq.parametrosGet('trapezi'));
	if (!nodereq.data.trapezi)
	return nodereq.error('Δεν βρέθηκε το τραπέζι');

	nodereq.data.apo = nodereq.parametrosGet('apo');
	if (!nodereq.data.apo)
	return nodereq.error('Ακαθόριστος αποστολέας');

	nodereq.data.pros = nodereq.parametrosGet('pros');
	if (!nodereq.data.pros)
	return nodereq.error('Ακαθόριστος παραλήπτης');

	login = nodereq.loginGet();
	if ((nodereq.data.apo !== login) && (nodereq.data.pros !== login))
	return nodereq.error('Η προόσκληση δεν σας αφορά');

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.prosklisi.diagrafi1(nodereq);
	});
};

Service.prosklisi.diagrafi1 = function(nodereq) {
	var query;

	query = 'DELETE FROM `prosklisi` WHERE `trapezi` = ' + nodereq.parametrosGet('trapezi') +
		' AND `apo` LIKE ' + nodereq.data.apo.json() +
		' AND `pros` LIKE ' + nodereq.data.pros.json();
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.prosklisi.diagrafi2(nodereq);

		nodereq.data.conn.rollback();
		nodereq.error('Απέτυχε η ανάκληση πρόσκλησης');
	});
};

Service.prosklisi.diagrafi2 = function(nodereq) {
	var sinedria, query;

	if (nodereq.data.trapezi.trapeziIsDimosio())
	return Service.prosklisi.diagrafi3(nodereq);

	sinedria = skiniko.skinikoSinedriaGet(nodereq.parametrosGet('pektis'));
	if (!sinedria)
	return Service.prosklisi.diagrafi3(nodereq);

	if (sinedria.sinedriaOxiTrapezi(nodereq.parametrosGet('trapezi')))
	return Service.prosklisi.diagrafi3(nodereq);

	if (sinedria.sinedriaIsPektis(nodereq.parametrosGet('trapezi')))
	return Service.prosklisi.diagrafi3(nodereq);

	query = 'UPDATE `sinedria` SET `trapezi` = NULL, `thesi` = NULL, `simetoxi` = NULL ' +
		'WHERE `pektis` LIKE ' + nodereq.parametrosGet('pektis').json();
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows <= 0) {
			nodereq.data.conn.rollback();
			return nodereq.error('Απέτυχε η αλλαγή στοιχείων θέσης συνεδρίας');
		}

		nodereq.data.exodos = 1;
		Service.prosklisi.diagrafi3(nodereq);
	});
};

Service.prosklisi.diagrafi3 = function(nodereq) {
	var kinisi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('XL');
	kinisi.data = {
		trapezi: nodereq.parametrosGet('trapezi'),
		apo: nodereq.data.apo,
		pros: nodereq.data.pros,
		exodos: nodereq.data.exodos,
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.prosklisi.apodoxi = function(nodereq) {
	var trapezi, sinedria, thesi;

	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('trapezi', true))
	return;

	if (nodereq.denPerastike('apo', true))
	return;

	if (nodereq.denPerastike('pros', true))
	return;

	nodereq.parametrosSet('trapezi', parseInt(nodereq.parametrosGet('trapezi')));
	if (isNaN(nodereq.parametrosGet('trapezi')))
	return nodereq.error('ακαθόριστος κωδικός τραπεζιού');

	trapezi = skiniko.skinikoTrapeziGet(nodereq.parametrosGet('trapezi'));
	if (!trapezi)
	return nodereq.error('Δεν βρέθηκε το τραπέζι');

	sinedria = skiniko.skinikoSinedriaGet(nodereq.parametrosGet('pros'));
	if (!sinedria)
	return nodereq.error('Δεν βρέθηκε συνεδρία');

	// Ελέγχουμε αν ο παίκτης βρίσκεται ήδη ως παίκτης στο τραπέζι και αν
	// ναι, τότε απλώς κάνουμε επιλογή τραπεζιού.

	thesi = trapezi.trapeziThesiPekti(nodereq.parametrosGet('pros'));
	if (thesi)
	return Service.trapezi.epilogi(nodereq);

	nodereq.data.thesi = trapezi.trapeziKeniThesi();
	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		if (nodereq.data.thesi)
		Service.prosklisi.pektis(nodereq);

		else
		Service.prosklisi.theatis(nodereq);
	});
};

//--------------------------------------------------------------------------------------------------------------------------@

Service.prosklisi.pektis = function(nodereq) {
	var query;

	query = 'REPLACE INTO `sinthesi` (`trapezi`, `thesi`, `pektis`) VALUES (' +
		nodereq.parametrosGet('trapezi') + ', ' + nodereq.data.thesi + ', ' +
		nodereq.parametrosGet('pros').json() + ')';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.prosklisi.pektis1(nodereq);

		nodereq.data.conn.rollback();
		nodereq.error('Απέτυχε η τοποθέτηση παίκτη στο τραπέζι');
	});
};

Service.prosklisi.pektis1 = function(nodereq) {
	var query;

	query = "UPDATE `sinedria` SET `trapezi` = " + nodereq.parametrosGet('trapezi') +
		", `thesi` = " + nodereq.data.thesi + ", `simetoxi` = 'ΠΑΙΚΤΗΣ' " +
		"WHERE `pektis` LIKE " + nodereq.parametrosGet('pros').json();
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.prosklisi.pektis2(nodereq);

		nodereq.data.conn.rollback();
		nodereq.error('Απέτυχε η αλλαγή στοιχείων θέσης συνεδρίας');
	});
};

Service.prosklisi.pektis2 = function(nodereq) {
	var kinisi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('LP');
	kinisi.data = {
		trapezi: nodereq.parametrosGet('trapezi'),
		pektis: nodereq.parametrosGet('pros'),
		thesi: nodereq.data.thesi,
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

//--------------------------------------------------------------------------------------------------------------------------@

Service.prosklisi.theatis = function(nodereq) {
	var query;

	query = "UPDATE `sinedria` SET `trapezi` = " + nodereq.parametrosGet('trapezi') +
		", `thesi` = 1, `simetoxi` = 'ΘΕΑΤΗΣ' WHERE `pektis` LIKE " + nodereq.parametrosGet('pros').json();
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.prosklisi.theatis1(nodereq);

		nodereq.data.conn.rollback();
		nodereq.error('Απέτυχε η αλλαγή στοιχείων θέσης συνεδρίας');
	});
};

Service.prosklisi.theatis1 = function(nodereq) {
	var kinisi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('LH');
	kinisi.data = {
		trapezi: nodereq.parametrosGet('trapezi'),
		pektis: nodereq.parametrosGet('pros'),
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
