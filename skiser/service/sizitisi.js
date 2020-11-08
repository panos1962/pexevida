////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: sizitisi');

Service.sizitisi = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.sizitisi.trapezi = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('sxolio', true))
	return;

	if (nodereq.akathoristoTrapezi())
	return;

	Service.sizitisi.add(nodereq, new Sizitisi({
		trapezi: nodereq.trapeziGet().trapeziKodikosGet(),
	}));
};

Service.sizitisi.kafenio = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('sxolio', true))
	return;

	if (nodereq.akathoristoKafenio())
	return;

	Service.sizitisi.add(nodereq, new Sizitisi({
		kafenio: nodereq.kafenioGet().kafenioKodikosGet(),
	}));
};

Service.sizitisi.lobi = function(nodereq) {
	if (nodereq.isvoli())
	return;

	if (nodereq.denPerastike('sxolio', true))
	return;

	Service.sizitisi.add(nodereq, new Sizitisi());
};

Service.sizitisi.add = function(nodereq, sizitisi) {
	sizitisi.sizitisiPektisSet(nodereq.loginGet());
	sizitisi.sizitisiSxolioSet(nodereq.parametrosGet('sxolio'));
	DB.connection().transaction(function(conn) {
		Service.sizitisi.add1(nodereq, conn, sizitisi);
	});
};

Service.sizitisi.add1 = function(nodereq, conn, sizitisi) {
	var query, values;

	// Προετοιμάζουμε sql query προκειμένου να εντάξουμε το σχόλιο στην database.
	// Το query αποτελείται από δύο σκέλη, το σκέλος της περιγραφής των πεδίων
	// και το σκέλος των τιμών των πεδίων αυτών.

	query = 'INSERT INTO `sizitisi` (`pektis`, `sxolio`';
	values = nodereq.loginGet().json() + ', ' + nodereq.parametrosGet('sxolio').json();

	// Αν το σχόλιο αφορά συζήτηση σε συγκεκριμένο τραπέζι, εισάγουμε τα
	// σχετικά attributes στο αντικείμενο της συζήτησης και τροποποιούμε
	// ανάλογα το query.

	if (sizitisi.sizitisiIsTrapezi()) {
		query += ', `trapezi`';
		values += ', ' + sizitisi.sizitisiTrapeziGet();
	}

	// Αν το σχόλιο αφορά συζήτηση σε συγκεκριμένο καφενείο, εισάγουμε τα
	// σχετικά attributes στο αντικείμενο της συζήτησης και τροποποιούμε
	// ανάλογα το query.

	else if (sizitisi.sizitisiIsKafenio()) {
		query += ', `kafenio`';
		values += ', ' + sizitisi.sizitisiKafenioGet();
	}

	query += ') VALUES (' + values + ')';
	conn.query(query, function(conn, res) {
		if (res.affectedRows === 1) {
			sizitisi.sizitisiKodikosSet(res.insertId);
			return Service.sizitisi.add2(nodereq, conn, sizitisi);
		}

		conn.rollback();
		nodereq.error('Απέτυχε η ένταξη σχολίου στην database');
	});
};

Service.sizitisi.add2 = function(nodereq, conn, sizitisi) {
	var kinisi;

	conn.commit();
	nodereq.end();

	kinisi = new Kinisi('SZ');
	kinisi.data = {
		kodikos: sizitisi.sizitisiKodikosGet(),
		pektis: sizitisi.sizitisiPektisGet(),
		sxolio: sizitisi.sizitisiSxolioGet(),
	};

	if (sizitisi.sizitisiIsKafenio())
	kinisi.data.kafenio = sizitisi.sizitisiKafenioGet();

	else if (sizitisi.sizitisiIsTrapezi())
	kinisi.data.trapezi = sizitisi.sizitisiTrapeziGet();

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
