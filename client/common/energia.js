Trapezi.prototype.trapeziProcessEnergiaΔΙΑΝΟΜΗ = function(energia) {
	var trapoula, dealer, apo, thesi;

	trapoula = energia.energiaDataGet().filajsToHand();
	dealer = energia.energiaPektisGet();

	if (this.trapeziIsBelot()) {
		for (apo = 0, thesi = 1; thesi <= Vida.thesiMax; thesi++, apo += 8)
		this.
		partidaFilaSet(thesi, trapoula.slice(apo, 5)).
		partidaKlistaSet(thesi, trapoula.slice(apo + 5, 3));

		this.partidaKlistaGet(this.partidaDealerGet()).
		cardGet(2).
		data('tzogos', true);
	}

	else {
		for (apo = 0, thesi = 1; thesi <= Vida.thesiMax; thesi++, apo += 8)
		this.
		partidaFilaSet(thesi, trapoula.slice(apo, 8));
	}

	this.
	partidaFasiSet('ΑΓΟΡΑ').
	partidaEpomenosSet(dealer.thesiEpomeni());

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.trapeziProcessEnergiaΔΗΛΩΣΗ = function(energia) {
	var edata, data = {};

	// Η δήλωση αγοράς συνήθως αποτελείται από ένα μόνο τμήμα εκτός από
	// την περίπτωση αγοράς με αλλαγή στο επτάρι των ατού. Τα δύο τμήματα,
	// εφόσον υπάρχει δεύτερο τμήμα, είναι διαχωρισμένα με ":"
	//
	// S		Αγορά μπαστούνια (μπουρλότο)
	//
	// S120		Δήλωση 120 μπαστούνια (βίδα)
	//
	// S:SJ		Αγορά μπαστούνια και αλλαγή επτάρι
	//		με τον βαλέ μπαστούνι (μπουρλότο)
	//
	// P		Δήλωση πάσο
	//
	// V		Βίδα (βίδα)
	//
	// 0		Άποντα (μπουρλότο)

	edata = energia.energiaDataGet().split(':');

	data.dilosi = new Dilosi(edata[0]);
	data.eptari = edata[1];

	data.pektis = energia.energiaPektisGet();
	this.partidaDilosiSet(data.dilosi, data.pektis);

	if (data.dilosi.dilosiIsAgora())
	return this.trapeziProcessEnergiaΔΗΛΩΣΗagora(data);

	if (data.dilosi.dilosiIsPaso())
	return this.trapeziProcessEnergiaΔΗΛΩΣΗpaso(data);

	if (data.dilosi.dilosiIsVida())
	return this.trapeziProcessEnergiaΔΗΛΩΣΗvida(data);

	if (data.dilosi.dilosiIsAponta())
	return this.trapeziProcessEnergiaΔΗΛΩΣΗaponta(data);

	return this;
};

// Δήλωση αγοράς, π.χ. 90 ΚΟΥΠΕΣ, 120 ΣΠΑΘΙΑ κλπ.

Trapezi.prototype.trapeziProcessEnergiaΔΗΛΩΣΗagora = function(data) {
	this.partidaAgorastisSet(data.pektis);
	this.partidaAgoraSet(data.dilosi);
	this.partidaEpomenosSet(data.pektis.thesiEpomeni());

	// Αν η αγορά πραγματοποιήθηκε έμμεσα αλλάζοντας το ομοιόχρωμο επτάρι,
	// θα πρέπει να αλλάξουν θέση τα δύο φύλλα, δηλαδή ο τζόγος (που είναι
	// το τρίτο φύλλο των κλειστών φύλλων του dealer) με το επτάρι του παίκτη
	// που κάνει την αγορά. Υπενθυμίζουμε ότι στο property "eptari" υπάρχει
	// το φύλλο του τζόγου, δηλαδή το τρίτο από τα κλειστά φύλλα του dealer.

	if (data.eptari)
	return this.trapeziProcessEnergiaEptariAlagi(data);

	// Η αγορά δεν έγινε με ταυτόχρονη αλλαγή με το ομοιόχρωμο επτάρι.
	// Αν πρόκειται για παρτίδα βίδας δεν προβαίνουμε σε καμία περαιτέρω
	// ενέργεια.

	if (this.trapeziIsVida())
	return this;

	// Πρόκειται για παρτίδα μπουρλότου και έχουμε αγορά που δεν έχει γίνει
	// με ταυτόχρονη αλλαγή στο ομοιόχρωμο επτάρι. Αν δεν έχει ήδη κλείσει
	// κύκλος δηλώσεων από όλους τους παίκτες, τότε δεν προβαίνουμε σε
	// περαιτέρω ενέργειες και η διαδικασία δηλώσεων θα συνεχιστεί με
	// επιβεβαίωση της αγοράς, καθώς μπορεί να υπάρχουν άποντα ή αλλαγή
	// με το ομοιόχρωμο επτάρι. Το πρόγραμμα δεν θα πρέπει να προδίδει
	// την ύπαρξη ή μη των συγκεκριμένων προϋποθέσεων.

	if (this.partidaDilosiCountGet() <= 4)
	return this;

	// Βρισκόμαστε σε παρτίδα μπουρλότου και έχει γίνει αγορά που δεν αφορά
	// στο προτεινόμενο χρώμα. Σ' αυτήν την περίπτωση εκκινούμε άμεσα την
	// εκτέλεση του συμβολαίου.

	this.partidaEktelesi();
	return this;
};

Trapezi.prototype.trapeziProcessEnergiaEptariAlagi = function(data) {
	var atou, eptari, fila, filo, filaLen, i;

	this.partidaEptariSet(data.pektis);
	atou = this.partidaAgoraXromaGet();

	// Εντοπίζουμε το επτάρι των ατού στα φύλλα του παίκτη δημιουργώντας
	// παράλληλα νέα φύλλα του παίκτη χωρίς το επτάρι.

	eptari = new filajsCard({
		suit: atou,
		rank: '7',
	});

	fila = new filajsHand();

	this.partidaFilaGet(data.pektis).
	cardWalk(function() {
		if (this.unlike(eptari))
		fila.cardPush(this);
	});

	// Προσθέτουμε αντίγραφο του επίμαχου φύλλου του τζόγου ως τελευταίο
	// φύλλο στα φύλλα του παίκτη και μάλιστα το τοποθετούμε ανοικτό.

	filo = new filajsCard(data.eptari).
	data('anikto', true);
	fila.cardPush(filo);

	// Θέτουμε ως φύλλα του παίκτη τη νέα χαρτωσιά που μόλις δημιουργήσαμε.

	this.partidaFilaSet(data.pektis, fila);

	// Τώρα πρέπει αντίστοιχα να αλλάξουμε το επίμαχο φύλλο του τζόγου 
	// μετατρέποντάς το στο επτάρι των ατού.

	fila = this.partidaKlistaGet(this.partidaDealerGet());
	filaLen = fila.cardsCount();
	if (filaLen <= 0)
	return this;

	// Εντοπίζουμε το επίμαχο φύλλο του τζόγου.

	for (i = 0; i < filaLen; i++) {
		if (fila.cardGet(i).like(filo))
		break;
	}

	if (i >= filaLen)
	return this;

	// Αλλάζουμε το επίμαχο φύλλο μετατρέποντάς το στο επτάρι των ατού.

	fila.cardGet(i).
	suitSet(atou).
	rankSet('7');

	return this;
};

// Δήλωση ΠΑΣΟ.

Trapezi.prototype.trapeziProcessEnergiaΔΗΛΩΣΗpaso = function(data) {
	switch (this.partidaFasiGet()) {
	case 'ΑΓΟΡΑ':
		return this.trapeziProcessEnergiaΔΗΛΩΣΗpasoAgora(data);
	case 'ΚΟΝΤΡΑ':
		return this.trapeziProcessEnergiaΔΗΛΩΣΗpasoKontra(data);
	}

	return this;
};

// Δήλωση ΠΑΣΟ σε φάση ΑΓΟΡΑΣ.

Trapezi.prototype.trapeziProcessEnergiaΔΗΛΩΣΗpasoAgora = function(data) {
	var pasoCount, pasoMax, epomenos, agorastis;

	pasoMax = this.trapeziIsVida() ? 4 : 8;
	pasoCount = this.partidaPasoCountGet();

	if (pasoCount >= pasoMax) {
		this.partidaFasiSet('ΕΠΑΝΑΔΙΑΝΟΜΗ');
		this.partidaEpomenosSet(this.partidaDealerGet().thesiEpomeni());
		return this;
	}

	epomenos = data.pektis.thesiEpomeni();

	if (this.partidaOxiAgora()) {
		this.partidaEpomenosSet(epomenos);
		return this;
	}

	agorastis = this.partidaAgorastisGet();
	if (epomenos !== agorastis) {
		this.partidaEpomenosSet(epomenos);
		return this;
	}

	this.partidaEktelesi();
	return this;
};

// Δήλωση ΠΑΣΟ σε φάση ΚΟΝΤΡΑΣ.

Trapezi.prototype.trapeziProcessEnergiaΔΗΛΩΣΗpasoKontra = function(data) {
	var pasoCount, telefteaVida;

	pasoCount = this.partidaPasoCountGet();
	if (pasoCount >= 3) {
		this.partidaFasiSet('ΠΑΙΧΝΙΔΙ');
		this.partidaEpomenosSet(this.partidaDealerGet().thesiEpomeni());
		return this;
	}

	telefteaVida = this.partidaTelefteaVidaGet();
	if (telefteaVida.thesiOxiApenanti(data.pektis)) {
		this.partidaPasoCountAfxisi();
		this.partidaEpomenosSet(data.pektis.thesiEpomeni(2));
		return this;
	}

	if (data.pektis.thesiIsAristera(this.partidaTelefteaVidaGet())) {
		this.partidaFasiSet('ΠΑΙΧΝΙΔΙ');
		this.partidaEpomenosSet(this.partidaDealerGet().thesiEpomeni());
		return this;
	}

	this.partidaEpomenosSet(data.pektis.thesiEpomeni());
	return this;
};

// Δήλωση ΒΙΔΑΣ.

Trapezi.prototype.trapeziProcessEnergiaΔΗΛΩΣΗvida = function(data) {
	if (this.partidaVidaCountGet() >= 4) {
		this.partidaFasiSet('ΠΑΙΧΝΙΔΙ');
		this.partidaEpomenosSet(this.partidaDealerGet().thesiEpomeni());
		return this;
	}

	this.
	partidaFasiSet('ΚΟΝΤΡΑ').
	partidaEpomenosSet(data.pektis.thesiEpomeni());

	return this;
};

// Δήλωση ΑΠΟΝΤΑ

Trapezi.prototype.trapeziProcessEnergiaΔΗΛΩΣΗaponta = function(data) {
	this.partidaFasiSet('ΕΠΑΝΑΔΙΑΝΟΜΗ');
	this.partidaEpomenosSet(this.partidaDealerGet().thesiEpomeni());
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.trapeziProcessEnergiaΕΠΤΑΡΙ = function(energia) {
	var data = {};

	data.eptari = energia.energiaDataGet();
	data.pektis = energia.energiaPektisGet();

	this.
	trapeziProcessEnergiaEptariAlagi(data).
	partidaEpomenosSet(data.pektis.thesiEpomeni());

	if (this.partidaEpomenosGet() !== this.partidaAgorastisGet())
	return this;

	this.
	partidaFasiSet('ΠΑΙΧΝΙΔΙ').
	partidaEpomenosSet(this.partidaDealerGet().thesiEpomeni()).
	trapeziThesiWalk(function(thesi) {
		this.partidaFilaGet(thesi).
		handPush(this.partidaKlistaGet(thesi)).
		cardWalk(function() {
			this.removeData('anikto');
		});
	});

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.trapeziProcessEnergiaΦΥΛΛΟ = function(energia) {
	var pektis, data, filo, filaPekti, filaCount, idx;

	this.
	partidaAerasEgrisiReset().
	partidaAerasLastClear();

	if (!this.baza)
	this.baza = new Baza();

	pektis = energia.energiaPektisGet();
	data = energia.energiaDataGet().split(':');
	filo = new filajsCard(data[0]);

	filaPekti = this.partidaFilaGet(pektis);
	filaCount = filaPekti.cardsCount();

	for (idx = 0; idx < filaCount; idx++) {
		if (filaPekti.cardGet(idx).like(filo))
		break;
	}

	if (idx >= filaCount)
	return this;

	this.baza.bazaFiloPush(filo, pektis);
	filaPekti.cardDelete(idx);

	if (data[1])
	this.partidaBourlotoSet(parseInt(pektis));

	else
	this.partidaBourlotoToraClear();

	if (this.baza.cardsCount() < 4)
	this.partidaEpomenosSet(pektis.thesiEpomeni());

	else
	this.partidaEpomenosSet();

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.trapeziProcessEnergiaΜΠΑΖΑ = function(energia) {
	var pektis;

	pektis = parseInt(energia.energiaDataGet());
	if (isNaN(pektis))
	return this;

	this.bazaPrev = new Baza().bazaCopy(this.baza);

	this.bazes.push(this.baza);
	this.bazaPios.push(pektis);
	delete this.baza;

	if (this.partidaBazesCount() < 8)
	return this.partidaEpomenosSet(pektis);

	return this.
	partidaFasiSet('ΠΛΗΡΩΜΗ').
	partidaEpomenosSet().
	partidaPliromi();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.trapeziProcessEnergiaΑΕΡΑΣ = function(energia) {
	var pektis, data;

	pektis = energia.energiaPektisGet();
	data = energia.energiaDataGet();

	// Αν δεν βρισκόμαστε σε φάση έγκρισης του αέρα, τότε σημαίνει ότι
	// μόλις παραλάβαμε ενέργεια επίδειξης του αέρα και τα data περιέχουν
	// τη σχετική χαρτωσιά. Καταχωρούμε, λοιπόν, τον αέρα και τον παίκτη
	// στους σχετικούς πίνακες και Θέτουμε την παρτίδα σε φάση έγκρισης
	// του αέρα. Θέτουμε, επίσης, ως επόμενο παίκτη τον παίκτη που βρίσκεται
	// δεξιά του αεριζόμενου, καθώς αυτός είναι ο πρώτος εκ των αντιπάλων
	// που καλείται να εγκρίνει ή να απορρίψει τον επιδειχθέντα αέρα.

	if (this.partidaOxiAerasEgrisi())
	return this.
	partidaAerasPush(new Aeras(pektis, data, this.partidaAgoraXromaGet())).
	partidaAerasEgrisiSet(pektis);

	/////////////////////////////////////////////////////////////////////////////

	// Ο αέρας έχει ήδη κοινοποιηθεί με προηγούμενη ενέργεια και βρισκόμαστε
	// σε φάση έγκρισης του αέρα. Αρχικά καταχωρούμε την απάντηση που μόλις
	// έχουμε λάβει στους σχετικούς πίνακες, είτε αυτή είναι θετική, είτε
	// είναι αρνητική.

	this.partidaAerasEgrisiPush(pektis, data);

	// Αν η απάντηση που λάβαμε είναι αρνητική, τότε ακυρώνουμε την όλη
	// διαδικασία και επιστρέφουμε σε φάση παιχνιδιού με επόμενο παίκτη
	// αυτόν που υπέβαλε τον ατυχήσαντα αέρα.
	//
	// Παράλληλα, μαρκάρουμε τα φύλλα ως επιδειχθέντα, πράγμα που σημαίνει
	// ότι δεν θα μπορέσουμε να τα χρησιμοποιήσουμε σε μελλοντικό αέρα (ίσως
	// κακώς), και κρατάμε τον μόλις απορριφθέντα αέρα στους σχετικούς πίνακες.

	if (data.oxiNai())
	return this.
	partidaAerasMarkFila().
	partidaEpomenosSet(this.partidaAerasPiosGet()).
	partidaSareaPush().
	partidaAerasEgrisiClear().
	partidaFasiSet('ΠΑΙΧΝΙΔΙ');

	/////////////////////////////////////////////////////////////////////////////

	// Η απάντηση που λάβαμε είναι θετική και ελέγχουμε αν είναι η πρώτη απάντηση.
	// Αν ναι, τότε θέτουμε επόμενο παίκτη τον έτερο αντίπαλο και παραμένουμε σε
	// φάση έγκρισης του αέρα.

	if (this.partidaAerasEgrisiCountGet() === 1)
	return this.
	partidaEpomenosSet(pektis.thesiEpomeni(2));

	/////////////////////////////////////////////////////////////////////////////

	// Λάβαμε τη δεύτερη (θετική) έγκριση του αέρα, οπότε αφήνουμε τον αέρα
	// στη θέση του, καθαρίζουμε τα της εγκρίσεως και επιστρέφουμε στον παίκτη
	// που υπέβαλε τον αέρα προκειμένου να παίξει κάποιο φύλλο. Αυτό το φύλλο
	// θα πρέπει να είναι φύλλο του υποβληθέντος αέρος, αλλά το πρόγραμμα δεν
	// το ελέγχει. XXX
	//
	// Παράλληλα  εντάσσουμε στους αέρηδες της παρτίδας τυχόν απορριφθέντες
	// αέρηδες της ομάδας.

	return this.
	partidaAerasMarkFila().
	partidaEpomenosSet(this.partidaAerasPiosGet()).
	partidaSareaCheck().
	partidaAerasEgrisiClear().
	partidaFasiSet('ΠΑΙΧΝΙΔΙ');
};
