///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Το singleton "profinfo" χρησιμοποιείται ως namespace για δομές και δαδικασίες
// που αφορούν στην κάρτα προφίλ παίκτη. Η κάρτα προφίλ παίκτη είναι μια popup
// κάρτα η οποία εμφανίζεται με click επάνω σε παίκτες/θεατές και στην οποία
// εκτός από τις πληροφορίες προφίλ του παίκτη εμφανίζονται και άλλες πληροφορίες,
// όπως το τρέχον καφενείο και το τρέχον τραπέζι που βρισκόμαστε και αν ο παίκτης
// έχει η όχι προσβάσεις και προσκλήσεις αντίστοιχα για αυτά. Στη ίδια κάρτα
// φαίνεται επίσης η σχέση που έχουμε με τον παίκτη και δίνεται η δυνατότητα
// διαπίστευσης/αποκλεισμού του παίκτη στο (πριβέ) καφενείο μας, πρόσκλησης/
// ανάκλησης του παίκτη στο τραπέζι μας, και συσχετισμός/αποσυσχετισμός παίκτη
// με την αφεντιά μας.
//
// Η κάρτα εμφανίζεται σε προκατασκευασμένο div και αφορά τον παίκτη/θεατή στον
// οποίο κάνουμε κλικ. Με άλλα λόγια, δεν ανοίγουμε ξεχωριστή κάρτα για κάθε
// παίκτη/θεατή στον οποίον κάνουμε κλικ, αλλά χρησιμοποιείται μια και μόνη
// κάρτα για ολους.

Arena.profinfo = {};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.profinfo.setup = function() {
	Arena.profinfoDOM = $('#profinfo').addClass('dialogos').
	append($('<div>').attr('id', 'profinfoPanel').

	append(Arena.profinfo.locationDOM = $('<div>').attr('id', 'profinfoLocation').addClass('profinfoNisida')).
	append(Arena.profinfo.vrestonDOM = $('<div>').attr('id', 'profinfoVreston').addClass('profinfoNisida')).
	append(Arena.profinfo.editDOM = $('<div>').attr('id', 'profinfoEdit').addClass('profinfoNisida')).
	append(Arena.profinfo.sxesiDOM = $('<div>').attr('id', 'profinfoSxesi').addClass('profinfoNisida')).
	append(Arena.profinfo.kafenioDOM = $('<div>').attr('id', 'profinfoKafenio')).
	append(Arena.profinfo.trapeziDOM = $('<div>').attr('id', 'profinfoTrapezi')).
	append(Arena.profinfo.minimaDOM = $('<div>').attr('id', 'profinfoMinima').addClass('profinfoNisida')).
	append(Arena.profinfo.loginDOM = $('<div>').attr('id', 'profinfoLogin').addClass('profinfoNisida'))).

	append(Arena.profinfo.panoDOM = $('<div>').attr('id', 'profinfoPano').addClass('profinfoInfo')).
	append(Arena.profinfo.katoDOM = $('<div>').attr('id', 'profinfoKato').addClass('profinfoInfo')).

	append(Arena.profinfo.mesiDOM = $('<div>').attr('id', 'profinfoMesi').
	append(Arena.profinfo.onomaDOM = $('<div>').attr('id', 'profinfoOnoma').addClass('profinfoNisida'))).

	append(Selida.klisimo(function(e) {
		Arena.profinfo.klisimo();
		Arena.inputRefocus();
	}).
	attr('title', 'Κλείσιμο'));

	Arena.profinfoDOM.siromeno();
	Arena.profinfo.mesiSetup();

	return Arena;
};

Arena.profinfo.refresh = function(pektis) {
	Arena.profinfoDOM.
	data('pektis', Vida.pektisLoginGet(pektis));

	Arena.profinfo.
	refreshOnoma().
	refreshLocation().
	refreshVreston().
	refreshEdit().
	refreshSxesi().
	refreshKafenio().
	refreshTrapezi();

	return Arena;
};

