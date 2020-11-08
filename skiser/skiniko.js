///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
//
// Στο παρόν περιγράφουμε μεθόδους που αφορούν μόνο στον server σκηνικού (skiser).
// Τέτοιες μέθοδοι είναι, π.χ. η επανασύσταση του σκηνικού από τα στοιχεία τής
// database, το κλείδωμα ενός τραπεζιού, το μοίρασμα μιας νέας διανομής, το
// φρεκάρισμα των στοιχείων παίκτη κλπ.
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Ακολουθεί μέθοδος με την οποία στήνεται ένα σκηνικό, ή καλύτερα ΤΟ σκηνικό στον
// skiser. Η μέθοδος αποτελεί ουσιαστικά το σημείο εκκίνησης της διαδικασίας, καθώς
// υπάρχει πληθώρα επιμέρους διαδικασιών που καλούνται αλυσιδωτά προκειμένου να
// στηθεί το σκηνικό. Το στήσιμο του σκηνικού στον skiser γίνεται με βάση τα στοιχεία
// που υπάρχουν κρατημένα στην database, και λαμβάνει χώρα κατά το ανέβασμα του skiser
// και πριν αρχίσει (ο skiser) να εξυπηρετεί τους clients.

Skiniko.prototype.stisimo = function() {
	Log.fasi.nea('Στήσιμο και ανασύσταση σκηνικού');

	// Στη λίστα "apotiposi" κρατάμε τα στοιχεία θέσης παικτών κατά τη στιγμή
	// της εξόδου, ώστε να γνωρίζουμε σε ποιο καφενείο, σε ποιο τραπέζι και σε
	// ποια θέση ήταν ο παίκτης τη στιγμή της εξόδου.

	this.apotiposi = {};

	this.
	skinikoReset().
	stisimoSizitisi(DB.connection());
	return this;
};

// Η συζητήσεις χωρίζονται σε τρία μεγάλα κεφάλαια: δημόσια συζήτηση, συζητήσεις
// καφενείων και συζητήσεις τραπεζιών. Εδώ διαβάζουμε τη δημόσια συζήτηση (lobby)
// και την εντάσσουμε στο σκηνικό.

Skiniko.prototype.stisimoSizitisi = function(conn) {
	var skiniko = this, query;

	Log.print('δημόσια συζήτηση');
	query = 'SELECT ' + Sizitisi.projection + ' FROM `sizitisi` ' +
		'WHERE (`kafenio` IS NULL) AND (`trapezi` IS NULL) ' +
		'ORDER BY `kodikos` DESC LIMIT ' + Globals.sizitisiMax;
	conn.query(query, function(conn, rows) {
		Globals.awalk(rows, function(i, sizitisi) {
			skiniko.skinikoSizitisiSet(new Sizitisi(sizitisi));
		});

		skiniko.stisimoKafenio(conn);
	});

	return this;
};

// Διαβάζουμε τα καφενεία από την database και τα εντάσσουμε στο σκηνικό.
// Παράλληλα δημιουργούμε λίστα καφενείων την οποία θα χρειαστούμε αργότερα.

Skiniko.prototype.stisimoKafenio = function(conn) {
	var skiniko = this, query, klist = {};

	Log.print('καφενεία');
	query = 'SELECT ' + Kafenio.projection + ' FROM `kafenio`';
	conn.query(query, function(conn, rows) {
		Globals.awalk(rows, function(i, kafenio) {
			var prive;

			kafenio.prive = (kafenio['idiotikotita'] === 'ΠΡΙΒΕ');
			delete kafenio['idiotikotita'];

			skiniko.skinikoKafenioSet(new Kafenio(kafenio));
			klist[kafenio.kodikos] = 1;
		});

		Log.level.push();
		Log.print('συζητήσεις καφενείων');
		skiniko.stisimoSizitisiKafenio(conn, klist);
	});

	return this;
};

// Οι συζητήσεις στα διάφορα καφενεία διαβάζονται κατά καφενείο προκειμένου να
// αποκόψουμε το τελευταίο τμήμα κάθε συζήτησης χωριστά.

