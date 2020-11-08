Tsoxa = {};

// Η flag "dilosiNormal" δείχνει αν οι δηλώσεις αγοράς των παικτών
// εμφανίζονται ακόμη και μετά το κλείσιμο της πρώτης μπάζας.

Tsoxa.dilosiNormal = true;

Tsoxa.setup = function() {
	filajs.cardWidthSet(84);
	Tsoxa.resetDOM();
	Tsoxa.showdownSet(Debug.flagGet('striptiz'));

	Arena.tsoxaDOM.
	off('mouseenter').
	on('mouseenter', '.tsoxaButton', function(e) {
		e.stopPropagation();
		if ($(this).data('disabled'))
		return;

		$(this).
		addClass('tsoxaButtonOplismeno');
	}).
	off('mouseleave').
	on('mouseleave', '.tsoxaButton', function(e) {
		e.stopPropagation();
		$(this).
		removeClass('tsoxaButtonOplismeno');
	}).
	off('click').
	on('click', '.tsoxaButton', function(e) {
		var callback;

		Arena.inputRefocus(e);
		if ($(this).data('disabled'))
		return;

		callback = $(this).data('click');
		if (callback)
		callback.call($(this), e);
	});

	return Arena;
};

Tsoxa.partidaReplay = function() {
	var trapezi;

	trapezi = ego.trapeziGet();
	if (trapezi)
	trapezi.partidaReplay();

	return Tsoxa;
};

Tsoxa.resetDOM = function() {
	Tsoxa.
	afoplismos().
	aerasIpovoliClear();

	Tsoxa.pektisDOM = {};
	Tsoxa.onomaDOM = {};
	Tsoxa.dilosiDOM = {};
	Tsoxa.aerasDOM = {};
	Tsoxa.egrisiDOM = {};
	Tsoxa.vidaDOM = {};
	Tsoxa.bazesDOM = {};
	Tsoxa.filaDOM = {};
	Tsoxa.klistaDOM = {};

	Arena.tsoxaDOM.
	empty().
	removeClass('tsoxaTheasi').
	append(Tsoxa.ipomnimaDOM = $('<div>').attr('id', 'tsoxaIpomnima').
	append(Tsoxa.kodikosDOM = $('<div>').attr('id', 'tsoxaKodikos').addClass('tsoxaKimeno')).
	append(Tsoxa.kafenioDOM = $('<div>').attr('id', 'tsoxaKafenio').addClass('tsoxaKimeno')).
	append(Tsoxa.dianomiDOM = $('<div>').attr('id', 'tsoxaDianomi').addClass('tsoxaKimeno')).
	append(Tsoxa.lixiDOM = $('<div>').attr('id', 'tsoxaLixi').addClass('tsoxaKimeno')).
	append(Tsoxa.skorDOM = $('<div>').attr('id', 'tsoxaSkor')).
	append(Tsoxa.skorLastDOM = $('<div>').attr('id', 'tsoxaSkorLast'))).
	append(Tsoxa.infoDOM = $('<div>').attr('id', 'tsoxaInfo')).
	append(Tsoxa.minimaDOM = $('<div>').attr('id', 'tsoxaMinima'));

	Tsoxa.fasiDOM = $('<div>').attr('id', 'tsoxaFasi').appendTo(Tsoxa.infoDOM);
	Tsoxa.fyiDOM = $('<div>').attr('id', 'tsoxaFYI').appendTo(Tsoxa.infoDOM);

	//////////////////////////////////////////////////////////

	Tsoxa.baza = new filajsHand();
	Tsoxa.bazaPrev = new filajsHand();

	Tsoxa.bazaDOM = Tsoxa.baza.
	baselineSet('T', 130).
	alignmentSet('C').
	domCreate().
	domGet();

	Arena.tsoxaDOM.
	append(Tsoxa.bazaDOM);

	//////////////////////////////////////////////////////////

	Vida.thesiWalk(function(thesi) {
		Arena.tsoxaDOM.
		append(Tsoxa.pektisDOM[thesi] = $('<div>').attr('id', 'tsoxaPektis' + thesi).
		addClass('tsoxaPektis ' + 'tsoxaPektis' + (thesi % 2 ? 'H' : 'V')).
		append(Tsoxa.onomaDOM[thesi] = $('<div>').attr('id', 'tsoxaOnoma' + thesi).addClass('tsoxaOnoma')).
		append(Tsoxa.dilosiDOM[thesi] = $('<div>').data('thesi', thesi).
		attr('id', 'tsoxaDilosi' + thesi).addClass('tsoxaDilosi')).
		append(Tsoxa.aerasDOM[thesi] = $('<div>').data('thesi', thesi).
		attr('id', 'tsoxaAeras' + thesi).addClass('tsoxaAeras')).
		append(Tsoxa.egrisiDOM[thesi] = $('<div>').data('thesi', thesi).
		attr('id', 'tsoxaEgrisi' + thesi).addClass('tsoxaEgrisi')).
		append(Tsoxa.vidaDOM[thesi] = $('<div>').data('thesi', thesi).
		attr('id', 'tsoxaVida' + thesi).addClass('tsoxaVida')).
		append(Tsoxa.bazesDOM[thesi] = $('<div>').data('thesi', thesi).
		attr('id', 'tsoxaBazes' + thesi).addClass('tsoxaBazes').attr('title', 'Μπάζες παίκτη')).
		append(Tsoxa.filaDOM[thesi] = $('<div>').addClass('tsoxaFila')).
		append(Tsoxa.klistaDOM[thesi] = $('<div>').data('thesi', thesi).
		attr('id', 'tsoxaKlista' + thesi).addClass('tsoxaKlista')));
	});

	Tsoxa.bazaPrevDOM = Tsoxa.bazaPrev.
	baselineSet('T').
	alignmentSet('C').
	domCreate().
	domGet();

	Arena.tsoxaDOM.
	append(Tsoxa.bazaPrevContainerDOM = $('<div>').attr('id', 'tsoxaBazaPrev').
	append(Tsoxa.bazaPrevDOM));

	Tsoxa.bazaPrevContainerDOM.
	on('mouseenter', function() {
		if (Tsoxa.bazaPrevOn)
		$(this).finish().css('opacity', 1);
	}).
	on('mouseleave', function() {
		$(this).finish().css('opacity', Tsoxa.bazaPrevOn ? 0.4 : 0);

	});

	Arena.tsoxaDOM.
	append(Tsoxa.optionsDOM = $('<div>').attr('id', 'tsoxaOptions'));

	return Tsoxa;
};