Arena.profinfo.refreshOnoma = function() {
	var pektis, login;

	Arena.profinfo.loginDOM.
	removeClass().
	addClass('profinfoNisida').
	empty();

	Arena.profinfo.onomaDOM.empty();
	Arena.profinfo.minimaDOM.empty();

	pektis = skiniko.skinikoPektisGet(Arena.profinfoDOM.data('pektis'));
	if (!pektis)
	return Arena.profinfo;

	login = pektis.pektisLoginGet();
	Arena.profinfo.loginDOM.text(login);

	if (ego.isTeri(login))
	Arena.profinfo.loginDOM.addClass('sxesiOnomaTeri');

	else if (ego.isFilos(login))
	Arena.profinfo.loginDOM.addClass('sxesiOnomaFilos');

	else if (ego.isApoklismenos(login))
	Arena.profinfo.loginDOM.addClass('sxesiOnomaApoklismenos');

	Arena.profinfo.onomaDOM.text(pektis.pektisOnomaGet());
	Arena.profinfo.minimaDOM.
	append($('<img>').addClass('profinfoIcon').attr({
		id: 'profinfoMinimaIcon',
		title: 'Αποστολή προσωπικού μηνύματος',
		src: 'ikona/misc/minima.png',
	}));

	return Arena.profinfo;
};

Arena.profinfo.refreshLocation = function() {
	var photo, sinedria, ip;

	Arena.profinfo.locationDOM.empty();
	if (Arena.profinfo.photoZoomDOM)
	Arena.profinfo.photoZoomDOM.remove();

	pektis = skiniko.skinikoPektisGet(Arena.profinfoDOM.data('pektis'));
	if (!pektis)
	return Arena.profinfo;

	photo = pektis.pektisPhotoGet();
	if (photo) {
		Arena.profinfo.locationDOM.
		append($('<img>').
		attr({
			id: 'profinfoPhoto',
			title: 'Φωτογραφία προφίλ',
			src: 'photo/' + photo,
		}).
		on('mouseenter', function(e) {
			e.stopPropagation();
			Arena.profinfo.photoZoomDOM.stop().fadeIn(100);
		}));

		Arena.profinfoDOM.
		append(Arena.profinfo.photoZoomDOM = $('<img>').
		attr({
			id: 'profinfoPhotoZoom',
			src: 'photo/' + photo,
		}).
		on('mousedown', function(e) {
			e.stopPropagation();
		}).
		on('click', function(e) {
			var kliked;

			e.stopPropagation();
			kliked = Arena.profinfo.photoZoomDOM.data('kliked');

			if (kliked)
			Arena.profinfo.photoZoomDOM.removeData('kliked').stop().fadeOut(50);

			else
			Arena.profinfo.photoZoomDOM.data('kliked', true);
		}).
		on('mouseleave', function(e) {
			e.stopPropagation();
			if (!Arena.profinfo.photoZoomDOM.data('kliked'))
			Arena.profinfo.photoZoomDOM.stop().fadeOut(50);
		}));
	}

	sinedria = skiniko.skinikoSinedriaGet(pektis.pektisLoginGet());
	ip = sinedria ? sinedria.sinedriaIpGet() : null;
	if (ip)
	Arena.profinfo.locationDOM.
	append($('<img>').
	addClass('profinfoIcon').
	attr({
		title: 'Τοποθεσία παίκτη (' + ip + ')',
		src: 'ikona/external/iplocator.png',
	}).
	on('mousedown', function(e) {
		e.stopPropagation();
	}).
	on('click', function(e) {
		window.open('http://www.infosniper.net/index.php?ip_address=' + ip +
			'&map_source=1&overview_map=1&lang=1&map_type=1&zoom_level=7', 'iplocator');
	}));

	return Arena.profinfo;
};

Arena.profinfo.refreshVreston = function() {
	Arena.profinfo.vrestonDOM.
	empty().
	append($('<img>').
	addClass('profinfoIcon').
	attr({
		title: 'Εντοπισμός και μετάβαση σε τραπέζι/καφενείο',
		src: 'ikona/panel/anazitisi.png',
	})).
	on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	on('click', function(e) {
		var sinedria, traka;

		Arena.inputRefocus(e);

		sinedria = skiniko.skinikoSinedriaGet(Arena.profinfoDOM.data('pektis'));
		if (!sinedria) return;

		traka = skiniko.skinikoKafenioGet(sinedria.sinedriaKafenioGet());
		if (traka) traka.kafenioEpilogi();

		traka = skiniko.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
		if (traka) traka.trapeziEpilogi({
			profinfoKlisimo: true,
		});
	});

	return Arena.profinfo;
};

