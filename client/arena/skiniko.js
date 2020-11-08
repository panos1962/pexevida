Client = {};

Client.feredataId = 0;
Client.feredataError = 0;
Client.feredataErrorMax = 5;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Skiniko.prototype.stisimo = function(delay) {
	if (delay) {
		setTimeout(function() {
			skiniko.stisimo();
		}, delay);
		return this;
	}

	Client.feredataId++;
	Selida.skiserService('skiniko', 'id=' + Client.feredataId).
	done(function(rsp) {
		var data;

		try {
			data = ('{' + rsp + '}').evalAsfales();
		} catch (e) {
			return skiniko.feredataError('Παρελήφθησαν λανθασμένα σκηνικά δεδομένα', rsp, 1000);
		}

		if (data.hasOwnProperty('error'))
		return skiniko.feredataError(data.error, rsp, 1000);

		if (!data.hasOwnProperty('id'))
		return skiniko.feredataError('Παρελήφθησαν σκηνικά δεδομένα χωρίς id', rsp, 1000);

		if (data.id < Client.feredataId)
		return skiniko.feredataError('Παρελήφθησαν παρωχημένα σκηνικά δεδομένα');

		skiniko.processFreska(data);
	}).
	fail(function(err) {
		Selida.skiserFail(err);
		skiniko.feredataError('Σφάλμα παραλαβής σκηνικών δεδομένων', 1000);
	});

	return this;
};