Tsoxa.refreshDOM = function(efoplismos) {
	var trapezi, thesi;

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa.resetDOM();

	Tsoxa.
	afoplismos().
	kodikosRefreshDOM().
	kafenioRefreshDOM().
	dianomiRefreshDOM().
	optionsRefreshDOM().
	fasiRefreshDOM().
	pektisRefreshDOM().
	dilosiRefreshDOM().
	aerasRefreshDOM().
	egrisiRefreshDOM().
	filaRefreshDOM().
	klistaRefreshDOM().
	bazaRefreshDOM().
	bazaPrevRefreshDOM().
	bazesRefreshDOM().
	skorRefreshDOM().
	skorLastRefreshDOM().
	minimaRefreshDOM();

	for (thesi = 2; thesi <= Vida.thesiMax; thesi++)
	Tsoxa.dilosiDOM[thesi].
	css('cursor', '').
	attr('title', '').
	off('click');

	if (ego.isTheatis()) {
		Arena.tsoxaDOM.
		addClass('tsoxaTheasi').
		find('.tsoxaKimeno').
		addClass('tsoxaKimenoTheatis');

		for (thesi = 2; thesi <= Vida.thesiMax; thesi++)
		Tsoxa.dilosiDOM[thesi].
		css('cursor', 'crosshair').
		attr('title', 'Αλλαγή θέσης θέασης').
		on('click', function(e) {
			var thesi;

			Arena.inputRefocus();

			thesi = $(this).data('thesi');
			if (!thesi)
			return;

			thesi = ego.thesiGet() + thesi - 1;
			if (thesi > Vida.thesiMax)
			thesi -= Vida.thesiMax;

			Selida.skiserService('thesiTheasis', 'thesi=' + thesi);
		});

		return Tsoxa;
	}

	Arena.tsoxaDOM.
	removeClass('tsoxaTheasi').
	find('.tsoxaKimeno').
	removeClass('tsoxaKimenoTheatis');

	if (efoplismos)
	Tsoxa.efoplismos();

	return Tsoxa;
};

Tsoxa.kodikosRefreshDOM = function() {
	var trapezi;

	trapezi = ego.trapeziGet();

	if (trapezi)
	Tsoxa.kodikosDOM.
	text(trapezi.trapeziKodikosGet()).
	css('display', 'block');

	else
	Tsoxa.kodikosDOM.
	css('display', 'none').
	empty();

	return Tsoxa;
};

Tsoxa.kafenioRefreshDOM = function() {
	var trapezi, kafenio;

	trapezi = ego.trapeziGet();

	if (trapezi)
	kafenio = trapezi.trapeziKafenioGet();

	if (kafenio)
	Tsoxa.kafenioDOM.
	text(kafenio).
	css('display', 'block');

	else
	Tsoxa.kafenioDOM.
	css('display', 'none').
	empty();

	return Tsoxa;
};

Tsoxa.dianomiRefreshDOM = function() {
	var trapezi, dianomi;

	trapezi = ego.trapeziGet();
	dianomi = (trapezi ? trapezi.trapeziTelefteaDianomi() : null);

	if (dianomi)
	Tsoxa.dianomiDOM.
	text(dianomi.dianomiKodikosGet()).
	css('display', 'block');

	else
	Tsoxa.dianomiDOM.
	css('display', 'none').
	empty();

	return Tsoxa;
};

Tsoxa.optionsRefreshDOM = function() {
	var trapezi;

	Arena.tsoxaDOM.
	removeClass('tsoxaPrive');

	Tsoxa.optionsDOM.
	empty();

	trapezi = ego.trapeziGet();
	if (!trapezi) return Tsoxa;

	if (trapezi.denPeziKomeni())
	Tsoxa.optionsDOM.append($('<img>').addClass('tsoxaOption').
	attr({
		src: 'ikona/panel/partida/komeniOff.png',
		title: 'Δεν επιτρέπονται δηλώσεις «ΚΟΜΜΕΝΗ»',
	}));

	if (trapezi.trapeziOxiDilosiAllow())
	Tsoxa.optionsDOM.append($('<img>').addClass('tsoxaOption').
	attr({
		src: 'ikona/panel/partida/dilosiOff.png',
		title: 'Υπενθύμιση δηλώσεων μέχρι την πρώτη μπάζα',
	}));

	if (trapezi.trapeziIsVida() && trapezi.vidaOkto())
	Tsoxa.optionsDOM.append($('<img>').addClass('tsoxaOption').
	attr({
		src: 'ikona/panel/partida/oktoOn.png',
		title: 'Βίδα 2, 4, 6, 8',
	}));

	if (trapezi.trapeziIsBelot() && trapezi.apontaOff())
	Tsoxa.optionsDOM.append($('<img>').addClass('tsoxaOption').
	attr({
		src: 'ikona/panel/partida/apontaOff.png',
		title: 'Δεν χαλάει με άποντα',
	}));

	if (trapezi.trapeziIsVida())
	Tsoxa.optionsDOM.append($('<img>').addClass('tsoxaOption').
	attr({
		src: 'ikona/vida/vida64.png',
		title: 'Παρτίδα βίδας',
	}));

	else
	Tsoxa.optionsDOM.append($('<img>').addClass('tsoxaOption').
	attr({
		src: 'ikona/panel/belot.png',
		title: 'Παρτίδα μπουρλότου',
	}));

	if (trapezi.trapeziIsPrive()) {
		Arena.tsoxaDOM.addClass('tsoxaPrive');
		Tsoxa.optionsDOM.append($('<img>').addClass('tsoxaOption').
		attr({
			src: 'ikona/panel/prive.png',
			title: 'Πριβέ τραπέζι',
		}));
	}

	if (trapezi.trapeziIsIdioktito())
	Tsoxa.optionsDOM.append($('<img>').addClass('tsoxaOption').
	attr({
		src: 'ikona/panel/idioktito.png',
		title: 'Ιδιόκτητο τραπέζι',
	}));

	return Tsoxa;
};

