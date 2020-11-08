Arena.mpanel = new BPanel();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.mpanel.bpanelButtonPush(PButton.enalagi(Arena.mpanel));
Arena.mpanel.bpanelButtonPush(PButton.slideH());

Arena.mpanel.bpanelButtonPush(new PButton({
	omada: 0,
	refresh: function() {
		if (!ego.pektisGet())
		return;

		if (ego.isApasxolimenos())
		this.
		pbuttonTitleSet('Μετατροπή κατάστασης σε ΔΙΑΘΕΣΙΜΟΣ').
		pbuttonIconSet('diathesimos.png');

		else
		this.
		pbuttonTitleSet('Μετατροπή κατάστασης σε ΑΠΑΣΧΟΛΗΜΕΝΟΣ').
		pbuttonIconSet('apasxolimenos.png');
	},
	check: function() {
		if (!ego.pektisGet())
		return false;

		return true;
	},
	click: function() {
		var button;

		button = this.pbuttonLock();
		Selida.skiserService('peparamSet', 'param=ΚΑΤΑΣΤΑΣΗ', 'timi=' +
			(ego.isApasxolimenos() ? 'ΔΙΑΘΕΣΙΜΟΣ' : 'ΑΠΑΣΧΟΛΗΜΕΝΟΣ')).
		done(function() {
			button.
			pbuttonRelease().
			pbuttonRefresh();
		}).
		fail(function() {
			button.
			pbuttonRelease();
		});
	},
}));

Arena.mpanel.bpanelButtonPush(Arena.mpanel.diataxiButton = new PButton({
	omada: Arena.mpanel.omadaMax,
	img: 'resize.gif',
	title: 'Εναλλαγή διάταξης καφενείου/παρτίδας',
	click: function() {
		Arena.diataxi.enalagi();
	},
}));

Arena.mpanel.bpanelButtonPush(Arena.mpanel.apopsiButton = new PButton({
	omada: Arena.mpanel.omadaMax,

	refresh: function() {
		if (this.data('partida'))
		this.
		pbuttonTitleSet('Άποψη καφενείου').
		pbuttonIconSet('kafenio.png');

		else
		this.
		pbuttonTitleSet('Άποψη παρτίδας').
		pbuttonIconSet('partida.png');
	},

	click: function() {
		if (this.data('partida')) {
			Arena.diataxi.prokat(1);
			this.data('partida', false);
		}
		else {
			Arena.diataxi.prokat(2);
			this.data('partida', true);
		}

		this.pbuttonRefresh();
	},
}));

Arena.mpanel.bpanelButtonPush(new PButton({
	omada: Arena.mpanel.omadaMax,
	refresh: function() {
		if (this.data('panoramiki'))
		this.
		pbuttonTitleSet('Οικονομική άποψη').
		pbuttonIconSet('ikonomiki.png');

		else
		this.
		pbuttonTitleSet('Πανοραμική άποψη').
		pbuttonIconSet('panoramiki.png');
	},
	click: function() {
		if (this.data('panoramiki')) {
			Arena.diataxi.prokat(0);
			this.data('panoramiki', false);
		}
		else {
			Arena.diataxi.prokat(3);
			this.data('panoramiki', true);
		}

		this.pbuttonRefresh();
	},
}));

Arena.mpanel.bpanelButtonPush(new PButton({
	id: 'diataxiSave',
	omada: Arena.mpanel.omadaMax,
	img: 'arxio.png',
	title: 'Διατάξεις περιοχών σελίδας',
	click: function() {
		if (Arena.diataxi.frame)
		Arena.diataxi.frameKlisimo();

		else
		Arena.diataxi.frameAnigma();
	},
}));

Arena.mpanel.bpanelButtonPush(new PButton({
	omada: Arena.mpanel.omadaMax,
	img: 'kinito.png',
	refresh: function() {
		if (Selida.isKinito()) {
			this.pbuttonTitleSet('Ενεργοποίηση πληκτρολογίου αφής');
			this.pbuttonEpilogiSet();
		}
		else {
			this.pbuttonTitleSet('Απενεργοποίηση πληκτρολογίου αφής');
		}
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Selida.ajax('lib/session', {
			'kinito': Selida.isKinito() ? null : 1,
		}).
		done(function(rsp) {
			if (Selida.isKinito()) {
				Selida.session.kinito = false;
				Selida.fyi.pano();
				Arena.inputRefocus();
			}
			else {
				Selida.session.kinito = true;
				Selida.fyi.pano('Απενεργοποιήθηκε αυτόματο πληκτρολόγιο αφής');
			}

			button.
			pbuttonEpilogiSet(Selida.isKinito()).
			pbuttonRelease().
			pbuttonRefresh();
		}).
		fail(function(err) {
			button.pbuttonRelease();
		});
	},
}));

