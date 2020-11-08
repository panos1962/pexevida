$(window).
ready(function() {
	Selida.bodyDOM = $(document.body);

	Selida.
	ixosSetup().
	paraskinioSetup().
	toolbarSetup().
	ribbonSetup().
	fyiSetup().
	ofelimoSetup().
	siromenoSetup().
	resize();
}).
on('resize', function() {
	Selida.resize();
});

Selida = {};

Selida.resize = function() {
		var w, w1;

		w = $(window).innerWidth();
		w1 = Selida.ofelimoDOM.outerWidth(true);

		if (w > w1)
		w = w1;
	
		w1 = w + 'px';

		Selida.toolbarDOM.css('width', w1);
		Selida.ribbonDOM.css('width', w1);

		w1 = (w - 8) + 'px';
		Selida.fyi.panoDOM.css('width', w1);
		Selida.fyi.katoDOM.css('width', w1);
}

Selida.url = function(s) {
	return Selida.server + s;
};

Selida.sessionSet = function(tag, val) {
	if (val === undefined)
	delete Selida.session[tag];

	else
	Selida.session[tag] = val;

	return Selida;
};

Selida.sessionGet = function(tag) {
	return Selida.session[tag];
};

Selida.isSession = function(tag) {
	return Selida.session.hasOwnProperty(tag);
};

Selida.isPektis = function() {
	return Selida.session.pektis;
};

Selida.oxiPektis = function() {
	return !Selida.isPektis();
};

$.ajaxSetup({
	type: 'POST',
});

Selida.ajaxID = 0;

Selida.ajax = function() {
	var opts, i;

	Selida.ajaxID++;
	opts = {
		url: arguments[0] + '.php?TS=' + Globals.torams() + '&ID=' + Selida.ajaxID,
	};

	if (arguments.length < 2)
	return $.ajax(opts);

	for (i in arguments[1]) {
		if (typeof(arguments[1][i]) === 'string')
		arguments[1][i] = arguments[1][i].uri();
	}

	opts.data = arguments[1];

	return $.ajax(opts);
};

Selida.ajaxFail = function(err) {
	if (err.hasOwnProperty('responseText') && (err.responseText !== ''))
	err = err.statusText;

	else if (err.hasOwnProperty('statusText') && (err.statusText !== ''))
	err = err.statusText;

	else if (typeof err !== 'string')
	err = 'Ο server δεν ανταποκρίνεται';

	Selida.fyi.epano(err);
};

Selida.skiserService = function() {
	var opts, i, j;

	Selida.ajaxID++;
	opts = {
		url: Selida.skiser + arguments[0] + '?TS=' + Globals.torams() + '&ID=' + Selida.ajaxID,
	};

	try {
		opts.url += '&PK=' + Selida.sessionGet('pektis').uri() +
			'&KL=' + Selida.sessionGet('klidi').uri();
	} catch (e) {
		console.error('missing pektis/klidi session');
	}

	for (i = 1; i < arguments.length; i++) {
		if (typeof arguments[i] === 'string')
		opts.url += '&' + arguments[i];

		else {
			for (j in arguments[i]) {
				opts.url += '&' + j.uri() + '=' + arguments[i][j].uri();
			}
		}
	}

	return $.ajax(opts);
};

