////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: sxesi');

Service.sxesi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.sxesi.set = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('pektis', true))
	return;

	if (nodereq.denPerastike('sxesi', true))
	return;

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.sxesi.set1(nodereq);
	});
};

Service.sxesi.set1 = function(nodereq) {
	var query;

	nodereq.data.sxesi = nodereq.parametrosGet('sxesi');

	if (nodereq.data.sxesi)
	query = 'REPLACE INTO `sxesi` (`pektis`, `sxetizomenos`, `sxesi`) VALUES (' +
		nodereq.loginGet().json() + ', ' + nodereq.parametrosGet('pektis').json() + ', ' +
		nodereq.data.sxesi.json() + ')';

	else
	query = 'DELETE FROM `sxesi` WHERE (`pektis` LIKE ' + nodereq.loginGet().json() +
		') AND (`sxetizomenos` LIKE ' + nodereq.parametrosGet('pektis').json() + ')';

	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.sxesi.set2(nodereq);

		nodereq.data.conn.rollback();
		nodereq.error('Απέτυχε η αλλαγή σχέσης');
	});
};

Service.sxesi.set2 = function(nodereq) {
	var kinisi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('SX');
	kinisi.data = {
		trapezi: nodereq.parametrosGet('trapezi'),
		pektis: nodereq.loginGet(),
		sxetizomenos: nodereq.parametrosGet('pektis'),
	};

	if (nodereq.data.sxesi)
	kinisi.data.sxesi = nodereq.data.sxesi;

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};