Arena.mpanel.bpanelButtonPush(new PButton({
	omada: Arena.mpanel.omadaMax,
	img: 'refresh.png',
	title: 'Επαναφόρτωση σελίδας',
	click: function() {
		self.location = Selida.server;
	},
}));

Arena.mpanel.omadaMax++;

Arena.mpanel.bpanelButtonPush(Arena.paraskinio.button = new PButton({
	omada: Arena.mpanel.omadaMax,
	img: 'paraskinio.png',
	title: 'Αλλαγή παρασκηνίου',
	click: function(e) {
		Arena.paraskinio.open();
	},
}));
Arena.paraskinio.button = Arena.paraskinio.button.pbuttonGetDOM();

Arena.mpanel.bpanelButtonPush(new PButton({
	omada: Arena.mpanel.omadaMax,
	img: 'trapoula.png',
	title: 'Αλλαγή τράπουλας',
	click: function(e) {
		switch (filajs.cardFamilyGet()) {
		case 'aguilar':
			filajs.cardFamilySet('classic');
			break;
		case 'classic':
			filajs.cardFamilySet('nicubunu');
			break;
		case 'nicubunu':
			filajs.cardFamilySet('ilias');
			break;
		case 'ilias':
			filajs.cardFamilySet('jfitz');
			break;
		default:
			filajs.cardFamilySet('aguilar');
			break;
		}

		Selida.skiserService('peparamSet', 'param=ΤΡΑΠΟΥΛΑ', 'timi=' + filajs.cardFamilyGet());
	},
}));

Arena.mpanel.bpanelButtonPush(new PButton({
	omada: Arena.mpanel.omadaMax,
	img: 'entasi.png',

	refresh: function() {
		this.pbuttonTitleSet('Ένταση ήχου: ' + Selida.ixos.entasiDefaultGet());
	},

	click: function(e) {
		var entasi;

		entasi = Selida.ixos.entasiDefaultGet();
		switch (entasi) {
		case 'ΚΑΝΟΝΙΚΗ':
			entasi = 'ΔΥΝΑΤΗ';
			break;
		case 'ΔΥΝΑΤΗ':
			entasi = 'ΣΙΩΠΗΛΟ';
			break;
		case 'ΣΙΩΠΗΛΟ':
			entasi = 'ΧΑΜΗΛΗ';
			break;
		default:
			entasi = 'ΚΑΝΟΝΙΚΗ';
			break;
		}

		this.pbuttonGetDOM().attr('title', 'Ένταση ήχου: ' + entasi);
		Selida.
		ixos.entasiDefaultSet(entasi).
		ixos.beep().
		fyi.pano('Ένταση ήχου: ' + entasi).
		ajax('misc/setCookie', {
			tag: 'entasi',
			val: entasi,
		});
	},
}));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.mpanelSetup = function() {
	Arena.mpanel.bpanelRefresh();
	Arena.mpanelDOM = $('#mpanel').
	append(Arena.mpanel.bpanelGetDOM()).
	siromeno({
		init: Arena.enotitaPanelInit,
		moveY: false,
		move: function(dx) {
			var siromeno, dx1, pektisW, kafenioW, trapeziW, partidaW, sizitisiW;

			if (dx === 0) return;
			siromeno = $(window).data('siromeno');
			if (!siromeno) return;

			while (1) {
				dx1 = dx;
				pektisW = Arena.pektisPlatosSet(siromeno.pektisW + dx1);
				dx1 -= pektisW - siromeno.pektisW;

				///////////////////////////////////////

				dx1 = dx - dx1;
				kafenioW = siromeno.kafenioW - dx1;
				if (kafenioW < 0) kafenioW = 0;
				dx1 += kafenioW - siromeno.kafenioW;

				trapeziW = siromeno.trapeziW - dx1;
				if (trapeziW < 0) trapeziW = 0;
				dx1 += trapeziW - siromeno.trapeziW;

				sizitisiW = siromeno.sizitisiW - dx1;
				if (sizitisiW < 0) sizitisiW = 0;
				dx1 += sizitisiW - siromeno.sizitisiW;

				partidaW = siromeno.partidaW - dx1;
				if (partidaW < 0) partidaW = 0;
				dx1 += partidaW - siromeno.partidaW;

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
