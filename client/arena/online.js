Trapezi.prototype.trapeziEnergiaOnlineΔΙΑΝΟΜΗ = function(energia, callback) {
	var dealer, trapoula, apo, thesi, fila = {}, ncards;

	Tsoxa.
	partidaReplay().
	fasiRefreshDOM().
	dealerRefreshDOM().
	epomenosRefreshDOM().
	filaRefreshDOM().
	klistaRefreshDOM().
	dilosiRefreshDOM().
	egrisiRefreshDOM();

	Selida.ixos.dianomi();
	dealer = energia.energiaPektisGet();
	Tsoxa.dilosiDOM[dealer].
	append($('<img>').attr({
		id: 'tsoxaPektisEndixi' + dealer,
		src: 'ikona/working/koutakia.gif',
	}).addClass('tsoxaPektisEndixi tsoxaPektisEndixiDealer'));

	trapoula = energia.energiaDataGet().filajsToHand();
	ncards = this.trapeziIsBelot() ? 5 : 8;

	for (apo = 0, thesi = 1; thesi <= Vida.thesiMax; thesi++, apo += 8) {
		this.fila[thesi] = new filajsHand();
		fila[thesi] = trapoula.slice(apo, ncards);
		fila[thesi].cardWalk(function() {
			if (thesi > 1)
			this.widthSet(40);
			this.domRefresh();
		});
	}

	this.trapeziEnergiaOnlineΔΙΑΝΟΜΗfilo(fila, ncards, callback, energia, 1000 / ncards);

	return this;
};

