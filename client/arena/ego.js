//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

ego = {
	prin: {},
};

// Η μέθοδος "egoReset" «μηδενίζει» όλα τα στοιχεία του τρέχοντος παίκτη και
// θέτει εκ νέου το login name του τρέχοντος παίκτη με βάση το session cookie.

Skiniko.prototype.egoReset = function() {
	if (!Selida.hasOwnProperty('session'))
	Globals.fatal('missing "session" property from "Selida"');

	if (!Selida.session.pektis)
	Globals.fatal('Απροσδιόριστος τρέχων παίκτης ("session.pektis" missing)');

	ego.login = Selida.session.pektis;
	delete ego.pektis;
	delete ego.sinedria;

	delete ego.kafenio;
	delete ego.trapezi;
	delete ego.thesi;
	delete ego.simetoxi;

	ego.sinthesi = {};
	delete ego.telener;

	return this;
};

Skiniko.prototype.egoSet = function() {
	var login;

	this.egoReset();
	login = ego.loginGet();

	ego.pektis = this.skinikoPektisGet(login);
	ego.sinedria = this.skinikoSinedriaGet(login);
	ego.kafenio = this.skinikoKafenioGet(ego.sinedria.sinedriaKafenioGet());
	ego.trapezi = this.skinikoTrapeziGet(ego.sinedria.sinedriaTrapeziGet());
	ego.thesi = ego.sinedria.sinedriaThesiGet();
	ego.simetoxi = ego.sinedria.sinedriaSimetoxiGet();

	if (!ego.trapezi)
	return this;

	ego.sinthesi = ego.trapezi.trapeziSinthesiGet();
	ego.telener = ego.trapezi.trapeziTelefteaEnergia();

	return this;
};

Skiniko.prototype.egoPrinReset = function() {
	ego.prin.kafenio = null;
	ego.prin.trapezi = null;
	ego.prin.thesi = null;
	ego.prin.simetoxi = null;

	ego.prin.sinthesi = {};
	ego.prin.telener = null;

	return this;
};

Skiniko.prototype.egoPrinSet = function() {
	ego.prin.kafenio = ego.kafenioGet();
	ego.prin.trapezi = ego.trapeziGet();
	ego.prin.thesi = ego.thesiGet();
	ego.prin.simetoxi = ego.simetoxiGet();

	if (!ego.prin.trapezi)
	return this;

	ego.prin.sinthesi = ego.prin.trapezi.trapeziSinthesiGet();
	ego.prin.telener = ego.prin.trapezi.trapeziTelefteaEnergia();

	return this;
};

ego.loginGet = function() {
	return ego.login;
};

ego.pektisGet = function() {
	return ego.pektis;
};

ego.sinedriaGet = function() {
	return ego.sinedria;
};

ego.kafenioGet = function() {
	return ego.kafenio;
};

ego.kafenioPrinGet = function() {
	return ego.prin.kafenio;
};

ego.isKafenio = function(kafenio) {
	var egoKafenio;

	egoKafenio = ego.kafenioGet();
	if (!egoKafenio)
	return false;

	if (kafenio === undefined)
	return true;

	if (typeof kafenio === 'object')
	return(egoKafenio === kafenio);

	return(egoKafenio.kafenioKodikosGet() === kafenio);
};

ego.oxiKafenio = function(kafenio) {
	return !ego.isKafenio(kafenio);
};

ego.trapeziGet = function() {
	return ego.trapezi;
};

ego.trapeziPrinGet = function() {
	return ego.prin.trapezi;
};

ego.isTrapezi = function(trapezi) {
	var egoTrapezi;

	egoTrapezi = ego.trapeziGet();
	if (!egoTrapezi)
	return false;

	if (trapezi === undefined)
	return true;

	if (typeof trapezi === 'object')
	trapezi = trapezi.trapeziKodikosGet();

	return(egoTrapezi.trapeziKodikosGet() == trapezi);
};

ego.oxiTrapezi = function(trapezi) {
	return !ego.isTrapezi(trapezi);
};

ego.thesiGet = function() {
	return ego.thesi;
};

ego.thesiPrinGet = function() {
	return ego.prin.thesi;
};

ego.simetoxiGet = function() {
	return ego.simetoxi;
};

ego.simetoxiPrinGet = function() {
	return ego.prin.simetoxi;
};

ego.telenerGet = function() {
	return ego.telener;
};

ego.telenerPrinGet = function() {
	return ego.prin.telener;
};