Tsoxa.fasiRefreshDOM = function() {
	var trapezi;

	Tsoxa.fasiDOM.empty();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	Tsoxa.fasiDOM.text(trapezi.partidaFasiGet());
	return Tsoxa;
};

Tsoxa.onomaRefreshDOM = function(thesi) {
	var iseht, trapezi, login, klasi, pektis;

	if (thesi === undefined)
	return Tsoxa.thesiWalk(function(thesi) {
		Tsoxa.onomaRefreshDOM(thesi);
	});

	iseht = thesi.mapThesi();

	Tsoxa.onomaDOM[iseht].
	removeClass().
	removeData('pektis').
	empty().
	off('click');

	Tsoxa.onomaDOM[iseht].
	addClass('tsoxaOnoma tsoxaOnoma' + (ego.isTheatis() ? 'Theatis' : 'Pektis'));

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	login = trapezi.trapeziPektisGet(thesi);
	if (!login)
	return Tsoxa;

	klasi = {
		onoma: 'tsoxaOnomaText',
	};
	Arena.pektisKlasiSet(login, klasi);

	Tsoxa.onomaDOM[iseht].
	data('pektis', login).
	append($('<div>').addClass(klasi.onoma).text(login)).
	addClass('oplismosProfinfo').
	oplismosProfinfo();

	if (!skiniko.skinikoSinedriaGet(login))
	Tsoxa.onomaDOM[iseht].addClass('offline');

	pektis = skiniko.skinikoPektisGet(login);
	if (!pektis)
	return Tsoxa;

	if (pektis.pektisIsApasxolimenos())
	Tsoxa.onomaDOM[iseht].addClass('apasxolimenos');

	return Tsoxa;
};

Tsoxa.apodoxiRefreshDOM = function(thesi) {
	var iseht, trapezi;

	if (thesi === undefined)
	return Tsoxa.thesiWalk(function(thesi) {
		Tsoxa.apodoxiRefreshDOM(thesi);
	});

	iseht = thesi.mapThesi();

	Tsoxa.onomaDOM[iseht].
	removeClass('tsoxaApodoxi tsoxaIxodopa');

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	Tsoxa.onomaDOM[iseht].
	addClass(trapezi.trapeziApodoxiGet(thesi) ? 'tsoxaApodoxi' : 'tsoxaIxodopa');

	return Tsoxa;
};

Tsoxa.dealerRefreshDOM = function() {
	var trapezi, dealer, protos;

	Arena.tsoxaDOM.
	find('#tsoxaDealer,#tsoxaProtos').
	remove();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	dealer = trapezi.partidaDealerGet();
	if (!dealer)
	return Tsoxa;

	Tsoxa.onomaDOM[dealer.mapThesi()].
	append($('<img>').addClass('tsoxaDealer' + dealer).attr({
		id: 'tsoxaDealer',
		src: 'ikona/endixi/dealer.png',
	}));

	protos = dealer.thesiEpomeni();
	Tsoxa.onomaDOM[protos.mapThesi()].
	append($('<img>').addClass('tsoxaDealer' + protos).attr({
		id: 'tsoxaProtos',
		src: 'ikona/endixi/protos.png',
	}));

	return Tsoxa;
};

Tsoxa.epomenosRefreshDOM = function() {
	var trapezi, epomenos, info, icon;

	Arena.tsoxaDOM.
	find('.tsoxaEpomenos').
	removeClass('tsoxaEpomenos').
	find('.tsoxaEpomenosIcon').
	remove();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	epomenos = trapezi.partidaEpomenosGet();
	if (!epomenos)
	return Tsoxa;

	switch (trapezi.partidaFasiGet()) {
	case 'ΠΑΙΧΝΙΔΙ':
		info = 'Αναμένεται κίνηση από τον παίκτη';
		icon = 'ikona/endixi/balitsa.gif';
		break;
	case 'ΔΙΑΝΟΜΗ':
	case 'ΕΠΑΝΑΔΙΑΝΟΜΗ':
		info = 'Μοιράζει φύλλα';
		icon = 'ikona/working/ringBlue.gif';
		break;
	default:
		info = 'Αναμένεται δήλωση/ενέργεια από τον παίκτη';
		icon = 'ikona/endixi/erotimatiko.gif';
		break;
	}

	Tsoxa.onomaDOM[epomenos.mapThesi()].
	addClass('tsoxaEpomenos').
	append($('<img>').addClass('tsoxaEpomenosIcon').attr({
		src: icon,
		title: info,
	}));

	return Tsoxa;
};

Tsoxa.pektisRefreshDOM = function(thesi) {
	if (thesi === undefined)
	return Tsoxa.thesiWalk(function(thesi) {
		Tsoxa.pektisRefreshDOM(thesi);
	});

	Tsoxa.
	onomaRefreshDOM(thesi).
	apodoxiRefreshDOM(thesi).
	dealerRefreshDOM(thesi).
	epomenosRefreshDOM(thesi);

	return Tsoxa;
};