Skiniko.prototype.stisimoSizitisiKafenio = function(conn, klist) {
	var skiniko = this, kafenio, query;

	for (kafenio in klist) {
		delete klist[kafenio];
		query = 'SELECT ' + Sizitisi.projection + ' FROM `sizitisi` ' +
			'WHERE `kafenio` = ' + kafenio + ' ORDER BY `kodikos` DESC ' +
			'LIMIT ' + Globals.sizitisiMax;
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, sizitisi) {
				skiniko.skinikoKafenioGet(kafenio).
				kafenioSizitisiSet(new Sizitisi(sizitisi));
			});

			skiniko.stisimoSizitisiKafenio(conn, klist);
		});

		return this;
	}

	this.stisimoDiapiste(conn);
	return this;
};

// Διαβάζουμε τα διαπιστευτήρια των παικτών στα διάφορα καφενεία.

Skiniko.prototype.stisimoDiapiste = function(conn) {
	var skiniko = this, query;

	Log.print('διαπιστευτήρια');
	query = 'SELECT ' + Diapiste.projection + ' FROM `diapiste`';
	conn.query(query, function(conn, rows) {
		Globals.awalk(rows, function(i, diapiste) {
			skiniko.skinikoDiapisteSet(new Diapiste(diapiste));
		});

		Log.level.pop();
		skiniko.stisimoTrapezi(conn);
	});

	return this;
};

// Διαβάζουμε τα ενεργά τραπέζια από την database και τα εντάσσουμε στο σκηνικό.
// Παράλληλα δημιουργούμε λίστα τραπεζιών που θα χρειαστούμε στην πορεία, καθώς
// επίσης και εναλλακτική λίστα τραπεζιών.

Skiniko.prototype.stisimoTrapezi = function(conn) {
	var skiniko = this, query, tlist1 = {}, tlist2 = {};

	Log.print('τραπέζια');
	query = 'SELECT ' + Trapezi.projection + ' FROM `partida`';
	conn.query(query, function(conn, rows) {
		Globals.awalk(rows, function(i, trapezi) {
			skiniko.skinikoTrapeziSet(new Trapezi(trapezi).trapeziPollSet());
			tlist1[trapezi.kodikos] = 1;
		});

		Log.level.push();
		Log.print('παράμετροι τραπεζιών');
		skiniko.stisimoTrapeziTrparam(conn, tlist1, tlist2);
	});

	return this;
};

// Διαβάζουμε τις παραμέτρους τραπεζιών από την database και τις εντάσσουμε στο σκηνικό.

Skiniko.prototype.stisimoTrapeziTrparam = function(conn, tlist1, tlist2) {
	var skiniko = this, trapeziKodikos, trapezi, query;

	for (trapeziKodikos in tlist1) {
		delete tlist1[trapeziKodikos];
		tlist2[trapeziKodikos] = 1;

		trapezi = skiniko.skinikoTrapeziGet(trapeziKodikos);
		if (!trapezi) {
			this.stisimoTrapeziTrparam(conn, tlist1, tlist2);
			return this;
		}

		query = 'SELECT ' + Trparam.projection + ' FROM `trparam` WHERE `trapezi` = ' + trapeziKodikos;
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, trparam) {
				trapezi.trapeziTrparamSet(trparam['param'], trparam['timi']);
			});

			skiniko.stisimoTrapeziTrparam(conn, tlist1, tlist2);
		});

		return this;
	}

	Log.print('διανομές');
	this.stisimoTrapeziDianomi(conn, tlist2, tlist1);
	return this;
};

// Διαβάζουμε τις διανομές τραπεζιών από την database και τις εντάσσουμε στο σκηνικό.

