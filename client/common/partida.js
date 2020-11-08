Trapezi.prototype.partidaFilaSet = function(thesi, xartosia) {
	this.fila[thesi] = xartosia;
	return this;
};

Trapezi.prototype.partidaFilaGet = function(thesi) {
	return this.fila[thesi];
};

Trapezi.prototype.partidaKlistaReset = function() {
	this.klista = {};
	return this;
};

Trapezi.prototype.partidaKlistaSet = function(thesi, xartosia) {
	this.klista[thesi] = xartosia;
	return this;
};

Trapezi.prototype.partidaKlistaGet = function(thesi) {
	return this.klista[thesi];
};

Trapezi.prototype.partidaFasiSet = function(fasi) {
	this.fasi = fasi;
	return this;
};

Trapezi.prototype.partidaFasiGet = function() {
	return this.fasi;
};

Trapezi.prototype.partidaDealerSet = function(thesi) {
	this.dealer = thesi;
	return this;
};

Trapezi.prototype.partidaDealerGet = function() {
	return this.dealer;
};

Trapezi.prototype.partidaEpomenosSet = function(thesi) {
	this.epomenos = thesi;
	return this;
};

Trapezi.prototype.partidaEpomenosGet = function() {
	return this.epomenos;
};

// Η μέθοδος "partidaDilosiSet" διαχειρίζεται ΟΛΕΣ τις δηλώσεις, είτε
// πρόκειται για δηλώσεις αγοράς, είτε για πάσο, είτε για βίδες.

Trapezi.prototype.partidaDilosiSet = function(dilosi, pektis) {
	if (pektis === undefined)
	pektis = dilosi.dilosiPektisGet();

	this.dilosi[pektis] = dilosi;

	this.partidaDilosiCountAfxisi();

	if (dilosi.dilosiIsPaso()) {
		this.partidaPasoCountAfxisi();
		return this;
	}

	if (dilosi.dilosiIsAponta())
	return this.partidaApontaSet(pektis);

	// Η καταμέτρηση των δηλώσεων πάσο ενδιαφέρει μόνον εφόσον
	// οι δηλώσεις αυτές είναι συνεχόμενες. Αν μεσολαβεί άλλου
	// είδους δήλωση, η καταμέτρηση ξεκινά εκ νέου.

	this.partidaPasoCountSet(0);

	// Από εδώ και πέρα μας ενδιαφέρουν μόνον δηλώσεις βίδας.

	if (dilosi.dilosiOxiVida())
	return this;

	// Πιο συγκεκριμένα μας ενδιαφέρει το πλήθος των δηλώσεων βίδας
	// για κάθε παίκτη και ποιος δήλωσε την τελευταία βίδα.

	this.
	partidaVidaCountAfxisi(pektis).
	partidaTelefteaVidaSet(pektis);

	return this;
};

Trapezi.prototype.partidaDilosiGet = function(pektis) {
	return this.dilosi[pektis];
};

Trapezi.prototype.partidaDilosiGet = function(pektis) {
	return this.dilosi[pektis];
};

Trapezi.prototype.partidaAgorastisSet = function(agorastis) {
	agorastis = parseInt(agorastis);

	if (isNaN(agorastis))
	delete this.agorastis;

	else
	this.agorastis = agorastis;

	return this;
};

Trapezi.prototype.partidaAgorastisGet = function() {
	return this.agorastis;
};

Trapezi.prototype.partidaAgoraSet = function(agora) {
	this.agora = agora;
	return this;
};

Trapezi.prototype.partidaAgoraGet = function() {
	return this.agora;
};

Trapezi.prototype.partidaIsAgora = function() {
	return this.agora;
};

Trapezi.prototype.partidaOxiAgora = function() {
	return !this.partidaIsAgora();
};

Trapezi.prototype.partidaAgoraXromaGet = function() {
	var agora;

	agora = this.partidaAgoraGet();
	if (!agora)
	return undefined;

	return agora.dilosiXromaGet();
};

Trapezi.prototype.partidaAgoraPontoiGet = function() {
	var agora;

	agora = this.partidaAgoraGet();
	if (!agora)
	return undefined;

	return agora.dilosiPontoiGet();
};

Trapezi.prototype.partidaDilosiCountSet = function(count) {
	this.dilosiCount = count;
	return this;
};

