////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: sinedria');

Service.sinedria = {};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.sinedria.checkin = function(nodereq) {
	var login, kodikos;

	if (nodereq.anonimo())
	return;

	if (nodereq.denPerastike('kodikos'))
	return nodereq.error('Δεν περάστηκε κωδικός');

	login = nodereq.loginGet();
	kodikos = CRYPTO.createHash('sha1').update(nodereq.url.kodikos).digest('hex');

	skiniko.pektisFreskarisma(login, {
		dbconn: DB.connection(),
		callback: function(conn, pektis) {
			Globals.consoleLog(login + ': ' + 'ανανεώθηκαν τα στοιχεία του παίκτη στο σκηνικό');
			conn.transaction(function(conn) {
				Service.sinedria.checkin1(nodereq, conn, pektis);
			});
		},

		fail: function(conn) {
			conn.free();
			nodereq.error('Access denied');
		},
	});

};

Service.sinedria.checkin1 = function(nodereq, conn, pektis) {
	var spektis, query;

	spektis = pektis.login.json();
	query = 'INSERT INTO `istoriko` (`pektis`, `ip`, `isodos`, `exodos`) ' +
		'SELECT `pektis`, `ip`, `isodos`, NOW() FROM `sinedria` WHERE `pektis` = ' + spektis;
	conn.query(query, function(conn) {
		if (!conn.affectedRows)
		return Service.sinedria.checkin2(nodereq, conn, pektis);

		query = 'DELETE FROM `sinedria` WHERE `pektis` = ' + spektis;
		conn.query(query, function(conn) {
			if (conn.affectedRows)
			return Service.sinedria.checkin2(nodereq, conn, pektis);

			conn.rollback();
			nodereq.error('Απέτυχε η αρχειοθέτηση προηγούμενης συνεδρίας');
		});
	});
};

Service.sinedria.checkin2 = function(nodereq, conn, pektis) {
	var tora, sinedria, query, query2, apotiposi;

	tora = Globals.tora();
	sinedria = new Sinedria({
		pektis: pektis.login,
		ip: nodereq.ip,
		isodos: tora,
		poll: tora,
		feredataPoll: tora,
	});

	query = 'INSERT INTO `sinedria` (`pektis`, `klidi`, `ip`, `isodos`';
	query2 = ') VALUES (' + sinedria.pektis.json() + ',' + nodereq.klidi.json() +
		',' + sinedria.ip.json() + ', NOW()';

	apotiposi = skiniko.apotiposiRestore(pektis.login);

	if (apotiposi.kafenio) {
		query += ', `kafenio`';
		query2 += ', ' + apotiposi.kafenio;
		sinedria.sinedriaKafenioSet(apotiposi.kafenio);
	}

	if (apotiposi.trapezi) {
		query += ', `trapezi`, `thesi`, `simetoxi`';
		query2 += ', ' + apotiposi.trapezi + ', ' + apotiposi.thesi +
			', ' + apotiposi.simetoxi.json();
		sinedria.sinedriaTrapeziSet(apotiposi.trapezi);
		sinedria.sinedriaThesiSet(apotiposi.thesi);
		sinedria.sinedriaSimetoxiSet(apotiposi.simetoxi);
	}

	conn.query(query + query2 + ')', function(conn) {
		if (conn.affectedRows)
		return Service.sinedria.checkin3(nodereq, conn, sinedria);

		conn.rollback();
		nodereq.error('Απέτυχε η δημιουργία νέας συνεδρίας');
	});
};