Skiniko.prototype.stisimoTrapeziDianomi = function(conn, tlist1, tlist2) {
	var skiniko = this, trapeziKodikos, trapezi, query;

	for (trapeziKodikos in tlist1) {
		delete tlist1[trapeziKodikos];
		tlist2[trapeziKodikos] = 1;

		trapezi = skiniko.skinikoTrapeziGet(trapeziKodikos);
		if (!trapezi) {
			this.stisimoTrapeziDianomi(conn, tlist1, tlist2);
			return this;
		}
		
		query = 'SELECT ' + Dianomi.projection + ' FROM `dianomi` WHERE `trapezi` = ' +
			trapeziKodikos + ' ORDER BY `kodikos`';
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, dianomi) {
				trapezi.trapeziDianomiPush(new Dianomi(dianomi));
			});

			skiniko.stisimoTrapeziDianomi(conn, tlist1, tlist2);
		});

		return this;
	}

	Log.print('ενέργειες');
	this.stisimoTrapeziEnergia(conn, tlist2, tlist1);
	return this;
};

// Διαβάζουμε τις ενέργειες τελευταίας διανομής τραπεζιών από την database και τις
// εντάσσουμε στο σκηνικό.

Skiniko.prototype.stisimoTrapeziEnergia = function(conn, tlist1, tlist2) {
	var skiniko = this, trapeziKodikos, trapezi, dianomi, dianomiKodikos, query;

	for (trapeziKodikos in tlist1) {
		delete tlist1[trapeziKodikos];
		tlist2[trapeziKodikos] = 1;

		trapezi = skiniko.skinikoTrapeziGet(trapeziKodikos);
		if (!trapezi) {
			this.stisimoTrapeziEnergia(conn, tlist1, tlist2);
			return this;
		}

		dianomi = trapezi.trapeziTelefteaDianomi();
		if (!dianomi) {
			this.stisimoTrapeziEnergia(conn, tlist1, tlist2);
			return this;
		}
		
		query = 'SELECT ' + Energia.projection + ' FROM `energia` WHERE `dianomi` = ' +
			dianomi.dianomiKodikosGet() + ' ORDER BY `kodikos`';
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, energia) {
				dianomi.dianomiEnergiaPush(new Energia(energia).energiaTrapeziSet(trapeziKodikos));
			});

			skiniko.stisimoTrapeziEnergia(conn, tlist1, tlist2);
		});

		return this;
	}

	Log.print('προσκλήσεις');
	this.stisimoTrapeziProsklisi(conn, tlist2, tlist1);
	return this;
};

Skiniko.prototype.stisimoTrapeziProsklisi = function(conn, tlist1, tlist2) {
	var skiniko = this, trapeziKodikos, trapezi, query;

	for (trapeziKodikos in tlist1) {
		delete tlist1[trapeziKodikos];
		tlist2[trapeziKodikos] = 1;

		trapezi = skiniko.skinikoTrapeziGet(trapeziKodikos);
		if (!trapezi) {
			this.stisimoTrapeziProsklisi(conn, tlist1, tlist2);
			return this;
		}
		
		query = 'SELECT ' + Prosklisi.projection + ' FROM `prosklisi` WHERE `trapezi` = ' + trapeziKodikos;
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, prosklisi) {
				trapezi.trapeziProsklisiSet(new Prosklisi(prosklisi));
			});

			skiniko.stisimoTrapeziProsklisi(conn, tlist1, tlist2);
		});

		return this;
	}

	Log.print('συνθέσεις τραπεζιών');
	this.stisimoTrapeziSinthesi(conn, tlist2, tlist1);
	return this;
};

Skiniko.prototype.stisimoTrapeziSinthesi = function(conn, tlist1, tlist2) {
	var skiniko = this, trapeziKodikos, trapezi, query;

	for (trapeziKodikos in tlist1) {
		delete tlist1[trapeziKodikos];
		tlist2[trapeziKodikos] = 1;

		trapezi = skiniko.skinikoTrapeziGet(trapeziKodikos);
		if (!trapezi) {
			this.stisimoTrapeziSinthesi(conn, tlist1, tlist2);
			return this;
		}
		
		query = 'SELECT ' + Sinthesi.projection + ' FROM `sinthesi` ' +
			'WHERE (`trapezi` = ' + trapeziKodikos + ') AND (`exodos` IS NULL)';
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, sinthesi) {
				if (!sinthesi['pektis'])
				return;

				trapezi.
				trapeziPektisSet(sinthesi['thesi'], sinthesi['pektis']).
				trapeziApodoxiSet(sinthesi['thesi'], sinthesi['apodoxi'].isNai());
			});

			skiniko.stisimoTrapeziSinthesi(conn, tlist1, tlist2);
		});

		return this;
	}

	Log.print('συζητήσεις τραπεζιών');
	this.stisimoTrapeziSizitisi(conn, tlist2);
	return this;
};

