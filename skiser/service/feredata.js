///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Log.print('service module: feredata');

Service.feredata = {};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "feredata.freska" εξυπηρετεί αίτημα αποστολής πλήρων σκηνικών
// δεδομένων. Τυχόν προηγούμενο κανάλι επικοινωνίας "feredata" της ίδιας
// συνεδρίας ακυρώνεται ως παρωχημένο.

Service.feredata.freska = function(nodereq) {
	var id;

	id = Service.feredata.idCheck(nodereq, 1);
	if (!id)
	return;

	nodereq.
	sinedriaGet().
	feredataPollSet().
	feredataObsolete(id).
	feredataSet(nodereq).
	feredataFreska();

	if (id === 1)
	nodereq.sinedria.sinedriaSalute();
};

// Η function "feredata.metavoles" εξυπηρετεί αίτημα αποστολής δεδομένων μεταβολής
// σκηνικών δεδομένων. Αν βρεθούν δεδομένα μεταβολής επιστρέφει αμέσως με τα
// δεδομένα μεταβολής, αλλιώς τίθεται σε αναμονή μέχρι να προκύψουν μεταβολές,
// ή να κλείσει επιστρέφοντας κωδικό μη μεταβολής λόγω παρέλευσης μέγιστου χρόνου
// αναμονής.

Service.feredata.metavoles = function(nodereq) {
	if (!Service.feredata.idCheck(nodereq, 2))
	return;

	nodereq.
	sinedriaGet().
	feredataPollSet().
	feredataSet(nodereq).
	feredataMetavoles();
};