Tsoxa.dilosiRefreshDOM = function(thesi) {
	var iseht, dom, domVida, trapezi, dianomi, paso, vida, aponta;

	if (thesi === undefined)
	return Tsoxa.thesiWalk(function(thesi) {
		Tsoxa.dilosiRefreshDOM(thesi);
	});

	iseht = thesi.mapThesi();
	dom = Tsoxa.dilosiDOM[iseht];
	domVida = Tsoxa.vidaDOM[iseht];

	dom.
	removeClass().
	addClass('tsoxaDilosi').
	empty();

	domVida.
	css('display', '').
	removeClass('tsoxaVida2').
	empty();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	// Μόλις κλείσει η πρώτη μπάζα φροντίζουμε να καθαρίσουμε όλες τις
	// δηλώσεις εκτός της αγοράς.

	if (Tsoxa.dilosiNormal && (trapezi.partidaBazesCount() > 0)) {
		if (trapezi.partidaAgorastisGet() === thesi)
		trapezi.partidaAgoraGet().agoraRefreshDOM(dom);
		return Tsoxa;
	}

	// Δεν έχουμε μπάζα, επομένως θα διατρέξουμε τις δηλώσεις για να
	// εντοπίσουμε τυχόν τελευταία δήλωση του παίκτη στην ανά χείρας
	// θέση.

	dianomi = trapezi.trapeziTelefteaDianomi();
	if (!dianomi)
	return Tsoxa;

	agora = null;
	paso = null;
	vida = null;
	aponta = null;

	dianomi.dianomiEnergiaWalk(function() {
		var dilosi;

		if (this.energiaPektisGet() !== thesi)
		return;

		if (this.energiaIdosGet() !== 'ΔΗΛΩΣΗ')
		return;

		dilosi = new Dilosi(this.energiaDataGet());

		if (dilosi.dilosiIsPaso())
		paso = true;

		else if (dilosi.dilosiIsVida())
		vida = true;

		else if (dilosi.dilosiIsAponta())
		aponta = true;

		else
		agora = dilosi;
	});

	if (aponta) {
		dom.
		addClass('tsoxaDilosiAgora tsoxaDilosiAponta').
		text('ΑΠΟΝΤΑ');
		return Tsoxa;
	}

	if (agora)
	agora.agoraRefreshDOM(dom);

	if (paso)
	trapezi.trapeziPasoLektiko(dom, agora);

	if (vida) {
		if (agora)
		dom.addClass('tsoxaDilosiAgora tsoxaDilosiPaso');

		domVida.
		css('display', 'block').
		append($('<img>').
		attr('src', 'ikona/vida2/vida64.png').
		addClass('tsoxaVidaIcon'));

		if (trapezi.partidaPektisVidaCountGet(thesi) > 1)
		domVida.addClass('tsoxaVida2');
	}

	return Tsoxa;
};

Trapezi.prototype.trapeziPasoLektiko = function(dom, agora) {
	if (this.trapeziIsVida()) {
		dom.addClass('tsoxaDilosiAgora tsoxaDilosiPaso');
		if (agora)
		return this;

		dom.html($('<div>').addClass('tsoxaDilosiPasoPaso').text('ΠΑΣΟ'));
		return this;
	}

	if (this.partidaIsAgora())
	return this;

	dom.
	addClass('tsoxaDilosiAgora tsoxaDilosiPaso').
	html($('<div>').addClass('tsoxaDilosiPasoPaso').text('ΠΑΣΟ'));

	return this;
};

Dilosi.prototype.agoraRefreshDOM = function(dom) {
	var xroma, pontoi;

	if (this.dilosiIsPaso())
	return this;

	if (this.dilosiIsVida())
	return this;

	xroma = this.dilosiXromaGet();
	pontoi = this.dilosiPontoiGet();

	dom.
	addClass('tsoxaDilosiAgora').
	append(filajs.suitDOM(xroma).addClass('tsoxaDilosiXroma'));

	if (pontoi)
	dom.append($('<div>').addClass('tsoxaDilosiPontoi').text(pontoi));

	else
	dom.addClass('tsoxaDilosiAgoraBelot');

	if (this.dilosiIsDilosi(ego.trapeziGet().partidaAgoraGet()))
	dom.addClass('tsoxaDilosiAgoraTora');

	return this;
};

Tsoxa.klistaRefreshDOM = function(thesi) {
	var iseht, dom, trapezi, plati, klista;

	if (thesi === undefined)
	return Tsoxa.thesiWalk(function(thesi) {
		Tsoxa.klistaRefreshDOM(thesi);
	});

	iseht = thesi.mapThesi();
	dom = Tsoxa.klistaDOM[iseht];

	dom.
	css('display', 'none').
	empty();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	if (trapezi.trapeziIsVida())
	return Tsoxa;

	switch (trapezi.partidaFasiGet()) {
	case 'ΑΓΟΡΑ':
		break;
	default:
		return Tsoxa;
	}

	if (thesi !== trapezi.partidaDealerGet())
	return Tsoxa;

	plati = ego.platiGet();
	klista = trapezi.partidaKlistaGet(thesi);

	klista.
	shiftxSet(0).
	cardWalk(function() {
		var tzogos;

		tzogos = this.data('tzogos');

		this.
		backSet(plati).
		faceSet(tzogos).
		widthSet(70).
		domRefresh();

		if (tzogos)
		this.domGet().attr('title', 'Φύλλο προτεινόμενης αγοράς');
	}).
	baselineSet('T').
	alignmentSet('L').
	asortiSet(false).
	domRefresh();

	dom.
	append(klista.domGet()).
	css('display', 'block');

	return Tsoxa;
};

Tsoxa.aerasRefreshDOM = function(thesi) {
	var iseht, dom, trapezi, pios, aeras, len;

	if (thesi === undefined)
	return Tsoxa.thesiWalk(function(thesi) {
		Tsoxa.aerasRefreshDOM(thesi);
	});

	iseht = thesi.mapThesi();
	dom = Tsoxa.aerasDOM[iseht];

	dom.empty();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	if (trapezi.partidaOxiAerasEgrisi()) {
		dom.css('display', 'none');
		return Tsoxa;
	}

	dom.css('display', 'block');
	pios = trapezi.partidaAerasPiosGet();
	if (pios !== thesi)
	return Tsoxa;

	aeras = trapezi.partidaAerasGet();
	len = aeras.cardsCount();

	aeras.
	cardWalk(function() {
		this.
		widthSet(70).
		domRefresh();
	}).
	archSet(len).
	baselineSet('T');

	switch (iseht) {
	case 1:
	case 3:
		aeras.alignmentSet('C');
		break;
	case 2:
		aeras.alignmentSet('R');
		break;
	case 4:
		aeras.alignmentSet('L');
		break;
	}

	aeras.
	domRefresh();

	dom.append(aeras.domGet());
	aeras.domRefresh();

	return Tsoxa;
};

