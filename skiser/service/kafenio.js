////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: kafenio');

Service.kafenio = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.kafenio.neo = function(nodereq) {
	if (nodereq.isvoli())
	return;

	DB.connection().transaction(function(conn) {
		Service.kafenio.neo1(nodereq, conn);
	});
};

Service.kafenio.neo1 = function(nodereq, conn) {
	var query;

	query = "INSERT INTO `kafenio` (`onomasia`, `dimiourgos`, `idiotikotita`) VALUES ('', "
		+ nodereq.login.json() + ", 'ΠΡΙΒΕ')";
	conn.query(query, function(conn, res) {
		if (res.affectedRows == 1)
		return Service.kafenio.neo2(nodereq, conn, res.insertId);

		conn.rollback();
		nodereq.error('Απέτυχε η δημιουργία καφενείου');
	});
};

Service.kafenio.neo2 = function(nodereq, conn, kafenio) {
	var kinisi;

	conn.commit();
	nodereq.end();

	kinisi = new Kinisi('NK');
	kinisi.data.kafenio = {
		kodikos: kafenio,
		dimiourgos: nodereq.login,
		prive: true,
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.kafenio.epilogi = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('kafenio', true))
	return;

	DB.connection().transaction(function(conn) {
		Service.kafenio.epilogi1(nodereq, conn);
	});
};

Service.kafenio.epilogi1 = function(nodereq, conn) {
	var query;

	query = 'UPDATE `sinedria` SET `kafenio` = ' + nodereq.parametrosGet('kafenio') +
		' WHERE `pektis` = ' + nodereq.loginGet().json();
	conn.query(query, function(conn, res) {
		if (res.affectedRows == 1)
		return Service.kafenio.epilogi2(nodereq, conn);

		conn.rollback();
		nodereq.error('Απέτυχε η επιλογή καφενείου');
	});
};