Skiniko.prototype.stisimoTrapeziSizitisi = function(conn, tlist) {
	var skiniko = this, trapeziKodikos, trapezi, query;

	for (trapeziKodikos in tlist) {
		delete tlist[trapeziKodikos];

		trapezi = skiniko.skinikoTrapeziGet(trapeziKodikos);
		if (!trapezi) {
			this.stisimoTrapeziSizitisi(conn, tlist);
			return this;
		}
		
		query = 'SELECT ' + Sizitisi.projection + ' FROM `sizitisi` ' +
			'WHERE `trapezi` = ' + trapeziKodikos + ' ORDER BY `kodikos` DESC ' +
			'LIMIT ' + Globals.sizitisiMax;
		conn.query(query, function(conn, rows) {
			Globals.awalk(rows, function(i, sizitisi) {
				trapezi.
				trapeziSizitisiSet(new Sizitisi(sizitisi));
			});

			skiniko.stisimoTrapeziSizitisi(conn, tlist);
		});

		return this;
	}

	Log.level.pop();
	this.stisimoSinedria(conn);
	return this;
};

Skiniko.prototype.stisimoSinedria = function(conn) {
	var skiniko = this, query;

	Log.print('συνεδρίες');
	query = 'SELECT ' + Sinedria.projection + ' FROM `sinedria`';
	conn.query(query, function(conn, rows) {
		Globals.awalk(rows, function(i, sinedria) {
			skiniko.skinikoSinedriaSet(new Sinedria(sinedria));
		});

		skiniko.stisimoPektis(conn);
	});

	return this;
};

// Έχουμε ήδη ανεβάσει στο σκηνικό καφενεία, τραπέζια και συνεδρίες και ήρθε η ώρα
// να ανεβάσουμε στοιχεία για τους παίκτες που εμπλέκονται σε όλα τα παραπάνω.

Skiniko.prototype.stisimoPektis = function(conn) {
	var plist = {};

	Log.print('παίκτες');

	this.skinikoSinedriaWalk(function() {
		plist[this.sinedriaPektisGet()] = true;
	});

	this.skinikoTrapeziWalk(function() {
		this.trapeziThesiWalk(function(thesi) {
			plist[this.trapeziPektisGet(thesi)] = true;
		});
	});

	this.skinikoKafenioWalk(function() {
		plist[this.kafenioDimiourgosGet()] = 1;
	});

	delete plist[undefined];
	delete plist[null];
	Log.level.push();
	this.stisimoPektis2(conn, plist);
	return this;
};

Skiniko.prototype.stisimoPektis2 = function(conn, plist) {
	var skiniko = this, login;

	for (login in plist) {
		delete plist[login];
		Log.print(login);
		this.pektisFreskarisma(login, {
			dbconn: conn,
			enimerosi: false,
			callback: function(conn) {
				skiniko.stisimoPektis2(conn, plist);
			},
		});

		return this;
	}

	Log.level.pop();
	skiniko.stisimoTelos(conn);
	return this;
};

// Ακολουθεί η τελευταία μέθοδος που καλείται κατά το στήσιμο του σκηνικού.

