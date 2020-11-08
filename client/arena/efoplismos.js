Tsoxa.efoplismosΑΓΟΡΑ = function() {
	if (this.trapeziIsVida())
	return Tsoxa.efoplismosΑΓΟΡΑvida.call(this);

	return Tsoxa.efoplismosΑΓΟΡΑbelot.call(this);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Tsoxa.efoplismosΑΓΟΡΑbelot = function() {
	var data = {};

	data.trapezi = ego.trapeziGet();
	data.pektis = data.trapezi.partidaEpomenosGet();
	data.dilosi = data.trapezi.partidaDilosiGet(data.pektis);
	data.oxiDilosi = !data.dilosi;
	data.dealer = data.trapezi.partidaDealerGet();
	data.oxiDealer = (data.pektis !== data.dealer);
	data.tzogos = data.trapezi.partidaKlistaGet(data.dealer).cardGet(2);
	data.tzogosOxiEptari = (data.tzogos.rankGet() !== '7');
	data.protasi = data.tzogos.suitGet();
	data.atou = data.trapezi.partidaAgoraXromaGet();
	data.fila = data.trapezi.partidaFilaGet(data.pektis);
	data.eptari = Vida.isEptari(data.fila, data.protasi);

	// Ετοιμάζουμε το πανελάκι επιλογών του παίκτη.

	data.panel = $('<div>').
	attr('id', 'tsoxaPanelAgoraBelot').
	addClass('efoplismos').
	on('mousedown', function(e) {
		e.preventDefault();
	}).appendTo(Arena.tsoxaDOM);

	// Αν ο dealer είναι στο Νότο, μετακινούμε το πάνελ λίγο δεξιά,
	// καθώς στο κέντρο υπάρχει το ανοικτό φύλλο.

	if (ego.mapThesi(data.dealer) === 1)
	data.panel.addClass('tsoxaPanelAgoraBelotPlai');

	// Αν έχει ήδη γίνει αγορά, περνάμε σε φάση ελέγχου απόντων,
	// επταρίου κλπ.

	if (data.atou)
	return Tsoxa.efoplismosΑΓΟΡΑbelotConfirm(data);

	// Δεν έχει γίνει ακόμη αγορά, επομένως θα γίνουν προτάσεις.
	// Αν ο παίκτης έχει ήδη δηλώσει σημαίνει ότι μιλάμε για τα
	// υπόλοιπα χρώματα εκτός του ανοικτού φύλλου.

	if (data.dilosi)
	filajs.suitWalk(function(xroma) {
		if (xroma === data.protasi)
		return;

		data.panel.
		append($('<div>').addClass('tsoxaButton tsoxaButtonAgoraBelot').
		append($('<div>').addClass('tsoxaPanelAgoraBelotXromaContainer').
		append(filajs.suitDOM(xroma).addClass('tsoxaPanelAgoraBelotXromaIcon'))).
		data('dilosi', new Dilosi().dilosiXromaSet(xroma)).
		data('click', function(e) {
			Tsoxa.panelAgoraDilosiIpovoli($(this));
		}));
	});

	// Ο παίκτης δεν έχει κάνει προηγούμενη δήλωση, επομένως θα πρέπει
	// να μιλήσει για το χρώμα του ανοικτού φύλλου.

	else
	data.panel.
	append($('<div>').addClass('tsoxaButton tsoxaButtonAgoraBelot').
	append($('<div>').addClass('tsoxaPanelAgoraBelotXromaContainer').
	append(filajs.suitDOM(data.protasi).addClass('tsoxaPanelAgoraBelotXromaIcon'))).
	data('dilosi', new Dilosi().dilosiXromaSet(data.protasi)).
	data('click', function(e) {
		Tsoxa.panelAgoraDilosiIpovoli($(this));
	}));

	// Αν ο παίκτης δεν έχει κάνει δηλώσεις και δεν είναι ο dealer της διανομής,
	// τότε παρέχουμε τη δυνατότητα αγοράς με αλλαγή του ανοικτού φύλλου με το
	// ομοιόχρωμο επτάρι.

	if (data.eptari && data.oxiDealer && data.oxiDilosi && data.tzogosOxiEptari)
	data.panel.
	append($('<div>').addClass('tsoxaButton tsoxaButtonAgoraBelot').
	text('ΕΠΤΑΡΙ').
	attr('title', 'Αλλάξτε το φύλλο της αγοράς με το ομοιόχρωμο επτάρι σας και κερδίστε την αγορά').
	data('click', function(e) {
		Tsoxa.agoraBelotEptariAgora($(this), data);
	}));

	// Ο παίκτης έχει το δικαίωμα να δηλώσει ΑΠΟΝΤΑ και να χαλάσει τη διανομή.

	if (data.trapezi.apontaOn() && data.oxiDilosi && Vida.isAponta(data.fila))
	data.panel.
	append($('<div>').addClass('tsoxaButton tsoxaButtonAgoraBelot').
	text('ΑΠΟΝΤΑ').
	attr('title', 'Δηλώστε άποντα και ζητήστε νέα διανομή').
	data('click', function(e) {
		Tsoxa.agoraBelotApontaIpovoli($(this), data);
	}));

	// Το ΠΑΣΟ είναι επιλογή που παρέχεται πάντα.

	data.panel.
	append($('<div>').addClass('tsoxaButton tsoxaButtonAgoraBelot').
	attr('id', 'escapeButton').
	text('ΠΑΣΟ').
	data('dilosi', new Dilosi().dilosiPasoSet()).
	data('click', function(e) {
		Tsoxa.panelAgoraDilosiIpovoli($(this));
	}));

	return Tsoxa;
};

// Ο εφοπλισμός που ακολουθεί αφορά σε αγορά παρτίδας μπουρλότου, αφού
// όμως έχει ήδη επιλεγεί το χρώμα της αγοράς.

Tsoxa.efoplismosΑΓΟΡΑbelotConfirm = function(data) {
	if (data.eptari && data.trapezi.partidaOxiEptari() && (data.atou === data.protasi)
	&& data.oxiDealer && data.tzogosOxiEptari)
	data.panel.
	append($('<div>').addClass('tsoxaButton tsoxaButtonAgoraBelot').
	text('ΕΠΤΑΡΙ').
	attr('title', 'Αλλάξτε το φύλλο της αγοράς με το ομοιόχρωμο επτάρι σας').
	data('click', function(e) {
		Tsoxa.agoraBelotEptariAlagi($(this), data);
	}));

	if (data.trapezi.apontaOn() && data.oxiDilosi && Vida.isAponta(data.fila, data.atou))
	data.panel.
	append($('<div>').addClass('tsoxaButton tsoxaButtonAgoraBelot').
	text('ΑΠΟΝΤΑ').
	attr('title', 'Δηλώστε άποντα και ζητήστε νέα διανομή').
	data('click', function(e) {
		Tsoxa.agoraBelotApontaIpovoli($(this), data);
	}));

	// Η επιλογή ΝΑΙ έχει την έννοια της επιβεβαίωσης ότι ο παίκτης είδε
	// την αγορά.

	data.panel.
	append($('<div>').addClass('tsoxaButton tsoxaButtonAgoraBelot').
	attr('id', 'escapeButton').
	text('ΝΑΙ').
	data('dilosi', new Dilosi().dilosiPasoSet()).
	data('click', function(e) {
		Tsoxa.panelAgoraDilosiIpovoli($(this));
	}));

	return Tsoxa;
};

// Η function "agoraBelotEptariAgora" καλείται όταν ο παίκτης επιλέγει
// αγορά με ταυτόχρονη αλλαγή του τζόγου με το ομοιόχρωμο επτάρι.

Tsoxa.agoraBelotEptariAgora = function(button, data) {
	// Πρώτα ελέγχεται ο παίκτης ότι κρατά στο χέρι του το επτάρι
	// της αλλαγής.

	if (Tsoxa.agoraBelotOxiEptari(data))
	return Tsoxa;

	// Θα υποβληθεί το σχετικό αίτημα και θα περιμένουμε τη σχετική
	// ενημέρωση από τον skiser.

	button.data('disabled', true);

	Selida.
	fyi.pano('Αλλάξατε το επτάρι αγοράζοντας <span class="entona prasina">' +
		filajs.suitDescGet(data.protasi) + '</span>', 0).
	skiserService('agoraDilosi', 'dilosi=' + data.protasi, 'eptari=' + data.tzogos.toString()).
	done(function(rsp) {
		Selida.fyi.pano(rsp);
	}).
	fail(function(err) {
		Selida.skiserFail(err);
		button.removeData('disabled');
	});

	return Tsoxa;
};

// Η function "agoraBelotApontaTpovoli" καλείται όταν ο παίκτης επιλέγει
// άποντα από το πάνελ των αγορών.

Tsoxa.agoraBelotApontaIpovoli = function(button, data) {
	button.data('disabled', true);
	Selida.fyi.pano();

	// Σε πρώτη φάση ελέγχουμε τα φύλλα του παίκτη να είναι όντως
	// άποντα.

	if (Vida.oxiAponta(data.fila, data.atou)) {
		Selida.
		fyi.epano('Κακώς δηλώνετε άποντα. Κοιτάξτε προσεκτικά τα φύλλα σας!').
		ixos.beep();
		button.removeData('disabled');
		return Tsoxa;
	}

	Selida.
	fyi.pano('Δηλώσατε <span class="entona prasina">ΑΠΟΝΤΑ</span>', 0).
	skiserService('agoraDilosi', 'dilosi=0').
	done(function() {
		Selida.fyi.pano();
	}).
	fail(function(err) {
		Selida.skiserFail(err);
		button.removeData('disabled');
	});

	return Tsoxa;
};

Tsoxa.agoraBelotEptariAlagi = function(button, data) {
	if (Tsoxa.agoraBelotOxiEptari(data))
	return Tsoxa;

	button.data('disabled', true);

	Selida.
	fyi.pano('Αλλάξατε το επτάρι. Παρακαλώ περιμένετε…').
	skiserService('eptariAlagi', 'eptari=' + data.tzogos.toString()).
	done(function(rsp) {
		Selida.fyi.epano(rsp);
	}).
	fail(function(err) {
		Selida.skiserFail(err);
		button.removeData('disabled');
	});

	return Tsoxa;
};

Tsoxa.agoraBelotOxiEptari = function(data) {
	var xroma, filaLen, i, filo;

	Selida.fyi.pano();
	xroma = (data.atou ? data.atou : data.protasi);
	filaLen = data.fila.cardsCount();

	for (i = 0; i < filaLen; i++) {
		filo = data.fila.cardGet(i);

		if (filo.suitUnlike(xroma))
		continue;

		if (filo.rankUnlike('7'))
		continue;

		data.eptari = i;
		return false;
	}

	delete data.eptari;
	Selida.
	fyi.epano('Δεν έχετε το επτάρι. Κοιτάξτε προσεκτικά τα φύλλα σας!').
	ixos.beep();

	return true;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Tsoxa.efoplismosΑΓΟΡΑvida = function() {
	var data = {};

	data.trapezi = ego.trapeziGet();
	data.thesi = data.trapezi.partidaEpomenosGet();
	data.agora = data.trapezi.partidaAgoraGet();
	data.agorastis = data.trapezi.partidaAgorastisGet();

	data.dom = $('<div>').
	attr('id', 'tsoxaPanelAgoraVida').
	addClass('tsoxaPanel efoplismos').
	on('mousedown', function(e) {
		e.preventDefault();
	});

	Tsoxa.
	efoplismosΑΓΟΡΑvidaXromata(data).
	efoplismosΑΓΟΡΑvidaControls(data);

	Arena.tsoxaDOM.
	append(data.dom);

	return Tsoxa;
};

Tsoxa.efoplismosΑΓΟΡΑvidaXromata = function(data) {
	data.pontoiMin = (data.agora ? data.agora.dilosiPontoiGet() + 10 : 80);
	data.pontoiMax = null;

	if (data.pontoiMin >= 850)
	return Tsoxa;

	data.pontoiMax = data.pontoiMin + 30;

	filajs.suitWalk(function(xroma) {
		var domXroma, pontoi;

		domXroma = $('<div>').addClass('tsoxaPanelAgoraVidaXroma').
		append($('<div>').addClass('tsoxaPanelAgoraVidaXromaContainer').
		append(filajs.suitDOM(xroma).addClass('tsoxaPanelAgoraVidaXromaIcon')));

		for (pontoi = data.pontoiMin; pontoi <= data.pontoiMax; pontoi += 10)
		domXroma.append($('<div>').addClass('tsoxaButton tsoxaPanelAgoraVidaPontoi').
		data('dilosi', new Dilosi({
			xroma: xroma,
			pontoi: pontoi,
		})).
		data('click', function(e) {
			Tsoxa.panelAgoraDilosiIpovoli($(this));
		}).
		text(pontoi));

		data.dom.
		append(domXroma);
	});

	return Tsoxa;
};

Tsoxa.efoplismosΑΓΟΡΑvidaControls = function(data) {
	var aristera, dexia;

	data.domControls = $('<div>').addClass('tsoxaPanelAgoraVidaControls').
	append(aristera = $('<div>').addClass('tsoxaPanelAgoraVidaControlsLeft')).
	append(dexia = $('<div>').addClass('tsoxaPanelAgoraVidaControlsRight'));

	data.dom.
	append(data.domControls);

	aristera.append($('<div>').addClass('tsoxaButton tsoxaButtonAreoH').
	attr('id', 'escapeButton').
	text('ΠΑΣΟ').
	data('dilosi', new Dilosi().dilosiPasoSet()).
	data('click', function(e) {
		Tsoxa.panelAgoraDilosiIpovoli($(this));
	}));

	if (data.agora && data.agorastis.thesiOxiApenanti(data.thesi))
	aristera.append($('<div>').addClass('tsoxaButton tsoxaButtonAreoH').
	data('dilosi', new Dilosi().dilosiVidaSet()).
	data('click', function(e) {
		Tsoxa.panelAgoraDilosiIpovoli($(this));
	}).
	text('ΒΙΔΑ'));

	if (data.pontoiMax === null)
	return Tsoxa;

	dexia.
	append(Tsoxa.panelAgoraVidaMiosiButtonDOM = $('<div>').addClass('tsoxaButton').
	append($('<img>').attr('src', 'ikona/misc/prosKato.png').addClass('tsoxaPanelAgoraVidaIcon')).
	data('disabled', true).
	on('click', function(e) {
		if ($(this).data('disabled'))
		return;

		Tsoxa.panelAgoraVidaAfxisi(e, -40);
	})).
	append(Tsoxa.panelAgoraVidaAfxisiButtonDOM = $('<div>').addClass('tsoxaButton').
	append($('<img>').attr('src', 'ikona/misc/prosPano.png').addClass('tsoxaPanelAgoraVidaIcon')).
	data('disabled', true).
	on('click', function(e) {
		if ($(this).data('disabled'))
		return;

		Tsoxa.panelAgoraVidaAfxisi(e, 40);
	}));

	Tsoxa.panelAgoraVidaAfxisiCheck(data.pontoiMin);

	return Tsoxa;
};

Tsoxa.panelAgoraVidaAfxisi = function(e, afxisi) {
	var min;

	Arena.inputRefocus(e);

	min = 9999;
	$('.tsoxaPanelAgoraVidaPontoi').each(function() {
		var dilosi, pontoi;

		dilosi = $(this).data('dilosi');
		pontoi = dilosi.dilosiPontoiGet() + afxisi;
		dilosi.dilosiPontoiSet(pontoi);
		$(this).text(pontoi);

		if (pontoi < min)
		min = pontoi;

		return true;
	});

	Tsoxa.panelAgoraVidaAfxisiCheck(min);
};

Tsoxa.panelAgoraVidaAfxisiCheck = function(min) {
	var minOrio, trapezi, agora;

	minOrio = 80;

	trapezi = ego.trapeziGet();
	if (trapezi) {
		agora = trapezi.partidaAgoraGet();
		if (agora && agora.dilosiIsAgora())
		minOrio = agora.dilosiPontoiGet() + 10;
	}

	if (min <= minOrio)
	Tsoxa.panelAgoraVidaMiosiButtonDOM.data('disabled', true);

	else
	Tsoxa.panelAgoraVidaMiosiButtonDOM.removeData('disabled');

	if (min >= 780)
	Tsoxa.panelAgoraVidaAfxisiButtonDOM.data('disabled', true);

	else
	Tsoxa.panelAgoraVidaAfxisiButtonDOM.removeData('disabled');
};

Tsoxa.panelAgoraDilosiIpovoli = function(button) {
	var dilosi;

	Selida.fyi.pano();
	dilosi = button.data('dilosi');
	if (!dilosi)
	return;

	button.data('disabled', true);
	Selida.fyi.pano('Δήλωση αγοράς: <span class="entona prasina">' +
		dilosi.dilosiLektiko() + '</span>', 0);
	Selida.skiserService('agoraDilosi', 'dilosi=' + dilosi.dilosi2string()).
	done(function() {
		Selida.fyi.pano();
	}).
	fail(function(err) {
		Selida.skiserFail(err);
		button.removeData('disabled');
	});
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Tsoxa.efoplismosΚΟΝΤΡΑ = function() {
	var trapezi, thesi;

	trapezi = ego.trapeziGet();
	thesi = trapezi.partidaEpomenosGet();

	dom = $('<div>').
	attr('id', 'tsoxaPanelAgoraVida').
	addClass('tsoxaPanel efoplismos');

	dom.append($('<div>').addClass('tsoxaButton tsoxaButtonAreoH').
	attr('id', 'escapeButton').
	text('ΠΑΣΟ').
	data('dilosi', new Dilosi().dilosiPasoSet()).
	data('click', function(e) {
		Tsoxa.panelAgoraDilosiIpovoli($(this));
	}));

	if (trapezi.partidaTelefteaVidaGet().thesiOxiApenanti(thesi))
	dom.append($('<div>').addClass('tsoxaButton tsoxaButtonAreoH').
	data('dilosi', new Dilosi().dilosiVidaSet()).
	data('click', function(e) {
		Tsoxa.panelAgoraDilosiIpovoli($(this));
	}).
	text('ΒΙΔΑ'));

	Arena.tsoxaDOM.
	append(dom);

	return Tsoxa;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Tsoxa.efoplismosΠΑΙΧΝΙΔΙ = function() {
	var data = {}, xromaAtou, atouMax, xromaBaza, ektosAera;

	data.trapezi = ego.trapeziGet();
	data.thesi = data.trapezi.partidaEpomenosGet();
	if (!data.thesi)
	return Tsoxa;

	if (Arena.aerasButton.check())
	Arena.tsoxaDOM.
	append($('<div>').
	attr('id', 'tsoxaPanelPektis').
	addClass('efoplismos').
	append($('<img>').attr({
		src: Arena.aerasButton.img,
		title: Arena.aerasButton.title,
	}).
	addClass('tsoxaButton tsoxaButtonPektisIcon').
	data('click', function(e) {
		Arena.aerasButton.click(e);
	})));

	data.iseht = ego.mapThesi(data.thesi);
	data.fila = data.trapezi.partidaFilaGet(data.thesi);
	data.fila.domRefresh();
	data.filaDOM = Tsoxa.filaDOM[data.iseht];

	if (Tsoxa.isAerasIpovoli())
	return Tsoxa.efoplismosΠΑΙΧΝΙΔΙaeras(data);

	// Ο παίκτης που παίζει πρώτος φύλλο συνήθως αφαιρείται. Γι' αυτόν το
	// λόγο τυπώνουμε σχετικό μήνυμα στον παίκτη που παίζει το πρώτο φύλλο
	// της πρώτης μπάζας.

	if ((!data.trapezi.baza) &&
	(!data.trapezi.partidaBazesCount()))
	Tsoxa.minimaDOM.
	addClass('tsoxaMinimaNotice').
	text('Είναι η σειρά σας να παίξετε. Οι συμπαίκτες σας περιμένουν!');

	// Δημιουργούμε λίστα με τα φύλλα που πρόκειται να οπλίσουμε, δηλαδή
	// με τα φύλλα που μπορούν να παιχτούν. Αρχικά η λίστα είναι κενή και
	// στην πορεία θα προσθέσουμε φύλλα.

	data.flist = $();

	// Αν δεν έχει παιχτεί φύλλο στην τρέχουσα μπάζα, τότε όλα
	// τα φύλλα είναι υποψήφια.

	if (!data.trapezi.baza) {
		data.filaDOM.find('.filajsHandCard').each(function() {
			var filo;

			filo = data.fila.cardGet($(this).data('index'));

			// Αν έχει επιδειχθεί αέρας, περιοριζόμαστε στα φύλλα
			// του αέρα.

			if (data.trapezi.partidaAerasLastCheck(filo))
			data.flist = data.flist.add($(this));

			return true;
		});

		return Tsoxa.efoplismosΠΑΙΧΝΙΔΙoplismos(data);
	}

	// Η τρέχουσα μπάζα βρίσκεται σε εξέλιξη, επομένως θα χρειαστούμε
	// το χρώμα των ατού και το μεγαλύτερο ατού που ενδεχομένως έχει
	// παιχτεί στην μπάζα.

	xromaAtou = data.trapezi.partidaAgoraXromaGet();
	atouMax = 0;

	// Διατρέχουμε τα φύλλα της τρέχουσας μπάζας προκειμένου να
	// εντοπίσουμε το μεγαλύτερο ατού που έχει παιχτεί.

	data.trapezi.baza.cardWalk(function() {
		var dinami;

		// Αν δεν πρόκειται για ατού, το φύλλο δεν μας ενδιαφέρει.

		if (this.suitGet() !== xromaAtou)
		return;

		// Το ανά χείρας φύλλο είναι ατού, επομένως πρέπει να δούμε
		// αν είναι το μεγαλύτερο μέχρι στιγμής.

		dinami = Vida.axiaDinamiAtou[this.rankGet()];
		if (dinami <= atouMax)
		return;

		// Το ανά χείρας φύλλο είναι μέχρι στιγμής το μεγαλύτερο ατού.

		atouMax = dinami;
	});

	// Κατά τη έρευνα που θα διενεργήσουμε υπάρχει περίπτωση να εντοπίσουμε
	// φύλλο εκτός αέρα που θα μπορούμε να οπλίσουμε αν δεν είχε επιδειχθεί
	// αέρας. Αν εντοπίσουμε τέτοιο φύλλο θα θέσουμε σχετική flag σε true.

	ektosAera = false;

	// Οπλίζουμε τα φύλλα που είναι στο χρώμα του πρώτου φύλλου της μπάζας.

	xromaBaza = data.trapezi.baza.bazaXromaGet();

	// Αρχικά ελέγχουμε την εξαιρετική περίπτωση κατά την οποία το πρώτο
	// φύλλο της μπάζας είναι ατού. Σ' αυτήν την περίπτωση τα φύλλα που
	// θα οπλίσουμε πρέπει να είναι ατού και μάλιστα μεγαλύτερα από το
	// μέχρι στιγμής μεγαλύτερο ατού.

	if (xromaBaza === xromaAtou) {
		data.filaDOM.find('.filajsHandCard').each(function() {
			var filo;

			filo = data.fila.cardGet($(this).data('index'));
			if (filo.suitGet() !== xromaBaza)
			return true;

			if (Vida.axiaDinamiAtou[filo.rankGet()] <= atouMax)
			return true;

			ektosAera = true;

			if (!data.trapezi.partidaAerasLastCheck(filo))
			return true;

			data.flist = data.flist.add($(this));
			return true;
		});

		if (data.flist.length || ektosAera)
		return Tsoxa.efoplismosΠΑΙΧΝΙΔΙoplismos(data);
	}

	// Είτε πρόκειται για ατού, είτε όχι, θα οπλίσουμε φύλλα που είναι
	// στο χρώμα του πρώτου φύλλου της μπάζας.

	data.filaDOM.find('.filajsHandCard').each(function() {
		var filo;

		filo = data.fila.cardGet($(this).data('index'));
		if (filo.suitGet() !== xromaBaza)
		return true;

		ektosAera = true;

		if (!data.trapezi.partidaAerasLastCheck(filo))
		return true;

		data.flist = data.flist.add($(this));
		return true;
	});

	if (data.flist.length || ektosAera)
	return Tsoxa.efoplismosΠΑΙΧΝΙΔΙoplismos(data);

	// Δεν βρέθηκαν φύλλα στο χρώμα του πρώτου φύλλου της μπάζας,
	// επομένως θα πρέπει να οπλίσουμε τα ατού. Αν το πρώτο φύλλο
	// της μπάζας είναι στο χρώμα των ατού, τότε έχουμε ήδη αποτύχει,
	// επομένως ελέγχουμε μόνο την περίπτωση που το χρώμα του πρώτου
	// φύλλου δεν είναι στο χρώμα των ατού.

	data.filaDOM.find('.filajsHandCard').each(function() {
		var filo, xroma;

		filo = data.fila.cardGet($(this).data('index'));
		xroma = filo.suitGet();

		if (xroma !== xromaAtou)
		return true;

		if (Vida.axiaDinamiAtou[filo.rankGet()] <= atouMax)
		return true;

		ektosAera = true;

		if (!data.trapezi.partidaAerasLastCheck(filo))
		return true;

		data.flist = data.flist.add($(this));
		return true;
	});

	if (data.flist.length || ektosAera)
	return Tsoxa.efoplismosΠΑΙΧΝΙΔΙoplismos(data);

	data.filaDOM.find('.filajsHandCard').each(function() {
		var filo, xroma;

		filo = data.fila.cardGet($(this).data('index'));
		xroma = filo.suitGet();

		if (xroma !== xromaAtou)
		return true;

		ektosAera = true;

		if (!data.trapezi.partidaAerasLastCheck(filo))
		return true;

		data.flist = data.flist.add($(this));
		return true;
	});

	if (data.flist.length || ektosAera)
	return Tsoxa.efoplismosΠΑΙΧΝΙΔΙoplismos(data);

	data.filaDOM.find('.filajsHandCard').each(function() {
		var filo;

		filo = data.fila.cardGet($(this).data('index'));
		if (!data.trapezi.partidaAerasLastCheck(filo))
		return true;

		data.flist = data.flist.add($(this));
		return true;
	});

	return Tsoxa.efoplismosΠΑΙΧΝΙΔΙoplismos(data);
};

// Η μέθοδος που ακολουθεί οπλίζει τα φύλλα που δίνονται ως "flist" property στο
// αντικείμενο που περνάμε ως μια και μόνη παράμετρο.

Tsoxa.efoplismosΠΑΙΧΝΙΔΙoplismos = function(data) {
	Tsoxa.fyiDOM.empty();
	if (!data.flist.length) {
		Selida.
		fyi.ekato('Κάτι κάνατε λάθος. Ακυρώστε την τελευταία σας κίνηση!').
		ixos.beep();
		return Tsoxa;
	}

	// Τα οπλισμένα φύλλα ανασηκώνονται ελαφρώς ώστε να είναι εμφανή τα φύλλα
	// που μπορεί να παίξει ο παίκτης. Αν, όμως, πρόκειται για όλα τα φύλλα
	// τότε αυτό δεν έχει νόημα.

	if (data.flist.length < data.fila.cardsCount())
	data.flist.raiseCard();

	data.flist.

	// Τα οπλισμένα φύλλα πρέπει να ανασηκώνονται ακόμη λίγο όταν ο παίκτης
	// τοποθετεί επάνω τους τον δείκτη του ποντικιού.

	off('mouseenter').on('mouseenter', function(e) {
		$(this).
		addClass('tsoxaFiloCandi').
		raiseCard();
	}).
	off('mouseleave').on('mouseleave', function(e) {
		$(this).
		removeClass('tsoxaFiloCandi').
		lowerCard();
	}).

	// Το κλικ σε οπλισμένο φύλλο σημαίνει παίξιμο του συγκεκριμένου φύλλου.
	// Σ' αυτήν την περίπτωση το φύλλο αρχίζει να κινείται προς το κέντρο του
	// τραπεζιού και συγκεκριμένα προς τη θέση που πρόκειται να καταλάβει στην
	// τρέχουσα μπάζα.

	off('click').on('click', function(e) {
		var filo, index, params;

		Arena.inputRefocus(e);

		// Αποφεύγουμε το double click.

		if ($(this).data('klik'))
		return;
		$(this).data('klik', true);

		$('#tsoxaPanelPektis').remove();
		Tsoxa.minimaResetDOM(Arena.bazaFiloDuration);

		filo = $(this).find('.filajsCard').data('card');

		// Πριν κοινοποιήσουμε το φύλλο στον skiser, ελέγχουμε ενδεχόμενο
		// μπουρλότο (ντάμα ρήγας ατού). Αν όντως πρόκειται για το πρώτο
		// φύλλο από το μπουρλότο, τότε περνάμε σε δεύτερο αρμάτωμα που
		// σχετίζεται με πανελάκι στο οποίο το πρόγραμμα προτείνει στο
		// χρήστη να δηλώσει ή όχι το μπουρλότο.

		if (Tsoxa.efoplismosΠΑΙΧΝΙΔΙisBourloto(data, filo, $(this)))
		return Tsoxa.efoplismosΠΑΙΧΝΙΔΙoplismosBourloto(data, filo, $(this));

		// Αφοπλίζουμε όλα τα φύλλα του παίκτη και ακυρώνουμε το ανέβασμα
		// των υποψηφίων.

		data.flist.off('click');
		$(this).removeClass('tsoxaFiloCandi');

		// Εκκινούμε την κίνηση του φύλλου προς το κέντρο του
		// τραπεζιού.

		index = $(this).data('index');
		filo.faceUp().domRefresh();

		data.fila.cardAnimate(index, Tsoxa.baza, {
			width: Arena.bazaFiloWidth,
			duration: Arena.bazaFiloDuration,
		});

		// Παράλληλα αποστέλλουμε την ενέργεια του παιξίματος του φύλλου
		// προς τον server σκηνικού.

		params = 'filo=' + filo.toString();
		if (filo.data('bourloto') === 2)
		params += '&bourloto=1';

		Tsoxa.bazaFiloEgo = true;
		Selida.skiserService('filo', params).
		done(function(rsp) {
			if (rsp)
			console.error(rsp);
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			delete Tsoxa.bazaFiloEgo;
			Tsoxa.
			filaRefreshDOM().
			bazaRefreshDOM();
		});
	});

	return Tsoxa;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function που ακολουθεί ελέγχει μήπως το φύλλο που παίχτηκε είναι το πρώτο
// φύλλο από ενδεχόμενο μπουρλότο (ντάμα ρήγας ατού) που ίσως κρατάει ο παίκτης.

Tsoxa.efoplismosΠΑΙΧΝΙΔΙisBourloto = function(data, filo, filoDOM) {
	var atou, count;

	// Αν έχει ήδη δηλωθεί μπουρλότο στη συγκεκριμένη διανομή, τότε προφανώς
	// δεν πρόκειται για το πρώτο φύλλο του μπουρλότου.

	if (data.trapezi.partidaIsBourloto())
	return false;

	// Ακολουθεί ένα λεπτό σημείο που έχει να κάνει με τη δεύτερη κλήση του
	// click event πάνω στο φύλλο. Πράγματι, αν το φύλλο που παίχτηκε ήταν
	// το πρώτο φύλλο του μπουρλότου, τότε μετά την επιλογή του παίκτη για
	// δημοσιοποίηση ή μη του μπουρλότου, το φύλλο πρέπει να παιχτεί κανονικά
	// ωσάν να επρόκειτο για ένα οποιδήποτε φύλλο. Για το σκοπό αυτό θα γίνει
	// trigger το click event πάνω στο φύλλο, αλλά θα πρέπει να αποφευχθεί
	// ένας εκ νέου έλεγχος για πιθανό μπουρλότο. Αυτό ακριβώς το διασφαλίζουμε
	// με το data "bourloto" στο ανά χείρας φύλλο.

	if (filo.data('bourloto'))
	return false;

	atou = data.trapezi.partidaAgoraXromaGet();
	if (filo.suitUnlike(atou))
	return false;

	switch (filo.rankGet()) {
	case 'Q':
	case 'K':
		break;
	default:
		return false;
	}

	// Θέτουμε data "bourloto" με τιμή 1 στα φύλλα του μπουρλότου προκειμένου
	// να μην επανεξεταστεί το φύλλο για πιθανό μπουρλότο στο δεύτερο πέρασμα.
	// Αργότερα και εφόσον ο παίκτης δηλώσει μπουρλότο, η τιμή αυτή θα γίνει 2.

	count = 0;
	data.fila.cardWalk(function() {
		if (this.suitUnlike(atou))
		return;

		switch (this.rankGet()) {
		case 'Q':
		case 'K':
			this.data('bourloto', 1);
			++count;
		}
	});

	return(count === 2);
};

Tsoxa.efoplismosΠΑΙΧΝΙΔΙoplismosBourloto = function(data, filo, filoDOM) {
	filoDOM.
	off('mouseleave mouseenter');

	Arena.tsoxaDOM.
	append($('<div>').
	attr('id', 'tsoxaPanelPektis').
	addClass('efoplismos').
	append($('<div>').addClass('tsoxaButton tsoxaButtonPektis').
	text('ΜΠΟΥΡΛΟΤΟ').
	data('click', function(e) {
		filo.data('bourloto', 2);
		filoDOM.removeData('klik').trigger('click');
	})).
	append($('<div>').addClass('tsoxaButton tsoxaButtonPektis').
	text('ΑΚΥΡΟ').
	data('click', function(e) {
		filoDOM.removeData('klik').trigger('click');
	})));

	return Tsoxa;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Tsoxa.efoplismosΠΑΙΧΝΙΔΙaeras = function(data) {
	var filo;

	data.fila.domRefresh();

	switch (Tsoxa.efoplismosΠΑΙΧΝΙΔΙaerasExtract(data.fila)) {
	case 0:
		Tsoxa.afoplismos();
		Arena.aerasButton.click();
		// fall through
	case 1:
		return Tsoxa;
	}

	data.flist = $();
	data.fila.cardWalk(function() {
		// Εξαιρούμε τα φύλλα που έχουν ήδη επιδειχθεί ως αέρας.

		if (this.data('aeras'))
		return;

		data.flist = data.flist.add(this.domGet().parent('.filajsHandCard'));
	});

	filo = Tsoxa.aerasIpovoliProtoGet();
	if (!filo)
	return Tsoxa.efoplismosΠΑΙΧΝΙΔΙaeras1(data);

	return Tsoxa;
};

// Η function "aerasExtract" δέχεται τη χαρτωσιά του παίκτη και επιχειρεί να
// αποσπάσει έναν και μοναδικό αέρα από αυτά τα φύλλα. Αν, όντως, εντοπιστεί
// ένας και μοναδικός αέρας, τότε αυτός υποβάλλεται αυτόματα σε διαβούλευση
// χωρίς να μεσολαβήσει ο παίκτης και επιστρέφεται 1. Αν δεν βρεθεί καθόλου
// αέρας στα φύλλα του παίκτη επιστρέφεται 0, ενώ σε περιπτώσεις ασάφειας
// επιστρέφεται 2 και ο παίκτης θα κληθεί να επιλέξει τα ακριανά φύλλα.

Tsoxa.efoplismosΠΑΙΧΝΙΔΙaerasExtract = function(fila) {
	var alif, len, count, nfila, amorx, aixa, aeras, kare, i, filo, xroma, axia, eklise;

	// Δημιουργούμε προσωρινή χαρτωσιά με τα φύλλα του παίκτη που δεν έχουν
	// ήδη υποβληθεί ως αέρας.

	alif = new filajsHand();
	fila.cardWalk(function() {
		// Εξαιρούμε τα φύλλα που έχουν ήδη επιδειχθεί ως αέρας.

		if (this.data('aeras'))
		return;

		alif.cardPush(this);
	});

	// Η μεταβλητή "count" μετράει το πλήθος των αέρηδων που περιέχονται
	// στα φύλλα του παίκτη, και ως εκ τούτου τίθεται αρχικά μηδέν.

	count = 0;

	// Η μεταβλητή "nfila" μετράει το πλήθος των φύλλων του τρέχοντος αέρα.

	nfila = 0;

	// Ο μεταβλητή "amorx" είναι το χρώμα του προηγούμενου φύλλου.

	amorx = undefined;

	// Η μεταβλητή "aixa" είναι η αξία του προηγούμενου φύλλου.

	aixa = undefined;

	// Η μεταβλητή "aeras" κρατάει τον έναν και μοναδικό αέρα που ενδεχομένως
	// εμπεριέχεται στα φύλλα του παίκτη, καθώς αυτός ο αέρας θα χρειαστεί να
	// υποβληθεί.

	aeras = undefined;

	// Η flag "eklise" δείχνει αν ο ενδεχόμενος ένας και μοναδικός αέρας έχει
	// ήδη σχηματιστεί και έχει κλείσει. Ένα σενάριο στο οποίο η εν λόγω flag
	// αποδεκινύεται χρήσιμη είναι το εξής:
	//
	// Κούπες: 7, 8, 9, K και A.
	// Σ' αυτήν την περίπτωση θα σχηματιστεί τρίτη 7, 8, 9 και κατόπιν θα γίνει
	// διακοπή λόγω του ρήγα που θα βρεθεί εκτός σειράς. Μετά το ρήγα, όμως, θα
	// υπάρξει ο άσος που καθώς είναι στη σειρά με το ρήγα θα λογιστεί ως καλό
	// φύλλο για τον αέρα ο οποίος θα διαμορφωθεί ως: 7, 8, 9 και A.

	eklise = false;

	// Η δομή "kare" κρατάει το πλήθος των φύλλων που μπορούν να εμπλέκονται σε
	// καρέ.

	kare = {
		'9': 0,
		'T': 0,
		'J': 0,
		'Q': 0,
		'K': 0,
		'A': 0,
	};

	alif.sort();
	len = alif.cardsCount();

	for (i = 0; i < len; i++) {
		filo = alif.cardGet(i);

		xroma = filo.suitGet();
		axia = filo.rankGet();

		// Αυξάνουμε το πλήθος των φύλλων με βάση την αξία του
		// φύλλου.

		if (kare.hasOwnProperty(axia))
		kare[axia]++;

		// Από εδώ και στο εξής η αξία του φύλλου μας ενδιαφέρει
		// μόνο ως σειρά στο αέρα: 7 (0), 8 (1), 9 (2), 10 (3),
		// J (4), Q (5), K (6), A (7).

		axia = Vida.axiaAeras[axia];

		// Αν έχουμε αλλαγή στο χρώμα, τότε ξεκινάμε ωσάν να έχουμε
		// νέον αέρα σε εξέλιξη.

		if (xroma !== amorx) {
			amorx = xroma;
			aixa = axia;
			nfila = 1;

			// Ξεκινάμε να κρατάμε τα φύλλα του αέρα μόνον εφόσον
			// δεν έχουμε ήδη καταμετρήσει κάποιον αέρα.

			if (count)
			eklise = true;

			else
			aeras = new filajsHand(filo);

			continue;
		}

		// Το φύλλο είναι ομοιόχρωμο με το προηγούμενο, επομένως ελέγχουμε
		// μήπως είναι εκτός σειράς. Αν είναι εκτός σειράς τότε θεωρούμε
		// και πάλι ότι έχουμε νέον αέρα σε εξέλιξη.

		if (axia !== (aixa + 1)) {
			aixa = axia;
			nfila = 1;

			if (count)
			eklise = true;

			else
			aeras = new filajsHand(filo);

			continue;
		}

		// Πρόκειται για φύλλο που «κολλάει» με τα προηγούμενα σε σχηματισμό
		// αέρα. Κρατάμε την αξία του (ως αέρα) και αυξάνουμε το πλήθος των
		// φύλλων του υπό σχηματισμό αέρα.

		aixa = axia;
		nfila++;

		// Αν τα φύλλα του υπό σχηματισμό αέρα είναι περισσότερα από 5, τότε
		// έχουμε ασάφεια και θα πρέπει ο παίκτης να επιλέξει τα ακριανά φύλλα.

		if (nfila > 5)
		return 2;

		// Αν τα φύλλα σχηματίζουν ήδη τον ελάχιστο αέρα (τρίτη), τότε αυξάνουμε
		// το πλήθος των αέρηδων κατά ένα.

		if (nfila === 3) {
			count++;

			// Εφόσον έχουν εντοπιστεί περισσότεροι από ένας αέρηδες, υπάρχει
			// ασάφεια και ο παίκτης θα πρέπει να επιλέξει τα ακριανά φύλλα.

			if (count > 1)
			return 2;
		}

		// Εάν έχει ήδη σχηματιστεί και έχει «κλείσει» ένας αέρας, δεν προσθέτουμε
		// άλλα φύλλα.

		if (eklise)
		continue;

		// Όλα δείχνουν ότι το φύλλο ανήκει στον ενδεχόμενο έναν και μοναδικό αέρα,
		// επομένως προσθέτουμε το φύλλο στον υπό σχηματισμό αέρα.

		aeras.cardPush(filo);
	}

	// Έχουμε περατώσει τον έλεγχο όσον αφορά σε τρίτες, τετάρτες και πέμπτες και θα
	// προχωρήσουμε στον έλεγχο των καρέ.

	for (axia in kare) {
		if (kare[axia] < 4)
		continue;

		// Υπάρχει καρέ, επομένως αυξάνουμε το πλήθος των αέρηδων κατά ένα.

		count++;

		// Αν οι μέχρι στιγμής καταμετρημένοι αέρηδες είναι περισσότεροι από
		// ένας, τότε υπάρχει ασάφεια και ο παίκτης θα πρέπει να επιλέξει τα
		// ακριανά φύλλα.

		if (count > 1)
		return 2;

		// Εντοπίσαμε καρέ ως πρώτον αέρα στα φύλλα του παίκτη, επομένως
		// σχηματίζουμε τον σχετικό αέρα.

		aeras = new filajsHand('S' + axia + 'D' + axia + 'C' + axia + 'H' + axia);
	}

	// Αν μετά από όλα τα παραπάνω δεν έχει εντοπιστεί αέρας, τότε δεν προβαίνουμε
	// σε περαιτέρω ενέργειες.

	if (count < 1)
	return 0;

	// Αν έχουν εντοπιστεί περισσότεροι από έναν αέρηδες, τότε ο παίκτης θα πρέπει
	// διαλέξει τα ακριανά φύλλα του αέρα. Η περίπτωση αυτή έχει ήδη αντιμετωπστεί
	// αλλά την εξετάζουμε για λόγους πληρότητας.

	if (count > 1)
	return 2;

	// Έχει εντοπιστεί ακριβώς ένας αέρας, οπότε προψωρούμε στην αυτόματη υποβολή
	// του εν λόγω αέρα σε διαβούλευση.

	Selida.skiserService('aerasIpovoli', 'aeras=' + aeras.toString()).
	done(function() {
		Tsoxa.aerasIpovoliClear();
	}).
	fail(function(err) {
		Selida.skiserFail(err);
	});

	return 1;
};

Tsoxa.efoplismosΠΑΙΧΝΙΔΙaeras1 = function(data) {
	Tsoxa.fyiDOM.text('Επιλέξτε το πρώτο φύλλο του συνδυασμού');

	if (data.flist.length < data.fila.cardsCount())
	data.flist.off().raiseCard();

	data.flist.
	on('mouseenter', function(e) {
		$(this).
		addClass('tsoxaFiloCandi').
		raiseCard();
	}).
	on('mouseleave', function(e) {
		$(this).
		removeClass('tsoxaFiloCandi').
		lowerCard();
	}).
	on('click', function(e) {
		var filo;

		Arena.inputRefocus(e);
		Selida.fyi.ekato();

		filo = $(this).children('.filajsCard').data('card');
		if (!filo)
		return;

		$(this).off();

		// XXX
		// Στον κώδικα που ακολουθεί μπορεί να χρειαστεί να αποθηκεύσουμε
		// αντίγραφο του φύλλου και όχι το ίδιο το φύλλο. Αυτό θα φανεί
		// εφόσον παρατηρηθεί εξαφάνιση ή αλλοίωση του αέρα κατά την
		// εξέλιξη της διανομής.

		Tsoxa.aerasIpovoliProtoSet(filo);
		Tsoxa.efoplismosΠΑΙΧΝΙΔΙaeras2(data);
	});

	return Tsoxa;
};

Tsoxa.efoplismosΠΑΙΧΝΙΔΙaeras2 = function(data) {
	Tsoxa.fyiDOM.text('Επιλέξτε το τελευταίο φύλλο του συνδυασμού');

	data.flist.
	off('click').on('click', function(e) {
		var filo;

		Arena.inputRefocus(e);
		filo = $(this).children('.filajsCard').data('card');
		if (!filo)
		return Tsoxa;

		data.flist.off();
		Tsoxa.aerasIpovoliTelefteoSet(filo);

		if (Tsoxa.aerasIpovoliLathos(data)) {
			Tsoxa.aerasIpovoliReset();
			Selida.
			fyi.ekato('Λανθασμένος αέρας. Επιχειρήστε πάλι…').
			ixos.beep();
			return Tsoxa.efoplismosΠΑΙΧΝΙΔΙaeras(data);
		}

		Selida.skiserService('aerasIpovoli', 'aeras=' + data.aeras.toString()).
		done(function() {
			Tsoxa.aerasIpovoliClear();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
		});
	});

	return Tsoxa;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Tsoxa.efoplismosΑΕΡΑΣ = function() {
	var trapezi, thesi, panelDOM;

	trapezi = ego.trapeziGet();
	thesi = trapezi.partidaEpomenosGet();

	panelDOM = $('<div>').
	attr('id', 'tsoxaPanelPektis').
	addClass('efoplismos').
	on('mousedown', function(e) {
		e.preventDefault();
	}).appendTo(Arena.tsoxaDOM);

	panelDOM.
	append($('<div>').addClass('tsoxaButton tsoxaButtonPektis').
	attr('id', 'escapeButton').
	text('ΝΑΙ').
	data('click', function(e) {
		Tsoxa.panelAerasApodoxi($(this));
	}));

	if (trapezi.partidaAerasCount() > 1)
	return Tsoxa;

	panelDOM.
	append($('<div>').addClass('tsoxaButton tsoxaButtonPektis').
	text('ΟΧΙ').
	data('click', function(e) {
		Tsoxa.panelAerasApodoxi($(this));
	}));

	if (trapezi.denPeziKomeni())
	return Tsoxa;

	panelDOM.
	append($('<div>').addClass('tsoxaButton tsoxaButtonPektis').
	text('ΚΟΜΜΕΝΗ').
	data('click', function(e) {
		Tsoxa.panelAerasApodoxi($(this));
	}));

	return Tsoxa;
};

Tsoxa.panelAerasApodoxi = function(button) {
	var apodoxi;

	apodoxi = button.text();
	if (!apodoxi)
	return;

	button.data('disabled', true);
	Selida.fyi.pano('Απάντηση στον αέρα');
	Selida.skiserService('aerasApodoxi', 'apodoxi=' + apodoxi).
	done(function() {
		Selida.fyi.pano();
	}).
	fail(function(err) {
		Selida.skiserFail(err);
		button.removeData('disabled');
	});
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
