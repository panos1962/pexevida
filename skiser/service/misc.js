////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: misc');

Service.misc = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.misc.kornaTrapezi = function(nodereq) {
	var kinisi;

	if (nodereq.isvoli())
	return;

	if (nodereq.akathoristoTrapezi())
	return;

	nodereq.end();

	kinisi = new Kinisi('KN');
	kinisi.data = {
		pektis: nodereq.loginGet(),
		trapezi: nodereq.trapeziGet().trapeziKodikosGet(),
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