Service.feredata.idCheck = function(nodereq, minId) {
	var sid, id;

	if (nodereq.isvoli())
	return 0;

	if (nodereq.denPerastike('id', true))
	return 0;

	sid = nodereq.parametrosGet('id');
	id = parseInt(sid);
	if (isNaN(id) || (id < minId)) {
		nodereq.error(sid + ': invalid feredata id');
		Globals.consoleError(sid + ': invalid feredata id for user "' + nodereq.loginGet() + '"');
		return 0;
	}

	return id;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "feredata.check" είναι function περιπόλου, δηλαδή καλείται σε
// τακτά χρονικά διαστήματα και σκοπό έχει το κλείσιμο ανοικτών καναλιών
// επικοινωνίας feredata μετά την παρέλευση εύλογου χρονικού διαστήματος,
// π.χ. 20 seconds. Αυτό το κάνουμε για δύο λόγους: να αποφύγουμε τυχόν
// ανεξέλεγκτο κλείσιμο λόγω ajax call timeout και, δεύτερον, να εντοπίσουμε
// clients που έχουν διακόψει την επαφή τους με τον server.

Service.feredata.timeout = 5;
Log.print('timeout for "feredata" set to ' + Service.feredata.timeout + ' seconds');

Service.feredata.check = function() {
	var tora;

	tora = Globals.tora();
	if (Debug.flagGet('feredataCheck')) Globals.consoleLog('περίπολος: feredata.check');

	skiniko.skinikoSinedriaWalk(function() {
		// Αν δεν βρούμε κανάλι feredata για την ανά χείρας συνεδρία, δεν
		// προβαίνουμε σε περαιτέρω ενέργειες.

		if (this.oxiFeredata())
		return;

		// Αν ο χρόνος που έχει παρέλθει από την υποβολή του αιτήματος δεν
		// είναι μεγάλος, δεν προβαίνουμε σε περαιτέρω ενέργειες.

		if ((tora - this.feredataPollGet()) < Service.feredata.timeout)
		return;

		// Παρήλθε μεγάλο χρονικό διάστημα κατά το οποίο το συγκεκριμένο
		// ανοικτό αίτημα feredata της ανά χείρας συνεδρίας δεν έχει λάβει
		// νέα δεδομένα, επομένως το κλείνουμε με απάντηση μη αλλαγής και
		// ως εκ τούτου θα δρομολογηθεί από τον client νέο αίτημα feredata.

		this.feredataEnd('=');
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η μέθοδος "feredataSet" δέχεται ένα κανάλι επικοινωνίας feredata
// και το συσχετίζει με την ανά χείρας συνεδρία. Κανονικά δεν πρέπει
// να υπάρχει άλλο κανάλι συσχετισμένο εκείνη τη στιγμή. Αν υπάρχει
// είναι από παράλειψη απαλοιφής προηγούμενου καναλιού.

Sinedria.prototype.feredataSet = function(nodereq) {
	this.feredataClose('previous feredata closed (' + this.sinedriaPektisGet() + ')');
	this.feredata = nodereq;
	return this;
};

// Η μέθοδος "feredataGet" επιστρέφει το κανάλι επικοινωνίας feredata
// της ανά χείρας συνεδρίας.

Sinedria.prototype.feredataGet = function() {
	return this.feredata;
};

// Η μέθοδος "isFeredata" ελέγχει αν η ανά χείρας συνεδρία ΕΧΕΙ συσχετισμένο
// κανάλι επικοινωνίας feredata.

Sinedria.prototype.isFeredata = function() {
	return this.feredata;
};

// Η μέθοδος "isFeredata" ελέγχει αν η ανά χείρας συνεδρία ΔΕΝ ΕΧΕΙ συσχετισμένο
// κανάλι επικοινωνίας feredata.

Sinedria.prototype.oxiFeredata = function() {
	return !this.isFeredata();
};

// Η μέθοδος "feredataPollGet" επιστρέφει το timestamp του τελευταίου αιτήματος
// feredata για την ανά χείρας συνεδρία. Αν δεν βρεθεί timestamp για τη συνεδρία
// θέτουμε το τρέχον timestamp, στηλιτεύοντας παράλληλα το γεγονός.

Sinedria.prototype.feredataPollGet = function() {
	if (!this.hasOwnProperty('feredataPoll')) {
		Globals.consoleError(this.sinedriaPektisGet() + ': δεν βρέθηκε feredata poll timestamp');
		this.feredataPollSet();
	}

	return this.feredataPoll;
};

// Η μέθοδος "feredataPollSet" θέτει το timestamp του τελευταίου αιτήματος feredata
// της ανά χείρας συνεδρίας στο τρέχον (ή σε άλλο επιθυμητό) timestamp.

Sinedria.prototype.feredataPollSet = function(ts) {
	if (ts === undefined)
	ts = Globals.toraServer();

	this.feredataPoll = ts;
	return this;
};

// Η "feredataEnd" κλείνει και διαγράφει τυχόν κανάλι επικοινωνίας feredata της
// ανά χείρας συνεδρίας αποστέλλοντας ως κατακλείδα ένα string το οποίο μπορούμε
// να περάσουμε ως παράμετρο.

Sinedria.prototype.feredataEnd = function(s) {
	if (this.oxiFeredata()) {
		Globals.consoleError(this.sinedriaPektisGet() +
		': επιχειρήθηκε κλείσιμο ήδη κλειστής feredata (' + s + ')');
		return this;
	}

	this.feredataGet().end(s);
	delete this.feredata;

	return this;
};

// Η μέθοδος "feredataObsolete" κλείνει το κανάλι επικοινωνίας feredata της ανά
// χείρας συνεδρίας με απάντηση που υποδηλώνει στον client ότι το συγκεκριμένο
// κανάλι κατέστη παρωχημένο.

Sinedria.prototype.feredataObsolete = function(id) {
	if (this.oxiFeredata())
	return this;

	if (id === 1)
	this.feredataClose();

	else
	this.feredataEnd('~');

	return this;
};

// Η μέθοδος "feredataClose" κλείνει το κανάλι επικοινωνίας feredata της ανά χείρας
// συνεδρίας με απάντηση που υποδηλώνει στον client ότι το συγκεκριμένο κανάλι δεν
// είναι πλέον ανοικτό.
//
// Αν το κλείσιμο γίνεται για λόγους τάξεως και το κανάλι επικοινωνίας feredata
// βρεθεί ανοικτό ενώ έπρεπε να είναι κλειστό, τότε μπορούμε να στηλιτεύσουμε το
// γεγονός περνώντας σχετικό μήνυμα λάθους.

Sinedria.prototype.feredataClose = function(err) {
	if (this.oxiFeredata())
	return this;

	if (err !== undefined)
	Globals.consoleError(err);

	this.feredataEnd('-');
	return this;
};

// Η μέθοδος "feredataExodos" κλείνει το κανάλι επικοινωνίας feredata της ανά
// χείρας συνεδρίας με απάντηση που υποδηλώνει στον client ότι το συγκεκριμένο
// κανάλι έχει κλείσει και θα πρέπει να τερματίσει τη λειτουργία του.

Sinedria.prototype.feredataExodos = function() {
	this.feredataEnd('_');
	return this;
};

// Η "feredataApostoli" κλείνει απάντηση σε αίτημα feredata.

Sinedria.prototype.feredataApostoli = function(errmsg) {
	var nodereq, id;

	nodereq = this.feredataGet();
	if (!nodereq)
	return this;

	if (errmsg !== undefined)
	nodereq.write("error:" + errmsg.json() + ',');

	// Κάθε έγκυρο αίτημα feredata φέρει μοναδικό (κατά client) id. Το id
	// αιτήματος επιστρέφεται ώστε να μην μπερδεύονται πολλαπλά αιτήματα
	// από τον ίδιο client.

	id = nodereq.parametrosGet('id');
	if (id)
	nodereq.write('id: ' + id);

	this.feredataEnd();
	return this;
};

Sinedria.prototype.sinedriaSalute = function() {
	var kinisi;

	kinisi = new Kinisi('SL');
	kinisi.data.pektis = this.sinedriaPektisGet();
	// TODO ip

	skiniko.
	skinikoKinisiPush(kinisi);
	
	return this;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Sinedria.prototype.feredataFreska = function() {
	var nodereq, klen;

	nodereq = this.feredataGet();
	if (!nodereq)
	return this;

	if (!nodereq.loginGet())
	return this;

	nodereq.data.paraliptis = nodereq.pektisGet();
	if (!nodereq.data.paraliptis)
	return this;

	nodereq.data.epoptis = nodereq.data.paraliptis.pektisIsEpoptis();
	nodereq.data.diaxiristis = nodereq.data.paraliptis.pektisIsDiaxiristis();

	klen = skiniko.kinisi.length;

	this.
	feredataFreskaPektis(nodereq).
	feredataFreskaPeparam(nodereq).
	feredataFreskaProfinfo(nodereq).
	feredataFreskaSxesi(nodereq).
	feredataFreskaKafenio(nodereq).
	feredataFreskaTrapezi(nodereq).
	feredataFreskaDianomi(nodereq).
	feredataFreskaDiapiste(nodereq).
	feredataFreskaSinedria(nodereq).
	feredataFreskaProsklisi(nodereq).
	feredataFreskaSizitisi(nodereq).
	neoteraReset().
	neoteraKafenio(nodereq).
	neoteraTrapezi(nodereq);

	// Ελέγχουμε μήπως έχουμε αφίξεις κινήσεων στην πορεία. Αυτό είναι
	// κάτι που δεν πρέπει να συμβεί κατά την αποστολή πλήρων σκηνικών
	// δεδομένων.

	if (klen != skiniko.kinisi.length) {
		this.feredataApostoli('Σφάλμα συγχρονισμού κινήσεων');
		return this;
	}

	this.
	floterKinisiSet(klen).
	feredataApostoli();
	
	return this;
};

Sinedria.prototype.feredataFreskaPektis = function(nodereq) {
	var proto = true;

	skiniko.skinikoPektisWalk(function() {
		if (proto) {
			nodereq.write('pektis: [\n');
			proto = false;
		}

		nodereq.write('\t');
		nodereq.write(this.pektisFeredata(nodereq));
		nodereq.write(',\n');
	});

	if (!proto)
	nodereq.write('],\n');

	return this;
};

Sinedria.prototype.feredataFreskaPeparam = function(nodereq) {
	var proto = true;

	skiniko.skinikoPektisWalk(function() {
		var pektis, idios, proto1 = true;

		pektis = this.pektisLoginGet();
		idios = (nodereq.loginGet() == pektis);

		this.pektisPeparamWalk(function(param, timi) {
			if (Vida.peparamIsTrivial(param, timi))
			return;

			if (Service.feredata.peparamExeresi(param, idios, nodereq.data.diaxiristis))
			return;

			if (proto) {
				nodereq.write('peparam: {\n');
				proto = false;
			}

			if (proto1) {
				nodereq.write('\t' + pektis.json() + ': {\n');
				proto1 = false;
			}

			nodereq.write('\t\t' + param.json() + ':' + timi.json() + ',\n');
		});

		if (!proto1)
		nodereq.write('\t},\n');
	});

	if (!proto)
	nodereq.write('},\n');

	return this;
};

// Η function "feredata.peparamExeresi" δέχεται το είδος παραμέτρου παίκτη, το αν
// ο παραλήπτης είναι ο παίκτης τής παραμέτρου και αν ο παραλήπτης είναι διαχειριστής,
// και επιστρέφει true εφόσον η παράμετρος πρέπει να εξαιρεθεί, αλλιώς επιστρέφει false.

Service.feredata.peparamExeresi = function(param, idios, diaxiristis) {
	// Αν ο παραλήπτης είναι ο παίκτης της παραμέτρου, τότε η παράμετρος
	// ΔΕΝ εξαιρείται.

	if (idios)
	return false;

	// Ο παραλήπτης ΔΕΝ είναι ο παίκτης της παραμέτρου. Σ' αυτή την περίπτωση
	// εξαιρούνται οι προσωπικές παράμετροι.

	if (Vida.peparamIsProsopiki(param))
	return true;

	// Αν ο παραλήπτης είναι διαχειριστής, δεν εξαιρείται καμία από τις μη
	// προσωπικές παραμέτρους.

	if (diaxiristis)
	return false;

	// Ο παραλήπτης δεν είναι διαχειριστής, επομένως πρέπει να φιλτράρουμε
	// κάποιες παραμέτρους. Οι παράμετροι που δεν είναι κρυφές ΔΕΝ εξαιρούνται.

	if (Vida.peparamOxiKrifi(param))
	return false;

	// Δεν έχουμε άλλες ειδικές περιπτώσεις, επομένως η παράμετρος πρέπει
	// να εξαιρεθεί.

	return true;
};

Sinedria.prototype.feredataFreskaProfinfo = function(nodereq) {
	var proto = true;

	skiniko.skinikoPektisWalk(function() {
		var login, proto1 = true;

		login = this.pektisLoginGet();

		this.pektisProfinfoWalk(function(sxoliastis, profinfo) {
			if ((sxoliastis !== login) && (sxoliastis !== nodereq.login))
			return;

			if (proto) {
				nodereq.write('profinfo: {\n');
				proto = false;
			}

			if (proto1) {
				nodereq.write(login.json() + ': {\n');
				proto1 = false;
			}

			nodereq.write('\t' + sxoliastis.json() + ':' + profinfo.json() + ',\n');
		});

		if (!proto1)
		nodereq.write('},\n');
	});

	if (!proto)
	nodereq.write('},\n');

	return this;
};

Sinedria.prototype.feredataFreskaSxesi = function(nodereq) {
	var proto = true;

	nodereq.data.paraliptis.pektisSxesiWalk(function(pektis, sxesi) {
		if (proto) {
			nodereq.write('sxesi: {\n');
			proto = false;
		}

		nodereq.write('\t' + pektis.json() + ':' + sxesi.json() + ',\n');
	});

	if (!proto)
	nodereq.write('},\n');

	return this;
};

Sinedria.prototype.feredataFreskaKafenio = function(nodereq) {
	var proto = true;

	skiniko.skinikoKafenioWalk(function() {
		if (proto) {
			nodereq.write('kafenio: [\n');
			proto = false;
		}

		nodereq.write('\t' + this.kafenioFeredata() + ',\n');
	}, -1);

	if (!proto)
	nodereq.write('],\n');

	return this;
};

Sinedria.prototype.feredataFreskaTrapezi = function(nodereq) {
	var proto = true;

	skiniko.skinikoTrapeziWalk(function() {
		if (proto) {
			nodereq.write('trapezi: [\n');
			proto = false;
		}

		nodereq.write('\t' + this.trapeziFeredata() + ',\n');
	}, -1);

	if (!proto)
	nodereq.write('],\n');

	return this;
};

Sinedria.prototype.feredataFreskaDianomi = function(nodereq) {
	var proto = true;

	skiniko.skinikoTrapeziWalk(function() {
		var trapezi;

		trapezi = this.trapeziKodikosGet();
		this.trapeziDianomiWalk(function() {
			if (proto) {
				nodereq.write('dianomi: [\n');
				proto = false;
			}

			this.dianomiTrapeziSet(trapezi);
			nodereq.write('\t' + this.dianomiFeredata() + ',\n');
		}, 1);
	});

	if (!proto)
	nodereq.write('],\n');

	return this;
};

Sinedria.prototype.feredataFreskaDiapiste = function(nodereq) {
	var proto = true;

	skiniko.skinikoKafenioWalk(function() {
		var kafenioXeno;

		kafenioXeno = (this.kafenioDimiourgosGet() !== nodereq.login);
		this.kafenioDiapisteWalk(function() {
			if (kafenioXeno && (this.diapistePektisGet() !== nodereq.login))
			return;

			if (proto) {
				nodereq.write('diapiste: [\n');
				proto = false;
			}

			nodereq.write('\t');
			nodereq.write(this.diapisteFeredata());
			nodereq.write(',\n');
		});
	});

	if (!proto)
	nodereq.write('],\n');

	return this;
};

Sinedria.prototype.feredataFreskaSizitisi = function(nodereq) {
	var orio = Globals.sizitisiMax, proto = true;

	skiniko.skinikoSizitisiWalk(function() {
		if (orio-- <= 0) {
			skiniko.skinikoSizitisiDelete(this.sizitisiKodikosGet());
			return;
		}

		if (proto) {
			nodereq.write('sizitisi: [\n');
			proto = false;
		}

		nodereq.write('\t' + this.sizitisiFeredata() + ',\n');
	}, -1);

	if (!proto)
	nodereq.write('],\n');

	return this;
};

Sinedria.prototype.feredataFreskaSinedria = function(nodereq) {
	var proto = true;

	skiniko.skinikoSinedriaWalk(function() {
		if (proto) {
			nodereq.write('sinedria: [\n');
			proto = false;
		}

		nodereq.write('\t' + this.sinedriaFeredata(nodereq) + ',\n');
	});

	if (!proto)
	nodereq.write('],\n');

	return this;
};

Sinedria.prototype.feredataFreskaProsklisi = function(nodereq) {
	var proto = true;

	skiniko.skinikoProsklisiWalk(function() {
		if (this.prosklisiIsAdiafori(nodereq.login))
		return;

		if (proto) {
			nodereq.write('prosklisi: [\n');
			proto = false;
		}

		nodereq.write('\t');
		nodereq.write(this.prosklisiFeredata());
		nodereq.write(',\n');
	});
	if (!proto)
	nodereq.write('],\n');

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Sinedria.prototype.feredataMetavoles = function() {
	var nodereq, proto, i, klen, kinisi;

	nodereq = this.feredataGet();
	if (!nodereq)
	return this;

	if (!nodereq.kafenioCheck())
	return this.feredataEnd('?');

	if (!nodereq.trapeziCheck())
	return this.feredataEnd('?');

	// Η flag "neotera" θα τεθεί σε true εφόσον σταλούν μεταβολές στον
	// client. Αρχικά τίθεται false και αν παραμείνει false μετά από τους
	// προσήκοντες ελέγχους, τότε το αίτημα θα τεθεί σε long polling state.

	this.
	neoteraSet(false).
	neoteraKinisi(nodereq).
	neoteraKafenio(nodereq).
	neoteraTrapezi(nodereq);

	// Αν τελικά δεν βρέθηκαν μεταβολές, το αίτημα τίθεται σε long polling state.

	if (this.oxiNeotera())
	return this;

	// Αλλιώς κλείνουμε την αποστολή των σκηνικών δεδομένων, οπότε θα δρομολογηθεί
	// νέο αίτημα από τον client.

	this.feredataApostoli();
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Sinedria.prototype.neoteraReset = function() {
	this.floter = {
		kinisi: skiniko.kinisi.length,	// δείκτης κινήσεων στο transaction log
		ksizitisi: {},			// μέγιστοι κωδικοί απεσταλμένων συζητήσεων καφενείων κατά καφενείο
		tsizitisi: {},			// μέγιστοι κωδικοί απεσταλμένων συζητήσεων τραπεζιών κατά τραπέζι
		energia: {},			// μέγιστοι κωδικοί απεσταλμένων ενεργειών κατά διανομή
	}

	return this;
};

Sinedria.prototype.neoteraSet = function(metavoles) {
	if (metavoles === undefined)
	metavoles = true;

	this.neotera = metavoles;
	return this;
};

Sinedria.prototype.isNeotera = function() {
	return this.neotera;
};

Sinedria.prototype.oxiNeotera = function() {
	return !this.isNeotera();
};

Sinedria.prototype.neoteraKinisi = function(nodereq) {
	var floter, klen, i, kinisi, proto = true;

	floter = this.floterKinisiGet();
	klen = skiniko.kinisi.length;

	for (i = floter; i < klen; i++) {
		kinisi = skiniko.kinisi[i];

		if (kinisi.isAdiafori(this))
		continue;

		if (proto) {
			nodereq.write('kinisi: [\n');
			proto = false;
		}

		kinisi.apostoli(this);
	}
	if (!proto) {
		this.neoteraSet();
		nodereq.write('],\n');
	}

	this.floterKinisiSet(klen);
	return this;
};

Sinedria.prototype.neoteraKafenio = function(nodereq) {
	var kafenio;

	kafenio = skiniko.skinikoKafenioGet(this.sinedriaKafenioGet());
	if (!kafenio)
	return this;

	this.neoteraKafenioSizitisi(nodereq, kafenio);

	return this;
};

Sinedria.prototype.neoteraKafenioSizitisi = function(nodereq, kafenio) {
	var floter, i, sizitisi, max = 0, proto = true;

	floter = this.floterKsizitisiGet(kafenio);

	kafenio.kafenioSizitisiWalk(function() {
		var kodikos;

		kodikos = this.sizitisiKodikosGet();
		if (kodikos <= floter)
		return;

		if (proto) {
			nodereq.write('ksizitisi: [\n');
			proto = false;
		}

		nodereq.write('\t' + this.sizitisiFeredata() + ',\n');
		if (kodikos > max)
		max = kodikos;
	});

	if (proto)
	return this;

	nodereq.write('],\n');
	this.
	neoteraSet().
	floterKsizitisiSet(kafenio, max);

	return this;
};

Sinedria.prototype.neoteraTrapezi = function(nodereq) {
	var trapezi;

	trapezi = skiniko.skinikoTrapeziGet(this.sinedriaTrapeziGet());
	if (!trapezi)
	return this;

	this.
	neoteraTrapeziSizitisi(nodereq, trapezi).
	neoteraTrapeziEnergia(nodereq, trapezi);

	return this;
};

Sinedria.prototype.neoteraTrapeziSizitisi = function(nodereq, trapezi) {
	var floter, i, sizitisi, max = 0, proto = true;

	floter = this.floterTsizitisiGet(trapezi);

	trapezi.trapeziSizitisiWalk(function() {
		var kodikos;

		kodikos = this.sizitisiKodikosGet();
		if (kodikos <= floter)
		return;

		if (proto) {
			nodereq.write('tsizitisi: [\n');
			proto = false;
		}

		nodereq.write('\t' + this.sizitisiFeredata() + ',\n');
		if (kodikos > max)
		max = kodikos;
	});

	if (proto)
	return this;

	nodereq.write('],\n');
	this.
	neoteraSet().
	floterTsizitisiSet(trapezi, max);

	return this;
};

Sinedria.prototype.neoteraTrapeziEnergia = function(nodereq, trapezi) {
	var sinedria = this, floter, i, energia, dianomi, max = 0, proto = true;

	dianomi = trapezi.trapeziTelefteaDianomi();
	if (!dianomi)
	return this;

	floter = this.floterEnergiaGet(trapezi);
	dianomi.dianomiEnergiaWalk(function() {
		var kodikos;

		kodikos = this.energiaKodikosGet();
		if (kodikos <= floter)
		return;

		if (proto) {
			nodereq.write('energia: [\n');
			proto = false;
		}

		nodereq.write('\t' + this.energiaFeredata(sinedria) + ',\n');
		if (kodikos > max)
		max = kodikos;
	});

	if (proto)
	return this;

	nodereq.write('],\n');
	this.
	neoteraSet().
	floterEnergiaSet(trapezi, max);

	return this;
};

// Η μέθοδος "floterKinisiSet" θέτει τον δείκτη τελευταίας κίνησης στο επιθυμητό
// ύψος από το array κινήσεων (transaction log).

Sinedria.prototype.floterKinisiSet = function(len) {
	if (!this.floter)
	this.neoteraReset();

	this.floter.kinisi = len;
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "feredataFormat" καλείται ως μέθοδος αντικειμένων της εφαρμογής
// με παράμετρο μια λίστα από attributes. Σκοπός της μεθόδου είναι να επιστρέψει
// stringified version του ανά χείρας αντικειμένου περιορισμένου όμως μόνο στα
// περιγραφόμενα attributes. Το επιστρεφόμενο string αποστέλλεται κατόπιν στον
// client ως μέρος των αιτουμένωνω σκηνικών δεδομένων.

Server.feredataFormat = function(attrs) {
	var i;

	for (i in attrs) {
		if (!this.hasOwnProperty(i)) {
			delete attrs[i];
			continue;
		}

		if (this[i] === null) {
			delete attrs[i];
			continue;
		}

		if (attrs[i] === null) {
			attrs[i] = this[i];
			continue;
		}

		attrs[attrs[i]] = this[i];
		delete attrs[i];
	}

	return JSON.stringify(attrs);
};

Pektis.prototype.pektisFeredata = function(nodereq) {
	return Server.feredataFormat.call(this, {
		login: null,
		onoma: null,
		photo: null,
	});
};

Kafenio.prototype.kafenioFeredata = function() {
	return Server.feredataFormat.call(this, {
		kodikos: null,
		enarxi: null,
		onomasia: null,
		dimiourgos: null,
		prive: null,
	});
};

Diapiste.prototype.diapisteFeredata = function() {
	return Server.feredataFormat.call(this, {
		kafenio: null,
		pektis: null,
		epidosi: null,
	});
};

Trapezi.prototype.trapeziFeredata = function() {
	return Server.feredataFormat.call(this, {
		kodikos: null,
		kafenio: null,
		stisimo: null,
		trparam: null,
		pektis: null,
		apodoxi: null,
		poll: null,
		trparam: null,
		simetoxi: null,
		telefteos: null,
		akirosi: null,
	});
};

Dianomi.prototype.dianomiFeredata = function() {
	return Server.feredataFormat.call(this, {
		kodikos: null,
		trapezi: null,
		dealer: null,
		skor13: null,
		skor24: null,
		kremamena: null,
	});
};

Energia.prototype.energiaFeredata = function(sinedria, trapezi) {
	var prosarmogi;

	prosarmogi = 'energiaProsarmogi' + this.energiaIdosGet();
	if (typeof this[prosarmogi] === 'function')
	return this[prosarmogi](sinedria, trapezi);

	return JSON.stringify(this);
};

Sizitisi.prototype.sizitisiFeredata = function() {
	return Server.feredataFormat.call(this, {
		kodikos: null,
		pektis: null,
		trapezi: null,
		kafenio: null,
		sxolio: null,
		pote: null,
	});
};

Sinedria.prototype.sinedriaFeredata = function(nodereq) {
	var cols;

	cols = {
		pektis: null,
		isodos: null,
		kafenio: null,
		trapezi: null,
		thesi: null,
		simetoxi: null,
	};
	if (nodereq.data.epoptis)
	cols.ip = null;

	return Server.feredataFormat.call(this, cols);
};

Prosklisi.prototype.prosklisiFeredata = function() {
	return Server.feredataFormat.call(this, {
		kodikos: null,
		trapezi: null,
		apo: null,
		pros: null,
		epidosi: null,
	});
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
