// Το σκηνικό αποτελείται από:
//
//	Παίκτες		Πρόκειται για λίστα δεικτοδοτημένη με το login name του παίκτη
//			που για κάποιο λόγο πρέπει να τους έχουμε πρόχειρους. Μερικοί
//			από τους λόγους αυτούς είναι: ο παίκτης είναι ή ήταν πρόσφατα
//			online, ο παίκτης φαίνεται να παίζει σε κάποιο τραπέζι κλπ.
//
//	Συνεδρίες	Πρόκειται για λίστα δεικτοδοτημένη με το login name του παίκτη
//			και περιλαμβάνει όλους τους online παίκτες. Η λίστα περιέχει
//			στοιχεία επικοινωνίας του παίκτη με τον server (IP, κλειδί,
//			αίτημα δεδομένων, κανάλι απάντησης κλπ) και τα στοιχεία θέσης
//			του παίκτη (κωδικός καφενείου, κωδικός τραπεζιού, θέση και τρόπος
//			συμμετοχής στο τραπέζι). Οι συνεδρίες αφαιρούνται από τη λίστα είτε
//			κατά την ρητή έξοδο του παίκτη από το πρόγραμμα, είτε μέσω περιπολικής
//			διαδικασίας εκκαθάρισης που κλείνει συνεδρίες που δείχνουν να είναι
//			αδρανείς για «μεγάλο» χρονικό διάστημα.
//
//	Τραπέζια	Πρόκειται για λίστα δεικτοδοτημένη με τον κωδικό τραπεζιού και
//			περιλαμβάνει όλα τα ενεργά τραπέζια, δηλαδή όλα τα τραπέζια που
//			δεν έχουν αρχειοθετηθεί.
//
//	Καφενεία	Πρόκειται για λίστα όλων των υφιστάμενων καφενείων δεικτοδοτημένη
//			με τον κωδικό καφενείου.
//
//	Συζήτηση	Πρόκειται για λίστα δεικτοδοτημένη με τον κωδικό σχολίου και αφορά
//			στη δημόσια συζήτηση εκτός συγκεκριμένου καφενείου και εκτός συγκεκριμένου
//			τραπεζιού (lobby).
//
// Υπάρχει πλήρες σκηνικό στον skiser και υποσύνολα σε κάθε client. Τα σκηνικά των clients
// περιλαμβάνουν εκείνα τα στοιχεία του σκηνικού που αφορούν στον αντίστοιχο παίκτη.

Skiniko = function(props) {
	Globals.initObject(this, props);
};

Skiniko.prototype.skinikoReset = function() {
	this.pektis = {};
	this.sinedria = {};
	this.trapezi = {};
	this.kafenio = {};
	this.sizitisi = {};

	return this;
};

Skiniko.prototype.skinikoPektisSet = function(pektis) {
	this.pektis[pektis.pektisLoginGet()] = pektis;
	return this;
};

Skiniko.prototype.skinikoPektisGet = function(login) {
	return this.pektis[login];
};

Skiniko.prototype.skinikoPektisDelete = function(login) {
	delete this.pektis[login];
	return this;
};

Skiniko.prototype.skinikoPektisWalk = function(callback, dir, sort) {
	var keys = [];

	if (!dir) {
		Globals.walk(this.pektis, function(login, pektis) {
			callback.call(pektis);
		});

		return this;
	}

	this.skinikoPektisWalk(function() {
		keys.push(this);
	});

	if (sort === undefined)
	sort = function(a, b) {
		return a.login.localeCompare(b.login) * dir;
	};
	keys.sort(sort);

	Globals.awalk(keys, function(i, pektis) {
		callback.call(pektis);
	});

	return this;
};

Skiniko.prototype.skinikoKafenioSet = function(kafenio) {
	this.kafenio[kafenio.kafenioKodikosGet()] = kafenio;
	return this;
};

Skiniko.prototype.skinikoKafenioGet = function(kodikos) {
	return this.kafenio[kodikos];
};

Skiniko.prototype.skinikoKafenioWalk = function(callback, dir, sort) {
	var keys = [];

	if (!dir) {
		Globals.walk(this.kafenio, function(i, kafenio) {
			callback.call(kafenio);
		});

		return this;
	}

	this.skinikoKafenioWalk(function() {
		keys.push(this);
	});

	if (sort === undefined)
	sort = function(a, b) {
		if (a.kodikos < b.kodikos)
		return (-1) * dir;

		if (a.kodikos > b.kodikos)
		return 1 * dir;

		return 0;
	};
	keys.sort(sort);

	Globals.awalk(keys, function(i, kafenio) {
		callback.call(kafenio);
	});

	return this;
};

Skiniko.prototype.skinikoDiapisteSet = function(diapiste) {
	var kafenio;

	kafenio = this.skinikoKafenioGet(diapiste.diapisteKafenioGet());
	if (!kafenio)
	return this;

	kafenio.kafenioDiapisteSet(diapiste.diapistePektisGet(), diapiste.diapisteEpidosiGet());
	return this;
};

Skiniko.prototype.skinikoDiapisteDelete = function(diapiste) {
	var kafenio;

	kafenio = this.skinikoKafenioGet(diapiste.diapisteKafenioGet());
	if (!kafenio)
	return this;

	kafenio.kafenioDiapisteDelete(diapiste.diapistePektisGet());
	return this;
};

Skiniko.prototype.skinikoTrapeziSet = function(trapezi) {
	var kodikos, kafenio;

	// Το τραπέζι εντάσσεται κατ' αρχάς στο σκηνικό.

	kodikos = trapezi.trapeziKodikosGet();
	this.trapezi[kodikos] = trapezi;

	// Εφόσον υπάρχει συμπληρωμένο καφενείο (πρέπει να υπάρχει),
	// το τραπέζι εντάσσεται ως αναφορά ΚΑΙ στο καφενείο.

	kafenio = this.skinikoKafenioGet(trapezi.trapeziKafenioGet());
	if (kafenio)
	kafenio.kafenioTrapeziSet(trapezi);

	return this;
};

Skiniko.prototype.skinikoTrapeziGet = function(kodikos) {
	return this.trapezi[kodikos];
};