Trapezi.prototype.partidaDilosiCountAfxisi = function() {
	this.dilosiCount++;
	return this;
};

Trapezi.prototype.partidaDilosiCountGet = function() {
	return this.dilosiCount;
};

Trapezi.prototype.partidaPasoCountSet = function(count) {
	this.pasoCount = count;
	return this;
};

Trapezi.prototype.partidaPasoCountAfxisi = function() {
	this.pasoCount++;
	return this;
};

Trapezi.prototype.partidaPasoCountGet = function() {
	return this.pasoCount;
};

Trapezi.prototype.partidaVidaCountSet = function(count) {
	this.vidaCount = count;
	return this;
};

Trapezi.prototype.partidaVidaCountAfxisi = function(pektis) {
	this.pektisVidaCount[pektis]++;
	this.vidaCount++;

	return this;
};

Trapezi.prototype.partidaVidaCountGet = function() {
	return this.vidaCount;
};

Trapezi.prototype.partidaPektisVidaCountGet = function(pektis) {
	return this.pektisVidaCount[pektis];
};

Trapezi.prototype.partidaTelefteaVidaSet = function(pektis) {
	this.telefteaVida = pektis;
	return this;
};

Trapezi.prototype.partidaTelefteaVidaGet = function() {
	return this.telefteaVida;
};

Trapezi.prototype.partidaApontaSet = function(pektis) {
	this.aponta = pektis;
	return this;
};

Trapezi.prototype.partidaApontaGet = function() {
	return this.aponta;
};

Trapezi.prototype.partidaEptariSet = function(pektis) {
	this.eptari = pektis;
	return this;
};

Trapezi.prototype.partidaEptariGet = function() {
	return this.eptari;
};

Trapezi.prototype.partidaOxiEptari = function() {
	return !this.partidaEptariGet();
};

Trapezi.prototype.partidaBazesCount = function(pektis) {
	var count;

	if (!pektis)
	return this.bazes.length;

	count = 0;
	Globals.awalk(this.bazaPios, function(i, pios) {
		if (pios === pektis)
		count++;
	});

	return count;
};

Trapezi.prototype.partidaReset = function() {
	var trapezi = this;

	this.
	partidaFasiSet('ΣΤΗΣΙΜΟ').
	partidaDealerSet().
	partidaEpomenosSet(1);

	delete this.dealer;
	this.fila = {};
	this.klista = {};
	this.dilosi = {};
	delete this.aponta;
	delete this.eptari;
	this.pektisVidaCount = {};
	this.trapeziThesiWalk(function(thesi) {
		trapezi.pektisVidaCount[thesi] = 0;
	});

	delete this.agorastis;
	delete this.agora;
	delete this.telefteaVida;

	this.
	partidaDilosiCountSet(0).
	partidaPasoCountSet(0).
	partidaVidaCountSet(0);

	// Ακολουθεί η τρέχουσα μπάζα (αυτή που βρίσκεται σε εξέλιξη).
	// Αν η μπάζα είναι απούσα, σημαίνει ότι ακόμη δεν έχει παιχτεί
	// κάποιο φύλλο στην μπάζα.

	delete this.baza;

	// Ακολουθεί το array των μπαζών της παρτίδας. Η τρέχουσα
	// μπάζα, μετά το παίξιμο και του τελευταίου φύλλου,
	// αντιγράφεται ως τελευταία μπάζα στο συγκεκριμένο array.

	this.bazes = [];
	this.bazaPios = [];

	// Το array "aeras" περιέχει τους αέρηδες που έχουν κατατεθεί στο
	// τραπέζι (ως χαρτωσιές). Πιθανόν, όμως, ο τελευταίος αέρας να
	// βρίσκεται σε φάση εγκρίσεως. Αυτό φαίνεται από την ύπαρξη της
	// flag "aerasEgrisi".

	this.aeras = [];
	this.partidaAerasLastClear();

	// Το array "sarea" περιέχει τους αέρηδες που έχουν κατατεθεί στο
	// τραπέζι και έχουν απορριφθεί. Αυτοί οι αέρηδες θα ενταχθούν στους
	// κανονικούς αέρηδες με την αποδοχή του πρώτου αέρα που θα γίνει
	// αποδεκτός.

	this.partidaSareaClear();

	// Αν υφίσταται flag "aerasEgrisi" σημαίνει ότι βρισκόμαστε σε φάση
	// έγκρισης του αέρα που μόλις έχει κατατεθεί. Παράλληλα, συντηρούμε
	// τους πίνακες "aerasEgrisiLista" και "aerasEgrisiPios" με τις
	// απαντήσεις και τις θέσεις των παικτών που απαντούν στον αέρα.

	this.
	partidaAerasEgrisiClear().
	partidaAerasEgrisiReset();

	// Όταν κάποιος παίκτης δηλώνει "μπουρλότο" τίθενται διάφορα attributes
	// στο τραπέζι. Πιο συγκεκριμένα τίθεται το attribute "bourloto" στον
	// παίκτη που δήλωσε το μπουρλότο, και το attribute "bourlotoTora" σε
	// true που σημαίνει ότι το μπουρλότο δηλώθηκε στο τελευταίο φύλλο που
	// παίχτηκε.

	this.
	partidaBourlotoClear();

	this.partidaSkorReset();

	return this;
};

