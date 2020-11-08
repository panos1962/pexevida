////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: peparam');

Service.peparam = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.peparam.set = function(nodereq) {
	var conn, query;

	if (nodereq.isvoli()) return;
	if (nodereq.denPerastike('param', true)) return;
	if (nodereq.denPerastike('timi', true)) return;

	conn = DB.connection();
	query = 'REPLACE INTO `peparam` (`pektis`, `param`, `timi`) VALUES (' +
		nodereq.loginGet().json() + ', ' + nodereq.url.param.json() + ', ' +
		nodereq.url.timi.json() + ')';
	conn.query(query, function(conn, res) {
		conn.free();
		if (res.affectedRows < 1)
		return nodereq.error('Απέτυχε η αλλαγή παραμέτρου παίκτη');

		Service.peparam.set2(nodereq);
	});
};

Service.peparam.set2 = function(nodereq) {
	var kinisi;

	nodereq.end();
	kinisi = new Kinisi({
		idos: 'PS',
		data: {
			pektis: nodereq.loginGet(),
			param: nodereq.url.param,
			timi: nodereq.url.timi,
		},
	});

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};