Tsoxa.egrisiRefreshDOM = function(thesi) {
	var iseht, dom, trapezi, egrisi, klasi;

	if (thesi === undefined)
	return Tsoxa.thesiWalk(function(thesi) {
		Tsoxa.egrisiRefreshDOM(thesi);
	});

	iseht = thesi.mapThesi();
	dom = Tsoxa.egrisiDOM[iseht];

	dom.
	css('display', 'none').
	removeClass().
	addClass('tsoxaEgrisi').
	empty();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	switch (trapezi.partidaFasiGet()) {
	case 'ΠΑΙΧΝΙΔΙ':
	case 'ΑΕΡΑΣ':
		break;
	default:
		return Tsoxa;
	}

	if (trapezi.partidaIsBourlotoTora() &&
	(thesi === trapezi.partidaBourlotoGet())) {
		egrisi = 'ΜΠΟΥΡΛΟΤΟ';
		klasi = 'Bourloto';
	}

	else {
		egrisi = trapezi.aerasEgrisiLista[thesi];

		if (!egrisi)
		return Tsoxa;

		switch (egrisi) {
		case 'ΝΑΙ':
			klasi = 'Nai';
			break;
		case 'ΟΧΙ':
			klasi = 'Oxi';
			break;
		case 'ΚΟΜΜΕΝΗ':
			klasi = 'Komeni';
			break;
		}
	}

	dom.
	addClass('tsoxaEgrisi' + klasi).
	css('display', 'block').
	text(egrisi);

	if (iseht % 2)
	dom.css('left', ((Arena.tsoxaDOM.outerWidth() - dom.innerWidth() - 14) / 2) + 'px');

	return Tsoxa;
};

Tsoxa.showdownSet = function(showdown) {
	Tsoxa.showdown = showdown;
};

Tsoxa.showdownSwitch = function() {
	Tsoxa.showdownSet(!Tsoxa.showdown);
};

Tsoxa.isShowdown = function() {
	return Tsoxa.showdown;
};

Tsoxa.filaRefreshDOM = function(thesi) {
	var iseht, trapezi, fila, fatsa, plati, family;

	if (thesi === undefined)
	return Tsoxa.thesiWalk(function(thesi) {
		Tsoxa.filaRefreshDOM(thesi);
	});

	iseht = thesi.mapThesi();

	Tsoxa.filaDOM[iseht].
	empty();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	fila = trapezi.partidaFilaGet(thesi);
	if (!fila)
	return Tsoxa;

	// Ως θεατές μπορούμε να βλέπουμε τα φύλλα όλων παικτών με το
	// πάτημα του κατάλληλου πλήκτρου στο control panel (βάτραχος).

	if (Debug.flagGet('striptiz') || ego.isTheatis())
	fatsa = Tsoxa.isShowdown();

	else
	fatsa = false;

	plati = ego.platiGet();

	switch (iseht) {
	case 1:
		fila.
		cardWidthSet(84).
		horizontalSet(1).
		baselineSet('B').
		alignmentSet('C');
		fatsa = true;
		break;
	case 2:
		fila.
		cardWidthSet(40).
		verticalSet(-1).
		baselineSet('R').
		alignmentSet('M');
		break;
	case 3:
		fila.
		cardWidthSet(50).
		horizontalSet(-1).
		baselineSet('T').
		alignmentSet('C');
		break;
	case 4:
		fila.
		cardWidthSet(40).
		verticalSet(1).
		baselineSet('L').
		alignmentSet('M');
		break;
	}

	family = filajs.cardFamilyGet();
	fila.cardWalk(function() {
		var anikto;

		anikto = this.data('anikto');
		if (!anikto)
		anikto = fatsa;

		this.
		backSet(plati).
		faceSet(anikto).
		familySet(family).
		domRefresh();
	}).
	// στα κλειστά φύλλα ακυρώνουμε την ταξινόμηση
	sort(fatsa).
	domRefresh().
	domGet().
	appendTo(Tsoxa.filaDOM[iseht]);

	fila.
	domRefresh();

	return Tsoxa;
};

Tsoxa.bazaFiloPiosClear = function(fadeout) {
	var jql;

	jql = Arena.tsoxaDOM.children('.tsoxaBazaFiloPios');

	if (fadeout)
	jql.fadeOut(function() {
		$(this).remove();
	});

	else
	jql.remove();

	return Tsoxa;
};

Tsoxa.bazaRefreshDOM = function() {
	var trapezi, epomenos, sonemope, pbfp;

	Tsoxa.baza.reset().circleSet();
	Tsoxa.bazaDOM.empty();
	Tsoxa.bazaFiloPiosClear();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	switch (trapezi.partidaFasiGet()) {
	case 'ΠΑΙΧΝΙΔΙ':
	case 'ΑΕΡΑΣ':
		break;
	default:
		return Tsoxa;
	}

	epomenos = trapezi.partidaEpomenosGet();
	sonemope = ego.mapThesi(epomenos);

	if (trapezi.baza)
	trapezi.baza.bazaFiloWalk(function(thesi, filo) {
		Tsoxa.baza.circlePush($('#filajsCircle4' + ego.mapThesi(thesi)));
		Tsoxa.baza.cardPush(filo.familySet().domRefresh());
	});

	Tsoxa.baza.circlePush($('#filajsCircle4' + sonemope));
	Tsoxa.baza.domRefresh();

	pbfp = (ego.isPektis() ? 'pektis' : 'theatis');
	if (trapezi.baza)
	trapezi.baza.bazaFiloWalk(function(thesi, filo) {
		var iseht;

		iseht = ego.mapThesi(thesi);
		Arena.tsoxaDOM.append($('<img>').attr({
			id: 'tsoxaBazaFiloPios' + iseht,
			src: 'ikona/baza/' + pbfp + iseht + '.png',
		}).addClass('tsoxaBazaFiloPios'));
	});

	Tsoxa.bazaDOM.css('opacity', trapezi.partidaIsAerasEgrisi() ? 0.5 : 1.0);
	return Tsoxa;
};

