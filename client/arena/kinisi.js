//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Αρχειοθέτηση τραπεζιού

Skiniko.prototype.processKinisiAnteAT = function(data) {
	var trapezi;

	data.trapezi = parseInt(data.trapezi);

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	this.skinikoSinedriaWalk(function() {
		if (this.sinedriaOxiTrapezi(data.trapezi))
		return;

		this.
		sinedriaTrapeziSet().
		sinedriaSimetoxiSet().
		sinedriaRefreshDOM();
	
	});

	data.trapeziDOM = trapezi.trapeziGetDOM();
	return this;
};

Skiniko.prototype.processKinisiPostAT = function(data) {
	if (this.skinikoTrapeziGet(data.trapezi))
	return this;

	Arena.prosklisiAreaDOM.
	children('.prosklisi').
	each(function() {
		if ($(this).data('trapezi') === data.trapezi)
		$(this).remove();

		return true;
	});

	if (data.trapeziDOM)
	data.trapeziDOM.remove();

	return this;
};

// Κόρνα

Skiniko.prototype.processKinisiPostKN = function(data) {
	if (ego.oxiTrapezi(data.trapezi))
	return this;

	Selida.ixos.kornaTixi();

	Arena.sizitisiTrapeziDOM.
	append(new Sizitisi().
	sizitisiPektisSet(data.pektis).
	sizitisiSxolioSet('KN').
	sizitisiCreateDOM().
	sizitisiRefreshDOM().
	sizitisiGetDOM());

	if (!Arena.sizitisiTrapeziDOM.data('pagomeni'))
	Arena.sizitisiTrapeziDOM.scrollKato();

	return this;
};

// Συσχετισμός παικτών

Skiniko.prototype.processKinisiPostSX = function(data) {
	if (Arena.profinfoDOM.data('pektis') === data.sxetizomenos)
	Arena.profinfo.
	refreshOnoma().
	refreshSxesi();

	this.skinikoPektisRefreshDOM(data.sxetizomenos);
	return this;
};

// Τέλος ακύρωσης κινήσεων

Skiniko.prototype.processKinisiPostKA = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	trapezi.trapeziRefreshDOM();

	if (ego.oxiTrapezi(trapezi))
	return this;

	Tsoxa.
	refreshDOM(true);
	Tsoxa.fyiDOM.empty();

	return this;
};

// Ακύρωση κίνησης

Skiniko.prototype.processKinisiPostAK = function(data) {
	var trapezi, fyi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	trapezi.trapeziRefreshDOM();

	if (ego.oxiTrapezi(trapezi))
	return this;

	Tsoxa.
	refreshDOM();

	fyi = 'Ο παίκτης <span class="entona kokino">' + data.pektis + '</span> ';
	if (trapezi.trapeziIsAkirosi()) {
		Tsoxa.fyiDOM.html(fyi + 'ακυρώνει κινήσεις');
		return this;
	}

	Tsoxa.fyiDOM.html(fyi + 'ακύρωσε κινήσεις');
	setTimeout(function() {
		Tsoxa.fyiDOM.empty();
	}, 2000);

	return this;
};

// Παράμετρος παίκτη

Skiniko.prototype.processKinisiPostPS = function(data) {
	switch (data.param) {
	case 'ΤΡΑΠΟΥΛΑ':
		Selida.fyi.pano('αλλαγή τράπουλας σε <span class="prasino entona">' + data.timi + '</span>');
		filajs.cardFamilySet(data.timi);
		Tsoxa.
		afoplismos().
		filaRefreshDOM().
		bazaRefreshDOM().
		bazesRefreshDOM().
		efoplismos();
		break;
	case 'ΚΑΤΑΣΤΑΣΗ':
		this.skinikoPektisRefreshDOM(data.pektis);
		break;
	}

	return this;
};

// Διανομή

Skiniko.prototype.processKinisiPostDN = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	if (ego.oxiTrapezi(data.trapezi))
	return this;

	Tsoxa.
	afoplismos().
	minimaRefreshDOM().
	dianomiRefreshDOM();

	return this;
};