Skiniko.prototype.processFreska = function(data) {
	Debug.feredataResponse(data);

	this.
	skinikoReset().
	egoPrinReset().
	egoReset();

	Arena.anazitisiAreaDOM.empty();
	Arena.thamonasAreaDOM.empty();
	Arena.kafenioAreaDOM.empty();
	Arena.trapeziAreaDOM.empty();
	Arena.prosklisiAreaDOM.empty();
	Arena.sizitisiLobiDOM.empty();
	Arena.sizitisiKafenioDOM.empty();
	Arena.sizitisiTrapeziDOM.empty();
	Arena.theatisAreaDOM.empty();

	Globals.awalk(data.pektis, function(i, pektis) {
		skiniko.skinikoPektisSet(new Pektis(pektis));
	});

	ego.pektis = skiniko.skinikoPektisGet(ego.loginGet());

	Globals.walk(data.peparam, function(login, plist) {
		var pektis;

		pektis = skiniko.skinikoPektisGet(login);
		if (!pektis)
		return;

		Globals.walk(plist, function(param, timi) {
			pektis.pektisPeparamSet(param, timi);
		});
	});

	filajs.cardFamilySet(ego.pektis.pektisPeparamGet('ΤΡΑΠΟΥΛΑ'));

	Globals.walk(data.profinfo, function(login, plist) {
		var pektis;

		pektis = skiniko.skinikoPektisGet(login);
		if (!pektis)
		return;

		Globals.walk(plist, function(sxoliastis, kimeno) {
			pektis.pektisProfinfoSet(sxoliastis, kimeno);
		});
	});

	Globals.walk(data.sxesi, function(pektis, sxesi) {
		ego.pektisGet().pektisSxesiSet(pektis, sxesi);
	});

	if (data.hasOwnProperty('kafenio'))
	Globals.awalk(data.kafenio, function(i, kafenio) {
		skiniko.skinikoKafenioSet(new Kafenio(kafenio));
	});

	if (data.hasOwnProperty('diapiste'))
	Globals.awalk(data.diapiste, function(i, diapiste) {
		skiniko.skinikoDiapisteSet(new Diapiste(diapiste));
	});

	if (data.hasOwnProperty('trapezi'))
	Globals.awalk(data.trapezi, function(i, trapezi) {
		skiniko.skinikoTrapeziSet(new Trapezi(trapezi));
	});

	if (data.hasOwnProperty('dianomi'))
	Globals.awalk(data.dianomi, function(i, dianomi) {
		var trapezi;

		dianomi = new Dianomi(dianomi);
		trapezi = skiniko.skinikoTrapeziGet(dianomi.dianomiTrapeziGet());
		if (!trapezi)
		return;

		trapezi.trapeziDianomiPush(dianomi);
	});

	if (data.hasOwnProperty('prosklisi'))
	Globals.awalk(data.prosklisi, function(i, prosklisi) {
		var trapezi;

		prosklisi = new Prosklisi(prosklisi);
		trapezi = skiniko.skinikoTrapeziGet(prosklisi.prosklisiTrapeziGet());
		if (!trapezi)
		return;

		prosklisi.
		prosklisiCreateDOM().
		prosklisiRefreshDOM();

		trapezi.trapeziProsklisiSet(prosklisi);
		prosklisi.prosklisiGetDOM().
		prependTo(Arena.prosklisiAreaDOM);
	});

	data.sinedria.sort(function(s1, s2) {
		if (s1.isodos < s2.isodos)
		return -1;

		if (s1.isodos > s2.isodos)
		return 1;

		return 0;
	});

	Globals.awalk(data.sinedria, function(i, sinedria) {
		var pektis, trapezi, thesi;

		sinedria = new Sinedria(sinedria);
		pektis = sinedria.sinedriaPektisGet();
		trapezi = skiniko.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
		if (trapezi) {
			thesi = trapezi.trapeziThesiPekti(pektis);
			if (thesi)
			sinedria.
			sinedriaThesiSet(thesi).
			sinedriaSimetoxiSet('ΠΑΙΚΤΗΣ');

			else {
				thesi = sinedria.sinedriaThesiGet();
				if (Vida.oxiThesi(thesi))
				sinedria.sinedriaThesiSet(1);

				sinedria.
				sinedriaSimetoxiSet('ΘΕΑΤΗΣ');

				trapezi.trapeziTheatisSet(pektis);
			}
		}

		else
		sinedria.
		sinedriaTrapeziSet().
		sinedriaThesiSet().
		sinedriaSimetoxiSet();

		sinedria.
		sinedriaCreateDOM().
		sinedriaRefreshDOM();

		skiniko.skinikoSinedriaSet(sinedria);
		sinedria.sinedriaGetDOM().
		prependTo(Arena.thamonasAreaDOM);
	});

	ego.sinedria = skiniko.skinikoSinedriaGet(ego.loginGet());

	if (data.hasOwnProperty('kafenio'))
	Globals.awalk(data.kafenio, function(i, kafenio) {
		kafenio = skiniko.skinikoKafenioGet(kafenio.kodikos);
		if (!kafenio)
		return;

		kafenio.
		kafenioCreateDOM().
		kafenioRefreshDOM();

		skiniko.skinikoKafenioSet(kafenio);
		kafenio.kafenioGetDOM().
		appendTo(Arena.kafenioAreaDOM);
	});

	if (data.hasOwnProperty('sizitisi'))
	Globals.awalk(data.sizitisi, function(i, sizitisi) {
		sizitisi = skiniko.skinikoSizitisiSet(new Sizitisi(sizitisi));
	});

	this.skinikoSizitisiWalk(function() {
		this.
		sizitisiCreateDOM().
		sizitisiRefreshDOM();

		this.sizitisiGetDOM().
		appendTo(Arena.sizitisiLobiDOM);
	}, 1);
	Arena.sizitisiLobiDOM.scrollTop(Arena.sizitisiLobiDOM.prop('scrollHeight'));

	this.
	egoSet().
	tsoxaTheatisRefreshDOM().
	neoteraKsizitisi(data).
	neoteraTsizitisi(data).
	neoteraEnergia(data);

	if (Client.feredataError) {
		Selida.fyi.pano('Αποκαταστάθηκαν σφάλματα ενημέρωσης σκηνικού');
		Client.feredataError = 0;
	}

	return this;
};

Skiniko.prototype.metavoles = function() {
	Client.feredataId++;
	Selida.skiserService('metavoles', 'id=' + Client.feredataId).
	done(function(rsp) {
		var data;

		switch (rsp) {
		case '=':
			skiniko.metavoles();
			return;
		case '~':
			return;
		case '-':
			self.location = Selida.server + 'error?minima=' +
				('Διαπιστώθηκαν πολλαπλές συνεδρίες για τον χρήστη ' + Selida.session.pektis).uri();
			return;
		case '?':
			skiniko.stisimo();
			return;
		}

		try {
			data = ('{' + rsp + '}').evalAsfales();
		} catch (e) {
			
			return skiniko.feredataError('Παρελήφθησαν λανθασμένες μεταβολές σκηνικών δεδομένων', rsp, 1000);
		}

		if (data.hasOwnProperty('error'))
		return skiniko.feredataError(data.error, rsp, 1000);

		if (!data.hasOwnProperty('id'))
		return skiniko.feredataError('Παρελήφθησαν μεταβολές σκηνικών δεδομένων χωρίς id', rsp, 1000);

		if (data.id < Client.feredataId)
		return skiniko.feredataError('Παρελήφθησαν παρωχημένες μεταβολές σκηνικών δεδομένων');

		skiniko.processMetavoles(data);
	}).
	fail(function(err) {
		Selida.skiserFail(err);
		skiniko.feredataError('Σφάλμα ενημέρωσης σκηνικών δεδομένων', 1000);
	});

	return this;
};