ego.epomenosGet = function() {
	return ego.epomenos;
};

ego.epomenosPrinGet = function() {
	return ego.prin.epomenos;
};

ego.platiGet = function() {
	return(ego.pektisGet().pektisPeparamGet('ΠΛΑΤΗ') === 'ΜΠΛΕ' ? 'B' : 'R');
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

ego.isPektis = function() {
	return(ego.simetoxi === 'ΠΑΙΚΤΗΣ');
};

ego.oxiPektis = function() {
	return !ego.isPektis();
};

ego.isTheatis = function() {
	return(ego.simetoxi === 'ΘΕΑΤΗΣ');
};

ego.oxiTheatis = function() {
	return !ego.isTheatis();
};

ego.isVip = function() {
	var pektis;

	pektis = ego.pektisGet();
	if (!pektis)
	return false;

	return pektis.pektisIsVip();
};

ego.isEpoptis = function() {
	var pektis;

	pektis = ego.pektisGet();
	if (!pektis)
	return false;

	return pektis.pektisIsEpoptis();
};

ego.isDiaxiristis = function() {
	var pektis;

	pektis = ego.pektisGet();
	if (!pektis)
	return false;

	return pektis.pektisIsDiaxiristis();
};

ego.isDeveloper = function() {
	var pektis;

	pektis = ego.pektisGet();
	if (!pektis)
	return false;

	return pektis.pektisIsDeveloper();
};

ego.isFilos = function(pektis) {
	var egoPektis;

	egoPektis = ego.pektisGet();
	if (!egoPektis)
	return false;

	return egoPektis.pektisIsFilos(pektis);
};

ego.isTeri = function(pektis) {
	var egoPektis;

	egoPektis = ego.pektisGet();
	if (!egoPektis)
	return false;

	return egoPektis.pektisIsTeri(pektis);
};

ego.isAgapimenos = function(pektis) {
	var egoPektis;

	egoPektis = ego.pektisGet();
	if (!egoPektis)
	return false;

	return egoPektis.pektisIsAgapimenos(pektis);
};

ego.isApoklismenos = function(pektis) {
	var egoPektis;

	egoPektis = ego.pektisGet();
	if (!egoPektis)
	return false;

	return egoPektis.pektisIsApoklismenos(pektis);
};

ego.isApasxolimenos = function() {
	var egoPektis;

	egoPektis = ego.pektisGet();
	if (!egoPektis)
	return false;

	return egoPektis.pektisIsApasxolimenos();
};

String.prototype.isEgo = function() {
	return(this.valueOf() === ego.loginGet());
};

String.prototype.oxiEgo = function() {
	return !this.isEgo();
};

ego.mapThesi = function(thesi) {
	var egoThesi;

	egoThesi = ego.thesiGet();
	if (!egoThesi) egoThesi = 1;

	return ((Vida.thesiMax + thesi - egoThesi) % Vida.thesiMax) + 1;
};

Number.prototype.mapThesi = function() {
	return ego.mapThesi(this);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Skiniko.prototype.egoRefreshDOM = function() {
	this.
	egoRefreshKafenioDOM().
	egoRefreshTrapeziDOM();

	Arena.
	inputTrexonSet().
	inputRefocus();

	if ((ego.trapeziGet() !== ego.trapeziPrinGet()) ||
	(ego.simetoxiGet() !== ego.simetoxiPrinGet()) ||
	(ego.thesiGet() !== ego.thesiPrinGet()) ||
	(ego.telenerGet() !== ego.telenerPrinGet()))
	Tsoxa.refreshDOM(true);

	return this;
};

Skiniko.prototype.egoRefreshKafenioDOM = function() {
	var kafenioTora, kafenioPrin, egoLogin, egoTrapezi;

	kafenioTora = ego.kafenioGet();
	kafenioPrin = ego.kafenioPrinGet();
	if (kafenioTora === kafenioPrin)
	return this;

	Arena.
	kafinfo.alagi(kafenioTora).
	profinfo.refreshKafenio();

	Arena.trapeziAreaDOM.
	empty();

	Arena.kafenioAreaDOM.
	children('.kafenioTrexon').removeClass('kafenioTrexon');

	egoLogin = ego.loginGet();
	egoTrapezi = ego.trapeziGet();

	// Διαχειριζόμαστε πρώτα την περίπτωση κατά την οποία ο παίκτης δεν έχει
	// τρέχον καφενείο.

	if (!kafenioTora) {
		Arena.kafenioInputDOM.
		prop('disabled', true);

		Arena.sizitisiKafenioLabelDOM.
		text('Καφενείο');

		// Αν δεν υπάρχει τρέχον καφενείο για τον παίκτη, τότε δείχνουμε όλα τα
		// τραπέζια στα οποία μετέχει είτε ως παίκτης, είτε ως θεατής.

		this.skinikoTrapeziWalk(function() {
			if (this === egoTrapezi)
			return;

			if (this.trapeziThesiPekti(egoLogin) || this.trapeziIsTheatis(egoLogin))
			this.trapeziDisplayDOM();
		}, 1);

		if (egoTrapezi)
		egoTrapezi.trapeziDisplayDOM(true);

		return this;
	}

	// Ο παίκτης έχει τρέχον καφενείο, επομένως θα πρέπει να του επιτραπεί η
	// σχετική συζήτηση και να φανούν τα τραπέζια του καφενείου στην περιοχή
	// τραπεζιών.

	Arena.kafenioInputDOM.
	prop('disabled', false);

	Arena.sizitisiKafenioLabelDOM.
	html('Καφενείο&nbsp;' + kafenioTora.kafenioKodikosGet());

	kafenioTora.kafenioTrapeziWalk(function() {
		if (this !== egoTrapezi)
		this.trapeziDisplayDOM();
	}, 1);

	if (egoTrapezi)
	egoTrapezi.trapeziDisplayDOM(true);

	Arena.kafenioInputDOM.inputTrexonSet();

	kafenioTora.kafenioGetDOM().
	addClass('kafenioTrexon');

	return this;
};

Skiniko.prototype.egoRefreshTrapeziDOM = function() {
	var trapeziPrin, trapeziTora, simetoxiPrin, simetoxiTora;

	trapeziPrin = ego.trapeziPrinGet();
	simetoxiPrin = ego.simetoxiPrinGet();

	trapeziTora = ego.trapeziGet();
	simetoxiTora = ego.simetoxiGet();

	if ((trapeziTora === trapeziPrin) && ego.isTrapezi(trapeziTora))
	ego.pektisBikeVgikeNotice();

	if ((trapeziTora === trapeziPrin) && (simetoxiTora === simetoxiPrin))
	return this;

	Arena.profinfo.
	refreshTrapezi();

	if (trapeziPrin)
	trapeziPrin.trapeziRefreshDOM();

	if (trapeziTora && (trapeziTora !== trapeziPrin))
	trapeziTora.trapeziRefreshDOM();

	if (trapeziTora && (!trapeziPrin))
	Arena.trapeziInputDOM.inputTrexonSet();

	// Στο σημείο αυτό ελέγχουμε αν ο παίκτης ήταν πριν σε τραπέζι ενώ
	// τώρα δεν είναι, και το αντίστροφο, και προβαίνουμε σε αλλαγή άποψης
	// εφόσον η τρέχουσα άποψη δεν είναι η προσήκουσα.

	if ((trapeziTora && (!trapeziPrin) && (!Arena.mpanel.apopsiButton.data('partida'))) ||
	(trapeziPrin && (!trapeziTora) && (Arena.mpanel.apopsiButton.data('partida'))))
	Arena.mpanel.apopsiButton.click();

	if (!trapeziTora) {
		Arena.trapeziInputDOM.
		prop('disabled', true);

		Arena.sizitisiTrapeziLabelDOM.
		text('Τραπέζι');

		return this;
	}

	Arena.trapeziInputDOM.
	prop('disabled', false);

	Arena.sizitisiTrapeziLabelDOM.
	html('Τραπέζι&nbsp;' + trapeziTora.trapeziKodikosGet());

	return this;
};

ego.pektisBikeVgikeNotice = function() {
	var pektis, prin, tora;

	prin = {};
	for (pektis in ego.prin.sinthesi)
	prin[pektis] = ego.prin.sinthesi[pektis];

	tora = {};
	for (pektis in ego.sinthesi)
	tora[pektis] = ego.sinthesi[pektis];

	for (pektis in tora) {
		if (prin[pektis] === tora[pektis]) {
			delete prin[pektis];
			delete tora[pektis];
		}
	}

	for (pektis in tora) {
		if (prin.hasOwnProperty(pektis))
		return Selida.ixos.tik();

		return Selida.ixos.doorbell();
	}

	for (pektis in prin)
	return Selida.ixos.blioup();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