Trapezi.prototype.partidaSkorReset = function(omada, skor) {
	this.skor13 = 0;
	this.skor24 = 0;
};

Trapezi.prototype.partidaSkorSet = function(omada, skor) {
	skor = parseInt(skor);
	if (isNaN(skor))
	skor = 0;

	this['skor' + omada] = skor;
	return this;
};

Trapezi.prototype.partidaSkorAdd = function(omada, skor) {
	skor = parseInt(skor);
	if (isNaN(skor))
	skor = 0;

	this['skor' + omada] += skor;
	return this;
};

// Η μέθοδος "partidaSkorGet" επιστρέφει τους πόντους της ομάδας που
// περνάμε ως παράμετρο ("13", "24"). Αν δεν περαστεί κωδικός ομάδας,
// επιστρέφονται οι πόντοι της ομάδας που είναι μπροστά.

Trapezi.prototype.partidaSkorGet = function(omada) {
	var skor13, skor24;

	switch (omada) {
	case '13':
	case '24':
		return this['skor' + omada];
	}

	skor13 = this.skor13;
	skor24 = this.skor24;

	return(skor13 > skor24 ? skor13 : skor24);
};

// Η μέθοδος "partidaEktelesi" θέτει την παρτίδα σε φάση εκτέλεσης μετά από
// ένα επιτυχημένο συμβόλαιο. Οι ενέργειες που επιτελούνται αφορούν κυρίως
// στο μπουρλότο και περιλαμβάνουν το μοίρασμα των κλειστών φύλλων κλπ.

Trapezi.prototype.partidaEktelesi = function() {
	this.trapeziThesiWalk(function(thesi) {
		var fila, klista;

		fila = this.partidaFilaGet(thesi);
		if (!fila)
		return;

		klista = this.partidaKlistaGet(thesi);
		if (!klista)
		return;

		fila.handPush(klista);
	});

	this.
	partidaKlistaReset().
	partidaFasiSet('ΠΑΙΧΝΙΔΙ').
	partidaEpomenosSet(this.partidaDealerGet().thesiEpomeni()).
	trapeziThesiWalk(function(thesi) {
		this.partidaFilaGet(thesi).
		cardWalk(function() {
			this.removeData('anikto');
		});
	});

	return this;
};