Skiniko.prototype.processMetavoles = function(data) {
	Debug.feredataResponse(data);

	skiniko.
	egoPrinSet().
	neoteraKinisi(data).
	neoteraKsizitisi(data).
	neoteraTsizitisi(data);

	if (ego.trapeziGet() === ego.trapeziPrinGet())
	skiniko.neoteraEnergiaOnline(data, 0);

	else
	skiniko.neoteraEnergia(data);

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η μέθοδος "feredataError" χρησιμοποιείται σε περίπτωση αποτυχίας παραλαβής
// σκηνικών δεδομένων. Ως πρώτη παράμετρο δέχεται ένα μήνυμα σφάλματος το οποίο
// εμφανίζεται στο επάνω μέρος της σελίδας, ενώ μπορούν να ακολουθούν μηνύματα
// που εκτυπώνονται στο standard error. Αν κάποια παράμετρος είναι αριθμητική,
// τότε αυτή υποδηλώνει χρόνο σε milliseconds κατά τον οποίο θα γίνει εκ νέου
// απόπειρα παραλαβής πλήρων σκηνικών δεδομένων.
//
// Αν παρατηρηθούν πολλά διαδοχικά σφάλματα κατά την πραλαβή δεδομένων, τότε το
// πρόγραμμα σταματά.

Skiniko.prototype.feredataError = function() {
	var msg, i, delay;

	if (Client.feredataError++ > Client.feredataErrorMax) {
		msg = 'Διαδοχικά σφάλματα ενημέρωσης σκηνικού. Δοκιμάστε αργότερα…';

		if (ego.isDeveloper())
		Globals.fatal(msg);

		if (Debug.flagGet('development'))
		Globals.fatal(msg);

		// Ακυρώνουμε το session cookie για το όνομα του παίκτη.

		Selida.ajax('misc/setCookie', 'tag=pektis').
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			console.error(rsp);
		}).
		fail(function(err) {
			Selida.ajaxFail(err);
		});

		self.location = Selida.server + 'error?minima=' + msg.uri();
		return this;
	}

	msg = '';
	for (i = 1; i < Client.feredataError; i++)
	msg += '&bullet;';
	msg += arguments[0];

	Selida.
	fyi.epano(msg).
	fyi.panoAristera();

	// Διατρέχουμε τις υπόλοιπες παραμέτρους προκειμένου να εντοπίσουμε
	// τυχόν άλλα δεδομένα τα οποία θα εκτυπωθούν στο standard error,
	// ή χρονικά διαστήματα επανάληψης του αιτήματος.

	delay = null;
	for (i = 1; i < arguments.length; i++) {
		switch (typeof arguments[i]) {
		case 'number':
			delay = arguments[i];
			break;
		default:
			console.error(arguments[i]);
			break;
		}
	}

	// Αν εντοπίστηκε παράμετρος χρόνου, δρομολογούμε νέο αίτημα παραλαβής
	// πλήρων σκηνικών δεδομένων.

	if (delay)
	this.stisimo(delay);

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Skiniko.prototype.postRefresh = function() {
	skiniko.
	egoSet().
	egoRefreshDOM().
	titlosRefresh().
	panelRefresh().
	metavoles();

	return this;
};

Skiniko.prototype.titlosRefresh = function() {
	Arena.titlosRefresh();
	return this;
};

Skiniko.prototype.panelRefresh = function() {
	Arena.mpanel.bpanelRefresh();
	Arena.kpanel.bpanelRefresh();
	Arena.tpanel.bpanelRefresh();
	Arena.cpanel.bpanelRefresh();
	Arena.zpanel.bpanelRefresh();

	return this;
};

