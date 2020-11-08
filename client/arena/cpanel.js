Arena.cpanel = new BPanel();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.cpanel.bpanelButtonPush(PButton.enalagi(Arena.cpanel));
Arena.cpanel.bpanelButtonPush(PButton.slideH());

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.cpanelSetup = function() {
	Arena.cpanel.bpanelRefresh();
	Arena.cpanelDOM = $('#cpanel').
	append(Arena.cpanel.bpanelGetDOM()).
	siromeno({
		init: Arena.enotitaPanelInit,
		moveY: false,
		move: function(dx) {
			var siromeno, dx1, pektisW, kafenioW, trapeziW, partidaW, sizitisiW;

			if (dx === 0) return;
			siromeno = $(window).data('siromeno');
			if (!siromeno) return;

			///////////////////////////////////////

			while (1) {
				dx1 = dx;
				partidaW = siromeno.partidaW + dx1;
				if (partidaW < 0) partidaW = 0;
				else if (partidaW > Arena.pexnidiPlatos) partidaW = Arena.pexnidiPlatos;
				dx1 -= partidaW - siromeno.partidaW;

				trapeziW = siromeno.trapeziW + dx1;
				if (trapeziW < 0) trapeziW = 0;
				dx1 -= trapeziW - siromeno.trapeziW;

				kafenioW = siromeno.kafenioW + dx1;
				if (kafenioW < 0) kafenioW = 0;
				dx1 -= kafenioW - siromeno.kafenioW;

				pektisW = Arena.pektisPlatosSet(siromeno.pektisW + dx1);
				dx1 -= pektisW - siromeno.pektisW;

				///////////////////////////////////////

				dx1 = dx - dx1;
				sizitisiW = siromeno.sizitisiW - dx1;
				if (sizitisiW < 0) sizitisiW = 0;
				dx1 += sizitisiW - siromeno.sizitisiW;

				///////////////////////////////////////

				if (!dx1)
				break;

				dx -= dx1;
			}

			Arena.enotitaPlatosSet(pektisW, kafenioW, trapeziW, partidaW, sizitisiW);
		},
	});

	return Arena;
};

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: Arena.cpanel.omadaMax,
	img: 'ikona/panel/partida/akirosiStart.png',
	title: 'Ακύρωση κινήσεων',

	check: function() {
		var trapezi, dianomi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		if (ego.oxiPektis())
		return false;

		dianomi = trapezi.trapeziTelefteaDianomi();
		if (!dianomi)
		return false;

		if (dianomi.energiaArray.length < 2)
		return false;

		switch (trapezi.partidaFasiGet()) {
		case 'ΑΓΟΡΑ':
		case 'ΚΟΝΤΡΑ':
		case 'ΠΑΙΧΝΙΔΙ':
		case 'ΑΕΡΑΣ':
			break;
		default:
			return false;
		}

		return true;
	},

	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Selida.fyi.pano('Ακύρωση κίνησης. Παρακαλώ περιμένετε…');
		Selida.skiserService('akirosi').
		done(function(rsp) {
			Selida.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: Arena.cpanel.omadaMax,
	img: 'ikona/panel/partida/akirosiStop.png',
	title: 'Τέλος ακύρωσης κινήσεων',

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		if (ego.oxiPektis())
		return false;

		if (trapezi.trapeziOxiAkirosi())
		return false;

		return true;
	},

	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Selida.fyi.pano('Τέλος ακύρωσης κινήσεων. Παρακαλώ περιμένετε…');
		Selida.skiserService('akirosiStop').
		done(function(rsp) {
			Selida.fyi.pano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

// Το πλήκτρο που ακολουθεί πατιέται όταν θέλουμε να δείξουμε κάποιον αέρα,
// επομένως είναι διαθέσιμο κατά τη φάση του παιχνιδιού στο παίκτη που έχει
// σειρά να βάλει φύλλο.

Arena.cpanel.bpanelButtonPush(Arena.aerasButton = new PButton({
	omada: Arena.cpanel.omadaMax,
	img: 'ikona/panel/partida/aeras.png',
	title: 'Επίδειξη/απόσυρση τρίτης, τετάρτης, πέμπτης, ή καρέ',

	// Όσο ο παίκτης επιχειρεί να υποβάλει τον αέρα το πλήκτρο γίνεται
	// εμφανές με περίγραμμα εκκρεμότητας.

	refresh: function() {
		this.pbuttonEkremesSet(Tsoxa.isAerasIpovoli() ? true : false);
	},

	check: function() {
		var trapezi, pektis, aerasPios;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		if (ego.oxiPektis())
		return false;

		pektis = trapezi.partidaEpomenosGet();
		if (!pektis)
		return false;

		if (Debug.flagGet('epomenosCheck') &&
		(ego.thesiGet() !== pektis))
		return false;

		if (trapezi.trapeziOxiDianomi())
		return false;

		switch (trapezi.partidaFasiGet()) {
		case 'ΠΑΙΧΝΙΔΙ':
			break;
		default:
			return false;
		}

		if (trapezi.partidaBazesCount() > 5)
		return false;

		// Αν έχει μόλις επιδειχθεί αέρας από τον παίκτη δεν
		// επιτρέπουμε την επίδειξη άλλου αέρα.

		if (trapezi.partidaAerasLastGet())
		return false;

		if (!trapezi.partidaAerasGet())
		return true;

		// Ελέγχουμε αν ήδη υπάρχει αέρας, οπότε ο αντίπαλος
		// δεν μπορεί να επιδείξει αέρα.

		aerasPios = trapezi.partidaAerasPiosGet();
		if (pektis.thesiIsAntipalos(aerasPios))
		return false;

		return true;
	},

	click: function(e) {
		if (Tsoxa.isAerasIpovoli())
		Tsoxa.aerasIpovoliClear();

		else
		Tsoxa.aerasIpovoliReset();

		this.pbuttonRefresh();
		Tsoxa.efoplismos();
	},
}));

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: Arena.cpanel.omadaMax,

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		if (trapezi.trapeziOxiVida())
		return false;

		if (trapezi.trapeziOxiDianomi())
		return false;

		switch (trapezi.partidaFasiGet()) {
		case 'ΠΑΙΧΝΙΔΙ':
			break;
		default:
			return false;
		}

		if (ego.isTheatis())
		return true;

		if (trapezi.trapeziOxiDilosiAllow())
		return false;

		if (trapezi.partidaBazesCount() < 1)
		return false;

		return true;
	},

	refresh: function() {
		if (Tsoxa.dilosiNormal)
		this.
		pbuttonTitleSet('Εμφάνιση δηλώσεων').
		pbuttonIconSet('ikona/panel/partida/dilosiOn.png');

		else
		this.
		pbuttonTitleSet('Απόκρυψη δηλώσεων').
		pbuttonIconSet('ikona/panel/partida/dilosiOff.png');
	},

	click: function(e) {
		Tsoxa.dilosiNormal = !Tsoxa.dilosiNormal;
		this.pbuttonRefresh();
		if (!ego.trapeziGet())
		return;

		Tsoxa.dilosiRefreshDOM();
	},
}));