Arena.profinfo.refreshEdit = function() {
	var pektis;

	Arena.profinfo.editDOM.empty();
	pektis = skiniko.skinikoPektisGet(Arena.profinfoDOM.data('pektis'));
	if (!pektis)
	return Arena.profinfo;

	if (Arena.profinfo.edit)
	Arena.profinfo.editDOM.
	append(dom = $('<img>').
	addClass('profinfoIcon').
	attr({
		title: 'Καταχώρηση',
		src: 'ikona/misc/kataxorisi.png',
	}));

	else
	Arena.profinfo.editDOM.
	append(dom = $('<img>').
	addClass('profinfoIcon').
	attr({
		title: 'Πληροφορίες προφίλ',
		src: 'ikona/pektis/edit.png',
	}));

	return Arena.profinfo;
};

Arena.profinfo.refreshSxesi = function() {
	var pektis;

	Arena.profinfo.sxesiDOM.empty();
	pektis = skiniko.skinikoPektisGet(Arena.profinfoDOM.data('pektis'));
	if (!pektis)
	return Arena.profinfo;

	if (ego.isTeri(pektis))
	Arena.profinfo.
	sxesiFilos(pektis).
	sxesiApoklismos(pektis).
	sxesiAposisxetisi(pektis);

	else if (ego.isFilos(pektis))
	Arena.profinfo.
	sxesiTeri(pektis).
	sxesiApoklismos(pektis).
	sxesiAposisxetisi(pektis);

	else if (ego.isApoklismenos(pektis))
	Arena.profinfo.
	sxesiTeri(pektis).
	sxesiFilos(pektis).
	sxesiAposisxetisi(pektis);

	else
	Arena.profinfo.
	sxesiTeri(pektis).
	sxesiFilos(pektis).
	sxesiApoklismos(pektis);

	return Arena.profinfo;
};

Arena.profinfo.sxesiTeri = function(pektis) {
	return Arena.profinfo.sxesiIcon(pektis, 'Ταίρι', 'pektis/teri.png', 'ΤΑΙΡΙ');
};

Arena.profinfo.sxesiFilos = function(pektis) {
	return Arena.profinfo.sxesiIcon(pektis, 'Φίλος', 'pektis/filos.png', 'ΦΙΛΟΣ');
};

Arena.profinfo.sxesiApoklismos = function(pektis) {
	return Arena.profinfo.sxesiIcon(pektis, 'Αποκλεισμός', 'pektis/apoklismos.png', 'ΑΠΟΚΛΕΙΣΜΕΝΟΣ');
};

Arena.profinfo.sxesiAposisxetisi = function(pektis) {
	return Arena.profinfo.sxesiIcon(pektis, 'Αποσυσχέτιση', 'misc/Xgray.png');
};

Arena.profinfo.sxesiIcon = function(pektis, title, img, sxesi) {
	Arena.profinfo.sxesiDOM.
	append(dom = $('<img>').
	addClass('profinfoIcon').
	attr({
		title: title,
		src: 'ikona/' + img,
	}).
	on('mousedown', function(e) {
		Arena.inputRefocus(e);
	}).
	on('click', function(e) {
		var icon = $(this);

		Arena.inputRefocus(e);
		if ($(this).data('klik'))
		return;

		$(this).
		data('klik', true).
		working(true);

		Selida.skiserService('sxesiSet',
			'pektis=' + pektis.pektisLoginGet().uri(),
			'sxesi=' + $(this).data('sxesi').uri()).
		done(function(rsp) {
			icon.removeData('klik').working(false);
		}).
		fail(function(err) {
			icon.removeData('klik').working(false);
			Selida.skiserFail(err);
		});
	}));

	if (!sxesi) sxesi = '';
	dom.data('sxesi', sxesi);

	return Arena.profinfo;
};