Trapezi.prototype.partidaReplay = function() {
	var trapezi = this, kremasmena, n, i, dianomi, skor13, skor24, kremamena, dealer;

	this.partidaReset();
	if (!this.dianomiArray.length)
	return this;

	// Τα κρεμασμένα σωρεύουν τυχόν κρεμάμενα των διανομών με σκοπό αυτά
	// να ενταχθούν στην πρώτη επόμενη διανομή που είναι κερδισμένη από
	// κάποια ομάδα, οπότε και θα μηδενιστούν εκ νέου.

	kremasmena = 0;

	n = this.dianomiArray.length - 1;
	for (i = 0; i < n; i++) {
		dianomi = this.dianomiArray[i];

		// Διαγράφουμε όλες τις ενέργειες από προηγούμενες διανομές.
		// Ωστόσο αυτές παραμένουν στην database.

		delete dianomi.energia;
		delete dianomi.energiaArray;

		skor13 = dianomi.dianomiSkorGet('13');
		skor24 = dianomi.dianomiSkorGet('24');
		kremamena = dianomi.dianomiKremamenaGet();

		// Αν η διανομή έχει κρεμάμενα, τα σωρεύουμε σε τυχόν υπάρχοντα
		// κρεμασμένα από προηγούμενες διανομές.

		if (kremamena)
		kremasmena += kremamena;

		else if (skor13 > skor24) {
			skor13 += kremasmena;
			kremasmena = 0;
		}

		else if (skor24 > skor13) {
			skor24 += kremasmena;
			kremasmena = 0;
		}

		this.partidaSkorAdd('13', skor13);
		this.partidaSkorAdd('24', skor24);
	}

	dianomi = this.dianomiArray[i];
	dealer = dianomi.dianomiDealerGet();

	this.
	partidaDealerSet(dealer).
	partidaFasiSet('ΔΙΑΝΟΜΗ').
	partidaEpomenosSet(dealer);

	dianomi.dianomiEnergiaWalk(function() {
		trapezi.trapeziProcessEnergia(this);
	});

	return this;
};