// Ενέργεια

Skiniko.prototype.processKinisiPostEG = function(data) {
	console.error("εντοπίστηκε κίνηση ενέργειας (EG):", data);
	return this;
};

// Αποδοχή όρων παιχνιδιού.

Skiniko.prototype.processKinisiPostAX = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	if (Vida.oxiThesi(data.thesi))
	return this;

	trapezi.
	trapeziPektisRefreshDOM(data.thesi);

	if (data.pektis.isEgo())
	Arena.tpanel.bpanelRefresh();

	if (ego.oxiTrapezi(data.trapezi))
	return this;

	Tsoxa.apodoxiRefreshDOM();
	Selida.ixos.tik();

	return this;
};

// Ανάκληση αποδοχής όρων του παιχνιδιού (επαναδιαπραγμάτευση).

Skiniko.prototype.processKinisiPostXA = Skiniko.prototype.processKinisiPostAX;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Διαπίστευση παίκτη σε καφενείο.

Skiniko.prototype.processKinisiPostKL = function(data) {
	var kafenio;

	kafenio = this.skinikoKafenioGet(data.kafenio);
	if (!kafenio)
	return this;

	if (data.pektis.isEgo()) {
		kafenio.kafenioRefreshDOM();
		return this;
	}

	if (data.kafetzis.oxiEgo())
	return this;

	if (ego.oxiKafenio(kafenio))
	return this;

	if (Arena.profinfo.oxiPektis(data.pektis))
	return this;

	Arena.profinfo.refreshKafenio();
	return this;
};

// Αποπομπή παίκτη από καφενείο.

Skiniko.prototype.processKinisiAnteKX =  function(data) {
	var egoKafenio;

	egoKafenio = ego.kafenioGet();
	if (egoKafenio)
	data.kafenioPrin = egoKafenio.kafenioKodikosGet();

	return this;
};

Skiniko.prototype.processKinisiPostKX =  function(data) {
	var kafenio;

	kafenio = this.skinikoKafenioGet(data.kafenio);
	if (!kafenio)
	return this;

	if (data.kafetzis.isEgo()) {
		if (data.kafetzis.oxiEgo())
		return this;

		if (ego.oxiKafenio(kafenio))
		return this;

		if (Arena.profinfo.oxiPektis(data.pektis))
		return this;

		Arena.profinfo.refreshKafenio();
		return this;
	}

	if (data.pektis.oxiEgo())
	return this;

	kafenio.kafenioRefreshDOM();
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Αποδοχή πρόσκλησης με τοποθέτηση ως θεατή.
//
// XXX
// Η μέθοδος χρησιμοποιείται και από πολλές παρόμοιες κινήσεις.

Skiniko.prototype.processKinisiAnteLH = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria)
	return this;

	// Το property "trapeziPrin" τίθεται μόνον εφόσον ο παίκτης είναι
	// σε άλλο τραπέζι πριν την εφαρμογή της κινήσεως.

	data.trapezi = parseInt(data.trapezi);
	data.trapeziPrin = sinedria.sinedriaTrapeziGet();

	if (data.trapeziPrin === data.trapezi)
	delete data.trapeziPrin;

	return this;
};