Skiniko.prototype.stisimoTelos = function(conn) {
	conn.free();

	// Κάνουμε replay όλες τις παρτίδες με βάση τα στοιχεία που έχουμε
	// ήδη φορτώσει.

	Log.print('replay παρτίδων');
	this.skinikoTrapeziWalk(function() {
		this.partidaReplay();
	});

	// Ετοιμάζουμε το transaction log, ήτοι ένα array κινήσεων μέσω των
	// οποίων γίνονται αλλαγές στο σκηνικό.

	this.kinisi = [];
	this.kinisiMax = Globals.kinisiMax;

	// Εκκινούμε τον skiser ως server εξυπηρέτησης αιτημάτων σκηνικού.
	// Αυτά τα αιτήματα είναι είτε αιτήματα που αφορούν στην ενημέρωση
	// του σκηνικού των clients, είτε αιτήματα αλλαγής σκηνικού (κινήσεις).

	Server.ekinisi(this);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η μέθοδος "pektisFreskarisma" δέχεται ένα login name και επιχειρεί να ανανεώσει
// τα στοιχεία του φερώνυμου παίκτη από τα στοιχεία της database. Ως δεύτερη παράμετρο
// μπορούμε να περάσουμε μια σειρά από options:
//
//	dbconn		Σύνδεση με την database στα πλαίσια της οποίας θα εκτελεστούν
//			τα απαραίτητα queries. Αν δεν έχει καθοριστεί, δημιουργείται
//			νέα σύνδεση με την database.
//
//	kodikos		Αν υπάρχει σημαίνει το password σε κρυπτογραφημένη μορφή.
//
//	enimerosi	Αν δεν υπάρχει η συγκεκριμένη παράμετρος θεωρείται true και
//			σημαίνει το αν θα δρομολογηθεί ενημέρωση των clients με τα
//			νέα στοιχεία του παίκτη.
//
//	callback	Function που καλείται μετά το πέρας των εργασιών. Η function
//			καλείται ως μέθοδος του σκηνικού με παραμέτρους τη σύνδεση με
//			την database και τον ίδιο τον παίκτη. Αν δεν καθοριστεί callback
//			function, τότε καλείται function η οποία κλείνει τη σχετική σύνδεση
//			με την database. Η function, εφόσον υπάρχει, θα κληθεί σε περίπτωση
//			που ο παίκτης εντοπίστεί επιτυχώς στην database.
//
//	fail		Function που καλείται μετά το πέρας των εργασιών και μόνον
//			εφόσον ο παίκτης ΔΕΝ εντοπιστεί επιτυχώς στην database.

Skiniko.prototype.pektisFreskarisma = function(login, opts) {
	var skiniko = this, query;

	if (opts === undefined)
	opts = {};

	if (!opts.hasOwnProperty('dbconn'))
	opts.dbconn = DB.connection();

	if (!opts.hasOwnProperty('enimerosi'))
	opts.enimerosi = true;

	if (!opts.hasOwnProperty('callback'))
	opts.callback = function(conn) {
		conn.free();
	};

	if (!opts.hasOwnProperty('fail'))
	opts.fail = function(conn) {
		conn.free();
	};

	query = 'SELECT ' + Pektis.projection + ' FROM `pektis` WHERE (`login` LIKE ' + login.json() + ')';
	if (opts.hasOwnProperty('kodikos'))
	query += ' AND (`kodikos` LIKE BINARY ' + opts.kodikos.json() + ')';
	opts.dbconn.query(query, function(conn, rows) {
		// Αν βρέθηκε γραμμή με τα στοιχεία του αναζητούμενου παίκτη,
		// προχωρούμε στις επόμενες φάσεις αλυσιδωτά εκκινώντας με τις
		// παραμέτρους του παίκτη.

		if (rows.length) {
			skiniko.pektisFreskarismaPeparam(new Pektis(rows[0]), opts);
			return;
		}

		// Ο παίκτης δεν βρέθηκε στην database, επομένως τον καταργούμε
		// και από το σκηνικό.

		skiniko.skinikoPektisDelete(login);

		// Η διαδικασία έχει τελειώσει, επομένως καλούμε την callback function
		// ως μέθοδο του σκηνικού, με παράμετρο τη σύνδεση με την database.

		opts.fail.call(skiniko, conn);
		console.error(login + ': δεν βρέθηκε ο παίκτης στην database');
	});

	return this;
};

Skiniko.prototype.pektisFreskarismaPeparam = function(pektis, opts) {
	var skiniko = this, query;

	query = 'SELECT ' + Peparam.projection + ' FROM `peparam` WHERE `pektis` LIKE ' + pektis.pektisLoginGet().json();
	opts.dbconn.query(query, function(conn, rows) {
		Globals.awalk(rows, function(i, peparam) {
			pektis.pektisPeparamSet(peparam['param'], peparam['timi']);
		});

		skiniko.pektisFreskarismaProfinfo(pektis, opts);
	});

	return this;
};

Skiniko.prototype.pektisFreskarismaProfinfo = function(pektis, opts) {
	var skiniko = this, query;

	query = 'SELECT ' + Profinfo.projection + ' FROM `profinfo` WHERE `pektis` LIKE ' + pektis.pektisLoginGet().json();
	opts.dbconn.query(query, function(conn, rows) {
		Globals.awalk(rows, function(i, profinfo) {
			pektis.pektisProfinfoSet(profinfo['sxoliastis'], profinfo['kimeno']);
		});

		skiniko.pektisFreskarismaSxesi(pektis, opts);
	});

	return this;
};

Skiniko.prototype.pektisFreskarismaSxesi = function(pektis, opts) {
	var skiniko = this, query;

	query = 'SELECT ' + Sxesi.projection + ' FROM `sxesi` WHERE `pektis` LIKE ' + pektis.pektisLoginGet().json();
	opts.dbconn.query(query, function(conn, rows) {
		Globals.awalk(rows, function(i, sxesi) {
			pektis.pektisSxesiSet(sxesi['sxetizomenos'], sxesi['sxesi']);
		});

		skiniko.pektisFreskarismaPhoto(pektis, opts);
	});

	return this;
};

Skiniko.prototype.pektisFreskarismaPhoto = function(pektis, opts) {
	var skiniko = this, login, fname;

	login = pektis.pektisLoginGet();
	fname = login.substr(0, 1).toLowerCase() + '/' + login;

	FS.stat('../client/photo/' + fname, function(err, stats) {
		if (err)
		pektis.pektisPhotoSet();

		else
		pektis.pektisPhotoSet(fname, parseInt(stats.mtime.getTime() / 1000));

		skiniko.skinikoPektisSet(pektis);

		if (opts.enimerosi)
		skiniko.skinikoKinisiPush(new Kinisi({
			idos: 'PK',
			data: pektis,
		}), false);

		opts.callback.call(skiniko, opts.dbconn, pektis);
	});

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Sinedria.prototype.floterKinisiGet = function() {
	var floter;

	if (!this.hasOwnProperty('floter'))
	return null;

	floter = this.floter.kinisi;

	if (isNaN(floter))
	return null;

	floter = parseInt(floter);

 	if (floter < 0)
	return null;

 	if (floter > skiniko.kinisi.length)
	return null;

	return floter;
};

Sinedria.prototype.floterKsizitisiSet = function(kafenio, n) {
	if (typeof kafenio === 'object')
	kafenio = kafenio.kafenioKodikosGet();

	this.floter.ksizitisi[kafenio] = n;
	return this;
};

Sinedria.prototype.floterKsizitisiGet = function(kafenio) {
	if (typeof kafenio === 'object')
	kafenio = kafenio.kafenioKodikosGet();

	return this.floter.ksizitisi.hasOwnProperty(kafenio) ? this.floter.ksizitisi[kafenio] : 0;
};

Sinedria.prototype.floterTsizitisiSet = function(trapezi, n) {
	if (typeof trapezi === 'object')
	trapezi = trapezi.trapeziKodikosGet();

	this.floter.tsizitisi[trapezi] = n;

	return this;
};

Sinedria.prototype.floterTsizitisiGet = function(trapezi) {
	if (typeof trapezi === 'object')
	trapezi = trapezi.trapeziKodikosGet();

	return this.floter.tsizitisi.hasOwnProperty(trapezi) ? this.floter.tsizitisi[trapezi] : 0;
};

Sinedria.prototype.floterEnergiaSet = function(trapezi, n) {
	if (typeof trapezi === 'object')
	trapezi = trapezi.trapeziKodikosGet();

	this.floter.energia[trapezi] = n;

	return this;
};

Sinedria.prototype.floterEnergiaGet = function(trapezi) {
	if (typeof trapezi === 'object')
	trapezi = trapezi.trapeziKodikosGet();

	return this.floter.energia.hasOwnProperty(trapezi) ? this.floter.energia[trapezi] : 0;
};

Sinedria.prototype.klidiSet = function(klidi) {
	this.klidi = klidi;
	return this;
};

Sinedria.prototype.klidiGet = function() {
	return this.klidi;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Skiniko.prototype.apotiposiSave = function(pektis) {
	var sinedria;

	pektis = Vida.pektisLoginGet(pektis);
	sinedria = this.skinikoSinedriaGet(pektis);

	if (sinedria)
	this.apotiposi[pektis] = {
		kafenio: sinedria.sinedriaKafenioGet(),
		trapezi: sinedria.sinedriaTrapeziGet(),
		thesi: sinedria.sinedriaThesiGet(),
		simetoxi: sinedria.sinedriaSimetoxiGet(),
	};

	else
	delete this.apotiposi[pektis];

	return this;
};

Skiniko.prototype.apotiposiSet = function(pektis, apotiposi) {
	pektis = Vida.pektisLoginGet(pektis);

	if (apotiposi) {
		this.apotiposi[pektis] = apotiposi;
		return apotiposi;
	}

	delete this.apotiposi[pektis];
	return {};
};

Skiniko.prototype.apotiposiTrapeziClear = function(pektis, apotiposi) {
	delete apotiposi.trapezi;
	delete apotiposi.thesi;
	delete apotiposi.simetoxi;

	return this.apotiposiSet(pektis, apotiposi);
};

Skiniko.prototype.apotiposiRestore = function(pektis) {
	var apotiposi, kafenio, trapezi;

	pektis = Vida.pektisLoginGet(pektis);
	apotiposi = skiniko.apotiposi[pektis];
	if (!apotiposi)
	return this.apotiposiSet(pektis);

	kafenio = skiniko.skinikoKafenioGet(apotiposi.kafenio);
	if (!kafenio)
	delete apotiposi.kafenio;

	trapezi = skiniko.skinikoTrapeziGet(apotiposi.trapezi);
	if (!trapezi)
	return this.apotiposiTrapeziClear(pektis, apotiposi);

	if (Vida.oxiThesi(apotiposi.thesi))
	return this.apotiposiTrapeziClear(pektis, apotiposi);

	switch (apotiposi.simetoxi) {
	case 'ΘΕΑΤΗΣ':
		return apotiposi;
	case 'ΠΑΙΚΤΗΣ':
		break;
	default:
		return this.apotiposiTrapeziClear(pektis, apotiposi);
	}

	if (trapezi.trapeziPektisGet(apotiposi.thesi) !== pektis)
	return this.apotiposiTrapeziClear(pektis, apotiposi);

	return apotiposi;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Η μέθοδος "trapeziKlidoma" θέτει ένα κλείδωμα στο τραπέζι και όσο το κλείδωμα
// είναι σε ισχύ κάθε άλλη απόπειρα κλειδώματος αποτυγχάνει. Η μέθοδος επιστρέφει
// τη χρονική στιγμή του κλειδώματος εφόσον το κλείδωμα είναι επιτυχημένο, αλλιώς
// επιστρέφει false.

Trapezi.prototype.trapeziKlidoma = function(logos) {
	if (this.klidoma)
	return false;

	if (logos)
	this.klidomaLogos = logos;

	else
	delete this.klidomaLogos;

	this.klidoma = Globals.torams();
	return this.klidoma;
};

Trapezi.prototype.trapeziKlidomaGet = function() {
	return this.klidoma;
};

Trapezi.prototype.trapeziKlidomeno = function() {
	return this.trapeziKlidomaGet();
};

Trapezi.prototype.trapeziXeklidoto = function() {
	return !this.trapeziKlidomeno();
};

// Κρατάμε κάπου (globally) τον μέγιστο χρόνο ξεκλειδώματος ο οποίος πρέπει να
// κυμαίνεται σε διαστήματα κλασμάτων του δευτερολέπτου. Αν παρουσιαστούν μεγάλα
// διαστήματα σημαίνει ότι κάπου έχουμε ξεχάσει να ξεκλειδώσουμε και θα πρέπει να
// διορθώσουμε το πρόγραμμα.

Trapezi.xeklidomaMax = 0;

Trapezi.prototype.trapeziXeklidoma = function() {
	var dt;

	if (this.trapeziXeklidoto())
	return this;

	dt = Globals.torams() - this.klidoma;
	delete this.klidoma;

	if (dt <= Trapezi.xeklidomaMax)
	return this;

	Trapezi.xeklidomaMax = dt;
	console.log('Trapezi.xeklidomaMax = ', dt + 'ms (reason: ' +
		(this.klidomaLogos ? this.klidomaLogos : 'unknown') + ')');
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Ακολουθούν projection lists των πεδίων των πινάκων που διαβάζουμε από την
// database για την επανακατασκευή του σκηνικού.

Kafenio.projection =
	'`kodikos`, ' +
	'`onomasia`, ' +
	'`dimiourgos`, ' +
	'UNIX_TIMESTAMP(`enarxi`) AS `stisimo`, ' +
	'`idiotikotita`';

Diapiste.projection =
	'`kafenio`, ' +
	'`pektis`, ' +
	'UNIX_TIMESTAMP(`epidosi`) AS `epidosi`';

Trapezi.projection =
	'`kodikos`, ' +
	'`kafenio`, ' +
	'UNIX_TIMESTAMP(`stisimo`) AS `stisimo`, ' +
	'UNIX_TIMESTAMP(`poll`) AS `poll`, ' +
	'UNIX_TIMESTAMP(`arxio`) AS `arxio`';

Trparam.projection =
	'`param`, ' +
	'`timi`';

Sinthesi.projection =
	'`trapezi`, ' +
	'`thesi`, ' +
	'`pektis`, ' +
	'`apodoxi`, ' +
	'`exodos`';

Simetoxi.projection =
	'`trapezi`, ' +
	'`pektis`, ' +
	'`thesi`';

Dianomi.projection =
	'`kodikos`, ' +
	'`trapezi`, ' +
	'UNIX_TIMESTAMP(`enarxi`) AS `enarxi`, ' +
	'`dealer`, ' +
	'`skor13`, ' +
	'`skor24`, ' +
	'`kremamena`, ' +
	'UNIX_TIMESTAMP(`telos`) AS `telos`';

Energia.projection =
	'`kodikos`, ' +
	'`dianomi`, ' +
	'`pektis`, ' +
	'`idos`, ' +
	'`data`, ' +
	'UNIX_TIMESTAMP(`pote`) AS `pote`';

Sizitisi.projection =
	'`kodikos`, ' +
	'`pektis`, ' +
	'`sxolio`, ' +
	'UNIX_TIMESTAMP(`pote`) AS `pote`';

Sinedria.projection =
	'`pektis`, ' +
	'`klidi`, ' +
	'`ip`, ' +
	'UNIX_TIMESTAMP(`isodos`) AS `isodos`, ' +
	'`kafenio`, `trapezi`, `thesi`, `simetoxi`';

Pektis.projection =
	'`login`, ' +
	'UNIX_TIMESTAMP(`egrafi`) AS `egrafi`, ' +
	'`onoma`, ' +
	'`email`';

Peparam.projection =
	'`param`, ' +
	'`timi`';

Sxesi.projection =
	'`sxetizomenos`, ' +
	'`sxesi`';

Profinfo.projection =
	'`sxoliastis`, ' +
	'`kimeno`';

Prosklisi.projection =
	'`trapezi`, ' +
	'`apo`, ' +
	'`pros`, ' +
	'UNIX_TIMESTAMP(`epidosi`) AS `epidosi`';
