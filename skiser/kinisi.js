//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Skiniko.prototype.skinikoKinisiPush = function(kinisi, enimerosi) {
	if (Debug.flagGet('monitor'))
	console.log('kinisi push (' + kinisi.kinisiIdosGet() + ')');

	this.skinikoKinisiKontema();
	this.kinisi.push(kinisi);

	if (enimerosi === undefined)
	enimerosi = true;

	if (enimerosi)
	this.skinikoKinisiEnimerosi();

	return this;
};

Skiniko.prototype.skinikoKinisiEnimerosi = function() {
	if (Debug.flagGet('monitor'))
	console.log('update clients');

	this.skinikoSinedriaWalk(function() {
		this.feredataMetavoles();
	});

	return this;
};

Kinisi.prototype.isAdiafori = function(sinedria) {
	var proc;

	proc = 'isAdiafori' + this.idos;
	if (typeof this[proc] !== 'function')
	return false;

	return this[proc](sinedria);
};

Kinisi.prototype.apostoli = function(sinedria) {
	var nodereq;

	nodereq = sinedria.feredataGet();
	if (!nodereq)
	return this;

	nodereq.write('\t{\n\t\tidos: ' + this.idos.json() + ',\n');
	if (this.hasOwnProperty('data')) {
		nodereq.write('\t\tdata: ');
		nodereq.write(this[this.isProsarmogi(sinedria) ?  'dataProsarmosmena' : 'dataPliri']);
	}
	nodereq.write('\n\t},\n');

	return this;
};

Kinisi.prototype.isProsarmogi = function(sinedria) {
	var proc;

	proc = 'prosarmogi' + this.idos;
	if ((typeof this[proc] === 'function') && this[proc](sinedria))
	return true;

	if (this.hasOwnProperty('dataPliri'))
	return false;

	this.dataPliri = JSON.stringify(this.data);
	return false;
};

Globals.kinisiMax = 5;