Arena.profinfo.refreshKafenio = function() {
	var pektis, kafenio, diapisteButton;

	Arena.profinfo.kafenioDOM.
	removeClass().
	addClass('profinfoNisida').
	empty();

	pektis = skiniko.skinikoPektisGet(Arena.profinfoDOM.data('pektis'));
	if (!pektis)
	return Arena.profinfo;

	kafenio = ego.kafenioGet();
	if (!kafenio)
	return Arena.profinfo;

	// Αν ο παίκτης στην κάρτα είναι ο ίδιος ο δημιουργός του καφενείου,
	// τότε δεν δίνουμε δικαίωμα διαπίστευσης/αποπομπής.

	if (kafenio.kafenioIsDimiourgos(pektis))
	return Arena.profinfo;

	// Αν ο παίκτης που τρέχει την κάρτα δεν είναι ο δημιουργός του καφενείου,
	// τότε δεν δίνουμε δικαίωμα διαπίστευσης/αποπομπής.

	if (kafenio.kafenioOxiDimiourgos(ego.loginGet()))
	return Arena.profinfo;

	if (kafenio.kafenioIsDimosio())
	Arena.profinfo.kafenioDOM.
	addClass('profinfoIpotono');

	diapisteButton = $('<button>').addClass('profinfoButton').
	appendTo(Arena.profinfo.kafenioDOM);

	if (kafenio.kafenioIsDiapiste(pektis))
	diapisteButton.
	text('Αποπομπή').
	on('mousedown', function(e) {
		e.stopPropagation();
	}).
	on('click', function(e) {
		e.stopPropagation();
		Selida.skiserService('kafenioApopompi',
			'kafenio=' + kafenio.kafenioKodikosGet(),
			'pektis=' + pektis.pektisLoginGet().uri()).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
		}).
		fail(function(err) {
			Selida.skiserFail(err);
		});
	});

	else
	diapisteButton.
	text('Διαπίστευση').
	on('mousedown', function(e) {
		e.stopPropagation();
	}).
	on('click', function(e) {
		e.stopPropagation();
		Selida.skiserService('kafenioDiapistefsi',
			'kafenio=' + kafenio.kafenioKodikosGet(),
			'pektis=' + pektis.pektisLoginGet().uri()).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
		}).
		fail(function(err) {
			Selida.skiserFail(err);
		});
	});

	return Arena.profinfo;
};

Arena.profinfo.refreshTrapezi = function() {
	var pektis, trapezi, prosklisiButton;

	Arena.profinfo.trapeziDOM.
	removeClass().
	addClass('profinfoNisida').
	empty();

	pektis = skiniko.skinikoPektisGet(Arena.profinfoDOM.data('pektis'));
	if (!pektis)
	return Arena.profinfo;

	trapezi = ego.trapeziGet();
	if (!trapezi)
	return Arena.profinfo;

	if (ego.oxiPektis())
	return Arena.profinfo;

	prosklisiButton = $('<button>').addClass('profinfoButton').
	appendTo(Arena.profinfo.trapeziDOM);

	if (trapezi.trapeziIsProsklisi(pektis, ego.loginGet()))
	prosklisiButton.
	text('Ανάκληση').
	on('mousedown', function(e) {
		e.stopPropagation();
	}).
	on('click', function(e) {
		e.stopPropagation();
		Selida.skiserService('prosklisiDiagrafi',
			'trapezi=' + trapezi.trapeziKodikosGet(),
			'apo=' + ego.loginGet().uri(),
			'pros=' + pektis.pektisLoginGet().uri()).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
		}).
		fail(function(err) {
			Selida.skiserFail(err);
		});
	});

	else
	prosklisiButton.
	text('Πρόσκληση').
	on('mousedown', function(e) {
		e.stopPropagation();
	}).
	on('click', function(e) {
		e.stopPropagation();
		Selida.skiserService('prosklisiEpidosi',
			'trapezi=' + trapezi.trapeziKodikosGet(),
			'pektis=' + pektis.pektisLoginGet().uri()).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
		}).
		fail(function(err) {
			Selida.skiserFail(err);
		});
	});

	return Arena.profinfo;
};

