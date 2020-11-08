////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: agora');

Service.agora = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.agora.dilosi = function(nodereq) {
	var thesi;

	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi()) return;
	nodereq.data.trapezi = nodereq.trapeziGet();

	nodereq.data.pektis = nodereq.data.trapezi.partidaEpomenosGet();
	if (Debug.flagGet('epomenosCheck')) {
		thesi = nodereq.data.trapezi.trapeziThesiPekti(nodereq.loginGet());
		if (!thesi) return nodereq.error('Ακαθόριστη θέση παίκτη');
		if (thesi !== nodereq.data.pektis) return nodereq.error('Δήλωση εκτός σειράς');
	}

	if (nodereq.akathoristiDianomi()) return;
	nodereq.data.dianomi = nodereq.dianomiGet();

	if (nodereq.denPerastike('dilosi'))
	return nodereq.error('Ακαθόριστη δήλωση αγοράς');

	nodereq.data.trapeziKodikos = nodereq.trapeziGet().trapeziKodikosGet();
	nodereq.data.dianomiKodikos = nodereq.dianomiGet().dianomiKodikosGet();

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.agora.dilosi1(nodereq);
	});
};

Service.agora.dilosi1 = function(nodereq) {
	var query, kafenio;

	nodereq.data.energiaIdos = 'ΔΗΛΩΣΗ';
	nodereq.data.energiaData = nodereq.parametrosGet('dilosi');
	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		nodereq.data.dianomiKodikos + ', ' + nodereq.data.pektis + ', ' +
		nodereq.data.energiaIdos.json() + ', ' + nodereq.data.energiaData.json() + ')';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows < 1) {
			nodereq.data.conn.rollback();
			return nodereq.error('Απέτυχε η καταχώρηση δήλωσης αγοράς');
		}

		nodereq.data.energiaKodikos = res.insertId;
		Service.agora.dilosi2(nodereq);
	});
};

Service.agora.dilosi2 = function(nodereq) {
	var kinisi, eptari;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('EG', {
		trapezi: nodereq.data.trapeziKodikos,
		dianomi: nodereq.data.dianomiKodikos,
		kodikos: nodereq.data.energiaKodikos,
		pektis: nodereq.data.pektis,
		idos: nodereq.data.energiaIdos,
		data: nodereq.data.energiaData,
	});

	eptari = nodereq.parametrosGet('eptari');
	if (eptari)
	kinisi.data.data += ':' + eptari;

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiEnimerosi();
	nodereq.data.trapezi.partidaReplay();

	if (nodereq.data.trapezi.partidaFasiGet() !== 'ΕΠΑΝΑΔΙΑΝΟΜΗ')
	return;

	setTimeout(function() {
		Service.trapezi.neaDianomi(nodereq.data.trapeziKodikos);
	}, new Dilosi(nodereq.data.energiaData).dilosiIsAponta() ? 3000 :2000);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.agora.eptariAlagi = function(nodereq) {
	var thesi;

	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi()) return;
	nodereq.data.trapezi = nodereq.trapeziGet();

	nodereq.data.pektis = nodereq.data.trapezi.partidaEpomenosGet();
	if (Debug.flagGet('epomenosCheck')) {
		thesi = nodereq.data.trapezi.trapeziThesiPekti(nodereq.loginGet());
		if (!thesi) return nodereq.error('Ακαθόριστη θέση παίκτη');
		if (thesi !== nodereq.data.pektis) return nodereq.error('Κίνηση εκτός σειράς');
	}

	if (nodereq.akathoristiDianomi()) return;
	nodereq.data.dianomi = nodereq.dianomiGet();

	if (nodereq.denPerastike('eptari'))
	return nodereq.error('Ακαθόριστο φύλλο αλλαγής');

	nodereq.data.trapeziKodikos = nodereq.trapeziGet().trapeziKodikosGet();
	nodereq.data.dianomiKodikos = nodereq.dianomiGet().dianomiKodikosGet();

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.agora.eptariAlagi1(nodereq);
	});
};

Service.agora.eptariAlagi1 = function(nodereq) {
	var query, kafenio;

	nodereq.data.energiaIdos = 'ΕΠΤΑΡΙ';
	nodereq.data.energiaData = nodereq.parametrosGet('eptari');
	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		nodereq.data.dianomiKodikos + ', ' + nodereq.data.pektis + ', ' +
		nodereq.data.energiaIdos.json() + ', ' + nodereq.data.energiaData.json() + ')';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows < 1) {
			nodereq.data.conn.rollback();
			return nodereq.error('Απέτυχε η αλλαγή με το επτάρι');
		}

		nodereq.data.energiaKodikos = res.insertId;
		Service.agora.eptariAlagi2(nodereq);
	});
};

Service.agora.eptariAlagi2 = function(nodereq) {
	var kinisi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('EG', {
		trapezi: nodereq.data.trapeziKodikos,
		dianomi: nodereq.data.dianomiKodikos,
		kodikos: nodereq.data.energiaKodikos,
		pektis: nodereq.data.pektis,
		idos: nodereq.data.energiaIdos,
		data: nodereq.data.energiaData,
	});

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiEnimerosi();
	nodereq.data.trapezi.partidaReplay();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