Service.sinedria.checkin3 = function(nodereq, conn, sinedria) {
	var kinisi, airdenis;

	kinisi = new Kinisi('SN');
	kinisi.data.sinedria = sinedria;

	skiniko.
	skinikoKinisiProcess(kinisi);

	airdenis = skiniko.skinikoSinedriaGet(sinedria.pektis);
	if (!airdenis) {
		conn.rollback();
		nodereq.error('Απέτυχε ο εντοπισμός νέας συνεδρίας στο σκηνικό');
		return;
	}

	conn.commit();

	airdenis.
	klidiSet(nodereq.klidi);

	skiniko.
	skinikoKinisiPush(kinisi);

	nodereq.end();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Service.sinedria.exodos = function(nodereq) {
	if (nodereq.nosinedria())
	return;

	nodereq.end();
	nodereq.sinedria.feredataExodos();
	skiniko.apotiposiSave(nodereq.loginGet());
	skiniko.skinikoSinedriaDelete(nodereq.loginGet());

	nodereq.data.conn = DB.connection().
	transaction(function(conn) {
		Service.sinedria.exodos2(nodereq);
	});
};

Service.sinedria.exodos2 = function(nodereq) {
	var query;

	nodereq.data.spektis = nodereq.login.json();
	query = 'INSERT INTO `istoriko` (`pektis`, `ip`, `isodos`, `exodos`) ' +
		'SELECT `pektis`, `ip`, `isodos`, NOW() FROM `sinedria` WHERE `pektis` = ' +
		nodereq.data.spektis;
	nodereq.data.conn.query(query, function(conn) {
		if (conn.affectedRows)
		return Service.sinedria.exodos3(nodereq);

		conn.free();
		Service.sinedria.exodos4(nodereq);
	});
};

Service.sinedria.exodos3 = function(nodereq) {
	var query;

	query = 'DELETE FROM `sinedria` WHERE `pektis` = ' + nodereq.data.spektis;
	nodereq.data.conn.query(query, function(conn) {
		if (conn.affectedRows <= 0) {
			conn.rollback();
			nodereq.error('Απέτυχε η διαγραφή προηγούμενης συνεδρίας');
		}

		else
		conn.commit();

		Service.sinedria.exodos4(nodereq);
	});
};

Service.sinedria.exodos4 = function(nodereq) {
	var kinisi;

	kinisi = new Kinisi({
		idos: 'NS',
		data: {
			login: nodereq.loginGet(),
		}
	});

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
	Globals.consoleLog(kinisi.data.login + ': bye');
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Service.sinedria.thesiTheasis = function(nodereq) {
	var sinedria;

	if (nodereq.isvoli())
	return;

	if (nodereq.oxiTrapezi())
	return;

	if (nodereq.denPerastike('thesi'))
	return nodereq.error('Δεν περάστηκε θέση θέασης');

	sinedria = nodereq.sinedriaGet();
	if (sinedria.sinedriaOxiTheatis())
	return nodereq.error('Δεν είστε θεατής στο τραπέζι');

	nodereq.data.thesi = parseInt(nodereq.url.thesi);
	if (sinedria.sinedriaThesiGet() === nodereq.data.thesi)
	return nodereq.end();

	Service.sinedria.thesiTheasis2(nodereq);
};

Service.sinedria.thesiTheasis2 = function(nodereq) {
	var query, conn;

	query = 'UPDATE `sinedria` SET `thesi` = ' + nodereq.data.thesi +
		' WHERE `pektis` = ' + nodereq.loginGet().json();
	conn = DB.connection();
	conn.query(query, function(conn, res) {
		conn.free();
		if (res.affectedRows === 1)
		return Service.sinedria.thesiTheasis3(nodereq);

		nodereq.error('Απέτυχε η αλλαγή θέσης θέασης');
	});
};

Service.sinedria.thesiTheasis3 = function(nodereq) {
	var kinisi;

	nodereq.end();
	kinisi = new Kinisi({
		idos: 'TT',
		data: {
			pektis: nodereq.login,
			thesi: nodereq.data.thesi,
		},
	});

	skiniko.
	skinikoKinisiProcess(kinisi).
	skinikoKinisiPush(kinisi);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Service.sinedria.check = function(aftonomo) {
	var tora = Globals.tora(), arxio = {};

	if (Debug.flagGet('sinedriaCheck'))
	Globals.consoleLog('Περίπολος: sinedria.check');

	skiniko.skinikoSinedriaWalk(function() {
		var pektis;

		if (this.sinedriaSeXrisi(tora))
		return;

		pektis = this.sinedriaPektisGet();
		Globals.consoleLog(pektis + ': ανενεργή συνεδρία');

		this.feredataClose();

		// Κρατάμε στη λίστα "arxio" τις συνεδρίες που κλείνουν λόγω
		// μεγάλου χρόνου αδράνειας.

		arxio[pektis] = new Sinedria(this);

		kinisi = new Kinisi({
			idos: 'NS',
			data: {
				login: pektis,
			}
		});

		skiniko.skinikoKinisiProcess(kinisi);

		if (!aftonomo)
		skiniko.skinikoKinisiPush(kinisi, false);
	});

	if (!aftonomo)
	skiniko.skinikoKinisiEnimerosi();

	// Αρχειοθετούμε στην database τις συνεδρίες που έκλεισαν λόγω μεγάλου
	// χρόνου αδράνειας.

	Service.sinedria.arxiothetisi(arxio);
};

// Η μέθοδος "sinedriaSeXrisi" ελέγχει αν η συνεδρία διατηρεί επαφή με τον server
// και αν ο παίκτης της συνεδρίας εκτελεί κάποιες κινήσεις ή απλώς έχει ξεχαστεί
// στον «Πρεφαδόρο».

Sinedria.prototype.sinedriaSeXrisi = function(tora) {
	var pektis;

	if (tora === undefined)
	tora = Globals.tora();

	pektis = this.sinedriaPektisGet();

	// Ελέγχουμε πρώτα την περίπτωση η συνεδρία να έχει χάσει την επαφή της με
	// τον server χωρίς ο παίκτης να έχει κάνει προηγουμένως ρητή έξοδο από το
	// πρόγραμμα. Ελέγχουμε, λοιπόν, αν δεν υπάρχει πρόσφατο αίτημα feredata.

	if (tora - this.feredataPollGet() > Peripolos.sinedriaTimeout) {
		Globals.consoleError(pektis + ': feredataPoll:',
			tora - this.feredataPollGet(), '>', Peripolos.sinedriaTimeout);
		return false;
	}

	// Διαπιστώσαμε ότι η συνεδρία έχει υποβάλει προσφάτως αίτημα feredata. Στην
	// περίπτωση αυτή πρέπει να ελέγξουμε αν η συνεδρία κάνει άλλες κινήσεις ή
	// απλώς βρίσκεται σε επαφή με τον server.

	if (tora - this.sinedriaPollGet() > Peripolos.inactiveTimeout) {
		Globals.consoleError(pektis + ': sinedriaPoll:',
			tora - this.sinedriaPollGet(), '>', Peripolos.inactiveTimeout);
		return false;
	}

	return true;
};

Service.sinedria.arxiothetisi = function(lista) {
	var pektis, sinedria;

	for (pektis in lista) {
		sinedria = lista[pektis];
		delete lista[pektis];

		// Αν βρούμε συνεδρία για τον παίκτη του οποίου επιχειρούμε
		// αρχειοθέτηση συνεδρίας, τότε σημαίνει ότι ξαναμπήκε πρόσφατα
		// και θα έχει γίνει αρχειοθέτηση μέσω της διαδικασίας εισόδου.

		if (skiniko.skinikoSinedriaGet(pektis))
		return Service.sinedria.arxiothetisi(lista);

		DB.connection().transaction(function(conn) {
			Service.sinedria.arxiothetisi2(pektis, sinedria, lista, conn);
		});

		return;
	}
};

Service.sinedria.arxiothetisi2 = function(pektis, sinedria, lista, conn) {
	var query = 'INSERT INTO `istoriko` (`pektis`, `ip`, `isodos`, `exodos`) VALUES (' + pektis.json() + ', ' +
		sinedria.sinedriaIpGet().json() + ', FROM_UNIXTIME(' + sinedria.sinedriaIsodosGet() + '), NOW())';
	conn.query(query, function(conn, res) {
		if (res.affectedRows == 1)
		return Service.sinedria.arxiothetisi3(pektis, lista, conn);

		conn.rollback(function(conn) {
			conn.free();
			Service.sinedria.arxiothetisi(lista);
		});

		Globals.consoleError(pektis + ': απέτυχε η αρχειοθέτηση της συνεδρίας');
	});
};

Service.sinedria.arxiothetisi3 = function(pektis, lista, conn) {
	var query = 'DELETE FROM `sinedria` WHERE `pektis` LIKE ' + pektis.json();
	conn.query(query, function(conn, res) {
		if (res.affectedRows == 1)
		conn.commit(function(conn) {
			conn.free();
			Service.sinedria.arxiothetisi(lista);
		});

		else
		conn.rollback(function(conn) {
			conn.free();
			Globals.consoleError(pektis + ': απέτυχε η διαγραφή παλαιάς συνεδρίας');
			Service.sinedria.arxiothetisi(lista);
		});
	});
};