Skiniko.prototype.processKinisiPostLH = function(data) {
	var trapezi, egoTrapezi, sinedria, simetoxi, tsoxa;

	if (data.trapeziPrin) {
		trapezi = skiniko.skinikoTrapeziGet(data.trapeziPrin);
		if (trapezi)
		trapezi.
		trapeziPektesRefreshDOM().
		trapeziTheatesRefreshDOM();
	}

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (trapezi)
	trapezi.
	trapeziPektesRefreshDOM().
	trapeziTheatesRefreshDOM();

	egoTrapezi = ego.sinedriaGet().sinedriaTrapeziGet();
	if (!egoTrapezi)
	return this;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria)
	return this;

	sinedria.sinedriaRefreshDOM();
	simetoxi = sinedria.sinedriaSimetoxiGet();
	trapezi = sinedria.sinedriaTrapeziGet();

	tsoxa = false;

	if (egoTrapezi === trapezi)
	tsoxa = true;

	else if (egoTrapezi === data.trapeziPrin)
	tsoxa = true;

	if (!tsoxa)
	return this;

	Tsoxa.pektisRefreshDOM();

	// Αν είναι ο ίδιος ο χρήστης αντικείμενο της μεταβολής, τότε
	// φρεσκάρουμε όλη την περιοχή των θεατών παρτίδας.

	if (data.pektis.isEgo()) {
		skiniko.tsoxaTheatisRefreshDOM();
		return this;
	}

	// Πρόκειται για άλλον παίκτη που αποτελεί αντικείμενο της μεταβολής.
	// Εκκινούμε τη διαδικασία επιχειρώντας να εντοπίσουμε και να διαγράψουμε
	// τον παίκτη ως θεατή από την παρτίδα. Αργότερα μπορεί να χρειαστεί να
	// τον ξαναβάλουμε.

	Tsoxa.removeTheatisDOM(data.pektis, true);

	if (sinedria.sinedriaOxiTrapezi(egoTrapezi))
	return this;

	if (simetoxi.oxiTheatis())
	return this;

	// Ο παίκτης είναι θεατής στη δική μας παρτίδα, επομένως ήρθε η στιγμή
	// να τον επανεντάξουμε στους θεατές της παρτίδας.

	Tsoxa.addTheatisDOM(data.pektis);
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Αποδοχή πρόσκλησης με τοποθέτηση ως παίκτη.

Skiniko.prototype.processKinisiAnteLP = Skiniko.prototype.processKinisiAnteLH;
Skiniko.prototype.processKinisiPostLP = Skiniko.prototype.processKinisiPostLH;

// Από θεατής παίκτης.

Skiniko.prototype.processKinisiAnteHP = Skiniko.prototype.processKinisiAnteLH;
Skiniko.prototype.processKinisiPostHP = Skiniko.prototype.processKinisiPostLH;

// Από παίκτης θεατής.

Skiniko.prototype.processKinisiAntePH = Skiniko.prototype.processKinisiAnteLH;
Skiniko.prototype.processKinisiPostPH = Skiniko.prototype.processKinisiPostLH;

// Επιλογή τραπεζιού.

Skiniko.prototype.processKinisiAnteET = Skiniko.prototype.processKinisiAnteLH;
Skiniko.prototype.processKinisiPostET = Skiniko.prototype.processKinisiPostLH;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Skiniko.prototype.processKinisiAnteXT = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria)
	return this;

	data.trapezi = sinedria.sinedriaTrapeziGet();
	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	data.thesiPekti = trapezi.trapeziThesiPekti(data.pektis);
	return this;
};

