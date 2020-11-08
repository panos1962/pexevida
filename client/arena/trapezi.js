Trapezi.prototype.trapeziCreateDOM = function() {
	var dom;

	dom = this.trapeziGetDOM();
	if (dom) {
		dom.empty();
		return this;
	}

	this.DOM = $('<div>').
	addClass('trapezi').
	data('trapezi', this).
	on('click', function(e) {
		$(this).
		data('trapezi').
		trapeziEpilogi({
			clickEvent: e,
		});
	});

	return this;
};

Trapezi.prototype.trapeziGetDOM = function() {
	return this.DOM;
};

Trapezi.prototype.trapeziRefreshDOM = function() {
	var dom;

	dom = this.trapeziGetDOM();
	if (!dom)
	return this;

	this.kodikosDOM = $('<div>').
	attr('title', 'Κωδικός τραπεζιού');
	this.trapeziKodikosRefreshDOM();

	this.kafenioDOM = $('<div>').
	addClass('trapeziKafenio').
	attr('title', 'Κωδικός καφενείου');
	this.trapeziKafenioRefreshDOM();

	this.optionsDOM = $('<div>').
	addClass('trapeziOptions');
	this.trapeziOptionsRefreshDOM();

	this.pektesDOM = $('<div>').
	addClass('trapeziPektes').
	append($('<div>').addClass('trapeziX').html('&times;'));

	this.pektisDOM = {};
	this.trapeziThesiWalk(function(thesi) {
		this.pektisDOM[thesi] = $('<div>').
		addClass('trapeziPektis pektis trapeziPektis' + thesi).
		oplismosProfinfo().
		appendTo(this.pektesDOM);
	});
	this.trapeziPektesRefreshDOM();

	this.theatesDOM = $('<div>').
	addClass('trapeziTheatisArea');
	this.trapeziTheatesRefreshDOM();

	dom.
	empty().
	append(this.kodikosDOM).
	append(this.kafenioDOM).
	append(this.optionsDOM).
	append(this.pektesDOM).
	append(this.theatesDOM);

	dom.removeClass('trapeziPrive');
	if (this.trapeziIsPrive())
	dom.addClass('trapeziPrive');

	dom.removeClass('trapeziTheasi');
	if (ego.isTrapezi(this) && ego.isTheatis())
	dom.addClass('trapeziTheasi');

	return this;
};

Trapezi.prototype.trapeziKodikosRefreshDOM = function() {
	if (!this.kodikosDOM)
	return this;

	this.kodikosDOM.
	removeClass().
	addClass('trapeziKodikos').
	text(this.trapeziKodikosGet());

	if (ego.isTrapezi(this))
	this.kodikosDOM.addClass('trapeziKodikosEpilogi');

	if (this.trapeziIsProsklisi(ego.loginGet()))
	this.kodikosDOM.addClass('trapeziKodikosProsklisi');

	return this;
};

Trapezi.prototype.trapeziKafenioRefreshDOM = function() {
	if (!this.kafenioDOM)
	return this;

	this.kafenioDOM.text(this.trapeziKafenioGet());
	return this;
};

Trapezi.prototype.trapeziOptionsRefreshDOM = function() {
	if (!this.optionsDOM)
	return this;

	this.optionsDOM.empty();

	if (this.denPeziKomeni())
	this.trapeziOptionIconPush('ikona/panel/partida/komeniOff.png', 'Δεν επιτρέπονται δηλώσεις «ΚΟΜΜΕΝΗ»');

	if (this.trapeziOxiDilosiAllow())
	this.trapeziOptionIconPush('ikona/panel/partida/dilosiOff.png', 'Δηλώσεις μέχρι την πρώτη μπάζα');

	if (this.trapeziIsVida() && this.vidaOkto())
	this.trapeziOptionIconPush('ikona/panel/partida/oktoOn.png', 'Βίδα 2, 4, 6, 8');

	if (this.trapeziIsBelot() && this.apontaOff())
	this.trapeziOptionIconPush('ikona/panel/partida/apontaOff.png', 'Δεν χαλάει με άποντα');

	if (this.trapeziIsVida())
	this.trapeziOptionIconPush('ikona/vida/vida64.png', 'Βίδα');

	else
	this.trapeziOptionIconPush('ikona/panel/belot.png', 'Μπουρλότο');

	if (this.trapeziIsPrive())
	this.trapeziOptionIconPush('prive.png', 'Πριβέ τραπέζι');

	if (this.trapeziIsIdioktito())
	this.trapeziOptionIconPush('idioktito.png', 'Ιδιόκτητο τραπέζι');

	return this;
};

Trapezi.prototype.trapeziPektesRefreshDOM = function() {
	if (!this.pektesDOM)
	return this;

	this.trapeziThesiWalk(function(thesi) {
		this.trapeziPektisRefreshDOM(thesi);
	});

	return this;
};

