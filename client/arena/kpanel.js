Arena.kpanel = new BPanel();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.kpanel.bpanelButtonPush(PButton.enalagi(Arena.kpanel));
Arena.kpanel.bpanelButtonPush(PButton.slideH());

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.kpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'neoKafenio.png',
	title: 'Νέο καφενείο',
	check: function() {
		return ego.isVip();
	},
	click: function(e) {
		var button, tora, dom, klikTS;

		tora = Globals.torams();
		dom = this.pbuttonGetDOM();
		klikTS = parseInt(dom.data('klikTS'));
		if (isNaN(klikTS))
		dom.data('klikTS', tora);

		else if (tora - klikTS < 1000)
		return;

		button = this.pbuttonLock();
		Selida.fyi.pano('Δημιουργία νέου καφενείου. Παρακαλώ περιμένετε…');
		Selida.skiserService('kafenioNeo').
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

Arena.kpanel.bpanelButtonPush(new PButton({
	omada: 1,
	img: 'exodos.png',
	title: 'Αποχώρηση από καφενείο',
	check: function() {
		return ego.kafenioGet();
	},
	click: function(e) {
		var button;

		button = this.pbuttonLock();
		Selida.fyi.pano('Αποχώρηση από καφενείο. Παρακαλώ περιμένετε…');
		Selida.skiserService('kafenioExodos').
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

Arena.kpanel.bpanelButtonPush(new PButton({
	omada: 1,
	check: function() {
		var kafenio;

		kafenio = ego.kafenioGet();
		if (!kafenio)
		return false;

		return(kafenio.kafenioDimiourgosGet().isEgo());
	},
	refresh: function() {
		var kafenio;

		kafenio = ego.kafenioGet();
		if (!kafenio)
		return;

		if (kafenio.kafenioIsPrive())
		this.
		pbuttonTitleSet('Μετατροπή σε δημόσιο').
		pbuttonIconSet('dimosio.png');

		else
		this.
		pbuttonTitleSet('Μετατροπή σε πριβέ').
		pbuttonIconSet('prive.png');
	},
	click: function(e) {
		var kafenio, prive, button;

		kafenio = ego.kafenioGet();
		if (!kafenio)
		return;

		prive = kafenio.kafenioIsPrive();

		button = this.pbuttonLock();
		Selida.fyi.pano('Μετατροπή καφενείου σε ' + (prive ? 'δημόσιο' : 'πριβέ') + '. Παρακαλώ περιμένετε…');
		Selida.skiserService('kafenio' + (prive ? 'Dimosio' : 'Prive'), 'kafenio=' + kafenio.kafenioKodikosGet()).
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

Arena.kpanel.bpanelButtonPush(new PButton({
	omada: 1,
	id: 'kafinfo',
	img: 'settings.png',
	title: 'Διαχείριση καφενείου',
	check: function() {
		var kafenio;

		kafenio = ego.kafenioGet();
		if (!kafenio)
		return false;

		return(ego.loginGet() === kafenio.kafenioDimiourgosGet());
	},
	click: function(e) {
		if (Arena.kafinfo.anikto)
		Arena.kafinfo.klisimo();

		else
		Arena.kafinfo.anigma();
	},
}));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.kpanelSetup = function() {
	Arena.kpanel.bpanelRefresh();
	Arena.kpanelDOM = $('#kpanel').
	append(Arena.kpanel.bpanelGetDOM()).
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
				kafenioW = siromeno.kafenioW + dx1;
				if (kafenioW < 0) kafenioW = 0;
				dx1 -= kafenioW - siromeno.kafenioW;

				pektisW = Arena.pektisPlatosSet(siromeno.pektisW + dx1);
				dx1 -= pektisW - siromeno.pektisW;

				///////////////////////////////////////

				dx1 = dx - dx1;
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
