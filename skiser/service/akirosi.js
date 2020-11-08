////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: akirosi');

Service.akirosi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.akirosi.start = function(nodereq) {
	var thesi, energia;

	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi()) return;
	nodereq.data.trapezi = nodereq.trapeziGet();

	thesi = nodereq.data.trapezi.trapeziThesiPekti(nodereq.loginGet());
	if (!thesi) return nodereq.error('Ακαθόριστη θέση παίκτη');

	if (nodereq.akathoristiDianomi()) return;
	nodereq.data.dianomi = nodereq.dianomiGet();

	if (nodereq.data.dianomi.energiaArray.length < 2)
	return nodereq.error('Δεν υπάρχουν κινήσεις προς ακύρωση');

	nodereq.data.trapeziKodikos = nodereq.trapeziGet().trapeziKodikosGet();
	nodereq.data.dianomiKodikos = nodereq.dianomiGet().dianomiKodikosGet();

	energia = nodereq.data.dianomi.energiaArray[nodereq.data.dianomi.energiaArray.length - 1];
	nodereq.data.energia = energia.energiaKodikosGet();

	if (!nodereq.trapeziKlidoma('akirosiStart'))
	return;

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.akirosi.start1(nodereq);
	});
};

Service.akirosi.start1 = function(nodereq) {
	var query;

	query = 'DELETE FROM `energia` WHERE (`dianomi` = ' + nodereq.data.dianomiKodikos +
		') AND (`kodikos` >= ' + nodereq.data.energia + ')';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows < 1) {
			nodereq.data.conn.rollback();
			return nodereq.error('Απέτυχε η ακύρωση κίνησης');
		}

		nodereq.data.conn.commit();
		Service.akirosi.start2(nodereq);
	});
};

Service.akirosi.start2 = function(nodereq) {
	var kinisi;

	nodereq.end();

	kinisi = new Kinisi('AK', {
		trapezi: nodereq.data.trapeziKodikos,
		dianomi: nodereq.data.dianomiKodikos,
		pektis: nodereq.loginGet(),
		energia: nodereq.data.energia,
	});

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
	nodereq.data.trapezi.partidaReplay();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.akirosi.stop = function(nodereq) {
	var thesi, kinisi;

	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi()) return;
	nodereq.data.trapezi = nodereq.trapeziGet();

	thesi = nodereq.data.trapezi.trapeziThesiPekti(nodereq.loginGet());
	if (!thesi) return nodereq.error('Ακαθόριστη θέση παίκτη');

	nodereq.data.trapeziKodikos = nodereq.trapeziGet().trapeziKodikosGet();
	nodereq.end();

	kinisi = new Kinisi('KA', {
		trapezi: nodereq.data.trapeziKodikos,
		pektis: nodereq.loginGet(),
	});

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
	nodereq.data.trapezi.partidaReplay();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