Tsoxa.bazaPrevRefreshDOM = function() {
	var trapezi;

	Tsoxa.bazaPrev.reset().circleSet();
	Tsoxa.bazaPrevDOM.empty();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	if (!trapezi.bazaPrev)
	return Tsoxa;

	trapezi.bazaPrev.
	bazaFiloWalk(function(thesi, filo) {
		filo.widthSet(50);
		Tsoxa.bazaPrev.circlePush($('#filajsCircle4' + ego.mapThesi(thesi)));
		Tsoxa.bazaPrev.cardPush(filo.familySet().domRefresh());
	});

	Tsoxa.bazaPrev.domRefresh();

	return Tsoxa;
};

Tsoxa.bazesRefreshDOM = function(thesi) {
	var iseht, dom, trapezi, bazes, prosartisi;

	if (thesi === undefined)
	return Tsoxa.thesiWalk(function(thesi) {
		Tsoxa.bazesRefreshDOM(thesi);
	});

	iseht = thesi.mapThesi();
	dom = Tsoxa.bazesDOM[iseht];

	dom.empty();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	// Επιλέγω τρόπο προσάρτησης των μπαζών ανάλογα με τη θέση, έτσι
	// ώστε να συμφωνεί ο χρωματισμός των μπαζών ανά τρεις με αυτόν
	// της online προσάρτησης.

	switch (iseht) {
	case 3:
	case 2:
		prosartisi = 'append';
		break;
	default:
		prosartisi = 'prepend';
	}

	bazes = trapezi.partidaBazesCount(thesi);
	while (bazes-- > 0) {
		dom[prosartisi]($('<div>').addClass('tsoxaBazaPekti').
		append(new filajsCard().widthSet(Arena.bazaPektiWidth).
		// Οι μπάζες είναι γυρισμένες «πλάτη», το δε χρώμα της πλάτης
		// αλλάζε μπλε/κόκκινο ανά τρεις μπάζες ώστε να είναι εύκολο
		// το μέτρημα των μπαζών.
		faceDown().backSet(Math.floor(bazes / 3) % 2 ? 'B' : 'R').
		domRefresh().domGet().addClass('tsoxaBazaPektiIcon')));
	}

	return Tsoxa;
};

Tsoxa.skorRefreshDOM = function() {
	var trapezi, skor13, skor24, xroma13, xroma24, lixi;

	Tsoxa.lixiDOM.css('display', 'none').empty();
	Tsoxa.skorDOM.css('display', 'none').empty();

	Arena.tsoxaDOM.
	children('#tsoxaTelosNoticeContainer').
	remove();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	Tsoxa.lixiDOM.
	css('display', 'block').
	text(trapezi.trapeziLixiGet());

	if (trapezi.trapeziOxiDianomi())
	return Tsoxa;

	switch (ego.thesiGet()) {
	case 1:
	case 3:
		skor13 = trapezi.partidaSkorGet('13');
		skor24 = trapezi.partidaSkorGet('24');
		break;
	default:
		skor13 = trapezi.partidaSkorGet('24');
		skor24 = trapezi.partidaSkorGet('13');
		break;
	}

	xroma13 = 'tsoxaKimeno';
	xroma24 = 'tsoxaKimeno';

	if (skor13 > skor24) {
		xroma13 += ' tsoxaSkorSin';
		xroma24 += ' tsoxaSkorMion';
	}
	else {
		xroma13 += ' tsoxaSkorMion';
		xroma24 += ' tsoxaSkorSin';
	}

	Tsoxa.skorDOM.
	css('display', 'block').
	append($('<div>').addClass('tsoxaSkorPontoi ' + xroma24).
	attr('title', 'Πόντοι Ανατολής/Δύσης').text(skor24)).
	append($('<div>').addClass('tsoxaSkorKagelo').text('#')).
	append($('<div>').addClass('tsoxaSkorPontoi ' + xroma13).
	attr('title', 'Πόντοι Βορρά/Νότου').text(skor13));

	lixi = trapezi.trapeziLixiGet();
	if ((lixi > skor13) && (lixi > skor24))
	return Tsoxa;

	Arena.tsoxaDOM.
	append($('<div>').attr('id', 'tsoxaTelosNoticeContainer').
	append($('<img>').attr({
		id: 'tsoxaTelosNotice',
		src: 'ikona/endixi/telos.png',
		title: 'Η παρτίδα έχει τελειώσει',
	})));

	return Tsoxa;
};

Tsoxa.skorNoticeDOM = function(dur) {

	if (!dur) {
		Tsoxa.skorDOM.
		finish().
		css('backgroundColor', '#FFFFCC');
		return Tsoxa;
	}

	Tsoxa.skorDOM.
	css('backgroundColor', '#FFFF66').
	animate({
		backgroundColor: 'transparent',
	}, dur);

	return Tsoxa;
};