Arena.profinfo.isPektis = function(pektis) {
	pektis = Vida.pektisLoginGet(pektis);
	if (!pektis)
	return false;

	if (Arena.profinfoDOM.data('pektis') !== pektis)
	return false;

	return true;
};

Arena.profinfo.oxiPektis = function(pektis) {
	return !Arena.profinfo.isPektis(pektis);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Arena.profinfo.mesiSetup = function() {
	Arena.profinfo.mesiDOM.siromeno({
		init: function(e, siromeno) {
			Selida.siromenoInitDefault(e, siromeno);
			siromeno.panoH = Arena.profinfo.panoDOM.height();
			siromeno.katoH = Arena.profinfo.katoDOM.height();
			siromeno.mesiT = Arena.profinfo.mesiDOM.position().top;
		},
		moveX: false,
		move: function(dx, dy) {
			var siromeno, dy1, panoH, katoH;

			if (dy === 0) return;
			siromeno = $(window).data('siromeno');
			if (!siromeno) return;

			while (1) {
				dy1 = dy;
				panoH = siromeno.panoH + dy1;
				if (panoH < 0) panoH = 0;
				dy1 -= panoH - siromeno.panoH;

				///////////////////////////////////////

				dy1 = dy - dy1;
				katoH = siromeno.katoH - dy1;
				if (katoH < 0) katoH = 0;
				dy1 += katoH - siromeno.katoH;

				///////////////////////////////////////

				if (!dy1)
				break;

				dy -= dy1;
			}

			Arena.profinfo.panoDOM.css('height', panoH + 'px');
			Arena.profinfo.katoDOM.css('height', katoH + 'px');
			Arena.profinfo.mesiDOM.css('top', (siromeno.mesiT - (siromeno.panoH - panoH)) + 'px');
		},
	});

	return Arena;
};

jQuery.fn.oplismosProfinfo = function() {
	return this.
	off('click').on('click', function(e) {
		var pektis;

		Arena.inputRefocus(e);

		pektis = $(this).data('pektis');
		if (!pektis)
		return;

		pektis = skiniko.skinikoPektisGet(Vida.pektisLoginGet(pektis));
		if (!pektis)
		return;

		Arena.profinfo.refresh(pektis);
		Arena.profinfo.anigma();
	}).
	off('mouseenter').on('mouseenter', function(e) {
		var pektis, s, title, fyi, sinedria, traka;

		pektis = skiniko.skinikoPektisGet($(this).data('pektis'));
		if (!pektis)
		return $(this).attr('title', 'Προφίλ, πρόσκληση, ανάκληση κλπ');

		s = pektis.pektisOnomaGet();
		title = s;
		fyi = '<span class="entona prasino">' + s + '</span>';

		sinedria = skiniko.skinikoSinedriaGet($(this).data('pektis'));
		if (!sinedria) {
			Selida.fyi.kato(fyi, 0);
			return $(this).attr('title', title);
		}

		traka = skiniko.skinikoKafenioGet(sinedria.sinedriaKafenioGet());
		if (traka) {
			s = traka.kafenioOnomasiaGet();
			title += ', καφενείο ' + s;
			fyi += ', καφενείο <span class="entona prasino">' + s + '</span>';
		}

		traka = skiniko.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
		if (traka) {
			s = traka.trapeziKodikosGet();
			title += ', τραπέζι ' + s;

			fyi += ',';
			if (sinedria.sinedriaIsPektis())
			fyi += ' <span class="entona kafekokino">ΠΑΙΖΕΙ</span> στο';

			fyi += ' τραπέζι <span class="entona prasino">' + s + '</span>';
		}

		Selida.fyi.kato(fyi, 0);
		return $(this).attr('title', title);
	}).
	off('mouseleave').on('mouseleave', function(e) {
		Selida.fyi.kato();
	});
};

Arena.profinfo.anigma = function() {
	Arena.profinfoDOM.
	anadisi().
	css('display', 'block');
	Arena.profinfo.anikto = true;

	return Arena;
};

Arena.profinfo.klisimo = function() {
	Arena.profinfoDOM.css('display', 'none');
	delete Arena.profinfo.anikto;

	return Arena;
};