Trapezi.prototype.trapeziEnergiaOnlineΔΙΑΝΟΜΗfilo = function(fila, n, callback, energia, delay) {
	var trapezi = this;

	this.trapeziThesiWalk(function(thesi) {
		this.fila[thesi].
		cardPush(fila[thesi].cardPop()).
		domRefresh();
		Tsoxa.filaRefreshDOM(thesi);
	});

	if (n < 2) {
		Selida.ixos.play('bell/handbell.ogg', 3);
		Tsoxa.dilosiRefreshDOM();
		callback.call(this, energia);
		return this;
	}

	setTimeout(function() {
		trapezi.trapeziEnergiaOnlineΔΙΑΝΟΜΗfilo(fila, n - 1, callback, energia, delay);
	}, delay);

	return this;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.trapeziEnergiaOnlineΔΗΛΩΣΗ = function(energia, callback) {
	var trapezi = this, edata, dilosi, eptari, dealer, klista, pektis, fila, filaLen, i, filo;

	// Αν είμαστε σε παρτίδα βίδας, δεν υπάρχει λόγος για κάποιο animation,
	// ή κάποια άλλη ασύγχρονη ενέργεια.

	if (this.trapeziIsVida()) {
		callback.call(this, energia);
		Selida.ixos.tik();
		return this;
	}

	// Βρισκόμαστε σε παρτίδα μπουρλότου. Εδώ υπάρχουν πολλά που πρέπει να
	// γίνουν.

	edata = energia.energiaDataGet().split(':');

	dilosi = new Dilosi(edata[0]);
	if (dilosi.dilosiIsPaso())
	return this.trapeziEnergiaOnlineΔΗΛΩΣΗpaso(energia, callback);

	// Αν υπάρχει δεύτερο τμήμα στα δεδομένα της ενεργείας, τότε πρόκειται για
	// το φύλλο που αλλάζει με το επτάρι. Εξετάζουμε πρώτα την απλή περίπτωση
	// κατά την οποία ΔΕΝ έχουμε αλλαγή με το ΕΠΤΑΡΙ.

	if (!edata[1])
	return this.trapeziEnergiaOnlineΔΗΛΩΣΗoxiEptari(energia, dilosi, callback);

	// Υπάρχει αγορά με ταυτόχρονη αλλαγή με το ομοιόχρωμο ΕΠΤΑΡΙ.

	dealer = this.partidaDealerGet();
	klista = this.partidaKlistaGet(dealer);

	pektis = energia.energiaPektisGet();

	Tsoxa.afoplismos();
	dilosi.agoraRefreshDOM(Tsoxa.dilosiDOM[ego.mapThesi(pektis)].
	addClass('tsoxaDilosiAgoraTora'));

	// Θα διατρέξουμε τα φύλλα του παίκτη που έκανε την αγορά προκειμένου
	// να εντοπίσουμε το επτάρι των ατού.

	fila = this.partidaFilaGet(pektis);
	filaLen = fila.cardsCount();
	eptari = new filajsCard({
		suit: dilosi.dilosiXromaGet(),
		rank: '7',
	});

	for (i = 0; i < filaLen; i++) {
		if (fila.cardGet(i).like(eptari))
		break;
	}

	// Αν δεν βρέθηκε το επτάρι των ατού στα φύλλα του παίκτη, τότε θεωρούμε
	// ότι αυτό βρίσκεται στη μέση της χαρτωσιάς, δηλαδή ότι είναι το τρίτο
	// φύλλο.

	if (i >= filaLen)
	i = 2;

	filo = fila.cardGet(i);
	width = filo.domGet().width();

	klista.cardAnimate(2, fila, {
		width: width,
		duration: Arena.eptariAgoraDuration1,
		callback: function() {
			fila.
			domRefresh();

			fila.cardGet(i).
			faceUp().
			domRefresh();

			fila.cardAnimate(i, klista, {
				width: 70,
				duration: Arena.eptariAgoraDuration2,
				callback: function() {
					callback.call(trapezi, energia);
					Selida.ixos.tik();
				},
			});
		},
	});

	return this;
};

Trapezi.prototype.trapeziEnergiaOnlineΔΗΛΩΣΗoxiEptari = function(energia, dilosi, callback) {
	if (dilosi.dilosiOxiXroma()) {
		callback.call(this, energia);
		Selida.ixos.tik();
		return this;
	}

	// Είμαστε σε online mode, επομένως η ανά χείρας δήλωση δεν έχει ακόμη
	// καταμετρηθεί. Αν, πάντως, έχουν ήδη συμπληρωθεί δηλώσεις και από τους
	// τέσσερις παίκτες, τότε πρόκειται για αγορά που γίνεται στο δεύτερο γύρο
	// της αγοράς, επομένως θα πρέπει να μοιράσουμε τα υπόλοιπα φύλλα και να
	// προχωρήσουμε στη φάση του παιχνιδιού.

	if (this.partidaDilosiCountGet() >= 4)
	return this.trapeziEnergiaOnlineΔΗΛΩΣΗagoraDefteri(energia, dilosi, callback);

	callback.call(this, energia);
	Selida.ixos.tik();
	return this;
};

// Ακολουθεί μέθοδος που αναλαμβάνει να μοιράσει τα υπόλοιπα φύλλα μετά από τυχόν
// αγορά που έγινε στο δεύτερο γύρο, και αμέσως μετά να περάσει την παρτίδα σε
// φάση εκτέλεσης.

Trapezi.prototype.trapeziEnergiaOnlineΔΗΛΩΣΗagoraDefteri = function(energia, dilosi, callback) {
	var dom;

	// Κάνουμε εμφανή την αγορά που μόλις έγινε.

	Tsoxa.afoplismos();
	dom = Tsoxa.dilosiDOM[ego.mapThesi(energia.energiaPektisGet())];
	dom.
	empty().
	removeClass().
	addClass('tsoxaDilosi tsoxaDilosiAgoraTora').
	css('backgroundColor', '#FFA947').
	finish().
	animate({
		backgroundColor: '#F2FF93',
	}, 800, 'easeInElastic', function() {
		$(this).css('backgroundColor', '');
	});
	dilosi.agoraRefreshDOM(dom);

	// Προχωρούμε στην τακτοποίηση της τράπουλας και στο μοίρασμα των
	// υπόλοιπων φύλλων.

	this.
	partidaKlistaGet(this.partidaDealerGet()).
	domGet().
	fadeOut();

	this.trapeziEnergiaOnlineΔΗΛΩΣΗdealKlista(energia, callback, 3);
	return this;
};

Trapezi.prototype.trapeziEnergiaOnlineΔΗΛΩΣΗpaso = function(energia, callback) {
	var agorastis, pektis;

	agorastis = this.partidaAgorastisGet();
	if (!agorastis) {
		callback.call(this, energia);
		Selida.ixos.tik();
		return this;
	}

	pektis = energia.energiaPektisGet();

	if (pektis.thesiEpomeni() !== agorastis) {
		callback.call(this, energia);
		Selida.ixos.tik();
		return this;
	}

	this.
	partidaKlistaGet(this.partidaDealerGet()).
	domGet().
	fadeOut();

	Tsoxa.afoplismos();
	this.trapeziEnergiaOnlineΔΗΛΩΣΗdealKlista(energia, callback, 3);

	return this;
};

Trapezi.prototype.trapeziEnergiaOnlineΔΗΛΩΣΗdealKlista = function(energia, callback, n) {
	var trapezi = this, fatsa, plati;

	if (n === 0) {
		callback.call(this, energia);
		Selida.ixos.play('bell/handbell.ogg', 3);
		return this;
	}

	fatsa = Debug.flagGet('striptiz');
	plati = ego.platiGet();

	this.trapeziThesiWalk(function(thesi) {
		var fila, klista, filo, width;

		fila = this.partidaFilaGet(thesi);
		klista = this.partidaKlistaGet(thesi);

		filo = fila.cardGet(0);
		width = filo.widthGet();

		filo = klista.
		cardPop().
		widthSet(width).
		faceSet(ego.mapThesi(thesi) === 1 ? true : fatsa).
		backSet(plati).
		domRefresh();

		fila.
		cardPush(filo).
		domRefresh();
	});

	setTimeout(function() {
		trapezi.trapeziEnergiaOnlineΔΗΛΩΣΗdealKlista(energia, callback, n - 1);
	}, 300);

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.trapeziEnergiaOnlineΕΠΤΑΡΙ = function(energia, callback) {
	var trapezi = this, pektis, eptari, agora, dealer, klista, fila, filaLen, i, filo;

	pektis = energia.energiaPektisGet();
	eptari = energia.energiaDataGet();

	agora = this.partidaAgoraGet();
	dealer = this.partidaDealerGet();
	klista = this.partidaKlistaGet(dealer);

	Tsoxa.afoplismos();

	// Θα διατρέξουμε τα φύλλα του παίκτη που έκανε την αγορά προκειμένου
	// να εντοπίσουμε το επτάρι των ατού.

	fila = this.partidaFilaGet(pektis);
	filaLen = fila.cardsCount();
	eptari = new filajsCard({
		suit: agora.dilosiXromaGet(),
		rank: '7',
	});

	for (i = 0; i < filaLen; i++) {
		if (fila.cardGet(i).like(eptari))
		break;
	}

	// Αν δεν βρέθηκε το επτάρι των ατού στα φύλλα του παίκτη, τότε θεωρούμε
	// ότι αυτό βρίσκεται στη μέση της χαρτωσιάς, δηλαδή ότι είναι το τρίτο
	// φύλλο.

	if (i >= filaLen)
	i = 2;

	filo = fila.cardGet(i);
	width = filo.domGet().width();

	klista.cardAnimate(2, fila, {
		width: width,
		duration: Arena.eptariAlagiDuration1,
		callback: function() {
			fila.
			domRefresh();

			fila.cardGet(i).
			faceUp().
			domRefresh();

			fila.cardAnimate(i, klista, {
				width: 70,
				duration: Arena.eptariAlagiDuration2,
				callback: function() {
					if (pektis.thesiEpomeni() !== trapezi.partidaAgorastisGet()) {
						callback.call(trapezi, energia);
						Selida.ixos.tik();
						return;
					}

					Tsoxa.
					afoplismos().
					minimaDOM.html('Ο παίκτης <span style="color: #542915;">' +
						trapezi.trapeziOnomaThesis(pektis) +
						'</span> άλλαξε το επτάρι. Περιμένετε τα υπόλοιπα φύλλα…');
					setTimeout(function() {
						trapezi.
						partidaKlistaGet(trapezi.partidaDealerGet()).
						domGet().
						fadeOut();
						trapezi.trapeziEnergiaOnlineΔΗΛΩΣΗdealKlista(energia, callback, 3);
					}, 1000);
				},
			});
		},
	});

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.trapeziEnergiaOnlineΦΥΛΛΟ = function(energia, callback) {
	var trapezi = this, thesi, iseht, data, filo, fila, filaCount, idx, olif;

	thesi = energia.energiaPektisGet();
	iseht = ego.mapThesi(thesi);
	data = energia.energiaDataGet().split(':');

	if (data[1])
	Tsoxa.egrisiDOM[iseht].
	removeClass().
	addClass('tsoxaEgrisi tsoxaEgrisiBourloto').
	css('opacity', 0).
	text('ΜΠΟΥΡΛΟΤΟ').
	fadeTo(Arena.bazaFiloDuration, 1);

	if (this.baza && (this.baza.cardsCount() === 3) && (trapezi.partidaBazesCount() === 7))
	Tsoxa.skorNoticeDOM();

	if (Tsoxa.bazaFiloEgo) {
		delete Tsoxa.bazaFiloEgo;
		setTimeout(function() {
			Selida.ixos.filo(iseht);
			callback.call(trapezi, energia);
		}, Arena.bazaFiloDuration);
		return this;
	}

	filo = new filajsCard(data[0]);
	fila = this.partidaFilaGet(thesi);
	filaCount = fila.cardsCount();

	for (idx = 0; idx < filaCount; idx++) {
		olif = fila.cardGet(idx);
		if (olif.unlike(filo))
		continue;

		olif.faceUp().domRefresh();
		break;
	}

	if (idx >= filaCount) {
		fila.cardPop().cardPush(filo.domCreate().domRefresh())
		idx = filaCount - 1;
	}

	fila.cardAnimate(idx, Tsoxa.baza, {
		width: Arena.bazaFiloWidth,
		duration: Arena.bazaFiloDuration,
		callback: function() {
			Selida.ixos.filo(iseht);
			callback.call(trapezi, energia);
		},
	});

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.trapeziEnergiaOnlineΜΠΑΖΑ = function(energia, callback) {
	var trapezi = this, thesi, iseht, bazaPekti, dom, bazaLen, n, i;

	thesi = energia.energiaPektisGet();
	iseht = ego.mapThesi(thesi);

	bazaPekti = new filajsHand().
	circleSet($('#filajsCircle11'));

	dom = bazaPekti.domCreate().domGet().css('top', '-10px');
	switch (iseht) {
	case 3:
	case 2:
		Tsoxa.bazesDOM[iseht].prepend(dom);
		break;
	default:
		Tsoxa.bazesDOM[iseht].append(dom);
	}

	if (trapezi.partidaBazesCount() === 7)
	Tsoxa.
	skorNoticeDOM(Arena.skorNoticeDuration).
	minimaRefreshDOM();

	Tsoxa.
	bazaFiloPiosClear(true);

	// Υπάρχει περίπτωση η μπάζα να έχει λιγότερα από 4 φύλλα λόγω
	// ακυρώσεων. Γι' αυτό κρίθηκε ασφαλέστερο να μετράμε τα φύλλα
	// της μπάζας.

	bazaLen = Tsoxa.baza.cardsCount();
	for (n = 0, i = 0; i < bazaLen; i++)
	Tsoxa.baza.cardAnimate(i, bazaPekti, {
		width: Arena.bazaPektiWidth,
		duration: Arena.bazaPektiDuration,
		callback: function() {
			if (++n < bazaLen)
			return;

			Selida.ixos.play('pop/tap.ogg', 2);
			callback.call(trapezi, energia);

			if (trapezi.partidaBazesCount() < 8)
			return;

			Tsoxa.skorRefreshDOM();
			if (trapezi.partidaSkorGet() < trapezi.trapeziLixiGet())
			return;

			Selida.ixos.xirokrotima();
		},
	});

	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Trapezi.prototype.trapeziEnergiaOnlineΑΕΡΑΣ = function(energia, callback) {
	var thesi, data;

	Tsoxa.fyiDOM.empty();

	thesi = energia.energiaPektisGet();
	data = energia.energiaDataGet();

	if (this.partidaIsAerasEgrisi())
	this.partidaAerasEgrisiPush(thesi, data);

	callback.call(this, energia);
	return this;
};
