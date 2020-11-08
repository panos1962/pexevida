// XXX
// Avoid minification warning about "ego"

var ego;

Arena.sizitisi = {};

Arena.sizitisi.zebraPaleta = [
	'#B45F04',
	'#9E3F70',
	'#006600',
	'#8A0808',
	'#084B8A',
	'#CD5C5C',
	'#663300',
	'#D52A00',
	'#666699',
	'#FF8400',
	'#669199',
	'#7AB404',
	'#7A04B4',
	'#777EFD',
	'#B29B00',
	'#387965',
	'#2B4100',
	'#A5B236',
];

Arena.sizitisi.zebraIndex = Arena.sizitisi.zebraPaleta.length;

Arena.sizitisi.zebraXroma = {};

Arena.sizitisi.setup = function() {
	Selida.ofelimoDOM.
	on('mouseenter', '.sizitisi', function(e) {
		var sizitisi, pote;

		$(this).addClass('sizitisiEpilogi');

		sizitisi = $(this).data('sizitisi');
		if (!sizitisi)
		return;

		pote = sizitisi.sizitisiPoteGet();
		if (!pote)
		return;

		pote = Globals.poteOra(pote - Selida.timeDif);
		$(this).append($('<div>').addClass('sizitisiPote').text(pote));
	}).
	on('mouseleave', '.sizitisi', function(e) {
		$(this).
		removeClass('sizitisiEpilogi').
		children('.sizitisiPote').remove();
	}).
	on('mousedown', '.sizitisi', function(e) {
		$(this).
		children('.sizitisiPote').css('display', 'none');
	}).
	on('mouseup', '.sizitisi', function(e) {
		$(this).
		children('.sizitisiPote').css('display', 'block');
	});

	return Arena;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Sizitisi.prototype.sizitisiGetDOM = function() {
	return this.DOM;
};

Sizitisi.prototype.sizitisiCreateDOM = function() {
	if (this.hasOwnProperty('DOM'))
	return this;

	this.DOM = $('<div>');
	return this;
};

Sizitisi.prototype.sizitisiRefreshDOM = function(online) {
	var pektis, pote, dom, pektisDOM, sxolioDOM, xroma;

	pektis = this.sizitisiPektisGet();
	pote = this.sizitisiPoteGet();

	dom = this.sizitisiGetDOM();

	dom.
	data('sizitisi', this).
	empty().
	removeClass().
	addClass('sizitisi').
	append(pektisDOM = $('<div>').addClass('sizitisiPektis').text(pektis)).
	append(sxolioDOM = $('<div>').addClass('sizitisiSxolio'));

	if (pektis.isEgo()) {
		pektisDOM.addClass('sizitisiPektisEgo');
		xroma = '#144C88';
	}
	else {
		xroma = Arena.sizitisi.zebraXroma[pektis];
		if (!xroma) {
			xroma = Arena.sizitisi.zebraPaleta
			[Arena.sizitisi.zebraIndex++ % Arena.sizitisi.zebraPaleta.length];
			Arena.sizitisi.zebraXroma[pektis] = xroma;
		}
	}
	pektisDOM.css('color', xroma);

	this.sizitisiSxolioExpand(sxolioDOM, online);
	return this;
};

Sizitisi.prototype.sizitisiSxolioExpand = function(dom, online) {
	var sxolio, tmima, i, lexi, j;

	sxolio = this.sizitisiSxolioGet();
	tmima = sxolio.split('^');

	dom.empty();

	switch (tmima[0]) {

	// Αν το πρώτο πεδίο του σχολίου είναι "FP" τότε πρόκειται για τα φύλλα της
	// προηγούμενης διανομής του παίκτη.

	case 'FP':
		try {
			for (i = 1; i < tmima.length; i++) {
				if (tmima[i].match(/^E[0-9]+:[0-9]+$/)) {
					Arena.sizitisi.emoticonAppend(dom, tmima[i]);
					continue;
				}

				dom.
				append(new filajsHand(tmima[i]).
				sort().
				cardWalk(function(filo) {
					this.
					widthSet(70).
					domRefresh();
				}).
				domRefresh().
				domGet()).
				append(' ');
			}
		} catch (e) {}
		return this;

	// Αν το πρώτο πεδίο του σχολίου είναι "MV[KT]" τότε πρόκειται για έναρξη
	// μολυβιού.

	case 'MVT':
	case 'MVK':
		Arena.sizitisi.moliviEnarxi(this, dom);
		return this;

	// Αν το πρώτο πεδίο του σχολίου είναι "FC" τότε πρόκειται για funchat
	// σχόλιο και σ' αυτή την περίπτωση το δεύτερο πεδίο πρέπει να είναι
	// το id του funchat item.

	case 'FC':
		Sizitisi.funchatAppend(dom, tmima[1], online);
		return this;

	// Αν το πρώτο πεδίο του σχολίου είναι "KN" τότε πρόκειται για κόρνα από
	// κάποιον παίκτη του τραπεζιού.

	case 'KN':
		Arena.sizitisi.kornaAppend(dom);
		return this;
	}

	for (i = 0; i < tmima.length; i++) {
		if (tmima[i].match(/^E[0-9]+:[0-9]+$/)) {
			Arena.sizitisi.emoticonAppend(dom, tmima[i]);
			continue;
		}

/*
		if (tmima[i].match(/^http:\/\/youtu\.be\//)) {
			Sizitisi.youtubeAppend(dom, tmima[i]);
			continue;
		}

		if (tmima[i].match(/^https?:\/\/.*\.(png|jpg|gif|jpeg)[-+]*$/i)) {
			Sizitisi.ikonaAppend(dom, tmima[i]);
			continue;
		}
*/

		//if (tmima[i].match(/^https?:\/\/.*/i)) {
/*
			Sizitisi.sindesmosAppend(dom, tmima[i]);
			continue;
		}
*/

		if (tmima[i] === '~') {
			dom.append($('<br />'));
			continue;
		}

		sxolio = tmima[i].replace(/</g, '&lt;');
		lexi = sxolio.split(/[ ]/);
		Arena.sizitisi.lexiMax = 40;
		sxolio = null;
		for (j = 0; j < lexi.length; j++) {
			if (lexi[j].length > Arena.sizitisi.lexiMax)
			lexi[j] = lexi[j].substr(0, Arena.sizitisi.lexiMax);

			if (sxolio === null) sxolio = lexi[j];
			else sxolio += ' ' + lexi[j];
		}
		dom.append(sxolio);
	}

	return this;
};

Arena.sizitisi.kornaAppend = function(dom) {
	var img;

	img = $('<img>').attr('src', 'ikona/panel/korna.png').css('width', '60px');
	dom.append(img);
	img.animate({
		width: '40px',
	}, 1000, 'easeInOutBounce');
};

Arena.sizitisi.emoticonAppend = function(dom, s) {
	var tmima, omada, ikona, lefkoma, emoticon;

	tmima = s.split(':');
	if (tmima.length != 2)
	return;

	omada = parseInt(tmima[0].replace(/^E/, ''));
	lefkoma = Arena.epanel.lefkoma[omada - 1];
	if (!lefkoma)
	return;

	ikona = parseInt(tmima[1]);
	emoticon = lefkoma[ikona - 1];
	if (!emoticon)
	return;

	dom.append($('<img>').addClass('sizitisiEmoticon').
	attr('src', 'ikona/emoticon/set' + omada + '/' + emoticon));
};

Arena.sizitisi.proepiskopisi = function(area) {
	var sxolio, sizitisi, dom;

	sxolio = Arena.inputTrexon.val().trim();
	if (sxolio === '') {
		Arena.sizitisi.katharismos(area);
		return Arena;
	}

	sizitisi = new Sizitisi({
		pektis: ego.login,
		sxolio: sxolio,
		pote: Globals.toraServer(),
	}).
	sizitisiCreateDOM().
	sizitisiRefreshDOM();

	dom = sizitisi.
	sizitisiGetDOM().
	addClass('sizitisiProepiskopisi');

	area.
	children('.sizitisiProepiskopisi').
	remove();

	area.append(dom);

	if (!area.data('pagomeni'))
	area.scrollKato();

	//Arena.sizitisi.moliviEkinisi();

	return Arena;
};

Arena.sizitisi.katharismos = function(area) {
	Arena.inputTrexon.val('');
	area.children('.sizitisiProepiskopisi').remove();
	//Arena.sizitisi.moliviAkirosi();

	return Arena;
};