Skiniko.prototype.skinikoPektisRefreshDOM = function(pektis) {
	var login, apasxolimenos;

	if (pektis instanceof Pektis)
	login = pektis.pektisLoginGet();

	else if (pektis instanceof Sinedria)
	login = sinedria.sinedriaPektisGet();

	else
	login = pektis;

	pektis = this.skinikoPektisGet(login);
	apasxolimenos = (pektis ? pektis.pektisIsApasxolimenos() : false);

	this.
	skinikoSinedriaWalk(function() {
		if (this.sinedriaPektisGet() === login)
		this.sinedriaRefreshDOM();
	}).
	skinikoTrapeziWalk(function() {
		this.trapeziThesiWalk(function(thesi) {
			if (this.trapeziPektisGet(thesi) !== login)
			return;

			this.trapeziPektisRefreshDOM(thesi);

			if (ego.oxiTrapezi(this))
			return;

			Tsoxa.pektisRefreshDOM(thesi);
		});

		this.trapeziTheatisWalk(function(theatisLogin) {
			if (theatisLogin !== login)
			return;

			this.trapeziTheatisRefreshDOM(theatisLogin);

			if (ego.oxiTrapezi(this))
			return;

			Tsoxa.locateTheatisDOM(login, function(dom) {
				Tsoxa.refreshTheatisDOM(dom);
			});
		});
	});

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Skiniko.prototype.neoteraKsizitisi = function(data) {
	var kafenioTora, kafenioPrin;

	kafenioTora = ego.kafenioGet();
	kafenioPrin = ego.kafenioPrinGet();

	if (kafenioTora !== kafenioPrin)
	Arena.sizitisiKafenioDOM.empty();

	if (!kafenioTora)
	return this;

	if (kafenioTora !== kafenioPrin) {
		kafenioTora.kafenioSizitisiWalk(function() {
			this.sizitisiGetDOM().
			appendTo(Arena.sizitisiKafenioDOM);
		});

		if (!Arena.sizitisiKafenioDOM.data('pagomeni'))
		Arena.sizitisiKafenioDOM.scrollKato();
	}

	if (data.hasOwnProperty('ksizitisi'))
	this.neoteraSizitisi(kafenioTora, data.ksizitisi, Arena.sizitisiKafenioDOM);

	return this;
};

Skiniko.prototype.neoteraTsizitisi = function(data) {
	var trapeziTora, trapeziPrin;

	trapeziTora = ego.trapeziGet();
	trapeziPrin = ego.trapeziPrinGet();

	if (trapeziTora !== trapeziPrin)
	Arena.sizitisiTrapeziDOM.empty();

	if (!trapeziTora)
	return this;

	if (trapeziTora !== trapeziPrin)
	trapeziTora.trapeziSizitisiWalk(function() {
		this.sizitisiGetDOM().
		appendTo(Arena.sizitisiTrapeziDOM);
	});

	if (data.hasOwnProperty('tsizitisi'))
	this.neoteraSizitisi(trapeziTora, data.tsizitisi, Arena.sizitisiTrapeziDOM);

	return this;
};

Skiniko.prototype.neoteraSizitisi = function(traka, slist, dom) {
	var grafon, proepi, egoLogin;

	if (slist.length <= 0)
	return this;

	egoLogin = ego.loginGet();
	grafon = false;
	Globals.awalk(slist.sort(function(s1, s2) {
		return s1.kodikos - s2.kodikos;
	}), function(i, sizitisi) {
		sizitisi = new Sizitisi(sizitisi).
		sizitisiCreateDOM().
		sizitisiRefreshDOM();
		traka.sizitisiSet(sizitisi);

		sizitisi.sizitisiGetDOM().
		appendTo(dom);

		if (!grafon)
		grafon = (sizitisi.sizitisiPektisGet() === egoLogin);
	});

	proepi = dom.children('.sizitisiProepiskopisi');
	if (grafon) proepi.remove();
	else proepi.detach().appendTo(dom);

	if (!dom.data('pagomeni'))
	dom.scrollKato();

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Sinedria.prototype.sinedriaGetDOM = function() {
	return this.DOM;
};

Sinedria.prototype.sinedriaCreateDOM = function() {
	if (this.hasOwnProperty('DOM'))
	return this;

	this.DOM = $('<div>').
	data('sinedria', this).
	data('pektis', this.sinedriaPektisGet()).
	oplismosProfinfo();

	return this;
};

Sinedria.prototype.sinedriaRefreshDOM = function() {
	var dom, login, klasi, pektis;

	dom = this.sinedriaGetDOM();
	if (!dom)
	return this;

	login = this.sinedriaPektisGet();

	klasi = {
		box: 'thamonas oplismosProfinfo',
		onoma: 'thamonasOnoma',
	};
	Arena.pektisKlasiSet(login, klasi);

	dom.
	empty().
	removeClass().
	addClass(klasi.box).
	append($('<div>').addClass(klasi.onoma).text(login));

	if (this.sinedriaIsTheatis())
	dom.addClass('theatis');

	else if (this.sinedriaIsPektis())
	dom.addClass('pektis pezon');

	else
	dom.addClass('pektis');

	pektis = skiniko.skinikoPektisGet(login);

	if (!pektis)
	return this;

	if (pektis.pektisIsApasxolimenos())
	dom.addClass('apasxolimenos');

	if (pektis.pektisAgapimenoIsBelot())
	dom.append($('<img>').
	addClass('pektisAgapimenoIcon').
	attr({
		title: 'Προτιμά το μπουρλότο',
		src: 'ikona/panel/belot.png',
	}));

	return this;
};

Arena.pektisKlasiSet = function(pektis, klasi) {
	if (!klasi.hasOwnProperty('box'))
	klasi.box = '';

	if (!klasi.hasOwnProperty('onoma'))
	klasi.onoma = '';

	if (ego.isTeri(pektis)) {
		klasi.box += ' sxesiBoxTeri';
		klasi.onoma += ' sxesiOnomaTeri';
	}

	else if (ego.isFilos(pektis)) {
		klasi.box += ' sxesiBoxFilos';
		klasi.onoma += ' sxesiOnomaFilos';
	}

	else if (ego.isApoklismenos(pektis)) {
		klasi.box += ' sxesiBoxApoklismenos';
		klasi.onoma += ' sxesiOnomaApoklismenos';
	}

	return Arena;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Kafenio.prototype.kafenioGetDOM = function() {
	return this.DOM;
};

Kafenio.prototype.kafenioCreateDOM = function() {
	if (this.hasOwnProperty('DOM'))
	return this;

	this.DOM = $('<div>').
	data('kafenio', this);

	return this;
};

Kafenio.prototype.kafenioRefreshDOM = function() {
	var kafenio = this, dom, optsDOM, kodikos, onomasia, dimiourgos, prive;

	dom = this.kafenioGetDOM();
	if (!dom)
	return this;

	kodikos = this.kafenioKodikosGet();

	onomasia = this.kafenioOnomasiaGet();
	if (!onomasia)
	onomasia = kodikos;

	dimiourgos = this.kafenioDimiourgosGet();
	prive = this.kafenioIsPrive();

	dom.
	empty().
	removeClass().
	addClass('kafenio').
	append(optsDOM = $('<div>').addClass('kafenioOptions')).
	append($('<div>').addClass('kafenioOnomasia').text(onomasia)).
	append($('<div>').addClass('kafenioKodikos').text(kodikos)).
	append($('<div>').addClass('kafenioOwner').text(dimiourgos)).
	off('mouseenter').on('mouseenter', function() {
		var desc;

		desc = 'καφενείο <span class="entona prasino">' + onomasia + '</span>, ' +
			'κωδικός <span class="entona prasino">' + kodikos + '</span>, ' +
			'by <span class="entona prasino">' + dimiourgos + '</span>';

		if (prive)
		desc += ' (<span class="kokino">πριβέ</span>)';

		Selida.fyi.kato(desc, 0);
	}).
	off('mouseleave').on('mouseleave', function() {
		Selida.fyi.kato();
	}).
	off('click').on('click', function(e) {
		kafenio.kafenioEpilogi(e);
	});

	if (ego.isKafenio(kafenio))
	dom.addClass('kafenioTrexon');

	if (prive) {
		dom.addClass('kafenioPrive');
		this.kafenioOptionPushDOM('prive.png', 'Πριβέ', optsDOM);
		if (this.kafenioOxiProsvasi(ego.loginGet()))
		dom.addClass(ego.isDiaxiristis() ? 'kafenioAvato' : 'kafenioAorato');
	}

	return this;
};

Kafenio.prototype.kafenioOptionPushDOM = function(img, title, dom) {
	dom.
	append($('<img>').
	addClass('kafenioOptionIcon').
	attr({
		src: 'ikona/panel/prive.png',
		title: title,
	}));

	return this;
};

Kafenio.prototype.kafenioEpilogi = function(e) {
	if (this.kafenioOxiProsvasi(ego.loginGet())) {
		Selida.
		fyi.epano('Δεν έχετε πρόσβαση στο καφενείο ' + this.kafenioKodikosGet()).
		ixos.beep();
		return this;
	}

	if (ego.kafenioGet() === this) {
		Selida.fyi.epano("Βρίσκεστε ήδη σ' αυτό το καφενείο");
		return this;
	}

	Selida.skiserService('kafenioEpilogi', 'kafenio=' + this.kafenioKodikosGet()).
	done(function(rsp) {
		Selida.fyi.epano(rsp);
	}).
	fail(function(err) {
		Selida.skiserFail(err);
	});

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.prosklisiSetup = function() {
	Selida.ofelimoDOM.
	on('mouseenter', '.prosklisi', function(e) {
		var prosklisi, epidosi;

		prosklisi = $(this).data('prosklisi');
		if (!prosklisi)
		return;

		epidosi = prosklisi.prosklisiEpidosiGet();
		if (!epidosi)
		return;

		epidosi = Globals.poteOra(epidosi - Selida.timeDif);
		$(this).append($('<div>').addClass('prosklisiEpidosi').text(epidosi));
	}).
	on('mouseleave', '.prosklisi', function(e) {
		$(this).children('.prosklisiEpidosi').remove();
	}).
	on('mousedown', '.prosklisi', function(e) {
		$(this).children('.prosklisiEpidosi').css('display', 'none');
	}).
	on('mouseup', '.prosklisi', function(e) {
		$(this).children('.prosklisiEpidosi').css('display', 'block');
	});

	return Arena;
};

Prosklisi.prototype.prosklisiGetDOM = function() {
	return this.DOM;
};

Prosklisi.prototype.prosklisiCreateDOM = function() {
	if (this.hasOwnProperty('DOM'))
	return this;

	this.DOM = $('<div>').
	data('prosklisi', this);

	return this;
};

Prosklisi.prototype.prosklisiRefreshDOM = function() {
	var dom, del, trapeziKodikos, trapezi, apo, pros, epidosi;

	dom = this.prosklisiGetDOM();
	if (!dom)
	return this;

	dom.
	removeData('trapezi').
	empty().
	off();

	trapeziKodikos = this.prosklisiTrapeziGet();
	trapezi = skiniko.skinikoTrapeziGet(trapeziKodikos);
	if (!trapezi)
	return this;

	apo = this.prosklisiApoGet();
	pros = this.prosklisiProsGet();
	epidosi = this.prosklisiEpidosiGet();

	del = $('<img>').addClass('prosklisiDeleteIcon').
	on('click', function(e) {
		var prosklisiDOM, prosklisi;

		e.stopPropagation();

		prosklisiDOM = $(this).parent();
		prosklisi = prosklisiDOM.data('prosklisi');
		if (!prosklisi)
		return;

		Selida.skiserService('prosklisiDiagrafi',
			'trapezi=' + prosklisiDOM.data('trapezi'),
			'apo=' + prosklisi.prosklisiApoGet().uri(),
			'pros=' + prosklisi.prosklisiProsGet().uri()).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
		}).
		fail(function(err) {
			Selida.skiserFail(err);
		});
	});

	dom.
	data('trapezi', trapeziKodikos).
	empty().
	removeClass().
	addClass('prosklisi').
	append(del);

	if (trapezi.trapeziIsVida())
	dom.append($('<img>').attr('src', 'ikona/vida/vida32.png').addClass('prosklisiPexnidiIcon'));

	else
	dom.append($('<img>').attr('src', 'ikona/panel/belot.png').addClass('prosklisiPexnidiIcon'));

	if (pros.oxiEgo()) {
		dom.
		append($('<div>').addClass('prosklisiPros').text(pros));

		del.attr({
			title: 'Ανάκληση',
			src: 'ikona/misc/Xgreen.png',
		});
	}

	else {
		dom.
		addClass('prosklisiIserxomeni').
		append($('<div>').addClass('prosklisiApo').text(apo)).
		on('click', function(e) {
			var prosklisiDOM = $(this), prosklisi;

			e.stopPropagation();

			prosklisi = $(this).data('prosklisi');
			if (!prosklisi)
			return;

			Selida.skiserService('prosklisiApodoxi',
				'trapezi=' + prosklisiDOM.data('trapezi'),
				'apo=' + prosklisi.prosklisiApoGet().uri(),
				'pros=' + prosklisi.prosklisiProsGet().uri()).
			done(function(rsp) {
				Selida.fyi.epano(rsp);
			}).
			fail(function(err) {
				Selida.skiserFail(err);
			});
		});

		del.attr({
			title: 'Απόρριψη',
			src: 'ikona/misc/Xred.png',
		});
	}

	dom.
	append($('<div>').addClass('prosklisiTrapezi').text(trapeziKodikos));

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Debug.feredataResponse = function(data) {
	var i;

	for (i in data) {
		switch (i) {
		case 'kinisi':
			Debug.feredataResponseKinisi(data.kinisi);
			break;
		case 'id':
			break;
		default:
			console.log('\t' + i, data[i]);
			break;
		}
	}

	return Debug;
};

Debug.feredataResponseKinisi = function(kinisi) {
	Globals.awalk(kinisi, function(i, kinisi) {
		console.log('\t%c%s', 'color: blue;', kinisi.idos, kinisi.data);
	});

	return Debug;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Skiniko.prototype.neoteraKinisi = function(data) {
	var kinisi, i;

	if (!data.hasOwnProperty('kinisi'))
	return this;

	kinisi = data.kinisi;
	for (i = 0; i < kinisi.length; i++) {
		this.
		skinikoKinisiProcess(kinisi[i]).
		egoSet();
	}

	return this;
};

Skiniko.prototype.neoteraEnergia = function(data) {
	var tlist = {};

	if (!data.hasOwnProperty('energia'))
	return this.postRefresh();

	Globals.awalk(data.energia, function(i, energia) {
		var trapeziKodikos, trapezi;

		energia = new Energia(energia);

		trapeziKodikos = energia.energiaTrapeziGet();
		trapezi = skiniko.skinikoTrapeziGet(trapeziKodikos);
		if (!trapezi) return;

		trapezi.trapeziEnergiaPush(energia);
		tlist[trapeziKodikos] = trapezi;
	});

	Globals.walk(tlist, function(kodikos, trapezi) {
		trapezi.partidaReplay();
	});

	return this.postRefresh();
};

Skiniko.prototype.neoteraEnergiaOnline = function(data, cursor) {
	var trapezi;

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return this.postRefresh();

	if (!data.hasOwnProperty('energia'))
	return this.postRefresh();

	if (cursor >= data.energia.length)
	return this.postRefresh();

	if (cursor > 0)
	Tsoxa.refreshDOM();

	trapezi.trapeziEnergiaOnline(new Energia(data.energia[cursor]), function(energia) {
		this.
		trapeziEnergiaPush(energia).
		partidaReplay();

		skiniko.neoteraEnergiaOnline(data, cursor + 1);
	});

	return this;
};

Trapezi.prototype.trapeziEnergiaOnline = function(energia, callback) {
	var proc;

	proc = 'trapeziEnergiaOnline' + energia.energiaIdosGet();

	if (typeof this[proc] === 'function')
	this[proc](energia, callback);

	else
	callback.call(this, energia);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η μέθοδος "tsoxaTheatisRefreshDOM" επαναδιαμορφώνει την περιοχή θεατών στο DOM.
// Μιλάμε για την περιοχή θεατών της τρέχουσας παρτίδας (κάτω από την τσόχα).

Skiniko.prototype.tsoxaTheatisRefreshDOM = function() {
	var trapezi;

	// Καθαρίζουμε την περιοχή θεατών τσόχας.

	Arena.theatisAreaDOM.empty();

	// Αν δεν είμαστε σε κάποιο τραπέζι, προφανώς δεν θα εμφανίσουμε
	// θεατές.

	// XXX
	// Μην επιχειρήσετε να πάρετε το τραπέζι του παίκτη με την function
	// "ego.trapeziGet", γιατί αυτό μπορεί να μην έχει ακόμη ενημερωθεί.

	trapezi = this.skinikoTrapeziGet(ego.sinedriaGet().sinedriaTrapeziGet());
	if (!trapezi)
	return this;

	// Είμαστε σε κάποιο τραπέζι, επομένως διατρέχουμε τους θεατές
	// του τραπεζιού και προσθέτουμε τα σχετικά DOM elements στο
	// χώρο των θεατών τσόχας.

	trapezi.trapeziTheatisWalk(function(login) {
		Tsoxa.addTheatisDOM(login);
	});

	return this;
};