Skiniko.prototype.processKinisiPostXT = function(data) {
	var trapezi, sinedria;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (trapezi)
	trapezi.trapeziRefreshDOM();

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (sinedria)
	sinedria.sinedriaRefreshDOM();

	if (ego.oxiTrapezi(data.trapezi))
	return this;

	if (data.thesiPekti)
	Tsoxa.pektisRefreshDOM(data.thesiPekti);

	this.tsoxaTheatisRefreshDOM();
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Skiniko.prototype.processKinisiAnteXL = function(data) {
	var trapezi, prosklisi, dom;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	prosklisi = trapezi.trapeziProsklisiGet(data.apo, data.pros);
	if (!prosklisi)
	return this;

	dom = prosklisi.prosklisiGetDOM();
	if (!dom)
	return this;

	dom.remove();
	Selida.ixos.skisimo();
	return this;
};

Skiniko.prototype.processKinisiPostXL = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	if (data.exodos)
	trapezi.trapeziRefreshDOM();

	if (data.pros.isEgo())
	trapezi.trapeziKodikosRefreshDOM();

	if (ego.oxiTrapezi(data.trapezi))
	return this;

	if (Arena.profinfo.oxiPektis(data.pros))
	return this;

	Arena.profinfo.refreshTrapezi();
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Skiniko.prototype.processKinisiAntePL = function(data) {
	var trapezi, prosklisi, dom;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	prosklisi = trapezi.trapeziProsklisiGet(data.apo, data.pros);
	if (!prosklisi)
	return this;

	dom = prosklisi.prosklisiGetDOM();
	if (!dom)
	return this;

	dom.remove();
	return this;
};

Skiniko.prototype.processKinisiPostPL = function(data) {
	var trapezi, prosklisi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	prosklisi = trapezi.trapeziProsklisiGet(data.apo, data.pros);
	if (!prosklisi)
	return this;

	prosklisi.
	prosklisiCreateDOM().
	prosklisiRefreshDOM().
	prosklisiGetDOM().
	prependTo(Arena.prosklisiAreaDOM);

	if (data.pros.isEgo())
	trapezi.trapeziRefreshDOM();

	if (data.apo.oxiEgo()) {
		if (data.pros.isEgo())
		Selida.ixos.play('notice/' + (ego.isFilos(data.apo) ? 'sfirigma' : 'pap') + '.ogg');

		else
		Selida.ixos.pop();
	}

	if (ego.oxiTrapezi(trapezi))
	return this;

	if (Arena.profinfo.oxiPektis(prosklisi.prosklisiProsGet()))
	return this;

	Arena.profinfo.refreshTrapezi();
	return this;
};

Skiniko.prototype.processKinisiPostOK = function(data) {
	var kafenio;

	kafenio = this.skinikoKafenioGet(data.kafenio);
	if (!kafenio)
	return this;

	kafenio.kafenioRefreshDOM();

	return this;
};

Skiniko.prototype.processKinisiPostDX = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	trapezi.trapeziRefreshDOM();

	if (ego.oxiTrapezi(data.trapezi))
	return this;

	Tsoxa.
	refreshDOM(true);

	return this;
};

Skiniko.prototype.processKinisiPostTP = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	trapezi.trapeziRefreshDOM();

	if (data.param === 'ΒΙΔΑ')
	Arena.prosklisiAreaDOM.
	children('.prosklisi').
	each(function() {
		var prosklisi;

		if ($(this).data('trapezi') !== data.trapezi)
		return true;

		prosklisi = $(this).data('prosklisi');
		if (!prosklisi)
		return true;

		prosklisi.prosklisiRefreshDOM();
		return true;
	});

	if (ego.oxiTrapezi(data.trapezi))
	return this;

	Tsoxa.
	skorRefreshDOM().
	optionsRefreshDOM();

	// Αν αλλάξουμε είδος παιχνιδιού από μπουρλότο σε βίδα και
	// αντιστρόφως, είναι βολικό να θέτουμε νέο όριο λήξης της
	// παρτίδας.

	if (data.pektis.isEgo() && (data.param === 'ΒΙΔΑ')) {
		Arena.tpanel.lixiEnalagiButton.click();
		return this;
	}

	Selida.ixos.tik();
	return this;
};

Skiniko.prototype.processKinisiPostIK = function(data) {
	var kafenio;

	kafenio = this.skinikoKafenioGet(data.kafenio);
	if (!kafenio)
	return this;

	kafenio.kafenioRefreshDOM();
	if (ego.oxiKafenio(kafenio))
	return this;

	Arena.profinfo.refreshKafenio();
	return this;
};

Skiniko.prototype.processKinisiPostNT = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	if (ego.oxiKafenio(data.kafenio))
	return this;

	trapezi.
	trapeziDisplayDOM();

	if (data.pektis.oxiEgo())
	return this;

	trapezi.trapeziEpilogi();
	Arena.trapeziAreaDOM.scrollPano();
	Selida.ixos.pop();

	return this;
};