Service.kafenio.epilogi2 = function(nodereq, conn) {
	var kinisi;

	conn.commit();
	nodereq.end();

	kinisi = new Kinisi('EK');
	kinisi.data = {
		pektis: nodereq.loginGet(),
		kafenio: nodereq.parametrosGet('kafenio'),
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.kafenio.exodos = function(nodereq) {
	if (nodereq.isvoli())
	return;

	DB.connection().transaction(function(conn) {
		Service.kafenio.exodos1(nodereq, conn);
	});
};

Service.kafenio.exodos1 = function(nodereq, conn) {
	var query;

	query = 'UPDATE `sinedria` SET `kafenio` = NULL WHERE `pektis` = ' + nodereq.loginGet().json();
	conn.query(query, function(conn, res) {
		if (res.affectedRows == 1)
		return Service.kafenio.exodos2(nodereq, conn);

		conn.rollback();
		nodereq.error('Απέτυχε η αποχώρηση από το καφενείο');
	});
};

Service.kafenio.exodos2 = function(nodereq, conn) {
	var kinisi;

	conn.commit();
	nodereq.end();

	kinisi = new Kinisi('XK');
	kinisi.data = {
		pektis: nodereq.loginGet(),
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.kafenio.dimosio = function(nodereq) {
	return Service.kafenio.idiotikotita(nodereq, 'ΔΗΜΟΣΙΟ');
};

Service.kafenio.prive = function(nodereq) {
	return Service.kafenio.idiotikotita(nodereq, 'ΠΡΙΒΕ');
};

Service.kafenio.idiotikotita = function(nodereq, idiotikotita) {
	var kafenio;

	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('kafenio', true))
	return;

	kafenio = skiniko.skinikoKafenioGet(nodereq.parametrosGet('kafenio'));
	if (!kafenio)
	return nodereq.error('Ανύπαρκτο καφενείο');

	if (kafenio.kafenioDimiourgosGet() !== nodereq.loginGet())
	return nodereq.error('Ξένο καφενείο');

	DB.connection().transaction(function(conn) {
		Service.kafenio.idiotikotita1(nodereq, conn, kafenio.kafenioKodikosGet(), idiotikotita);
	});
};

Service.kafenio.idiotikotita1 = function(nodereq, conn, kafenio, idiotikotita) {
	var query;

	query = 'UPDATE `kafenio` SET `idiotikotita` = ' + idiotikotita.json() +
		' WHERE `kodikos` = ' + kafenio;
	conn.query(query, function(conn, res) {
		if (res.affectedRows == 1)
		return Service.kafenio.idiotikotita2(nodereq, conn, kafenio, idiotikotita);

		conn.rollback();
		nodereq.error('Απέτυχε η αλλαγή ιδιωτικότητας καφενείου');
	});
};

Service.kafenio.idiotikotita2 = function(nodereq, conn, kafenio, idiotikotita) {
	var kinisi;

	conn.commit();
	nodereq.end();

	kinisi = new Kinisi('IK');
	kinisi.data = {
		pektis: nodereq.loginGet(),
		kafenio: kafenio,
		idiotikotita: idiotikotita,
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.kafenio.onomasia = function(nodereq) {
	var kafenio, query;

	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('kafenio', true))
	return;

	kafenio = skiniko.skinikoKafenioGet(nodereq.parametrosGet('kafenio'));
	if (!kafenio)
	return nodereq.error('Ανύπαρκτο καφενείο');

	if (kafenio.kafenioDimiourgosGet() !== nodereq.loginGet())
	return nodereq.error('Ξένο καφενείο');

	if (nodereq.denPerastike('onomasia', true))
	return;

	conn = DB.connection();
	query = 'UPDATE `kafenio` SET `onomasia` = ' + nodereq.parametrosGet('onomasia').json() +
		' WHERE `kodikos` = ' + nodereq.parametrosGet('kafenio');
	conn.query(query, function(conn, res) {
		conn.free();
		if (res.affectedRows < 1)
		return nodereq.error('Απέτυχε η αλλαγή ιδιωτικότητας καφενείου');

		Service.kafenio.onomasia2(nodereq);
	});
};

Service.kafenio.onomasia2 = function(nodereq) {
	var kinisi;

	nodereq.end();

	kinisi = new Kinisi('OK');
	kinisi.data = {
		pektis: nodereq.loginGet(),
		kafenio: parseInt(nodereq.parametrosGet('kafenio')),
		onomasia: nodereq.parametrosGet('onomasia'),
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.kafenio.diapistefsi = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('kafenio', true))
	return;

	if (nodereq.denPerastike('pektis', true))
	return;

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.kafenio.diapistefsi1(nodereq);
	});
};

Service.kafenio.diapistefsi1 = function(nodereq) {
	var query, trapezi;

	query = 'REPLACE INTO `diapiste` (`kafenio`, `pektis`) VALUES (' +
		nodereq.parametrosGet('kafenio') + ', ' + nodereq.loginGet().json() + ')';
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.kafenio.diapistefsi2(nodereq);

		nodereq.data.conn.rollback();
		nodereq.error('Απέτυχε η διαπίστευση στο καφενείο');
	});
};

Service.kafenio.diapistefsi2 = function(nodereq) {
	var kinisi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('KL');
	kinisi.data = {
		kafenio: nodereq.parametrosGet('kafenio'),
		kafetzis: nodereq.loginGet(),
		pektis: nodereq.parametrosGet('pektis'),
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.kafenio.apopompi = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('kafenio', true))
	return;

	if (nodereq.denPerastike('pektis', true))
	return;

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.kafenio.apopompi1(nodereq);
	});
};

Service.kafenio.apopompi1 = function(nodereq) {
	var query;

	query = 'DELETE FROM `diapiste` WHERE `kafenio` = ' + nodereq.parametrosGet('kafenio') +
		' AND `pektis` LIKE ' + nodereq.loginGet().json();
	nodereq.data.conn.query(query, function(conn, res) {
		if (res.affectedRows > 0)
		return Service.kafenio.apopompi2(nodereq);

		nodereq.data.conn.rollback();
		nodereq.error('Απέτυχε η αποπομπή παίκτη από καφενείο');
	});
};

Service.kafenio.apopompi2 = function(nodereq) {
	var kinisi;

	nodereq.data.conn.commit();
	nodereq.end();

	kinisi = new Kinisi('KX');
	kinisi.data = {
		kafenio: nodereq.parametrosGet('kafenio'),
		kafetzis: nodereq.loginGet(),
		pektis: nodereq.parametrosGet('pektis'),
	};

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