Trapezi.prototype.trapeziPektisRefreshDOM = function(thesi) {
	var dom, klasi, login, sinedria, pektis;

	if (!this.hasOwnProperty('pektisDOM'))
	return this;

	dom = this.pektisDOM[thesi];
	if (!dom)
	return this;

	klasi = {
		box: 'trapeziPektis trapeziPektis' + thesi + ' pektis',
		onoma: 'trapeziPektisOnoma',
	};

	dom.
	empty().
	removeData('pektis').
	removeClass().
	addClass(klasi.box);

	login = this.trapeziPektisGet(thesi);
	if (!login)
	return this;

	if (this.trapeziIsApodoxi(thesi))
	klasi.box += ' trapeziPektisApodoxi';

	sinedria = skiniko.skinikoSinedriaGet(login);
	if (!sinedria)
	klasi.box += ' offline';

	pektis = skiniko.skinikoPektisGet(login);
	if (pektis && pektis.pektisIsApasxolimenos())
	klasi.box += ' apasxolimenos';

	klasi.box += ' oplismosProfinfo';
	Arena.pektisKlasiSet(login, klasi);

	dom.
	data('pektis', login).
	addClass(klasi.box).
	append($('<div>').addClass(klasi.onoma).text(login));

	return this;
};

Trapezi.prototype.trapeziTheatesRefreshDOM = function() {
	if (!this.theatesDOM)
	return this;

	this.theatesDOM.empty();
	this.theatisDOM = {};

	this.trapeziTheatisWalk(function(login) {
		this.theatisDOM[login] = $('<div>').
		data('pektis', login).
		append($('<div>').addClass('trapeziTheatisOnoma').text(login)).
		oplismosProfinfo().
		appendTo(this.theatesDOM);

		this.trapeziTheatisRefreshDOM(login);
	});

	return this;
};

Trapezi.prototype.trapeziTheatisRefreshDOM = function(login) {
	var dom, klasi, pektis;

	if (!this.hasOwnProperty('theatisDOM'))
	return this;

	dom = this.theatisDOM[login];
	if (!dom)
	return this;

	dom.
	removeClass().
	empty();

	klasi = {
		box: 'trapeziTheatis theatis oplismosProfinfo',
		onoma: 'trapeziTheatisOnoma',
	};
	Arena.pektisKlasiSet(login, klasi);

	pektis = skiniko.skinikoPektisGet(login);
	if (pektis && pektis.pektisIsApasxolimenos())
	klasi.box += ' apasxolimenos';

	dom.
	addClass(klasi.box).
	append($('<div>').addClass(klasi.onoma).text(login));

	return this;
};

Trapezi.prototype.trapeziTheatisLocateDOM = function(pektis, callback) {
	var dom;

	if (!this.theatisDOM)
	return this;

	if (pektis instanceof Pektis)
	pektis = pektis.pektisLoginGet();

	else if (pektis instanceof Sinedria)
	pektis = pektis.sinedriaPektisGet();

	dom = this.theatisDOM[pektis];
	if (!dom)
	return this;

	callback(dom, pektis);
	return this;
};

Trapezi.prototype.trapeziTheatisRemoveDOM = function(pektis, animation) {
	var dom;

	if (pektis instanceof Pektis)
	pektis = pektis.pektisLoginGet();

	else if (pektis instanceof Sinedria)
	pektis = pektis.sinedriaPektisGet();

	dom = this.theatisDOM[pektis];
	if (!dom)
	return this;

	if (animation)
	dom.
	finish().
	fadeOut(function() {
		$(this).remove();
	});

	else
	dom.remove();

	delete this.theatisDOM[pektis];
	return this;
};

Trapezi.prototype.trapeziOptionIconPush = function(img, title) {
	if (!img.match(/[/]/))
	img = 'ikona/panel/' + img;

	this.optionsDOM.append($('<img>').attr({
		src: img,
		title: title,
	}).addClass('trapeziOptionIcon'));

	return this;
};

Trapezi.prototype.trapeziDisplayDOM = function(scroll) {
	this.
	trapeziRemoveDOM().
	trapeziCreateDOM().
	trapeziRefreshDOM().
	trapeziGetDOM().
	prependTo(Arena.trapeziAreaDOM);

	if (scroll)
	Arena.trapeziAreaDOM.scrollPano();

	return this;
};

Trapezi.prototype.trapeziRemoveDOM = function() {
	var dom;

	dom = this.trapeziGetDOM();
	if (!dom)
	return this;

	dom.remove;
	delete this.DOM;

	return this;
};

// opts:
//
//	clickEvent	Το κλικ event εφόσον υπάρχει τέτοιο (προς το παρόν
//			δεν χρησιμοποιείται).
//
//	profinfoClear	Καθαρισμός της φόρμας πληροφοριών προφίλ εφόσον
//			αλλάζει τραπέζι.

Trapezi.prototype.trapeziEpilogi = function(opts) {
	if (!opts)
	opts = {};

	if (ego.trapeziGet() === this) {
		Selida.fyi.epano("Βρίσκεστε ήδη σ' αυτό το τραπέζι");
		return this;
	}

	if (opts.profinfoKlisimo)
	Arena.profinfo.klisimo();

	Selida.skiserService('trapeziEpilogi', 'trapezi=' + this.trapeziKodikosGet()).
	done(function(rsp) {
		Selida.fyi.epano(rsp);
	}).
	fail(function(err) {
		Selida.
		skiserFail(err).
		ixos.beep();
	});

	return this;
};