Trapezi.prototype.trapeziProcessEnergia = function(energia) {
	var idos, proc;

	idos = energia.energiaIdosGet();
	if (!idos)
	return this;

	proc = 'trapeziProcessEnergia' + idos;
	this[proc](energia);

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.partidaAerasPush = function(aeras) {
	this.aeras.push(aeras);
	return this;
};

Trapezi.prototype.partidaAerasCount = function() {
	return this.aeras.length;
};

Trapezi.prototype.partidaAerasGet = function(i) {
	var len;

	len = this.aeras.length;
	if (!len)
	return undefined;

	if (i === undefined)
	i = len - 1;

	return this.aeras[i];
};

Trapezi.prototype.partidaAerasPiosGet = function(i) {
	var len;

	len = this.aeras.length;
	if (!len)
	return undefined;

	if (i === undefined)
	i = len - 1;

	return this.aeras[i].aerasPektisGet();
};

Trapezi.prototype.partidaAerasWalk = function(callback) {
	var trapezi = this;

	Globals.awalk(this.aeras, function(i, aeras) {
		callback.call(trapezi, aeras, trapezi.aerasPios[i]);
	});

	return this;
};

Trapezi.prototype.partidaAerasIsFilo = function(filo) {
	var found;

	found = false;
	this.partidaAerasWalk(function(xartosia, pios) {
		xartosia.cardWalk(function() {
			console.log(arguments);
		});
	});

	return found;
};

Trapezi.prototype.partidaAerasEgrisiSet = function(pektis) {
	this.aerasEgrisi = true;
	this.aerasEgrisiLista = {};
	this.aerasEgrisiCount = 0;

	this.
	partidaFasiSet('ΑΕΡΑΣ').
	partidaEpomenosSet(pektis.thesiEpomeni());

	return this;
};

Trapezi.prototype.partidaAerasEgrisiPush = function(pektis, egrisi) {
	this.aerasEgrisiLista[pektis] = egrisi;
	this.aerasEgrisiCount++;
	return this;
};

Trapezi.prototype.partidaAerasEgrisiClear = function() {
	delete this.aerasEgrisi;
	return this;
};

Trapezi.prototype.partidaAerasEgrisiReset = function() {
	this.aerasEgrisiLista = {};
	this.aerasEgrisiCount = 0;

	return this;
};

Trapezi.prototype.partidaIsAerasEgrisi = function() {
	return this.aerasEgrisi;
};

Trapezi.prototype.partidaOxiAerasEgrisi = function() {
	return !this.partidaIsAerasEgrisi();
};

Trapezi.prototype.partidaAerasEgrisiCountGet = function() {
	return this.aerasEgrisiCount;
};

Trapezi.prototype.partidaAerasMarkFila = function() {
	var fila, i, filo;

	this.partidaAerasLastSet(this.partidaAerasGet());
	fila = this.partidaFilaGet(this.partidaAerasPiosGet());

	for (i = fila.cardsCount() - 1; i >= 0; i--) {
		filo = fila.cardGet(i);
		if (this.partidaAerasLastCheck(filo))
		filo.data('aeras', true);
	}

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Οι μέθοδοι που ακολουθούν διαχειρίζονται τον τελευταίο αέρα που επιδείχθηκε
// στο τραπέζι. Ο τελυταίος επιδειχθείς αέρας θεωρείται ενεργός από τη στιγμή
// της επίδειξης μέχρι το παίξιμο κάποιου φύλλου· προφανώς θα πρόκειται για
// φύλλο του αέρα από τον παίκτη που επέδειξε τον αέρα.

// Η μέθοδος "partidaAerasLastSet" θέτει ως τελευταίο επιδειχθέντα αέρα τής
// παρτίδας τη χαρτωσιά που περνάμε ως παράμετρο.

Trapezi.prototype.partidaAerasLastSet = function(xartosia) {
	this.aerasLast = xartosia;
	return this;
};

// Η μέθοδος "partidaAerasLastGet" επιστρέφει τον τελευταίο επιδειχθέντα αέρα,
// για όσο διάστημα, βεβαίως, αυτός παραμένει ενεργός.

Trapezi.prototype.partidaAerasLastGet = function() {
	return this.aerasLast;
};

// Η μέθοδος "partidaIsAerasLast" επιστρέφει true εφόσον έχουμε ενεργό τελευταίο
// επιδειχθέντα αέρα.

Trapezi.prototype.partidaIsAerasLast = function() {
	return this.aerasLast;
};

Trapezi.prototype.partidaOxiAerasLast = function() {
	return !this.partidaIsAerasLast();
};

// Η μέθοδος "partidaAerasLastClear" ακυρώνει τον τελευταίο επιδειχθέντα αέρα.

Trapezi.prototype.partidaAerasLastClear = function() {
	delete this.aerasLast;
	return this;
};

// Η μέθοδος "partidaAerasLastCheck" δέχεται ως παράμετρο ένα φύλλο και επιστρέφει
// true εφόσον τον φύλλο βρεθεί στα φύλλα του τελευταίου επιδειχθέντος αέρα. Αν δεν
// υφίσταται ενεργός τελευταίος αέρας, τότε η μέθοδος επιστρέφει true.

Trapezi.prototype.partidaAerasLastCheck = function(filo) {
	var aeras, i;

	aeras = this.partidaAerasLastGet();
	if (!aeras)
	return true;

	for (i = aeras.cardsCount() - 1; i >= 0; i--) {
		if (aeras.cardGet(i).like(filo))
		return true;
	}

	return false;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Ο πίνακας "sarea" είναι αντίστοιχος του πίνακα "aeras" με μόνη διαφορά ότι αφορά
// στους απορριφθέντες αέρηδες. Πράγματι, οι απορριφθέντες αέρηδες κρατούνται προσωρινά
// σ' αυτον τον πίνακα μέχρι την πρώτη αποδοχή κάποιου αέρα. Τότε θα διατρέξουμε αυτόν
// τον πίνακα προκειμένου τυχόν απορριφθέντες αέρηδες της ομάδας να ενταχθούν στους
// αέρηδες της παρτίδας.

Trapezi.prototype.partidaSareaClear = function() {
	this.sarea = [];
	return this;
};

// Η μέθοδος "sareaPush" μετακινεί τον αέρα που μόλις έχει απορριφθεί, από τους
// πίνακες των αέρηδων στους πίνακες των απορριφθέντων αέρηδων.

Trapezi.prototype.partidaSareaPush = function() {
	this.sarea.push(this.aeras.pop());
	return this;
};

// Εντάσσουμε στους αέρηδες της παρτίδας τους απορριφθέντες αέρηδες της ομάδας της
// οποίας ο αέρας έγινε μόλις αποδεκτός και κατόπιν διαγράφουμε τους απορριφθέντες.
// Η μέθοδος αυτή καλείται με την πρώτη αποδοχή αέρα, οπότε ο αέρας αυτός βρίσκεται
// ήδη στους πίνακες "aeras" και "aerasPios", επομένως σ' αυτό το σημείο υπάρχει ένα
// μικρό ατόπημα: οι αέρηδες που έχουν απορριφθεί δεν εντάσσονται με την ορθή σειρά.

Trapezi.prototype.partidaSareaCheck = function() {
	var trapezi = this, pios;

	// Κρατάμε τον παίκτη του οποίου ο αέρας έγινε μόλις αποδεκτός.
	// Προφανώς πρόκειται για τον τελευταίο και μοναδικό, επί του
	// παρόντος, παίκτη του σχετικού πίνακα.

	pios = this.partidaAerasPiosGet();

	// Διατρέχουμε τον πίνακα των απορριφθέντων αέρηδων και εντάσσουμε
	// στους αέρηδες της παρτίδας τυχόν απορριφθέντες αέρηδες της ομάδας
	// της οποίας ο αέρας έγινε αποδεκτός.

	Globals.awalk(this.sarea, function(i, aeras) {
		var pektis;

		pektis = aeras.aerasPektisGet();
		if (pektis.thesiIsOmada(pios))
		trapezi.partidaAerasPush(aeras);
	});

	// Καθαρίζουμε τους πίνακες απορριφθέντων αέρηδων.

	this.partidaSareaClear();

	return this;
};

// Η μέθοδος "partidaSareaForgot" καλείται κατά τη φάση της πληρωμής και
// ακριβώς πριν αρχίσει η καταμέτρηση του αέρα. Σκοπός της μεθόδου είναι
// ο έλεγχος του κρατημένου αέρα. Κανονικά δεν πρέπει να υπάρχει κρατημένος
// αέρας στη φάση της πληρωμής· υπάρχει, όμως, περίπτωση η ομάδα που «έκοψε»
// τον τελευταίο αέρα να έχει ξεχάσει να επιδείξει τον δικό της αέρα. Σ' αυτήν
// την περίπτωση θα καταμετρηθεί όλος ο κρατημένος αέρας της ομάδας που έχει
// στην κατοχή της τον πιο «ακριβό» αέρα. Υπάρχει, βεβαίως, και η περίπτωση
// του κομμένου αέρα, όπου καλώς οι αέρηδες παρέμειναν κρατημένοι.

Trapezi.prototype.partidaSareaForgot = function() {
	var trapezi = this, taxiMax;

	if (!this.sarea.length)
	return this;

console.log('ΞΕΧΑΣΤΗΚΕ Ο ΑΕΡΑΣ. ΘΑ ΜΕΤΡΗΣΕΙ ΑΕΡΑΣ ΓΙΑ ΤΗΝ ΟΜΑΔΑ ΤΟΥ ΠΑΙΚΤΗ ΠΟΥ ΕΠΕΔΕΙΞΕ ΤΟΝ ΙΣΧΥΡΟΤΕΡΟ ΑΕΡΑ');

	taxiMax = [
		0,
		0,
	];

	Globals.awalk(this.sarea, function(i, aeras) {
		var taxi, omada;

		taxi = aeras.aerasTaxiGet();
		omada = aeras.aerasPektisGet() % 2;

		if (taxi > taxiMax[omada])
		taxiMax[omada] = taxi;
	});

	if (taxiMax[0] > taxiMax[1])
	Globals.awalk(this.sarea, function(i, aeras) {
		switch (aeras.aerasPektisGet()) {
		case 2:
		case 4:
			trapezi.partidaAerasPush(aeras);
			break;
		}
	});

	else if (taxiMax[0] < taxiMax[1])
	Globals.awalk(this.sarea, function(i, aeras) {
		switch (aeras.aerasPektisGet()) {
		case 1:
		case 3:
			trapezi.partidaAerasPush(aeras);
			break;
		}
	});

	this.partidaSareaClear();
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.partidaBourlotoSet = function(pektis) {
	this.bourloto = pektis;
	this.bourlotoTora = true;

	return this;
};

Trapezi.prototype.partidaBourlotoGet = function() {
	return this.bourloto;
};

Trapezi.prototype.partidaIsBourloto = function() {
	return this.partidaBourlotoGet();
};

Trapezi.prototype.partidaIsBourlotoTora = function() {
	return this.bourlotoTora;
};

Trapezi.prototype.partidaBourlotoToraClear = function() {
	delete this.bourlotoTora;
	return this;
};

Trapezi.prototype.partidaBourlotoClear = function() {
	delete this.bourloto;
	this.partidaBourlotoToraClear();

	return this;
};
