$();
Arena.apanel = new BPanel();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.apanel.bpanelButtonPush(PButton.slideV());

Arena.anazitisiInputDOM = Arena.apanel.bpanelInputPush({
	submit: function(dom) {
		console.log(dom.val());
	},
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.apanelSetup = function() {
	Arena.apanel.bpanelRefresh();
	Arena.apanelDOM.empty().
	append(Arena.apanel.bpanelGetDOM());

	Arena.apanelDOM.siromeno({
		init: function(e, siromeno) {
			Selida.siromenoInitDefault(e, siromeno);
			siromeno.anazitisiAreaH = Arena.anazitisiAreaDOM.height();
			siromeno.thamonasAreaH = Arena.thamonasAreaDOM.height();
		},
		moveX: false,
		move: function(dx, dy) {
			var siromeno, dy1, anazitisiAreaH, thamonasAreaH;

			if (dy === 0) return;
			siromeno = $(window).data('siromeno');
			if (!siromeno) return;

			while (1) {
				dy1 = dy;
				anazitisiAreaH = siromeno.anazitisiAreaH + dy1;
				if (anazitisiAreaH < 0) anazitisiAreaH = 0;
				dy1 -= anazitisiAreaH - siromeno.anazitisiAreaH;

				///////////////////////////////////////

				dy1 = dy - dy1;
				thamonasAreaH = siromeno.thamonasAreaH - dy1;
				if (thamonasAreaH < 0) thamonasAreaH = 0;
				dy1 += thamonasAreaH - siromeno.thamonasAreaH;

				///////////////////////////////////////

				if (!dy1)
				break;

				dy -= dy1;
			}

			Arena.anazitisiAreaDOM.css('height', anazitisiAreaH + 'px');
			Arena.thamonasAreaDOM.css('height', thamonasAreaH + 'px');
		},
	});


	return Arena;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.a1panel = new BPanel();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.a1panel.bpanelButtonPush(PButton.slideV());

Arena.a1panel.bpanelButtonPush(new PButton({
	img: 'ikona/panel/balaki/prasino.png',
	title: 'Online',
}));

Arena.a1panel.bpanelButtonPush(new PButton({
	img: 'sxetikos.png',
	title: 'Φίλοι',
}));

Arena.a1panel.bpanelButtonPush(new PButton({
	img: 'fakos.png',
	title: 'Αναζήτηση',
}));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.a1panelSetup = function() {
	Arena.a1panel.bpanelRefresh();
	Arena.a1panelDOM.empty().
	append(Arena.a1panel.bpanelGetDOM());

	Arena.a1panelDOM.siromeno({
		init: function(e, siromeno) {
			Selida.siromenoInitDefault(e, siromeno);
			siromeno.anazitisiAreaH = Arena.anazitisiAreaDOM.height();
			siromeno.thamonasAreaH = Arena.thamonasAreaDOM.height();
		},
		moveX: false,
		move: function(dx, dy) {
			var siromeno, dy1, anazitisiAreaH, thamonasAreaH;

			if (dy === 0) return;
			siromeno = $(window).data('siromeno');
			if (!siromeno) return;

			while (1) {
				dy1 = dy;
				anazitisiAreaH = siromeno.anazitisiAreaH + dy1;
				if (anazitisiAreaH < 0) anazitisiAreaH = 0;
				dy1 -= anazitisiAreaH - siromeno.anazitisiAreaH;

				///////////////////////////////////////

				dy1 = dy - dy1;
				thamonasAreaH = siromeno.thamonasAreaH - dy1;
				if (thamonasAreaH < 0) thamonasAreaH = 0;
				dy1 += thamonasAreaH - siromeno.thamonasAreaH;

				///////////////////////////////////////

				if (!dy1)
				break;

				dy -= dy1;
			}

			Arena.anazitisiAreaDOM.css('height', anazitisiAreaH + 'px');
			Arena.thamonasAreaDOM.css('height', thamonasAreaH + 'px');
		},
	});


	return Arena;
};
