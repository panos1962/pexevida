Arena.tpanel = new BPanel();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.tpanel.bpanelButtonPush(PButton.enalagi(Arena.tpanel));
Arena.tpanel.bpanelButtonPush(PButton.slideH());

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,
	img: 'neoTrapezi.png',
	title: 'Νέο τραπέζι',

	check: function() {
		return ego.isKafenio();
	},

	refresh: function() {
		this.pbuttonGetDOM().css('opacity', ego.isTrapezi() ? 0.6 : 1.0);
	},

	click: function(e) {
		var button, tora, dom, klikTS;

		if (ego.oxiKafenio())
		return;

		if (ego.isTrapezi())
		return;

		tora = Globals.torams();
		dom = this.pbuttonGetDOM();
		klikTS = parseInt(dom.data('klikTS'));
		if (isNaN(klikTS))
		dom.data('klikTS', tora);

		else if (tora - klikTS < 1000)
		return;

		button = this.pbuttonLock();
		Selida.fyi.pano('Δημιουργία τραπεζιού. Παρακαλώ περιμένετε…');
		Selida.skiserService('trapeziNeo').
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,
	img: 'exodos.png',
	title: 'Αποχώρηση από το τραπέζι',

	check: function() {
		return ego.isTrapezi();
	},

	click: function(e) {
		var button, trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		button = this.pbuttonLock();
		Selida.fyi.pano('Αποχώρηση από το τραπέζι. Παρακαλώ περιμένετε…');
		Selida.skiserService('trapeziExodos').
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,
	img: 'matakias.png',
	title: 'Από παίκτης θεατής',

	check: function() {
		return ego.isPektis();
	},

	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Selida.fyi.pano('Από παίκτης θεατής. Παρακαλώ περιμένετε…');
		Selida.skiserService('pektisTheatis').
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,
	img: 'saikatam.png',
	title: 'Από θεατής παίκτης' ,

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		if (ego.oxiTheatis())
		return false;

		if (trapezi.trapeziOxiProsklisi(ego.loginGet()))
		return false;

		return trapezi.trapeziKeniThesi();
	},

	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Selida.fyi.pano('Από θεατής παίκτης. Παρακαλώ περιμένετε…');
		Selida.skiserService('theatisPektis').
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,

	refresh: function() {
		if (Tsoxa.isShowdown())
		this.
		pbuttonTitleSet('Απόκρυψη φύλλων').
		pbuttonIconSet('frogBlind.png');

		else
		this.
		pbuttonTitleSet('Εμφάνιση φύλλων').
		pbuttonIconSet('frog.png');
	},

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		if (trapezi.trapeziOxiDianomi())
		return false;

		if (Debug.flagGet('striptiz'))
		return true;

		if (ego.oxiTheatis())
		return false;

		return true;
	},

	click: function(e) {
		Tsoxa.showdownSwitch();
		Tsoxa.filaRefreshDOM();
		this.pbuttonRefresh();
	},
}));

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		return trapezi.trapeziRithmisi(ego.loginGet());
	},

	refresh: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		if (trapezi.trapeziIsPrive())
		this.
		pbuttonTitleSet('Μετατροπή σε δημόσιο').
		pbuttonIconSet('dimosio.png');

		else
		this.
		pbuttonTitleSet('Μετατροπή σε πριβέ').
		pbuttonIconSet('prive.png');
	},

	click: function(e) {
		var trapezi, prive, button;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		prive = trapezi.trapeziIsPrive();

		button = this.pbuttonLock();
		Selida.fyi.pano('Μετατροπή τραπεζιού σε ' + (prive ? 'δημόσιο' : 'πριβέ') + '. Παρακαλώ περιμένετε…');
		Selida.skiserService('trapezi' + (prive ? 'Dimosio' : 'Prive')).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

// Εναλλαγή: ΔΥΣΗ <----> ΑΝΑΤΟΛΗ

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,
	title: 'Αλλαγή διάταξης αντιπάλων (ΑΝΑΤΟΛΗ/ΔΥΣΗ)',
	img: 'ikona/panel/partida/diataxi.png',

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		return trapezi.trapeziRithmisi(ego.loginGet());
	},

	click: function(e) {
		var trapezi, thesi1, thesi2, button;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		thesi1 = ego.thesiGet().thesiEpomeni();
		thesi2 = thesi1.thesiEpomeni(2);

		if (trapezi.trapeziPektisGet(thesi1) === trapezi.trapeziPektisGet(thesi2))
		return;

		button = this.pbuttonLock();
		Selida.fyi.pano('Αλλαγή διάταξης παικτών. Παρακαλώ περιμένετε…');
		Selida.skiserService('trapeziDiataxi', 'thesi1=' + thesi1, 'thesi2=' + thesi2).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

// Εναλλαγή: ΒΟΡΡΑΣ <----> ΑΝΑΤΟΛΗ

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,
	title: 'Αλλαγή σύνθεσης ομάδων (ΒΟΡΡΑΣ/ΑΝΑΤΟΛΗ)',
	img: 'ikona/panel/partida/enalagi.png',

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		return trapezi.trapeziRithmisi(ego.loginGet());
	},

	click: function(e) {
		var trapezi, thesi1, thesi2, button;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		thesi1 = ego.thesiGet().thesiEpomeni();
		thesi2 = thesi1.thesiEpomeni();
		
		if (trapezi.trapeziPektisGet(thesi1) === trapezi.trapeziPektisGet(thesi2))
		return;

		button = this.pbuttonLock();
		Selida.fyi.pano('Αλλαγή σύνθεσης ομάδων. Παρακαλώ περιμένετε…');
		Selida.skiserService('trapeziDiataxi', 'thesi1=' + thesi1, 'thesi2=' + thesi2).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,

	check: function() {
		var trapezi, thesi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		thesi = trapezi.trapeziThesiPekti(ego.loginGet());
		if (!thesi)
		return false;

		if (trapezi.trapeziIsApodoxi(thesi))
		return false;

		if (Debug.flagGet('apodoxiPanta'))
		return true;

		if (trapezi.trapeziIsDianomi())
		return false;

		return true;
	},

	refresh: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		if (trapezi.trapeziApodoxiLow())
		this.
		pbuttonTitleSet('Αποδοχή όρων παιχνιδιού').
		pbuttonIconSet('ikona/panel/partida/apodoxi.png');

		else
		this.
		pbuttonTitleSet('Αποδοχή όρων παιχνιδιού και εκκίνηση της παρτίδας').
		pbuttonIconSet('ikona/panel/partida/go.jpg');
	},

	click: function(e) {
		var trapezi, button;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		if (!trapezi.trapeziThesiPekti(ego.loginGet()))
		return;

		button = this.pbuttonLock();
		Selida.fyi.pano('Αποδοχή όρων παιχνιδιού. Παρακαλώ περιμένετε…');
		Selida.skiserService('trapeziApodoxi').
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,
	title: 'Διαπραγμάτευση όρων παιχνιδιού',
	img: 'ikona/panel/partida/ixodopa.png',

	check: function() {
		var trapezi, thesi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		thesi = trapezi.trapeziThesiPekti(ego.loginGet());
		if (!thesi)
		return false;

		if (trapezi.trapeziOxiApodoxi(thesi))
		return false;

		if (Debug.flagGet('apodoxiPanta'))
		return true;

		if (trapezi.trapeziIsDianomi())
		return false;

		return true;
	},

	click: function(e) {
		var trapezi, button;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		if (!trapezi.trapeziThesiPekti(ego.loginGet()))
		return;

		button = this.pbuttonLock();
		Selida.fyi.pano('Διαπραγμάτευση όρων παιχνιδιού. Παρακαλώ περιμένετε…');
		Selida.skiserService('trapeziIxodopa').
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.tpanel.omadaMax++;

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		return trapezi.trapeziRithmisi(ego.loginGet());
	},

	refresh: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		if (trapezi.trapeziIsVida())
		this.
		pbuttonTitleSet('Μετατροπή σε μπουρλότο').
		pbuttonIconSet('ikona/panel/belot.png');

		else
		this.
		pbuttonTitleSet('Μετατροπή σε βίδα').
		pbuttonIconSet('ikona/vida/vida64.png');
	},

	click: function(e) {
		var trapezi, vida, button;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		vida = trapezi.trapeziIsVida();

		button = this.pbuttonLock(false);
		Selida.fyi.pano('Μετατροπή τραπεζιού σε ' + (vida ? 'μπουρλότο' : 'βίδα') + '. Παρακαλώ περιμένετε…');
		Selida.skiserService('trapezi' + (vida ? 'Belot' : 'Vida')).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease(false);
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease(false);
		});
	},
}));

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,

	check: function() {
		var trapezi, thesi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		thesi = trapezi.trapeziThesiPekti(ego.loginGet());
		if (!thesi)
		return false;

		return(thesi === 1);
	},

	refresh: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		if (trapezi.trapeziIsIdioktito())
		this.
		pbuttonTitleSet('Μετατροπή σε ελεύθερο').
		pbuttonIconSet('elefthero.png');

		else
		this.
		pbuttonTitleSet('Μετατροπή σε ιδιόκτητο').
		pbuttonIconSet('idioktito.png');
	},

	click: function(e) {
		var trapezi, idioktito, button;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		idioktito = trapezi.trapeziIsIdioktito();

		button = this.pbuttonLock();
		Selida.fyi.pano('Μετατροπή τραπεζιού σε ' + (idioktito ? 'ελεύθερο' : 'ιδιόκτητο') +
			'. Παρακαλώ περιμένετε…');
		Selida.skiserService('trapezi' + (idioktito ? 'Elefthero' : 'Idioktito')).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		if (trapezi.trapeziOxiBelot())
		return false;

		return trapezi.trapeziRithmisi(ego.loginGet());
	},

	refresh: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		if (trapezi.apontaOn())
		this.
		pbuttonTitleSet('Δεν χαλάει με άποντα').
		pbuttonIconSet('ikona/panel/partida/apontaOff.png');

		else
		this.
		pbuttonTitleSet('Χαλάει με άποντα').
		pbuttonIconSet('ikona/panel/partida/apontaOn.png');
	},

	click: function(e) {
		var trapezi, aponta, button;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		aponta = trapezi.apontaOn();

		button = this.pbuttonLock();
		Selida.
		fyi.pano('Μετατροπή καθεστώτος για άποντα. Παρακαλώ περιμένετε…').
		skiserService('aponta' + (aponta ? 'Off' : 'On')).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		if (trapezi.trapeziOxiVida())
		return false;

		return trapezi.trapeziRithmisi(ego.loginGet());
	},

	refresh: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		if (trapezi.vidaOkto())
		this.
		pbuttonTitleSet('Βίδα 2, 4, 8, 16').
		pbuttonIconSet('ikona/panel/partida/oktoOff.png');

		else
		this.
		pbuttonTitleSet('Βίδα 2, 4, 6, 8').
		pbuttonIconSet('ikona/panel/partida/oktoOn.png');
	},

	click: function(e) {
		var trapezi, okto, button;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		okto = trapezi.vidaOkto();

		button = this.pbuttonLock();
		Selida.
		fyi.pano('Μετατροπή υπολογισμού βίδας. Παρακαλώ περιμένετε…').
		skiserService('vida' + (okto ? 'Dekaexi' : 'Okto')).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		return trapezi.trapeziRithmisi(ego.loginGet());
	},

	refresh: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		if (trapezi.trapeziIsDilosiAllow())
		this.
		pbuttonTitleSet('Απόκρυψη δηλώσεων').
		pbuttonIconSet('ikona/panel/partida/dilosiOff.png');

		else
		this.
		pbuttonTitleSet('Εμφάνιση δηλώσεων').
		pbuttonIconSet('ikona/panel/partida/dilosiOn.png');
	},

	click: function(e) {
		var trapezi, dilosiAllow, button;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		dilosiAllow = trapezi.trapeziIsDilosiAllow();

		button = this.pbuttonLock();
		Selida.fyi.pano('Μετατροπή καθεστώτος υπενθύμισης δηλώσεων. Παρακαλώ περιμένετε…');
		Selida.skiserService('trapeziDilosi' + (dilosiAllow ? 'Disallow' : 'Allow')).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		return trapezi.trapeziRithmisi(ego.loginGet());
	},

	refresh: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		if (trapezi.peziKomeni())
		this.
		pbuttonTitleSet('Όχι δηλώσεις «ΚΟΜΜΕΝΗ»').
		pbuttonIconSet('ikona/panel/partida/komeniOff.png');

		else
		this.
		pbuttonTitleSet('Επιτρεπτές δηλώσεις «ΚΟΜΜΕΝΗ»').
		pbuttonIconSet('ikona/panel/partida/komeniOn.png');
	},

	click: function(e) {
		var trapezi, komeniAllow, button;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		komeniAllow = trapezi.peziKomeni();

		button = this.pbuttonLock();
		Selida.fyi.pano('Αλλαγή καθεστώτος δηλώσεων «ΚΟΜΜΕΝΗ». Παρακαλώ περιμένετε…');
		Selida.skiserService('trapeziKomeni' + (komeniAllow ? 'Disallow' : 'Allow')).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.tpanel.bpanelButtonPush(Arena.tpanel.lixiEnalagiButton = new PButton({
	omada: Arena.tpanel.omadaMax,
	img: 'ikona/panel/partida/lixi.png',

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		return trapezi.trapeziRithmisi(ego.loginGet());
	},

	refresh: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		this.
		pbuttonTitleSet('Λήξη: ' + trapezi.trapeziIxilGet());
	},

	click: function(e) {
		var trapezi, lixi, button;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		lixi = trapezi.trapeziIxilGet();

		button = this.pbuttonLock();
		Selida.fyi.pano('Αλλαγή λήξης σε ' + lixi + '. Παρακαλώ περιμένετε…');
		Selida.skiserService('trapeziLixi', 'lixi=' + lixi).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,
	img: 'ikona/misc/prosPano.png',
	title: 'Αύξηση ορίου λήξης παρτίδας κατά 50 πόντους',

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		return trapezi.trapeziRithmisi(ego.loginGet());
	},

	click: function(e) {
		var trapezi, lixi, button;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		lixi = trapezi.trapeziLixiGet() + 50;

		button = this.pbuttonLock();
		Selida.fyi.pano('Αύξηση λήξης σε ' + lixi + '. Παρακαλώ περιμένετε…');
		Selida.skiserService('trapeziLixi', 'lixi=' + lixi).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

Arena.tpanel.bpanelButtonPush(new PButton({
	omada: Arena.tpanel.omadaMax,
	img: 'ikona/misc/prosKato.png',
	title: 'Μείωση ορίου λήξης παρτίδας κατά 50 πόντους',

	check: function() {
		var trapezi;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return false;

		if (trapezi.trapeziLixiGet() < 100)
		return false;

		return trapezi.trapeziRithmisi(ego.loginGet());
	},

	click: function(e) {
		var trapezi, lixi, button;

		trapezi = ego.trapeziGet();
		if (!trapezi)
		return;

		lixi = trapezi.trapeziLixiGet() - 50;

		button = this.pbuttonLock();
		Selida.fyi.pano('Μείωση λήξης σε ' + lixi + '. Παρακαλώ περιμένετε…');
		Selida.skiserService('trapeziLixi', 'lixi=' + lixi).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			button.pbuttonRelease();
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			button.pbuttonRelease();
		});
	},
}));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.tpanelSetup = function() {
	Arena.tpanel.bpanelRefresh();
	Arena.tpanelDOM = $('#tpanel').
	append(Arena.tpanel.bpanelGetDOM()).
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
				partidaW = siromeno.partidaW - dx1;
				if (partidaW < 0) partidaW = 0;
				else if (partidaW > Arena.pexnidiPlatos) partidaW = Arena.pexnidiPlatos;
				dx1 += partidaW - siromeno.partidaW;

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