Tsoxa.skorLastRefreshDOM = function() {
	var trapezi, skor13, skor24, dianomiCount, dianomi, xroma13, xroma24;

	Tsoxa.skorLastDOM.css('display', 'none').empty();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	dianomiCount = trapezi.trapeziDianomiCount();
	if (dianomiCount < 2)
	return Tsoxa;

	switch (trapezi.partidaFasiGet()) {
	case 'ΠΛΗΡΩΜΗ':
	case 'ΔΙΑΝΟΜΗ':
	case 'ΕΠΑΝΑΔΙΑΝΟΜΗ':
		dianomi = trapezi.dianomiArray[dianomiCount - 1];
		break;
	default:
		dianomi = trapezi.dianomiArray[dianomiCount - 2];
		break;
	}

	if (!dianomi)
	return Tsoxa;

	switch (ego.thesiGet()) {
	case 1:
	case 3:
		skor13 = dianomi.dianomiSkorGet('13');
		skor24 = dianomi.dianomiSkorGet('24');

		roks13 = trapezi.roks13;
		roks24 = trapezi.roks24;
		break;
	default:
		skor13 = dianomi.dianomiSkorGet('24');
		skor24 = dianomi.dianomiSkorGet('13');

		roks13 = trapezi.roks24;
		roks24 = trapezi.roks13;
		break;
	}

	if ((skor13 === 0) && (skor24 === 0))
	return Tsoxa;

	xroma13 = 'tsoxaKimeno';
	xroma24 = 'tsoxaKimeno';

	if (skor13 > skor24) {
		xroma13 += ' tsoxaSkorSin';
		xroma24 += ' tsoxaSkorMion';
	}
	else {
		xroma13 += ' tsoxaSkorMion';
		xroma24 += ' tsoxaSkorSin';
	}

	Tsoxa.skorLastDOM.
	css('display', 'block').
	append($('<div>').addClass('tsoxaSkorPontoi ' + xroma24).
	attr('title', 'Πόντοι τελευταίας διανομής Ανατολής/Δύσης').text(skor24)).
	append($('<div>').addClass('tsoxaSkorKagelo').text('#')).
	append($('<div>').addClass('tsoxaSkorPontoi ' + xroma13).
	attr('title', 'Πόντοι τελευταίας διανομής Βορρά/Νότου').text(skor13));

	if ((!isNaN(roks13)) && (!isNaN(roks24)) && ((roks13 !== skor13) || (roks24 !== skor24)))
	Tsoxa.skorLastDOM.
	append($('<div>').addClass('tsoxaRoksPontoi tsoxaRoksPontoi24').
	attr('title', 'Μετρημένοι πόντοι Ανατολής/Δύσης').text(roks24)).
	append($('<div>').addClass('tsoxaSkorKagelo').text('#')).
	append($('<div>').addClass('tsoxaRoksPontoi tsoxaRoksPontoi13').
	attr('title', 'Μετρημένοι πόντοι Βορρά/Νότου').text(roks13));

	return Tsoxa;
};

Tsoxa.minimaRefreshDOM = function() {
	var trapezi, fasi;

	Tsoxa.minimaResetDOM();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	switch (fasi = trapezi.partidaFasiGet()) {
	case 'ΔΙΑΝΟΜΗ':
		Tsoxa.minimaSetDOM('Γίνεται διανομή. Παρακαλώ περιμένετε…');
		break;
	case 'ΕΠΑΝΑΔΙΑΝΟΜΗ':
		Tsoxa.minimaSetDOM((trapezi.partidaApontaGet() ? 'Δηλώθηκαν άποντα' : 'Η αγορά απέβη άγονη') +
			' και ως εκ τούτου θα γίνει νέα διανομή. Παρακαλώ περιμένετε…');
		break;
	case 'ΑΓΟΡΑ':
	case 'ΚΟΝΤΡΑ':
		if (trapezi.trapeziIsVida())
		Tsoxa.minimaRefreshDOMagoraVida(trapezi, fasi);

		else
		Tsoxa.minimaRefreshDOMagoraBelot(trapezi);

		break;
	case 'ΠΛΗΡΩΜΗ':
		Tsoxa.minimaSetDOM('Καταμέτρηση πόντων. Παρακαλώ περιμένετε…');
		break;
	}

	return Tsoxa;
};

Tsoxa.minimaRefreshDOMagoraVida = function(trapezi, fasi) {
	var isPektis, thesi, epomenos;

	isPektis = ego.isPektis();
	thesi = ego.thesiGet();
	epomenos = trapezi.partidaEpomenosGet();

	// Στη βίδα ο παίκτης που μιλάει στην αγορά έχει μπροστά του κάποιο
	// εμφανές πάνελ, επομένως κρίνεται άσκοπο να εμφανίσουμε επιπλέον
	// μήνυμα.

	if ((fasi !== 'ΚΟΝΤΡΑ') && isPektis && (thesi === epomenos))
	return Tsoxa;

	if (isPektis && (thesi === epomenos)) {
		Tsoxa.minimaDOM.addClass('tsoxaMinimaNotice');
		minima = 'Είναι η σειρά σας να δεχθείτε ή να αμφισβητήσετε την αγορά. Οι συμπαίκτες σας περιμένουν…';
	}

	else
	minima = 'Είναι η σειρά του παίκτη που ' + epomenos.thesiSxetikiPerigrafi(thesi) +
		' να μιλήσει στην αγορά. Παρακαλώ περιμένετε…';

	Tsoxa.minimaSetDOM(minima);
	return Tsoxa;
};

Tsoxa.minimaRefreshDOMagoraBelot = function(trapezi) {
	var isPektis, thesi, epomenos, minima;

	isPektis = ego.isPektis();
	thesi = ego.thesiGet();
	epomenos = trapezi.partidaEpomenosGet();

	if (isPektis && (thesi === epomenos)) {
		minima = 'Είναι η σειρά σας να μιλήσετε στην αγορά. Οι συμπαίκτες σας περιμένουν…';
		Tsoxa.minimaDOM.addClass('tsoxaMinimaNotice');
	}

	else
	minima = 'Είναι η σειρά του παίκτη που ' + epomenos.thesiSxetikiPerigrafi(thesi) +
	' να μιλήσει στην αγορά. Παρακαλώ περιμένετε…';

	Tsoxa.minimaDOM.
	addClass('tsoxaMinimaBelotAgora' + (isPektis ? 'Pektis' : 'Theatis') +
		ego.mapThesi(trapezi.partidaDealerGet())).
	text(minima);

	return Tsoxa;
};

Tsoxa.minimaResetDOM = function(svisimo) {
	if (svisimo)
	Tsoxa.minimaDOM.
	finish().
	fadeOut(svisimo, function() {
		Tsoxa.minimaResetDOM();
	});

	else
	Tsoxa.minimaDOM.
	empty().
	removeClass().
	css('display', 'block');

	return Tsoxa;
};