// Επίδειξη τελευταίας χαρτωσιάς παίκτη.

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: Arena.cpanel.omadaMax,

	img: 'ikona/panel/partida/araxni.png',
	title: 'Προηγούμενη χαρτωσιά',

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		if (ego.oxiPektis())
		return false;

		if (trapezi.trapeziDianomiCount() < 2)
		return false;

		return true;
	},

	click: function(e) {
		Selida.skiserService('filaPrev').
		done(function(rsp) {
			var fld;

			fld = Arena.inputTrexon;
			if (!fld)
			return;

			fld.
			val('FP^' + rsp).
			trigger(jQuery.Event('keyup', {which:35}));
		}).
		fail(function(err) {
			Selida.skiserFail(err);
		});
	},
}));

// Επίδειξη τελευταίας χαρτωσιάς παίκτη προ της διανομής.

Arena.cpanel.bpanelButtonPush(new PButton({
	omada: Arena.cpanel.omadaMax,

	img: 'ikona/panel/partida/inxara.png',
	title: 'Προηγούμενη χαρτωσιά πριν την αγορά',

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		if (ego.oxiPektis())
		return false;

		if (trapezi.trapeziIsVida())
		return false;

		if (trapezi.trapeziDianomiCount() < 2)
		return false;

		return true;
	},

	click: function(e) {
		Selida.skiserService('filaPrev', 'dianomi=1').
		done(function(rsp) {
			var fld;

			fld = Arena.inputTrexon;
			if (!fld)
			return;

			fld.
			val('FP^' + rsp).
			trigger(jQuery.Event('keyup', {which:35}));
		}).
		fail(function(err) {
			Selida.skiserFail(err);
		});
	},
}));

Tsoxa.bazaPrevOn = false;

Arena.cpanel.bpanelButtonPush(new PButton({
	refresh: function() {
		if (Tsoxa.bazaPrevOn)
		this.
		pbuttonTitleSet('Απόκρυψη τελευταίας μπάζας').
		pbuttonIconSet('ikona/panel/partida/bazaPrevOff.png');

		else
		this.
		pbuttonTitleSet('Εμφάνιση τελευταίας μπάζας').
		pbuttonIconSet('ikona/panel/partida/bazaPrevOn.png');
	},

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		if (trapezi.trapeziOxiDianomi())
		return false;

		if (!trapezi.bazaPrev)
		return false;

		return true;
	},

	click: function(e) {
		Tsoxa.bazaPrevOn = !Tsoxa.bazaPrevOn;

		if (Tsoxa.bazaPrevOn)
		Tsoxa.bazaPrevContainerDOM.finish().fadeTo(100, 1).delay(1000).fadeTo(1000, 0.4);

		else
		Tsoxa.bazaPrevContainerDOM.finish().fadeTo(100, 0);

		this.pbuttonRefresh();
	},
}));