Skiniko.prototype.skinikoKinisiKontema = function() {
	var len, min;

	len = this.kinisi.length;
	if (len < this.kinisiMax)
	return this;

	min = null;
	this.skinikoSinedriaWalk(function() {
		var floter;

		floter = this.floterKinisiGet();
		if (floter === null)
		return;

		if ((min === null) || (min > floter))
		min = floter;
	});

	// Αν δεν βρέθηκαν συνεδρίες με δείκτη κινήσεων προς μείωση, τότε
	// απλώς μηδενίζουμε το transaction log.

	if (min === null) {
		this.kinisi = [];
		return this;
	}

	// Αν υπάρχουν συνεδρίες οι οποίες έχουν μηδενικό δείκτη κινήσεων,
	// τότε δεν μπορούμε να προβούμε σε μείωση του transaction log,
	// οπότε προβαίνουμε σε αύξηση του ορίου ελέγχου.

	if (min === 0) {
		this.kinisiMax += Globals.kinisiMax;
		Globals.consoleError('transaction log overflow limit raised to ' + this.kinisiMax);
		return this;
	}

	if (min > len) {
		Globals.consoleError('διαπιστώθηκε υπερβάλλον απόκομμα transaction log');
		min = len;
	}

	// Προχωρούμε στη μείωση των δεικτών κινήσεων για όλες τις συνεδρίες
	// που διαθέτουν δείκτη κινήσεων.

	this.skinikoSinedriaWalk(function() {
		var floter;

		if (!this.hasOwnProperty('floter'))
		return;

		floter = this.floterKinisiGet() - min;
		this.floterKinisiSet(floter);
	});

	// Μειώνουμε το transaction log κατά το ίδιο μέγεθος.

	this.kinisi = this.kinisi.slice(min);
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Kinisi.prototype.isAdiaforiKN = function(sinedria) {
	return sinedria.sinedriaOxiTrapezi(this.data.trapezi);
};

Kinisi.prototype.isAdiaforiKL = function(sinedria) {
	var pektis;

	pektis = sinedria.sinedriaPektisGet();

	if (pektis === this.data.kafetzis)
	return false;

	if (pektis === this.data.pektis)
	return false;

	return true;
};

Kinisi.prototype.isAdiaforiKX = Kinisi.prototype.isAdiaforiKX;

Kinisi.prototype.isAdiaforiPL = function(sinedria) {
	var pektis;

	pektis = sinedria.sinedriaPektisGet();

	if (pektis === this.data.apo)
	return false;

	if (pektis === this.data.pros)
	return false;

	return true;
};

Kinisi.prototype.isAdiaforiXL = Kinisi.prototype.isAdiaforiPL;

Kinisi.prototype.isAdiaforiSZ = function(sinedria) {
	if (this.data.trapezi)
	return true;

	if (this.data.kafenio)
	return true;

	return false;
};

Kinisi.prototype.isAdiaforiSL = function(sinedria) {
	return(sinedria.sinedriaPektisGet() === this.data.pektis);
};

Kinisi.prototype.isAdiaforiNK = function(sinedria) {
	var pektis;

	pektis = sinedria.sinedriaPektisGet();
	if (this.data.kafenio.dimiourgos == pektis)
	return false;

	pektis = skiniko.skinikoPektisGet(pektis);
	if (!pektis)
	return true;

	return pektis.pektisOxiEpoptis();
};

Kinisi.prototype.isAdiaforiPS = function(sinedria) {
	var pektis;

	pektis = sinedria.sinedriaPektisGet();
	if (Vida.peparamIsProsopiki(this.data.param))
	return(this.data.pektis !== pektis);

	if (Vida.peparamOxiKrifi(this.data.param))
	return false;

	pektis = skiniko.skinikoPektisGet(pektis);
	if (!pektis)
	return true;

	return pektis.pektisOxiDiaxiristis();
};

Kinisi.prototype.isAdiaforiSX = function(sinedria) {
	return(sinedria.sinedriaPektisGet() !== this.data.pektis);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Kinisi.prototype.prosarmogiPK = function(sinedria) {
	var pektis;

	// Αν ο παραλήπτης είναι ο ίδιος ο παίκτης, τότε δεν απαιτείται
	// καμία προσαρμογή.

	pektis = sinedria.sinedriaPektisGet();
	if (pektis === this.data.login)
	return false;

	// Θα πρέπει να γίνει προσαρμογή ανάλογα με το αν ο παραλήπτης
	// είναι ανώτερος αξιωματούχος, επιδοτούμενος κλπ.

	pektis = skiniko.skinikoPektisGet(pektis);
	if (!pektis) return false;

	if (pektis.pektisIsDiaxiristis())
	return this.prosarmogiPKdiaxiristis(sinedria);

	return this.prosarmogiPKxenos(sinedria);
};

Kinisi.prototype.prosarmogiPKdiaxiristis = function(sinedria) {
	var data = this.data, atad;

	if (this.hasOwnProperty('dataDiaxiristis')) {
		this.dataProsarmosmena = this.dataDiaxiristis;
		return true;
	}

	atad = {
		login: data.login,
		onoma: data.onoma,
		peparam: {},
	};

	if (data.photo)
	atad.photo = data.photo;

	Globals.walk(data.peparam, function(param, timi) {
		if (Vida.peparamIsProsopiki(param))
		return;

		atad.peparam[param] = timi;
	});

	this.dataProsarmosmena = JSON.stringify(atad);
	this.dataDiaxiristis = this.dataProsarmosmena;
	return true;
};

Kinisi.prototype.prosarmogiPKxenos = function(sinedria) {
	var data = this.data, atad;

	if (this.hasOwnProperty('dataXenos')) {
		this.dataProsarmosmena = this.dataXenos;
		return true;
	}

	atad = {
		login: data.login,
		onoma: data.onoma,
		peparam: {},
	};

	Globals.walk(data.peparam, function(param, timi) {
		if (Vida.peparamIsProsopiki(param)) return;
		if (Vida.peparamIsKrifi(param)) return;
		atad.peparam[param] = timi;
	});

	this.dataProsarmosmena = JSON.stringify(atad);
	this.dataXenos = this.dataProsarmosmena;
	return true;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