Skiniko.prototype.processKinisiPostSZ = function(data) {
	var sizitisi, dom, traka, grafon, proepi;

	sizitisi = new Sizitisi(data).
	sizitisiCreateDOM().
	sizitisiRefreshDOM();
	dom = sizitisi.sizitisiGetDOM();
	grafon = (ego.login == sizitisi.sizitisiPektisGet());

	traka = sizitisi.sizitisiTrapeziGet();
	if (traka) {
		if (ego.oxiTrapezi(traka))
		return this;

		Arena.sizitisiTrapeziDOM.append(dom);
		proepi = Arena.sizitisiTrapeziDOM.children('.sizitisiProepiskopisi');
		if (grafon) proepi.remove();
		else proepi.detach().appendTo(Arena.sizitisiTrapeziDOM);

		if (!Arena.sizitisiTrapeziDOM.data('pagomeni'))
		Arena.sizitisiTrapeziDOM.scrollKato();

		return this;
	}

	traka = sizitisi.sizitisiKafenioGet();
	if (traka) {
		if (ego.oxiKafenio(traka))
		return this;

		Arena.sizitisiKafenioDOM.append(dom);
		proepi = Arena.sizitisiKafenioDOM.children('.sizitisiProepiskopisi');
		if (grafon) proepi.remove();
		else proepi.detach().appendTo(Arena.sizitisiKafenioDOM);

		if (!Arena.sizitisiKafenioDOM.data('pagomeni'))
		Arena.sizitisiKafenioDOM.scrollKato();

		return this;
	}

	Arena.sizitisiLobiDOM.append(dom);
	proepi = Arena.sizitisiLobiDOM.children('.sizitisiProepiskopisi');
	if (grafon) proepi.remove();
	else proepi.detach().appendTo(Arena.sizitisiLobiDOM);

	if (!Arena.sizitisiLobiDOM.data('pagomeni'))
	Arena.sizitisiLobiDOM.scrollKato();

	return this;
};

Skiniko.prototype.processKinisiPostNK = function(data) {
	var kafenio;

	kafenio = this.skinikoKafenioGet(data.kafenio.kodikos);
	if (!kafenio)
	return this;

	dom = kafenio.kafenioGetDOM();
	if (dom)
	return this;

	kafenio.
	kafenioCreateDOM().
	kafenioRefreshDOM().
	kafenioGetDOM().
	prependTo(Arena.kafenioAreaDOM);

	if (kafenio.kafenioDimiourgosGet().oxiEgo())
	return this;

	kafenio.kafenioEpilogi();
	Arena.kafinfo.anigma(500);
	return this;
};

Skiniko.prototype.processKinisiPostSN = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.sinedria.pektis);
	if (!sinedria)
	return this;

	dom = sinedria.sinedriaGetDOM();
	if (dom)
	return this;

	sinedria.
	sinedriaCreateDOM().
	sinedriaRefreshDOM().
	sinedriaGetDOM().
	prependTo(Arena.thamonasAreaDOM);

	if (ego.isFilos(data.sinedria.pektis))
	Selida.ixos.tinybell();

	else if (ego.isTeri(data.sinedria.pektis))
	Selida.ixos.deskbell();

	return this;
};