Skiniko.prototype.skinikoTrapeziDelete = function(trapezi) {
	var kodikos, kafenio;

	if (trapezi instanceof Trapezi)
	kodikos = trapezi.trapeziKodikosGet();

	else {
		kodikos = trapezi;
		trapezi = this.skinikoTrapeziGet(kodikos);
	}

	// Εφόσον υπάρχει συμπληρωμένο καφενείο (πρέπει να υπάρχει),
	// το τραπέζι διαγράφεται κατ' αρχάς από το καφενείο.

	kafenio = this.skinikoKafenioGet(trapezi.trapeziKafenioGet());
	if (kafenio)
	kafenio.kafenioTrapeziDelete(kodikos);

	// Το τραπέζι διαγράφεται από το σκηνικό.

	delete this.trapezi[kodikos];

	return this;
};

Skiniko.prototype.skinikoTrapeziWalk = function(callback, dir, sort) {
	var keys = [];

	if (!dir) {
		Globals.walk(this.trapezi, function(i, trapezi) {
			callback.call(trapezi);
		});

		return this;
	}

	this.skinikoTrapeziWalk(function() {
		keys.push(this);
	});

	if (sort === undefined)
	sort = function(a, b) {
		if (a.kodikos < b.kodikos)
		return (-1) * dir;

		if (a.kodikos > b.kodikos)
		return 1 * dir;

		return 0;
	};
	keys.sort(sort);

	Globals.awalk(keys, function(i, trapezi) {
		callback.call(trapezi);
	});

	return this;
};

Skiniko.prototype.skinikoSinedriaSet = function(sinedria) {
	var pektis;

	pektis = sinedria.sinedriaPektisGet();
	this.sinedria[pektis] = sinedria;

	return this;
};

Skiniko.prototype.skinikoSinedriaGet = function(login) {
	return this.sinedria[login];
};

Skiniko.prototype.skinikoSinedriaDelete = function(login) {
	delete this.sinedria[login];
	return this;
};

Skiniko.prototype.skinikoSinedriaWalk = function(callback, dir, sort) {
	var keys = [];

	if (!dir) {
		Globals.walk(this.sinedria, function(login, sinedria) {
			callback.call(sinedria);
		});

		return this;
	}

	this.skinikoSinedriaWalk(function() {
		keys.push(this);
	});

	if (sort === undefined)
	sort = function(a, b) {
		if (a.isodos < b.isodos)
		return (-1) * dir;

		if (a.isodos > b.isodos)
		return 1 * dir;

		return 0;
	};
	keys.sort(sort);

	Globals.awalk(keys, function(i, sinedria) {
		callback.call(sinedria);
	});

	return this;
};

Skiniko.prototype.skinikoSizitisiSet = function(sizitisi) {
	this.sizitisi[sizitisi.sizitisiKodikosGet()] = sizitisi;
	return this;
};

Skiniko.prototype.skinikoSizitisiGet = function(kodikos) {
	return this.sizitisi[kodikos];
};

Skiniko.prototype.skinikoSizitisiDelete = function(kodikos) {
	delete this.sizitisi[kodikos];
	return this;
};

Skiniko.prototype.skinikoSizitisiWalk = function(callback, dir) {
	var keys = [];

	if (!dir) {
		Globals.walk(this.sizitisi, function(kodikos, sizitisi) {
			callback.call(sizitisi);
		});

		return this;
	}

	this.skinikoSizitisiWalk(function() {
		keys.push(this);
	});

	keys.sort(function(a, b) {
		if (a.kodikos < b.kodikos) return (-1) * dir;
		if (a.kodikos > b.kodikos) return 1 * dir;
		return 0;
	});

	Globals.awalk(keys, function(i, sizitisi) {
		callback.call(sizitisi);
	});

	return this;
};

Skiniko.prototype.skinikoProsklisiWalk = function(callback) {
	this.skinikoTrapeziWalk(function() {
		Globals.walk(this.prosklisi, function(kodikos, prosklisi) {
			callback.call(prosklisi);
		});
	});

	return this;
}

