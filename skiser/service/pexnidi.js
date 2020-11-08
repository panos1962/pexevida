////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: pexnidi');

Service.pexnidi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.pexnidi.filo = function(nodereq) {
	var thesi, filo;

	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi()) return;
	nodereq.data.trapezi = nodereq.trapeziGet();

	nodereq.data.pektis = nodereq.data.trapezi.partidaEpomenosGet();
	if (Debug.flagGet('epomenosCheck')) {
		thesi = nodereq.data.trapezi.trapeziThesiPekti(nodereq.loginGet());

		if (!thesi)
		return nodereq.error('Ακαθόριστη θέση παίκτη');

		if (thesi !== nodereq.data.pektis)
		return nodereq.error('Παίξιμο φύλλου εκτός σειράς');
	}

	if (nodereq.akathoristiDianomi()) return;
	nodereq.data.dianomi = nodereq.dianomiGet();

	if (nodereq.denPerastike('filo'))
	return nodereq.error('Ακαθόριστο φύλλο');

	filo = new filajsCard(nodereq.parametrosGet('filo'));
	nodereq.data.fila = nodereq.data.trapezi.partidaFilaGet(nodereq.data.pektis);
	if (!nodereq.data.fila)
	return nodereq.error('Ακαθόριστα φύλλα παίκτη');

	nodereq.data.index = -1;
	nodereq.data.fila.cardWalk(function(i) {
		if (this.like(filo))
		nodereq.data.index = i;
	});

	if (nodereq.data.index < 0)
	return nodereq.error('Δεν βρέθηκε το φύλλο στα φύλλα του παίκτη');

	nodereq.data.trapeziKodikos = nodereq.trapeziGet().trapeziKodikosGet();
	nodereq.data.dianomiKodikos = nodereq.dianomiGet().dianomiKodikosGet();

	if (!nodereq.trapeziKlidoma('pexnidiFilo'))
	return;

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.pexnidi.filo1(nodereq);
	});
};

Service.pexnidi.filo1 = function(nodereq) {
	var query;

	nodereq.data.energiaIdos = 'ΦΥΛΛΟ';
	nodereq.data.energiaData = nodereq.parametrosGet('filo');

	if (nodereq.parametrosGet('bourloto'))
	nodereq.data.energiaData += ':B';

	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		nodereq.data.dianomiKodikos + ', ' + nodereq.data.pektis + ', ' +
		nodereq.data.energiaIdos.json() + ', ' + nodereq.data.energiaData.json() + ')';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows < 1) {
			nodereq.data.conn.rollback();
			return nodereq.error('Απέτυχε η καταχώρηση παιξίματος φύλλου');
		}

		nodereq.data.conn.commit();
		nodereq.data.energiaKodikos = res.insertId;
		Service.pexnidi.filo2(nodereq);
	});
};

Service.pexnidi.filo2 = function(nodereq) {
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

	if (nodereq.data.trapezi.baza.cardsCount() < 4)
	return;

	setTimeout(function() {
		Service.pexnidi.kliseBaza(nodereq.data.trapeziKodikos);
	}, 1000);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.pexnidi.kliseBaza = function(trapeziKodikos) {
	var data = {};

	data.trapeziKodikos = trapeziKodikos;
	data.trapezi = skiniko.skinikoTrapeziGet(data.trapeziKodikos);
	if (!data.trapezi)
	return;

	if (!data.trapezi.baza)
	return;

	data.dianomi = data.trapezi.trapeziTelefteaDianomi();
	if (!data.dianomi)
	return;

	data.dianomiKodikos = data.dianomi.dianomiKodikosGet();
	data.pios = data.trapezi.baza.bazaPios(data.trapezi);

	data.conn = DB.connection().
	transaction(function(conn) {
		Service.pexnidi.kliseBaza1(data);
	});
};

Service.pexnidi.kliseBaza1 = function(data) {
	var query;

	data.energiaIdos = 'ΜΠΑΖΑ';
	query = 'INSERT INTO `energia` (`dianomi`, `pektis`, `idos`, `data`) VALUES (' +
		data.dianomiKodikos + ', ' + data.pios + ', ' +
		data.energiaIdos.json() + ", '" + data.pios + "')";
	data.conn.query(query, function(conn, res) {
		if (res.affectedRows < 1) {
			data.conn.rollback();
			return Globals.consoleError('Απέτυχε η καταχώρηση μπάζας');
		}

		data.conn.commit();
		data.energiaKodikos = res.insertId;
		Service.pexnidi.kliseBaza2(data);
	});
};

Service.pexnidi.kliseBaza2 = function(data) {
	var kinisi, pios;

	kinisi = new Kinisi('EG', {
		trapezi: data.trapeziKodikos,
		dianomi: data.dianomiKodikos,
		kodikos: data.energiaKodikos,
		pektis: data.pios,
		idos: data.energiaIdos,
		data: data.pios,
	});

	skiniko.skinikoKinisiProcess(kinisi);
	data.trapezi.partidaReplay();
	skiniko.skinikoKinisiEnimerosi();

	if (data.trapezi.partidaBazesCount() < 8)
	return;

	setTimeout(function() {
		Service.trapezi.neaDianomi(data.trapeziKodikos);
	}, 2000);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.pexnidi.filaPrev = function(nodereq) {
	var trapezi, thesi, dcount, dianomi;

	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi()) return;
	trapezi = nodereq.trapeziGet();

	thesi = trapezi.trapeziThesiPekti(nodereq.loginGet());
	if (!thesi)
	return nodereq.error('Ακαθόριστη θέση παίκτη');

	dcount = trapezi.trapeziDianomiCount();
	if (dcount < 2)
	return nodereq.error('Ακαθόριστη διανομή');

	dianomi = trapezi.dianomiArray[dcount - 2];

	query = "SELECT `data` FROM `energia` WHERE (`dianomi` = " +
		dianomi.dianomiKodikosGet() + ") AND (`idos` LIKE 'ΔΙΑΝΟΜΗ')";
	DB.connection().query(query, function(conn, res) {
		var data, apo;

		conn.free();

		if (res.length !== 1)
		return nodereq.error('Δεν βρέθηκαν φύλλα προηγούμενης διανομής');

		apo = (thesi - 1) * 16;

		if (trapezi.trapeziIsBelot() && nodereq.parametrosGet('dianomi'))
		nodereq.end(res[0].data.substr(apo, 10) + '^' + res[0].data.substr(apo + 10, 6));

		else
		nodereq.end(res[0].data.substr(apo, 16));
	});
};