Skiniko.prototype.processKinisiPostSL = function(data) {
	var sinedria, domList, theatis;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria)
	return this;

	// Αρχικά θεωρούμε ότι ο νεοεισερχόμενος δεν είναι θεατής
	// σε κάποιο τραπέζι.

	theatis = false;

	// Η λίστα που ακολουθεί αποτελείται από όλα το DOM elements
	// που αφορούν στον νεοεισερχόμενο παίκτη. Ως πρώτο στοιχείο
	// της λίστας εντάσσουμε το σχετικό DOM element στην περιοχή
	// των online θαμώνων.

	domList = sinedria.sinedriaGetDOM();

	this.skinikoTrapeziWalk(function() {
		var dom;

		this.trapeziThesiWalk(function(thesi) {
			if (this.trapeziPektisGet(thesi) !== data.pektis)
			return;

			if (this.hasOwnProperty('pektisDOM'))
			domList = domList.add(this.pektisDOM[thesi]);

			if (ego.oxiTrapezi(this))
			return;

			domList = domList.add(Tsoxa.onomaDOM[ego.mapThesi(thesi)]);
		});

		if (sinedria.sinedriaOxiTheatis())
		return;

		if (sinedria.sinedriaOxiTrapezi(this))
		return;

		dom = undefined;
		this.trapeziTheatisLocateDOM(data.pektis, function(t) {
			dom = t;
		});

		if (dom)
		domList = domList.add(dom);

		else
		this.trapeziTheatesRefreshDOM();

		if (ego.oxiTrapezi(this))
		return;

		// Ο νεοεισερχόμενος βρέθηκε να είναι θεατής στο δικό μας τραπέζι
		// οπότε μαρκάρουμε σχετικά προκειμένου να τον εντάξουμε στην
		// περιοχή θεατών τσόχας.

		theatis = true;

		// Επιχειρούμε να εντοπίσουμε σχετικό DOM element στην περιοχή
		// θεατών τσόχας.

		Tsoxa.locateTheatisDOM(data.pektis, function(dom) {
			// Εφόσον εντοπίσαμε σχετικό DOM element στην περιοχή
			// θεατών τσόχας, ακυρώνουμε το σχετικό μαρκάρισμα που
			// κάναμε μόλις πριν, ώστε να μην εντάξουμε για δεύτερη
			// φορά τον νεοεισερχόμενο παίκτη ως θεατή στην περιοχή
			// θεατών τσόχας.

			theatis = false;

			// Εντάσσουμε, βέβαια, το σχετικό DOM element στη σχετική
			// λίστα.

			domList = domList.add(dom);
		});
	});

	if (theatis)
	Tsoxa.addTheatisDOM(data.pektis);

	// Έχουμε μαζέψει όλα τα DOM elements που αφορούν στον νεοεισερχόμενο
	// παίκτη σε λίστα και τώρα θα διατρέξουμε αυτά τα DOM elements με
	// σκοπό να κάνουμε εμφανή τον χαιρετισμό του νεοεισερχομένου, μέσω
	// τρεμοπαίξίματος του περιθωρίου.

	domList.each(function() {
		var bc;

		bc = $(this).css('borderColor');
		$(this).
		finish().
		removeClass('offline').
		css('borderColor', '#FFD700').
		animate({
			borderColor: bc,
		}, 1000, function() {
			$(this).css('borderColor', '');
		});
		return true;
	});

	return this;
};

Skiniko.prototype.processKinisiAnteNS = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.login);
	if (!sinedria)
	return this;

	dom = sinedria.sinedriaGetDOM();
	if (dom)
	dom.remove();

	return this;
};

Skiniko.prototype.processKinisiPostNS = function(data) {
	var sinedria, domList;

	sinedria = this.skinikoSinedriaGet(data.login);
	if (sinedria)
	return this;

	domList = $();
	this.skinikoTrapeziWalk(function() {
		var trapezi = this;

		this.trapeziThesiWalk(function(thesi) {
			if (this.trapeziPektisGet(thesi) !== data.login)
			return;

			if (this.hasOwnProperty('pektisDOM'))
			domList = domList.add(this.pektisDOM[thesi]);

			if (ego.oxiTrapezi(this))
			return;

			domList = domList.add(Tsoxa.pektisDOM[ego.mapThesi(thesi)].children('.tsoxaOnoma'));
		});

		this.trapeziTheatisLocateDOM(data.login, function(dom, login) {
			dom.remove();
			delete trapezi.theatisDOM[login];
		});

		if (ego.oxiTrapezi(this))
		return;

		Tsoxa.locateTheatisDOM(data.login, function(dom) {
			dom.finish().
			fadeOut(function() {
				$(this).remove();
			});
		});
	});

	if (!domList.length)
	return this;

	domList.addClass('offline');
	return this;
};