Skiniko.prototype.skinikoKinisiProcess = function(kinisi) {
	var proc;

	proc = 'processKinisiAnte' + kinisi.idos;
	if (typeof this[proc] === 'function')
	this[proc](kinisi.data);

	proc = 'processKinisi' + kinisi.idos;
	if (typeof this[proc] === 'function')
	this[proc](kinisi.data);

	proc = 'processKinisiPost' + kinisi.idos;
	if (typeof this[proc] === 'function')
	this[proc](kinisi.data);

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Pektis = function(props) {
	this.peparam = {};
	this.profinfo = {};
	this.sxesi = {};
	Globals.initObject(this, props);
};

Pektis.prototype.pektisLoginGet = function() {
	return this.login;
};

Pektis.prototype.pektisOnomaGet = function() {
	return this.onoma;
};

Pektis.prototype.pektisPollSet = function(ts) {
	if (ts === undefined)
	ts = Globals.toraServer();

	this.poll = ts;
	return this;
};

Pektis.prototype.pektisPollGet = function(ts) {
	return this.poll;
};

Pektis.prototype.pektisPeparamSet = function() {
	var param, timi;

	if (arguments.length === 1) {
		param = arguments[0].peparamParamGet();
		timi = arguments[0].peparamTimiGet();
	}

	else if (arguments.length === 2) {
		param = arguments[0];
		timi = arguments[1];
	}

	else
	throw "invalid arguments";

	if (Vida.peparamIsTrivial(param, timi))
	delete this.peparam[param];

	else
	this.peparam[param] = timi;

	return this;
};

Pektis.prototype.pektisPeparamGet = function(param) {
	if (this.peparam.hasOwnProperty(param))
	return this.peparam[param];

	return Vida.peparamDefault[param];
};

Pektis.prototype.pektisPeparamWalk = function(callback) {
	Globals.walk(this.peparam, function(param, timi) {
		callback(param, timi);
	});
	return this;
};

Pektis.prototype.pektisAxiomaGet = function() {
	return this.pektisPeparamGet('ΑΞΙΩΜΑ');
};

Pektis.prototype.pektisAxiomaRankGet = function() {
	var axioma = this.pektisAxiomaGet();
	return(Peparam.axiomaRank.hasOwnProperty(axioma) ? Peparam.axiomaRank[axioma] : 0);
};

Pektis.prototype.pektisIsThamonas = function() {
	return(this.pektisAxiomaRankGet() >= Peparam.axiomaRank['ΘΑΜΩΝΑΣ']);
};

Pektis.prototype.pektisIsVip = function() {
	return(this.pektisAxiomaRankGet() >= Peparam.axiomaRank['VIP']);
};

Pektis.prototype.pektisOxiVip = function() {
	return !this.pektisIsVip();
};

Pektis.prototype.pektisIsEpoptis = function() {
	return(this.pektisAxiomaRankGet() >= Peparam.axiomaRank['ΕΠΟΠΤΗΣ']);
};

Pektis.prototype.pektisOxiEpoptis = function() {
	return !this.pektisIsEpoptis();
};

Pektis.prototype.pektisIsDiaxiristis = function() {
	return(this.pektisAxiomaRankGet() >= Peparam.axiomaRank['ΔΙΑΧΕΙΡΙΣΤΗΣ']);
};

Pektis.prototype.pektisOxiDiaxiristis = function() {
	return !this.pektisIsDiaxiristis();
};

Pektis.prototype.pektisIsAdministrator = function() {
	return(this.pektisAxiomaRankGet() >= Peparam.axiomaRank['ADMINISTRATOR']);
};

Pektis.prototype.pektisOxiAdminstrator = function() {
	return !this.pektisIsAdminstrator();
};

Pektis.prototype.pektisIsApasxolimenos = function() {
	return(this.pektisPeparamGet('ΚΑΤΑΣΤΑΣΗ') === 'ΑΠΑΣΧΟΛΗΜΕΝΟΣ');
};

Pektis.prototype.pektisIsDiathesimos = function() {
	return !this.pektisIsApasxolimenos();
};

Pektis.prototype.pektisAgapimenoGet = function() {
	return this.pektisPeparamGet('ΑΓΑΠΗΜΕΝΟ');
};

Pektis.prototype.pektisAgapimenoIsBelot = function() {
	return(this.pektisAgapimenoGet() === 'ΜΠΟΥΡΛΟΤΟ');
};

Pektis.prototype.pektisPlatiGet = function() {
	return this.pektisPeparamGet('ΠΛΑΤΗ');
};

Pektis.prototype.pektisPlatiRBGet = function() {
	return(this.pektisPlatiGet() == 'ΚΟΚΚΙΝΟ' ? 'R' : 'B');
};

Pektis.prototype.pektisIsDeveloper = function() {
	var developer = this.pektisPeparamGet('DEVELOPER');
	if (!developer) return false;
	return developer.isNai();
};

Pektis.prototype.pektisOxiDeveloper = function() {
	return !this.pektisIsDeveloper();
};

Pektis.prototype.pektisProfinfoSet = function() {
	if (arguments.length === 1)
	this.profinfo[arguments[0].profinfoSxoliastisGet()] = arguments[0].profinfoKimenoGet();

	else if (arguments.length === 2)
	this.profinfo[arguments[0]] = arguments[1];

	else
	throw "invalid arguments";

	return this;
};

Pektis.prototype.pektisProfinfoGet = function(pektis) {
	return this.profinfo[pektis];
};

Pektis.prototype.pektisProfinfoWalk = function(callback) {
	Globals.walk(this.profinfo, function(sxetizomenos, profinfo) {
		callback(sxetizomenos, profinfo);
	});
	return this;
};

Pektis.prototype.pektisSxesiSet = function(sxetizomenos, sxesi) {
	if (sxesi)
	this.sxesi[sxetizomenos] = sxesi;

	else
	delete this.sxesi[sxetizomenos];

	return this;
};

Pektis.prototype.pektisSxesiSetFilos = function(sxetizomenos) {
	this.sxesi[sxetizomenos] = 'ΦΙΛΟΣ';
	return this;
};

Pektis.prototype.pektisSxesiSetApoklismenos = function(sxetizomenos) {
	this.sxesi[sxetizomenos] = 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ';
	return this;
};

Pektis.prototype.pektisSxesiGet = function(sxetizomenos) {
	if (sxetizomenos instanceof Pektis)
	sxetizomenos = sxetizomenos.pektisLoginGet();

	else if (sxetizomenos instanceof Sinedria)
	sxetizomenos = sxetizomenos.sinedriaPektisGet();

	return this.sxesi[sxetizomenos];
};

Pektis.prototype.pektisSxesiWalk = function(callback) {
	Globals.walk(this.sxesi, function(sxetizomenos, sxesi) {
		callback(sxetizomenos, sxesi);
	});
	return this;
};

Pektis.prototype.pektisIsFilos = function(sxetizomenos) {
	return(this.pektisSxesiGet(sxetizomenos) === 'ΦΙΛΟΣ');
};

Pektis.prototype.pektisIsTeri = function(sxetizomenos) {
	return(this.pektisSxesiGet(sxetizomenos) === 'ΤΑΙΡΙ');
};

Pektis.prototype.pektisIsAgapimenos = function(sxetizomenos) {
	switch (this.pektisSxesiGet(sxetizomenos)) {
	case 'ΤΑΙΡΙ':
	case 'ΦΙΛΟΣ':
		return true;
	}

	return false;
};

Pektis.prototype.pektisIsApoklismenos = function(sxetizomenos) {
	return(this.pektisSxesiGet(sxetizomenos) === 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ');
};

Pektis.prototype.pektisPhotoSet = function(photo, mtime) {
	delete this.photo;

	if (!photo)
	return this;

	this.photo = photo;
	if (mtime)
	this.photo += '?mt=' + mtime;

	return this;
};

Pektis.prototype.pektisPhotoGet = function() {
	return this.photo;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Peparam = function(props) {
	Globals.initObject(this, props);
};

Peparam.prototype.peparamParamGet = function() {
	return this.param;
};

Peparam.prototype.peparamTimiGet = function() {
	return this.timi;
};

Peparam.axiomaRank = {
	ΘΑΜΩΝΑΣ:	0,
	VIP:		1,
	ΕΠΟΠΤΗΣ:	2,
	ΔΙΑΧΕΙΡΙΣΤΗΣ:	3,
	ADMINISTRATOR:	4,
	ΠΡΟΕΔΡΟΣ:	5,
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Profinfo = function(props) {
	Globals.initObject(this, props);
};

Profinfo.prototype.profinfoPektisGet = function() {
	return this.pektis;
};

Profinfo.prototype.profinfoSxoliastisGet = function() {
	return this.sxoliastis;
};

Profinfo.prototype.profinfoKimenoGet = function() {
	return this.kimeno;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Sxesi = function(props) {
	Globals.initObject(this, props);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Kafenio = function(props) {
	this.trapezi = {};
	this.sizitisi = {};
	this.diapiste = {};
	Globals.initObject(this, props);
};

Kafenio.prototype.kafenioKodikosSet = function(kodikos) {
	this.kodikos = kodikos;
	return this;
};

Kafenio.prototype.kafenioKodikosGet = function() {
	return this.kodikos;
};

Kafenio.prototype.kafenioOnomasiaSet = function(onomasia) {
	this.onomasia = onomasia;
	return this;
};

Kafenio.prototype.kafenioOnomasiaGet = function() {
	return this.onomasia;
};

Kafenio.prototype.kafenioDimiourgosSet = function(dimiourgos) {
	this.dimiourgos = dimiourgos;
	return this;
};

Kafenio.prototype.kafenioDimiourgosGet = function() {
	return this.dimiourgos;
};

Kafenio.prototype.kafenioIsDimiourgos = function(pektis) {
	return(this.kafenioDimiourgosGet() === Vida.pektisLoginGet(pektis));
};

Kafenio.prototype.kafenioOxiDimiourgos = function(pektis) {
	return !this.kafenioIsDimiourgos(pektis);
};

Kafenio.prototype.kafenioTrapeziSet = function(trapezi) {
	this.trapezi[trapezi.trapeziKodikosGet()] = trapezi;
	return this;
};

Kafenio.prototype.kafenioTrapeziGet = function(kodikos) {
	return this.trapezi[kodikos];
};

Kafenio.prototype.kafenioTrapeziDelete = function(trapezi) {
	var kodikos;

	if (trapezi instanceof Trapezi)
	kodikos = trapezi.trapeziKodikosGet();

	else {
		kodikos = trapezi;
		trapezi = skiniko.skinikoTrapeziGet(kodikos);
	}

	// Εφόσον υπάρχει συμπληρωμένο καφενείο (πρέπει να υπάρχει),
	// το τραπέζι διαγράφεται από το καφενείο.

	kafenio = skiniko.skinikoKafenioGet(trapezi.trapeziKafenioGet());
	if (kafenio)
	delete kafenio.trapezi[kodikos];

	// Ανεξαρτοποιούμε το τραπέζι από οποιοδήποτε καφενείο.

	delete trapezi.kafenio;

	return this;
};

Kafenio.prototype.kafenioTrapeziWalk = function(callback, dir, sort) {
	var keys = [];

	if (!dir) {
		Globals.walk(this.trapezi, function(kodikos, trapezi) {
			callback.call(trapezi);
		});

		return this;
	}

	this.kafenioTrapeziWalk(function() {
		keys.push(this);
	});

	if (sort === undefined)
	sort = function(a, b) {
		if (a.kodikos < b.kodikos)
		return (-1) * dir;

		if (a.kodikos > b.kodikos)
		return 1 * dir;

		return 0;
	};
	keys.sort(sort);

	Globals.awalk(keys, function(i, trapezi) {
		callback.call(trapezi);
	});

	return this;
};

Kafenio.prototype.kafenioPriveSet = function(prive) {
	this.prive = prive;
	return this;
};

Kafenio.prototype.kafenioIsPrive = function() {
	return this.prive;
};

Kafenio.prototype.kafenioIsDimosio = function() {
	return !this.kafenioIsPrive();
};

Kafenio.prototype.kafenioDiapisteSet = function(pektis, epidosi) {
	if (!pektis)
	return this;

	if (!epidosi)
	epidosi = Globals.toraServer();

	this.diapiste[pektis] = epidosi;
	return this;
};

Kafenio.prototype.kafenioDiapisteGet = function(pektis) {
	return this.diapiste[pektis];
};

Kafenio.prototype.kafenioDiapisteDelete = function(pektis) {
	var sinedria;

	delete this.diapiste[pektis];
	sinedria = skiniko.skinikoSinedriaGet(pektis);
	if (!sinedria)
	return this;

	if (sinedria.sinedriaKafenioGet() !== this.kafenioKodikosGet())
	return this;

	sinedria.sinedriaKafenioSet();
	return this;
};

Kafenio.prototype.kafenioIsDiapiste = function(pektis) {
	return this.diapiste[Vida.pektisLoginGet(pektis)];
};

Kafenio.prototype.kafenioOxiDiapiste = function(pektis) {
	return !this.kafenioIsDiapiste(pektis);
};

Kafenio.prototype.kafenioIsProsvasi = function(pektis) {
	if (this.kafenioIsDimosio())
	return true;

	if (pektis instanceof Pektis)
	pektis = pektis.pektisLoginGet();

	else if (pektis instanceof Sinedria)
	pektis = sinedria.sinedriaPektisGet();

	if (pektis === this.kafenioDimiourgosGet())
	return true;

	return this.kafenioIsDiapiste(pektis);
};

Kafenio.prototype.kafenioOxiProsvasi = function(pektis) {
	return !this.kafenioIsProsvasi(pektis);
};

Kafenio.prototype.kafenioDiapisteWalk = function(callback) {
	var kafenio = this;

	Globals.walk(this.diapiste, function(pektis, epidosi) {
		callback.call(new Diapiste({
			kafenio: kafenio.kafenioKodikosGet(),
			pektis: pektis,
			epidosi: epidosi,
		}));
	});

	return this;
};

Kafenio.prototype.kafenioSizitisiSet = function(sizitisi) {
	this.sizitisi[sizitisi.sizitisiKodikosGet()] = sizitisi;
	return this;
};

Kafenio.prototype.sizitisiSet = function(sizitisi) {
	return this.kafenioSizitisiSet(sizitisi);
};

Kafenio.prototype.kafenioSizitisiGet = function(kodikos) {
	return this.sizitisi[kodikos];
};

Kafenio.prototype.kafenioSizitisiDelete = function(kodikos) {
	delete this.sizitisi[kodikos];
	return this;
};

Kafenio.prototype.kafenioSizitisiWalk = function(callback, dir) {
	var keys = [];

	if (!dir) {
		Globals.walk(this.sizitisi, function(kodikos, sizitisi) {
			callback.call(sizitisi);
		});

		return this;
	}

	this.kafenioSizitisiWalk(function() {
		keys.push(this);
	});

	keys.sort(function(a, b) {
		if (a.kodikos < b.kodikos) return (-1) * dir;
		if (a.kodikos > b.kodikos) return 1 * dir;
		return 0;
	});

	Globals.awalk(keys, function(i, sizitisi) {
		callback.call(sizitisi);
	});

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Diapiste = function(props) {
	this.epidosi = Globals.toraServer();
	Globals.initObject(this, props);
};

Diapiste.prototype.diapisteKafenioSet = function(kafenio) {
	this.kafenio = kafenio;
	return this;
};

Diapiste.prototype.diapisteKafenioGet = function() {
	return this.kafenio;
};

Diapiste.prototype.diapistePektisSet = function(pektis) {
	this.pektis = pektis;
	return this;
};

Diapiste.prototype.diapistePektisGet = function() {
	return this.pektis;
};

Diapiste.prototype.diapisteEpidosiSet = function(epidosi) {
	this.epidosi = epidosi;
	return this;
};

Diapiste.prototype.diapisteEpidosiGet = function() {
	return this.epidosi;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Sinedria = function(props) {
	Globals.initObject(this, props);
};

Sinedria.prototype.sinedriaPektisSet = function(pektis) {
	this.pektis = pektis;
	return this;
};

Sinedria.prototype.sinedriaPektisGet = function() {
	return this.pektis;
};

Sinedria.prototype.sinedriaIsodosGet = function() {
	return this.isodos;
};

Sinedria.prototype.sinedriaIpSet = function(ip) {
	this.ip = ip;
	return this;
};

Sinedria.prototype.sinedriaIpGet = function() {
	return this.ip;
};

Sinedria.prototype.sinedriaKafenioSet = function(kafenio) {
	this.kafenio = kafenio;
	return this;
};

Sinedria.prototype.sinedriaKafenioGet = function() {
	return this.kafenio;
};

Sinedria.prototype.sinedriaIsKafenio = function(kafenio) {
	var sinedriaKafenio;

	sinedriaKafenio = this.sinedriaKafenioGet();
	if (!sinedriaKafenio)
	return false;

	if (kafenio === undefined)
	return true;

	if (typeof kafenio === 'object')
	kafenio = kafenio.kafenioKodikosGet();

	return(sinedriaKafenio == kafenio);
};

Sinedria.prototype.sinedriaOxiKafenio = function(kafenio) {
	return !this.sinedriaIsKafenio(kafenio);
};

Sinedria.prototype.sinedriaTrapeziSet = function(trapezi) {
	this.trapezi = trapezi;
	return this;
};

Sinedria.prototype.sinedriaTrapeziGet = function() {
	return this.trapezi;
};

Sinedria.prototype.sinedriaIsTrapezi = function(trapezi) {
	var sinedriaTrapezi;

	sinedriaTrapezi = this.sinedriaTrapeziGet();
	if (!sinedriaTrapezi)
	return false;

	if (trapezi === undefined)
	return true;

	if (trapezi instanceof Trapezi)
	trapezi = trapezi.trapeziKodikosGet();

	return(sinedriaTrapezi == trapezi);
};

Sinedria.prototype.sinedriaOxiTrapezi = function(trapezi) {
	return !this.sinedriaIsTrapezi(trapezi);
};

Sinedria.prototype.sinedriaThesiSet = function(thesi) {
	if (Vida.isThesi(thesi))
	this.thesi = parseInt(thesi);

	else
	this.thesi = undefined;

	return this;
};

Sinedria.prototype.sinedriaThesiGet = function() {
	return this.thesi;
};

Sinedria.prototype.sinedriaSimetoxiSet = function(simetoxi) {
	this.simetoxi = simetoxi;
	return this;
};

Sinedria.prototype.sinedriaSimetoxiGet = function() {
	return this.simetoxi;
};

Sinedria.prototype.sinedriaIsPektis = function() {
	return(this.sinedriaSimetoxiGet() === 'ΠΑΙΚΤΗΣ');
};

Sinedria.prototype.sinedriaOxiPektis = function() {
	return !this.sinedriaIsPektis();
};

Sinedria.prototype.sinedriaIsTheatis = function() {
	return(this.sinedriaSimetoxiGet() === 'ΘΕΑΤΗΣ');
};

Sinedria.prototype.sinedriaOxiTheatis = function() {
	return !this.sinedriaIsTheatis();
};

Sinedria.prototype.sinedriaPollSet = function(ts) {
	if (ts === undefined)
	ts = Globals.toraServer();

	this.poll = ts;
	return this;
};

Sinedria.prototype.sinedriaPollGet = function() {
	return this.poll;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi = function(props) {
	this.trparam = {};
	this.pektis = {};
	this.apodoxi = {};
	this.prosklisi = {};
	this.dianomi = {};
	this.dianomiArray = [];
	this.sizitisi = {};
	this.theatis = {};
	this.fila = {};
	this.bazes = [];
	this.bazaPios = [];
	Globals.initObject(this, props);
};

Trapezi.prototype.trapeziKodikosSet = function(kodikos) {
	this.kodikos = kodikos;
	return this;
};

Trapezi.prototype.trapeziKodikosGet = function() {
	return this.kodikos;
};

Trapezi.prototype.trapeziKafenioSet = function(kafenio) {
	this.kafenio = kafenio;
	return this;
};

Trapezi.prototype.trapeziKafenioGet = function() {
	return this.kafenio;
};

Trapezi.prototype.trapeziTrparamSet = function() {
	var param, timi;

	if (arguments.length === 1) {
		param = arguments[0].trparamTaramGet();
		timi = arguments[0].trparamTimiGet();
	}

	else if (arguments.length === 2) {
		param = arguments[0];
		timi = arguments[1];
	}

	else
	throw "invalid arguments";

	if (Vida.trparamIsTrivial(param, timi))
	delete this.trparam[param];

	else
	this.trparam[param] = timi;

	return this;
};

Trapezi.prototype.trapeziTrparamGet = function(param) {
	return this.trparam[param];
};

Trapezi.prototype.trapeziIsVida = function() {
	return this.trparamGet('ΒΙΔΑ').isNai();
};

Trapezi.prototype.trapeziIsBelot = function() {
	return !this.trapeziIsVida();
};

Trapezi.prototype.trapeziDianomiPush = function(dianomi) {
	this.dianomi[dianomi.dianomiKodikosGet()] = dianomi;
	this.dianomiArray.push(dianomi);

	return this;
};

Trapezi.prototype.trapeziDianomiGet = function(dianomi) {
	if (typeof dianomi === 'object')
	dianomi = dianomi.dianomiKodikosGet();

	return this.dianomi[dianomi];
};

Trapezi.prototype.trapeziTelefteaDianomi = function() {
	return this.dianomiArray[this.trapeziDianomiCount() - 1];
};

Trapezi.prototype.trapeziDianomiWalk = function(callback, dir) {
	var i;

	if (dir > 0) {
		for (i = 0; i < this.trapeziDianomiCount(); i++) {
			callback.call(this.dianomiArray[i]);
		}
	}
	else if (dir < 0) {
		for (i = this.trapeziDianomiCount() - 1; i >= 0; i--) {
			callback.call(this.dianomiArray[i]);
		}
	}
	else {
		for (i in this.dianomi) {
			callback.call(this.dianomi[i]);
		}
	}

	return this;
};

Trapezi.prototype.trapeziDianomiCount = function() {
	return this.dianomiArray.length;
};

Trapezi.prototype.trapeziIsDianomi = function() {
	return this.trapeziDianomiCount();
};

Trapezi.prototype.trapeziOxiDianomi = function() {
	return !this.trapeziIsDianomi();
};

Trapezi.prototype.trapeziPektisSet = function(thesi, login) {
	this.pektis[thesi] = login;
	return this;
};

Trapezi.prototype.trapeziPektisGet = function(thesi) {
	return this.pektis[thesi];
};

Trapezi.prototype.trapeziApodoxiSet = function(thesi, apodoxi) {
	this.apodoxi[thesi] = apodoxi;
	return this;
};

Trapezi.prototype.trapeziApodoxiGet = function(thesi) {
	return this.apodoxi[thesi];
};

Trapezi.prototype.trapeziIsApodoxi = function(thesi) {
	return this.trapeziApodoxiGet(thesi);
};

Trapezi.prototype.trapeziOxiApodoxi = function(thesi) {
	return !this.trapeziIsApodoxi(thesi);
};

Trapezi.prototype.trapeziApodoxiCount = function() {
	var count;

	count = 0;
	this.trapeziThesiWalk(function(thesi) {
		if (this.trapeziApodoxiGet(thesi))
		count++;
	});

	return count;
};

Trapezi.prototype.trapeziApodoxiJust = function() {
	if (Debug.flagGet('apodoxiPanta'))
	return true;

	return(this.trapeziApodoxiCount() === Vida.thesiMax - 1);
};

Trapezi.prototype.trapeziApodoxiLow = function() {
	if (Debug.flagGet('apodoxiPanta'))
	return false;

	return(this.trapeziApodoxiCount() < Vida.thesiMax - 1);
};

Trapezi.prototype.trapeziTheatisSet = function(pektis) {
	this.theatis[Vida.pektisLoginGet(pektis)] = true;
	return this;
};

Trapezi.prototype.trapeziIsTheatis = function(pektis) {
	return this.theatis[Vida.pektisLoginGet(pektis)];
};

Trapezi.prototype.trapeziTheatisDelete = function(pektis) {
	delete this.theatis[Vida.pektisLoginGet(pektis)];
	return this;
};

Trapezi.prototype.trapeziVidaSet = function(vida) {
	if (vida === undefined)
	vida = true;

	this.trapeziTrparamSet('ΒΙΔΑ', vida ? 'ΝΑΙ' : 'ΟΧΙ');
	return this;
};

Trapezi.prototype.trapeziIsVida = function() {
	var vida;

	vida = this.trapeziTrparamGet('ΒΙΔΑ');
	if (!vida)
	return true;

	return vida.isNai();
};

Trapezi.prototype.trapeziOxiVida = function() {
	return !this.trapeziIsVida();
};

Trapezi.prototype.trapeziBelotSet = function(belot) {
	if (belot === undefined)
	belot = true;

	this.trapeziTrparamSet('ΒΙΔΑ', belot ? 'ΟΧΙ' : 'ΝΑΙ');
	return this;
};

Trapezi.prototype.trapeziIsBelot = function() {
	return !this.trapeziIsVida();
};

Trapezi.prototype.trapeziOxiBelot = function() {
	return this.trapeziIsVida();
};

Trapezi.prototype.trapeziLixiGet = function() {
	var lixi;

	lixi = parseInt(this.trapeziTrparamGet('ΛΗΞΗ'));
	if (!isNaN(lixi))
	return lixi;

	return Vida.lixi[this.trapeziIsVida() ? 'vida' : 'belot'][0];
};

Trapezi.prototype.trapeziIxilGet = function() {
	var pinakas;

	pinakas = Vida.lixi[this.trapeziIsVida() ? 'vida' : 'belot'];
	return pinakas[this.trapeziLixiGet() !== pinakas[0] ? 0 : 1];
};

Trapezi.prototype.trapeziPriveSet = function(prive) {
	this.trapeziTrparamSet('ΠΡΙΒΕ', prive ? 'ΝΑΙ' : 'ΟΧΙ');
	return this;
};

Trapezi.prototype.trapeziIsPrive = function() {
	var prive;

	prive = this.trapeziTrparamGet('ΠΡΙΒΕ');
	if (!prive)
	return false;

	return prive.isNai();
};

Trapezi.prototype.trapeziIsDimosio = function() {
	return !this.trapeziIsPrive();
};

Trapezi.prototype.trapeziIsIdioktito = function() {
	var idioktito;

	idioktito = this.trapeziTrparamGet('ΙΔΙΟΚΤΗΤΟ');
	if (!idioktito)
	return false;

	return idioktito.isNai();
};

Trapezi.prototype.trapeziIsElefthero = function() {
	return !this.trapeziIsIdioktito();
};

Trapezi.prototype.trapeziIsDilosiAllow = function() {
	var dilosiAllow;

	dilosiAllow = this.trapeziTrparamGet('ΔΗΛΩΣΗ');
	if (!dilosiAllow)
	return true;

	return dilosiAllow.isNai();
};

Trapezi.prototype.trapeziOxiDilosiAllow = function() {
	return !this.trapeziIsDilosiAllow();
};

Trapezi.prototype.peziKomeni = function() {
	var komeni;

	komeni = this.trapeziTrparamGet('ΚΟΜΜΕΝΗ');
	if (!komeni)
	return true;

	return komeni.isNai();
};

Trapezi.prototype.denPeziKomeni = function() {
	return !this.peziKomeni();
};

Trapezi.prototype.apontaOn = function() {
	var aponta;

	aponta = this.trapeziTrparamGet('ΑΠΟΝΤΑ');
	if (!aponta)
	return true;

	return aponta.isNai();
};

Trapezi.prototype.apontaOff = function() {
	return !this.apontaOn();
};

Trapezi.prototype.vidaOkto = function() {
	var okto;

	okto = this.trapeziTrparamGet('ΟΚΤΩ');
	if (!okto)
	return false;

	return okto.isNai();
};

Trapezi.prototype.vidaDekaexi = function() {
	return !this.vidaOkto();
};

Trapezi.prototype.trapeziThesiWalk = function(callback) {
	var trapezi = this;

	Vida.thesiWalk(function(thesi) {
		callback.call(trapezi, thesi);
	});

	return this;
};

Trapezi.prototype.trapeziSizitisiSet = function(sizitisi) {
	this.sizitisi[sizitisi.sizitisiKodikosGet()] = sizitisi;
	return this;
};

Trapezi.prototype.sizitisiSet = function(sizitisi) {
	return this.trapeziSizitisiSet(sizitisi);
};

Trapezi.prototype.trapeziSizitisiGet = function(kodikos) {
	return this.sizitisi[kodikos];
};

Trapezi.prototype.trapeziSizitisiDelete = function(kodikos) {
	delete this.sizitisi[kodikos];
	return this;
};

Trapezi.prototype.trapeziSizitisiWalk = function(callback, dir) {
	var keys = [];

	if (!dir) {
		Globals.walk(this.sizitisi, function(kodikos, sizitisi) {
			callback.call(sizitisi);
		});

		return this;
	}

	this.trapeziSizitisiWalk(function() {
		keys.push(this);
	});

	keys.sort(function(a, b) {
		if (a.kodikos < b.kodikos) return (-1) * dir;
		if (a.kodikos > b.kodikos) return 1 * dir;
		return 0;
	});

	Globals.awalk(keys, function(i, sizitisi) {
		callback.call(sizitisi);
	});

	return this;
};

Trapezi.prototype.trapeziTheatisWalk = function(callback) {
	var login;

	for (login in this.theatis)
	callback.call(this, login);

	return this;
};

Trapezi.prototype.trapeziPollSet = function(ts) {
	if (ts === undefined)
	ts = Globals.toraServer();

	this.poll = ts;
	return this;
};

Trapezi.prototype.trapeziPollGet = function(ts) {
	return this.poll;
};

Trapezi.prototype.trapeziThesiPekti = function(pektis) {
	var thesi;

	pektis = Vida.pektisLoginGet(pektis);
	if (!pektis)
	return null;

	for (thesi = 1; thesi <= Vida.thesiMax; thesi++) {
		if (this.trapeziPektisGet(thesi) === pektis)
		return thesi;
	}

	return null;
};

Trapezi.prototype.trapeziRithmisi = function(pektis) {
	var thesi;

	// Αν δε είναι παίκτης στο τραπέζι δεν έχει δικαίωμα
	// ρύθμισης.

	thesi = this.trapeziThesiPekti(pektis);
	if (!thesi)
	return false;

	// Όταν υπάρχει η flag "rithmisiPanta" έχει δικαίωμα
	// ρύθμισης. Η συγκεκριμένη flag τίθεται σε δοκιμές,
	// ή σε περιβάλλον ανάπτυξης.

	if (Debug.flagGet('rithmisiPanta'))
	return true;

	// Αν έχει εκκινήσει η παρτίδα δεν επιτρέπεται ρύθμιση.

	if (this.trapeziIsDianomi())
	return false;

	// Αν το τραπέζι είναι ελεύθερο, όλοι οι παίκτες μπορούν
	// να κάνουν ρυθμίσεις και αλλαγές.

	if (this.trapeziIsElefthero())
	return true;

	// Το τραπέζι είναι ιδιόκτητο, επομένως μόνον ο παίκτης
	// στη θέση 1 μπορεί να κάνει ρυθμίσεις και αλλαγές.

	return(thesi === 1);
};

Trapezi.prototype.trapeziOxiRithmisi = function(pektis) {
	return !this.trapeziRithmisi(pektis);
};

Trapezi.prototype.trapeziProsklisiSet = function(prosklisi) {
	this.prosklisi[prosklisi.prosklisiIndexGet()] = prosklisi;
};

Trapezi.prototype.trapeziProsklisiGet = function(apo, pros) {
	return this.prosklisi[apo + ',' + pros];
};

Trapezi.prototype.trapeziProsklisiDelete = function(apo, pros) {
	delete this.prosklisi[apo + ',' + pros];
	return this;
};

Trapezi.prototype.trapeziIsProsklisi = function(pektis, apo) {
	var i;

	pektis = Vida.pektisLoginGet(pektis);
	for (i in this.prosklisi) {
		if (this.prosklisi[i].prosklisiProsGet() !== pektis)
		continue;

		if (apo && (this.prosklisi[i].prosklisiApoGet() !== apo))
		continue;

		return true;
	}
		
	return false;
};

Trapezi.prototype.trapeziOxiProsklisi = function(pektis) {
	return !this.trapeziIsProsklisi(pektis);
};

Trapezi.prototype.trapeziKeniThesi = function() {
	var thesi, epomeniThesi;

	for (thesi = 1; thesi <= Vida.thesiMax; thesi++) {
		if (this.trapeziPektisGet(thesi))
		continue;

		if (thesi === 1)
		return thesi;

		epomeniThesi = thesi.thesiEpomeni();
		return(this.trapeziPektisGet(epomeniThesi) ? thesi : epomeniThesi);
	}

	return null;
};

Trapezi.prototype.trapeziEnergiaPush = function(energia) {
	var dianomi;

	dianomi = this.trapeziDianomiGet(energia.energiaDianomiGet());
	if (!dianomi)
	return this;

	dianomi.dianomiEnergiaPush(energia);
	return this;
};

Trapezi.prototype.trapeziSinthesiGet = function() {
	var sinthesi = {};

	this.trapeziThesiWalk(function(thesi) {
		var pektis;

		pektis = this.trapeziPektisGet(thesi);
		if (pektis)
		sinthesi[pektis] = thesi;
	});

	return sinthesi;
};

Trapezi.prototype.trapeziTelefteaEnergia = function() {
	var dianomi, ecount;

	dianomi = this.trapeziTelefteaDianomi();
	if (!dianomi) return undefined;

	ecount = dianomi.dianomiEnergiaCount();
	if (!ecount) return undefined;

	return dianomi.energiaArray[ecount - 1];
};

Trapezi.prototype.trapeziAkirosiSet = function(pektis) {
	this.akirosi = pektis;
	return this;
};

Trapezi.prototype.trapeziIsAkirosi = function() {
	return this.akirosi;
};

Trapezi.prototype.trapeziOxiAkirosi = function() {
	return !this.trapeziIsAkirosi();
};

Trapezi.prototype.trapeziAkirosiClear = function() {
	delete this.akirosi;
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trparam = function(props) {
	Globals.initObject(this, props);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Sinthesi = function(props) {
	Globals.initObject(this, props);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Simetoxi = function(props) {
	Globals.initObject(this, props);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Prosklisi = function(props) {
	this.epidosi = Globals.toraServer();
	Globals.initObject(this, props);
};

Prosklisi.prototype.prosklisiTrapeziGet = function() {
	return this.trapezi;
};

Prosklisi.prototype.prosklisiApoGet = function() {
	return this.apo;
};

Prosklisi.prototype.prosklisiProsGet = function() {
	return this.pros;
};

Prosklisi.prototype.prosklisiEpidosiGet = function() {
	return this.epidosi;
};

Prosklisi.prototype.prosklisiIsAdiafori = function(pektis) {
	if (!pektis)
	return true;

	pektis = Vida.pektisLoginGet(pektis);

	if (this.prosklisiApoGet() === pektis)
	return false;

	if (this.prosklisiProsGet() === pektis)
	return false;

	return true;
};

Prosklisi.prototype.prosklisiIndexGet = function() {
	return this.prosklisiApoGet() + ',' + this.prosklisiProsGet();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Dianomi = function(props) {
	this.energia = {};
	this.energiaArray = [];
	this.enarxi = Globals.toraServer();
	this.skor13 = 0;
	this.skor24 = 0;
	this.kremamena = 0;

	Globals.initObject(this, props);
};

Dianomi.prototype.dianomiKodikosGet = function() {
	return this.kodikos;
};

Dianomi.prototype.dianomiTrapeziSet = function(trapezi) {
	this.trapezi = trapezi;
	return this;
};

Dianomi.prototype.dianomiTrapeziGet = function() {
	return this.trapezi;
};

Dianomi.prototype.dianomiDealerGet = function() {
	return this.dealer;
};

Dianomi.prototype.dianomiSkorSet = function(omada, skor) {
	skor = parseInt(skor)
	if (isNaN(skor))
	skor = 0;

	this['skor' + omada] = skor;
	return this;
};

Dianomi.prototype.dianomiSkorGet = function(omada) {
	return this['skor' + omada];
};

Dianomi.prototype.dianomiKremamenaSet = function(kremamena) {
	kremamena = parseInt(kremamena)
	if (isNaN(kremamena))
	kremamena = 0;

	this.kremamena = kremamena;
	return this;
};

Dianomi.prototype.dianomiKremamenaGet = function() {
	return this.kremamena;
};

Dianomi.prototype.dianomiEnergiaPush = function(energia) {
	this.energia[energia.energiaKodikosGet()] = energia;
	this.energiaArray.push(energia);

	return this;
};

Dianomi.prototype.dianomiEnergiaCount = function() {
	return this.energiaArray.length;
};

Dianomi.prototype.dianomiEnergiaWalk = function(callback, dir) {
	var i;

	if (dir > 0) {
		for (i = 0; i < this.dianomiEnergiaCount(); i++) {
			callback.call(this.energiaArray[i]);
		}
	}
	else if (dir < 0) {
		for (i = this.dianomiEnergiaCount() - 1; i >= 0; i--) {
			callback.call(this.energiaArray[i]);
		}
	}
	else {
		for (i in this.energia) {
			callback.call(this.energia[i]);
		}
	}

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Energia = function(props) {
	Globals.initObject(this, props);
};

Energia.prototype.energiaKodikosGet = function() {
	return this.kodikos;
};

Energia.prototype.energiaIdosGet = function() {
	return this.idos;
};

Energia.prototype.energiaTrapeziSet = function(trapezi) {
	switch (typeof trapezi) {
	case 'object':
		trapezi = trapezi.trapeziKodikosGet();
		break;
	case 'string':
		trapezi = parseInt(trapezi);
		break;
	}

	this.trapezi = trapezi;
	return this;
};

Energia.prototype.energiaTrapeziGet = function() {
	return this.trapezi;
};

Energia.prototype.energiaDianomiGet = function() {
	return this.dianomi;
};

Energia.prototype.energiaPektisGet = function() {
	return this.pektis;
};

Energia.prototype.energiaDataGet = function() {
	return this.data;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Sizitisi = function(props) {
	this.pote = Globals.toraServer();
	Globals.initObject(this, props);
};

Sizitisi.prototype.sizitisiKodikosSet = function(kodikos) {
	this.kodikos = kodikos;
	return this;
};

Sizitisi.prototype.sizitisiKodikosGet = function() {
	return this.kodikos;
};

Sizitisi.prototype.sizitisiPektisSet = function(pektis) {
	this.pektis = pektis;
	return this;
};

Sizitisi.prototype.sizitisiPektisGet = function() {
	return this.pektis;
};

Sizitisi.prototype.sizitisiKafenioSet = function(kafenio) {
	this.kafenio = kafenio;
	return this;
};

Sizitisi.prototype.sizitisiKafenioGet = function() {
	return this.kafenio;
};

Sizitisi.prototype.sizitisiIsKafenio = function() {
	return this.kafenio;
};

Sizitisi.prototype.sizitisiTrapeziSet = function(trapezi) {
	this.trapezi = trapezi;
	return this;
};

Sizitisi.prototype.sizitisiTrapeziGet = function() {
	return this.trapezi;
};

Sizitisi.prototype.sizitisiIsTrapezi = function() {
	return this.trapezi;
};

Sizitisi.prototype.sizitisiSxolioSet = function(sxolio) {
	this.sxolio = sxolio;
	return this;
};

Sizitisi.prototype.sizitisiSxolioGet = function() {
	return this.sxolio;
};

Sizitisi.prototype.sizitisiPoteSet = function(pote) {
	this.pote = pote;
	return this;
};

Sizitisi.prototype.sizitisiPoteGet = function() {
	return this.pote;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

//	k = new Kinisi('PK');
//
//	k = new Kinisi('PK', {
//		login: login,
//		onoma: onoma,
//	};
//
//	k = new Kinisi({
//		idos: 'PK',
//		data: {
//			login: login,
//			onoma: onoma,
//		}
//	});

Kinisi = function() {
	var prop = {};

	if (arguments.length === 2) {
		prop.idos = arguments[0];
		prop.data = arguments[1];
	}
	else {
		if (typeof(arguments[0]) === 'string')
		prop = { idos: arguments[0] };

		else
		prop = arguments[0];
	}

	Globals.initObject(this, prop);
	if (!this.hasOwnProperty('data'))
	this.data = {};
};

Kinisi.prototype.kinisiIdosGet = function() {
	return this.idos;
};

Kinisi.prototype.kinisiDataGet = function(tag) {
	return(tag === undefined ? this.data : this.data[tag]);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

skiniko = new Skiniko();
