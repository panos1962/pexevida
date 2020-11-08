////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: aeras');

Service.aeras = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.aeras.ipovoli = function(nodereq) {
	var thesi, filo;

	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi()) return;
	nodereq.data.trapezi = nodereq.trapeziGet();

	nodereq.data.pektis = nodereq.data.trapezi.partidaEpomenosGet();
	if (Debug.flagGet('epomenosCheck')) {
		thesi = nodereq.data.trapezi.trapeziThesiPekti(nodereq.loginGet());
		if (!thesi) return nodereq.error('Ακαθόριστη θέση παίκτη');
		if (thesi !== nodereq.data.pektis) return nodereq.error('Υποβολή αέρα εκτός σειράς');
	}

	if (nodereq.akathoristiDianomi()) return;
	nodereq.data.dianomi = nodereq.dianomiGet();

	if (nodereq.denPerastike('aeras'))
	return nodereq.error('Ακαθόριστος αέρας');

	nodereq.data.trapeziKodikos = nodereq.trapeziGet().trapeziKodikosGet();
	nodereq.data.dianomiKodikos = nodereq.dianomiGet().dianomiKodikosGet();

	if (!nodereq.trapeziKlidoma('aerasIpovoli'))
	return;

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.aeras.ipovoli1(nodereq);
	});
};

Service.aeras.ipovoli1 = function(nodereq) {
	var query, kafenio;

	nodereq.data.energiaIdos = 'ΑΕΡΑΣ';
	nodereq.data.energiaData = nodereq.parametrosGet('aeras');
	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		nodereq.data.dianomiKodikos + ', ' + nodereq.data.pektis + ', ' +
		nodereq.data.energiaIdos.json() + ', ' + nodereq.data.energiaData.json() + ')';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows < 1) {
			nodereq.data.conn.rollback();
			return nodereq.error('Απέτυχε η καταχώρηση αέρα');
		}

		nodereq.data.conn.commit();
		nodereq.data.energiaKodikos = res.insertId;
		Service.aeras.ipovoli2(nodereq);
	});
};

Service.aeras.ipovoli2 = function(nodereq) {
	var kinisi, pios;

	nodereq.end();

	kinisi = new Kinisi('EG', {
		trapezi: nodereq.data.trapeziKodikos,
		dianomi: nodereq.data.dianomiKodikos,
		kodikos: nodereq.data.energiaKodikos,
		pektis: nodereq.data.pektis,
		idos: nodereq.data.energiaIdos,
		data: nodereq.data.energiaData,
	});

	skiniko.skinikoKinisiProcess(kinisi);
	nodereq.data.trapezi.partidaReplay();
	skiniko.skinikoKinisiEnimerosi();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.aeras.apodoxi = function(nodereq) {
	var thesi, filo;

	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi()) return;
	nodereq.data.trapezi = nodereq.trapeziGet();

	nodereq.data.pektis = nodereq.data.trapezi.partidaEpomenosGet();
	if (Debug.flagGet('epomenosCheck')) {
		thesi = nodereq.data.trapezi.trapeziThesiPekti(nodereq.loginGet());
		if (!thesi) return nodereq.error('Ακαθόριστη θέση παίκτη');
		if (thesi !== nodereq.data.pektis) return nodereq.error('Υποβολή αέρα εκτός σειράς');
	}

	if (nodereq.akathoristiDianomi()) return;
	nodereq.data.dianomi = nodereq.dianomiGet();

	if (nodereq.denPerastike('apodoxi'))
	return nodereq.error('Ακαθόριστη απάντηση');

	nodereq.data.trapeziKodikos = nodereq.trapeziGet().trapeziKodikosGet();
	nodereq.data.dianomiKodikos = nodereq.dianomiGet().dianomiKodikosGet();

	if (!nodereq.trapeziKlidoma('aerasApodoxi'))
	return;

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.aeras.apodoxi1(nodereq);
	});
};

Service.aeras.apodoxi1 = function(nodereq) {
	var query, kafenio;

	nodereq.data.energiaIdos = 'ΑΕΡΑΣ';
	nodereq.data.energiaData = nodereq.parametrosGet('apodoxi');
	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		nodereq.data.dianomiKodikos + ', ' + nodereq.data.pektis + ', ' +
		nodereq.data.energiaIdos.json() + ', ' + nodereq.data.energiaData.json() + ')';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows < 1) {
			nodereq.data.conn.rollback();
			return nodereq.error('Απέτυχε η καταχώρηση αποδοχής');
		}

		nodereq.data.conn.commit();
		nodereq.data.energiaKodikos = res.insertId;
		Service.aeras.apodoxi2(nodereq);
	});
};

Service.aeras.apodoxi2 = function(nodereq) {
	var kinisi, pios;

	nodereq.end();

	kinisi = new Kinisi('EG', {
		trapezi: nodereq.data.trapeziKodikos,
		dianomi: nodereq.data.dianomiKodikos,
		kodikos: nodereq.data.energiaKodikos,
		pektis: nodereq.data.pektis,
		idos: nodereq.data.energiaIdos,
		data: nodereq.data.energiaData,
	});

	skiniko.skinikoKinisiProcess(kinisi);
	nodereq.data.trapezi.partidaReplay();
	skiniko.skinikoKinisiEnimerosi();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