Selida.skiserFail = function(err) {
	var msg;

	if (err.hasOwnProperty('responseText') && (err.responseText !== ''))
	msg = err.responseText;

	else if (typeof err === 'string')
	msg = err;

	else
	msg = 'Ο server σκηνικού δεν ανταποκρίνεται';

	Selida.fyi.epano(msg);
	console.error(msg);

	return Selida;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Selida.tab = function(dom) {
	return $('<div>').addClass('tab sinefo').html(dom);
};

Selida.tabVida = function() {
	if (window.opener && (window.opener !== window.self))
	return Selida;

	Selida.tab($('<a>').attr({href: Selida.server}).
	text('Βίδα!')).
	appendTo(Selida.toolbarLeftDOM);
	return Selida;
};

Selida.tabKlisimo = function() {
	if (!window.opener)
	return Selida;

	if (window.opener === window.self)
	return Selida;

	Selida.tab($('<a>').attr({href: '#'}).on('click', function(e) {
		self.close();
		return false;
	}).text('Κλείσιμο')).
	appendTo(Selida.toolbarLeftDOM);
	return Selida;
};

Selida.tabEgrafi = function() {
	if (window.Account)
	return Selida;

	Selida.tab($('<a>').attr({
		title: 'Δημιουργία λογαριασμού και είσοδος στην εφαρμογή',
		target: '_self',
		href: Selida.url('account'),
	}).text('Εγγραφή')).
	appendTo(Selida.toolbarRightDOM);

	return Selida;
};

Selida.tabIsodos = function() {
	if (window.Isodos)
	return Selida;

	Selida.tab($('<a>').attr({
		title: 'Έλεγχος στοιχείων και είσοδος στην εφαρμογή',
		target: '_self',
		href: Selida.url('isodos'),
	}).text('Είσοδος')).
	appendTo(Selida.toolbarRightDOM);

	return Selida;
};

Selida.tabAccount = function() {
	if (window.Account)
	return Selida;

	Selida.tab($('<a>').attr({
		title: 'Ενημέρωση στοιχείων λογαριασμού',
		target: 'account',
		href: Selida.url('account'),
	}).text(Selida.isPektis())).
	appendTo(Selida.toolbarRightDOM);

	return Selida;
};

Selida.tabExodos = function() {
	Selida.tab($('<a>').attr({
		title: 'Έξοδος από την εφαρμογή',
		target: '_self',
		href: Selida.server,
	}).text('Έξοδος').
	on('click', function(e) {
		Selida.skiserService('exodos').
		done(function() {
console.log(arguments);
		});
		Selida.ajax(Selida.server + 'misc/exodos').
		done(function(rsp) {
			if (self.name === 'account') {
				self.close();
				self.opener.location = Selida.server;
				return;
			}

			self.location = Selida.server;
		}).
		fail(function(err) {
			console.error(err);
		});
		return false;
	})).
	appendTo(Selida.toolbarRightDOM);

	return Selida;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Selida.toolbarSetup = function() {
	Selida.toolbarDOM = $('#toolbar');
	Selida.toolbarLeftDOM = $('#toolbarLeft');
	Selida.toolbarCenterDOM = $('#toolbarCenter');
	Selida.toolbarRightDOM = $('#toolbarRight');

	return Selida;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Selida.ribbonSetup = function() {
	Selida.ribbonDOM = $('#ribbon');
	Selida.ribbonLeftDOM = $('#ribbonLeft');
	Selida.ribbonCenterDOM = $('#ribbonCenter');
	Selida.ribbonRightDOM = $('#ribbonRight');

	return Selida;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Selida.fyiSetup = function() {
	Selida.fyi.panoDOM = $('#fyiPano');
	Selida.fyi.katoDOM = $('#fyiKato');
	return Selida;
};

Selida.fyi = {};

Selida.fyi.minima = function(dom, msg, dur) {
	dom.finish();

	if (!msg) {
		dom.empty().fadeTo(100, 0);
		return Selida;
	}

	dom.css({
		opacity: 1,
	}).html(msg);
	if (dur <= 0)
	return Selida;

	if (dur === undefined)
	dur = 5000;

	dom.delay(dur).fadeTo(400, 0);
	return Selida;
};

Selida.fyi.pano = function(msg, dur) {
	Selida.fyi.panoDOM.
	removeClass().
	addClass('fyi').
	css({
		textAlign: 'right',
	});

	return Selida.fyi.minima(Selida.fyi.panoDOM, msg, dur);
};

Selida.fyi.panoAristera = function() {
	Selida.fyi.panoDOM.css({
		textAlign: 'left',
	});
	return Selida;
};

Selida.fyi.kato = function(msg, dur) {
	Selida.fyi.katoDOM.
	removeClass().
	addClass('fyi').
	css({
		textAlign: 'left',
	});
	return Selida.fyi.minima(Selida.fyi.katoDOM, msg, dur);
};

Selida.fyi.katoDexia = function() {
	Selida.fyi.katoDOM.css({
		textAlign: 'right',
	});
	return Selida;
};

Selida.fyi.epano = function(msg, dur) {
	Selida.fyi.panoDOM.addClass('kokino');
	return Selida.fyi.minima(Selida.fyi.panoDOM, msg, dur);
};

Selida.fyi.ekato = function(msg, dur) {
	Selida.fyi.katoDOM.addClass('kokino');
	return Selida.fyi.minima(Selida.fyi.katoDOM, msg, dur);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Selida.ixos = {
	entasi: {
		'ΣΙΩΠΗΛΟ': 0,
		'ΧΑΜΗΛΗ': 0.3,
		'ΚΑΝΟΝΙΚΗ': 0.6,
		'ΔΥΝΑΤΗ': 1.0,
	},

	miosi: {
		'filo/thesi4.mp3': 1.7,
		'filo/thesi2.mp3': 1.5,
		'beep/beep.ogg': 1.5,
		'notice/tilt.ogg': 0.7,
		'pop/blioup.ogg': 0.7,
		'pop/tap.ogg': 0.7,
	},
};

Selida.ixosSetup = function() {
	Selida.bodyDOM.prepend($('<div>').attr('id', 'ixos'));
	Selida.ixos.DOM = $('#ixos');

	if (Selida.ixos.entasi.hasOwnProperty(Selida.session.entasi))
	Selida.ixos.entasiDefaultSet(Selida.session.entasi);

	else
	Selida.ixos.entasiDefaultSet('ΚΑΝΟΝΙΚΗ');

	return Selida;
};

Selida.ixos.entasiDefaultSet = function(entasi) {
	Selida.ixos.entasiDefault = entasi;
	return Selida;
};

Selida.ixos.entasiDefaultGet = function() {
	return Selida.ixos.entasiDefault;
};

Selida.ixos.play = function(ixos, opts) {
	var vol, entasi;

	if (!opts)
	opts = {};

	else if (typeof opts === 'number')
	opts = { vol: opts };

	entasi = Selida.ixos.entasi[Selida.ixos.entasiDefaultGet()];

	vol = (opts.hasOwnProperty('vol') ? (opts.vol / 10) * (entasi / Selida.ixos.entasi['ΚΑΝΟΝΙΚΗ']) : entasi);

	if (vol <= 0)
	return Selida;

	if (vol > 1)
	vol = 1.0;

	if (Selida.ixos.miosi.hasOwnProperty(ixos)) {
		vol *= Selida.ixos.miosi[ixos];
		if (vol <= 0) return Selida;
		if (vol > 1) vol = 1.0;
	}

	$('<audio>').
	prop({
		src: Selida.server + 'ixos/' + ixos,
		autoplay: true,
		volume: vol,
	}).
	on('ended', function() {
		$(this).remove();
	}).
	appendTo(Selida.ixos.DOM);

	return Selida;
};

Selida.ixos.pop = function(vol) {
	return Selida.ixos.play('pop/pop.ogg', vol);
};

Selida.ixos.doorbell = function(vol) {
	return Selida.ixos.play('bell/doorbell.ogg', vol);
};

Selida.ixos.tinybell = function(vol) {
	return Selida.ixos.play('bell/tinybell.ogg', vol);
};

Selida.ixos.deskbell = function(vol) {
	return Selida.ixos.play('bell/deskbell.ogg', vol);
};

Selida.ixos.beep = function(vol) {
	return Selida.ixos.play('beep/beep.ogg', vol);
};

Selida.ixos.sfirigma = function(vol) {
	return Selida.ixos.play('notice/sfirigma.ogg', vol);
};

Selida.ixos.skisimo = function(vol) {
	return Selida.ixos.play('misc/skisimo.ogg', vol);
};

Selida.ixos.tik = function(vol) {
	return Selida.ixos.play('pop/tik.ogg', vol);
};

Selida.ixos.stickhit = function(vol) {
	return Selida.ixos.play('pop/stickhit.ogg', vol);
};

Selida.ixos.blioup = function(vol) {
	return Selida.ixos.play('pop/blioup.ogg', vol);
};

Selida.ixos.dianomi = function(vol) {
	return Selida.ixos.play('misc/dianomi.ogg', vol);
};

Selida.ixos.xirokrotima = function(vol) {
	return Selida.ixos.play('misc/applause.ogg', vol);
};

Selida.ixos.kornaList = [
	'honk22.ogg',
	'bop2.ogg',
	'honk.ogg',
	'dout2.ogg',
	'honk2.ogg',
];

Selida.ixos.kornaTixi = function() {
	return Selida.ixos.play('korna/' + Selida.ixos.kornaList
		[Globals.random(Selida.ixos.kornaList.length - 1)]);
};

Selida.ixos.filo = function(thesi) {
	return Selida.ixos.play('filo/thesi' + thesi + '.mp3', 2);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Selida.paraskinioSetup = function() {
	if (Selida.isPektis() && Selida.isSession('paraskinio'))
	Selida.bodyDOM.css('backgroundImage', "url('" + Selida.server +
		"ikona/paraskinio/" + Selida.sessionGet('paraskinio') + "')");

	else
	Selida.sessionSet('paraskinio', 'standard.png');

	return Selida;
};

Selida.ofelimoSetup = function() {
	Selida.ofelimoDOM = $('#ofelimo');
	return Selida;
};

Selida.panelSetup = function() {
	$('.panelV,.panelH').
	addClass('panel zelatina');

	$('.panelH').children('.panelContainer').
	children('.panelButton').addClass('panelButtonH').
	children('.panelIcon').addClass('panelIconH');

	$('.panelV').children('.panelContainer').
	children('.panelButton').addClass('panelButtonV');

	return Selida;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

jQuery.fn.strofi = function(opts) {
	var prev = 'strofiPrev';

	if (opts === undefined) opts = {
		strofi: 90,
		duration: 200,
	};
	else if (typeof opts === 'number') opts = {
		strofi: parseInt(opts),
		duration: 200,
	};
	else if (isNaN(opts.strofi)) opts.strofi = 90;

	return this.each(function(){
		var elem = $(this), teliki;

		if (isNaN(opts.arxiki)) opts.arxiki = elem.data(prev);
		if (isNaN(opts.arxiki)) opts.arxiki = 0;
		teliki = opts.arxiki + opts.strofi;

		$({gonia: opts.arxiki}).animate({gonia: teliki}, {
			duration: opts.duration,
			easing: opts.easing,
			step: function(now) {
				elem.css('transform', 'rotate(' + now + 'deg)');
			},
			complete: function() {
				elem.data(prev, teliki);
				if (opts.complete) complete(elem);
			},
		});

		return true;
	});
};

// Η μέθοδος "working" εφαρμόζεται σε εικόνες και τις αντικαθιστά με
// εικόνες εκτέλεσης εργασιών. Είναι χρήσιμη κυρίως κατά το κλικ σε
// εργαλεία όπου αλλάζουμε προσωρινά την εικόνα με εικόνα εκτέλεσης
// εργασιών μέχρι να ολοκληρωθεί η σχετική εργασία.

jQuery.fn.working = function(wrk) {
	var ico = $(this);

	if (wrk === false)
	return this.each(function() {
		ico.attr('src', ico.data('srcWorking')).removeData('srcWorking');
		return true;
	});

	if (wrk === undefined)
	wrk = 'working/default.gif';

	else if (wrk === true)
	wrk = 'working/gear.png';

	return this.each(function() {
		if (!ico.data('srcWorking'))
		ico.data('srcWorking', ico.attr('src'));

		ico.attr('src', Selida.server + 'ikona/' + wrk);
		return true;
	});
};

jQuery.fn.scrollKato = function(wrk) {
	return this.each(function() {
		$(this).scrollTop($(this).prop('scrollHeight'));
		return true;
	});
};

jQuery.fn.scrollPano = function(wrk) {
	return this.each(function() {
		$(this).scrollTop(0);
		return true;
	});
};

Globals.anadisiLevel = 0;

jQuery.fn.anadisi = function(opts) {
	Globals.anadisiLevel++;

	return this.each(function(){
		$(this).css('zIndex', Globals.anadisiLevel);
		return true;
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

jQuery.fn.siromeno = function(opts) {
	if (!opts)
	opts = {};

	if (!opts.hasOwnProperty('moveX'))
	opts.moveX = true;

	if (!opts.hasOwnProperty('moveY'))
	opts.moveY = true;

	if (!opts.hasOwnProperty('init'))
	opts.init = Selida.siromenoInitDefault;

	if (!opts.hasOwnProperty('move'))
	opts.move = Selida.siromenoMoveDefault;

	if (!opts.hasOwnProperty('callback'))
	opts.callback = Selida.siromenoCallbackDefault;

	return this.each(function() {
		$(this).
		on('mousedown', function(e) {
			var pos, siromeno;

			pos = $(this).position();

			siromeno = {
				domel: $(this),
				top0: pos.top,
				left0: pos.left,
				x0: e.clientX,
				y0: e.clientY,
				moveX: opts.moveX,
				moveY: opts.moveY,
				move: opts.move,
				callback: opts.callback,
			};


			opts.init(e, siromeno);

			if (!opts.moveY) Selida.bodyDOM.css('cursor', 'ew-resize');
			else if (!opts.moveX) Selida.bodyDOM.css('cursor', 'ns-resize');
			else Selida.bodyDOM.css('cursor', 'move');

			$(window).data('siromeno', siromeno);
		}).
		on('scroll', function(e) {
			if ($(window).data('siromeno'))
			Selida.bodyDOM.trigger('mouseup');
		});

		$(this).find('input,textarea,button,.panelContainer').
		on('mousedown', function(e) {
			e.stopPropagation();
		});

		return true;
	});
};

Selida.siromenoInitTimer = null;

Selida.siromenoInitDefault = function(e, siromeno) {
	if (Selida.siromenoInitAnte)
	Selida.siromenoInitAnte(e, siromeno);

	e.stopPropagation();
	e.preventDefault();

	if (Selida.siromenoInitTimer)
	clearTimeout(Selida.siromenoInitTimer);

	Selida.siromenoInitTimer = setTimeout(function() {
		siromeno.domel.addClass('siromeno');
	}, 50);

	if (Selida.siromenoInitPost)
	Selida.siromenoInitPost(e, siromeno);
};

Selida.siromenoCallbackDefault = function(e, siromeno) {
	if (Selida.siromenoInitTimer)
	clearTimeout(Selida.siromenoInitTimer);

	siromeno.domel.removeClass('siromeno');
};

Selida.siromenoMoveDefault = function(dx, dy) {
	var siromeno;

	siromeno = $(window).data('siromeno');
	if (!siromeno) return;

	if (!siromeno.moveX)
	dx = 0;

	if (!siromeno.moveY)
	dy = 0;

	siromeno.domel.css({
		left: (siromeno.left0 + dx) + 'px',
		top: (siromeno.top0 + dy) + 'px',
	});
};

Selida.siromenoSetup = function() {
	$(window).
	on('mousemove', function(e) {
		var siromeno, dx, dy;

		siromeno = $(this).data('siromeno');
		if (!siromeno) return;

		dx = e.clientX - siromeno.x0;
		dy = e.clientY - siromeno.y0;

		siromeno.move(dx, dy);
	}).
	on('mouseup', function(e) {
		var siromeno;

		Selida.bodyDOM.css('cursor', 'auto');
		siromeno = $(this).data('siromeno');
		$(this).removeData('siromeno');
		if (!siromeno) return;

		if (siromeno.callback)
		siromeno.callback(e, siromeno);
	});

	return Selida;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Selida.klisimo = function(callback) {
	return $('<img>').addClass('klisimoIcon').attr({
		src: Selida.server + 'ikona/misc/klisimo.png',
	}).

	on('mouseenter', function(e) {
		e.stopPropagation();
		$(this).addClass('klisimoIconEmfanes');
	}).

	on('mouseleave', function(e) {
		e.stopPropagation();
		$(this).removeClass('klisimoIconEmfanes');
	}).

	// Λαμβάνουμε μέριμνα για τα συρόμενα στοιχεία.

	on('mousedown', function(e) {
		e.stopPropagation();
	}).

	on('click', function(e) {
		e.stopPropagation();
		if (callback)
		return callback();

		$(this).parent().finish().fadeOut(200, function() {
			$(this).remove();
		});
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Selida.isKinito = function() {
	return Selida.sessionGet('kinito');
};

Selida.oxiKinito = function() {
	return !Selida.isKinito();
};