Tsoxa.minimaSetDOM = function(html) {
	Tsoxa.minimaDOM.html(html);
	return Tsoxa;
};

Tsoxa.thesiWalk = function(callback) {
	Vida.thesiWalk(function(thesi) {
		callback(thesi);
	});

	return Tsoxa;
};

Tsoxa.addTheatisDOM = function(pektis) {
	var login, dom;

	Tsoxa.removeTheatisDOM(pektis);

	if (pektis instanceof Sinedria)
	pektis = skiniko.skinikoPektisGet(pektis.sinedriaPektisGet());

	else if (typeof pektis === 'string')
	pektis = skiniko.skinikoPektisGet(pektis);

	else if (!(pektis instanceof Pektis))
	pektis = undefined;

	if (!pektis)
	return Tsoxa;

	login = pektis.pektisLoginGet();

	dom = $('<div>').
	data('pektis', login).
	oplismosProfinfo().
	prependTo(Arena.theatisAreaDOM);

	Tsoxa.refreshTheatisDOM(dom);
	return Tsoxa;
};

Tsoxa.refreshTheatisDOM = function(dom) {
	var login, klasi, pektis;

	login = dom.data('pektis');

	klasi = {
		box: 'tsoxaTheatis theatis oplismosProfinfo',
		onoma: 'tsoxaTheatisOnoma',
	};
	Arena.pektisKlasiSet(login, klasi);

	pektis = skiniko.skinikoPektisGet(login);
	if (pektis && pektis.pektisIsApasxolimenos())
	klasi.box += ' apasxolimenos';

	dom.
	removeClass().
	addClass(klasi.box).
	empty().
	append($('<div>').addClass(klasi.onoma).text(login));

	return Tsoxa;
};

Tsoxa.removeTheatisDOM = function(pektis, animation) {
	Tsoxa.locateTheatisDOM(pektis, function(dom) {
		if (animation)
		dom.
		finish().
		fadeOut(function() {
			$(this).remove();
		});

		else
		dom.remove();
	});

	return Tsoxa;
};

// H function "locateTheatisDOM" δέχεται ως παράμετρο έναν παίκτη (παίκτη,
// συνεδρία, login name) και επιχειρεί να εντοπίσει τον συγκεκριμένο
// παίκτη στο χώρο θεατών τσόχας (είναι ο χώρος κάτο από την τσόχα).
// Εφόσον εντοπιστεί το σχετικό DOM element, θα κληθεί function που
// περνάμε ως δεύτερη παράμετρο με παραμέτρους το ίδο το DOM element
// και τον παίκτη που περάσαμε ως παράμετρο.

Tsoxa.locateTheatisDOM = function(pektis, callback) {
	if (!pektis)
	return Tsoxa;

	if (pektis instanceof Pektis)
	pektis = pektis.pektisLoginGet();

	else if (pektis instanceof Sinedria)
	pektis = pektis.sinedriaPektisGet();

	if (!pektis)
	return Tsoxa;

	Arena.theatisAreaDOM.
	children('.tsoxaTheatis').
	each(function() {
		if ($(this).data('pektis') !== pektis)
		return true;

		callback($(this), pektis);
		return false;
	});

	return Tsoxa;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Tsoxa.efoplismos = function() {
	var trapezi, proc;

	Tsoxa.reminder.clear();

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Tsoxa;

	if (trapezi.trapeziIsAkirosi())
	return Tsoxa;

	if (ego.oxiPektis())
	return Tsoxa;

	if (Debug.flagGet('epomenosCheck') &&
	(ego.thesiGet() !== trapezi.partidaEpomenosGet()))
	return Tsoxa;

	proc = 'efoplismos' + trapezi.partidaFasiGet();
	if (!(typeof Tsoxa[proc] === 'function'))
	return Tsoxa;

	Tsoxa[proc].call(trapezi);

	if (Debug.flagGet('epomenosReminderOff'))
	return Tsoxa;

	Tsoxa.reminder.timer = setTimeout(function() {
		Tsoxa.reminder.notice();
	}, 8000);

	return Tsoxa;
};

Tsoxa.afoplismos = function() {
	Tsoxa.reminder.clear();

	Arena.tsoxaDOM.
	find('.efoplismos').
	remove();

	return Tsoxa;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Tsoxa.reminder = {};

Tsoxa.reminder.clear = function() {
	if (!Tsoxa.reminder.timer)
	return Tsoxa.reminder;

	clearTimeout(Tsoxa.reminder.timer);
	delete Tsoxa.reminder.timer;

	return Tsoxa.reminder;
};

Tsoxa.reminder.notice = function(count) {
	var ixos, entasi, epomeno;

	if (count === undefined)
	count = 1;

	Tsoxa.reminder.clear();

	switch (count) {
	case 1:
		ixos = 'notice/kanarini.ogg';
		entasi = 1;
		epomeno = 10000;
		break;
	case 2:
		ixos = 'notice/kabanaki.ogg';
		entasi = 1;
		epomeno = 10000;
		break;
	default:
		ixos = 'korna/dout2.ogg';
		entasi = 5;
		epomeno = 0;
		break;
	}

	Selida.ixos.play(ixos, entasi);
	if (!epomeno)
	return Tsoxa;

	Tsoxa.reminder.timer = setTimeout(function() {
		Tsoxa.reminder.notice(count + 1);
	}, epomeno);

	return Tsoxa;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.trapeziOnomaThesis = function(thesi) {
	var onoma;

	onoma = this.trapeziPektisGet(thesi);
	if (onoma)
	return onoma;

	switch (ego.mapThesi(thesi)) {
	case 1:
		return 'ΝΟΤΟΣ';
	case 2:
		return 'ΑΝΑΤΟΛΗ';
	case 3:
		return 'ΒΟΡΡΑΣ';
	case 4:
		return 'ΔΥΣΗ';
	}

	return '??????';
};
