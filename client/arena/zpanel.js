// XXX
// Avoid minification warning about "ego"

var ego;

Arena.zpanel = new BPanel();
$();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.zpanel.bpanelButtonPush(PButton.slideV());

Arena.trapeziInputDOM = Arena.zpanel.bpanelInputPush({
	proepiskopisi: function() {
		Arena.sizitisi.proepiskopisi(Arena.sizitisiTrapeziDOM);
	},

	submit: function(dom) {
		var sxolio;

		sxolio = dom.val().trim();
		if (sxolio === '')
		return;

		Selida.skiserService('sizitisiTrapezi', 'sxolio=' + dom.val().uri()).
		done(function(rsp) {
			dom.val('');
		}).
		fail(function(err) {
			Selida.skiserFail(err);
		});
	},
});

Arena.zpanel.bpanelButtonPush(new PButton({
	img: 'ikona/panel/korna.png',
	title: 'Ηχητική ενόχληση για συμπαίκτες και θεατές',

	check: function() {
		var sinedria;

		sinedria = ego.sinedriaGet();
		if (!sinedria)
		return false;

		if (sinedria.sinedriaOxiTrapezi())
		return false;

		if (sinedria.sinedriaIsPektis())
		return true;

		if (ego.isEpoptis())
		return true;

		return false;
	},

	click: function() {
		Selida.skiserService('kornaTrapezi');
	},
}));

Arena.zpanel.bpanelButtonPush(new PButton({
	refresh: function() {
		if (Arena.sizitisiTrapeziDOM.data('pagomeni'))
		this.
		pbuttonTitleSet('Ρολάρισμα κειμένου συζήτησης τραπεζιού').
		pbuttonIconSet('xepagoma.png');

		else
		this.
		pbuttonTitleSet('Πάγωμα κειμένου συζήτησης τραπεζιού').
		pbuttonIconSet('pagoma.png');
	},
	click: function() {
		if (Arena.sizitisiTrapeziDOM.data('pagomeni'))
		Arena.sizitisiTrapeziDOM.
		scrollKato().
		removeClass('sizitisiPagomeni').
		removeData('pagomeni');

		else
		Arena.sizitisiTrapeziDOM.
		addClass('sizitisiPagomeni').
		data('pagomeni', true);

		this.pbuttonRefresh();
	},
}));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.zpanelSetup = function() {
	Arena.zpanel.bpanelRefresh();
	Arena.zpanelDOM.empty().
	append(Arena.zpanel.bpanelGetDOM());

	Arena.zpanelDOM.siromeno({
		init: function(e, siromeno) {
			Selida.siromenoInitDefault(e, siromeno);
			siromeno.prosklisiAreaH = Arena.prosklisiAreaDOM.height();
			siromeno.sizitisiTrapeziH = Arena.sizitisiTrapeziDOM.height();
		},
		moveX: false,
		move: function(dx, dy) {
			var siromeno, dy1, prosklisiAreaH, sizitisiTrapeziH;

			if (dy === 0) return;
			siromeno = $(window).data('siromeno');
			if (!siromeno) return;

			while (1) {
				dy1 = dy;
				prosklisiAreaH = siromeno.prosklisiAreaH + dy1;
				if (prosklisiAreaH < 0) prosklisiAreaH = 0;
				dy1 -= prosklisiAreaH - siromeno.prosklisiAreaH;

				///////////////////////////////////////

				dy1 = dy - dy1;
				sizitisiTrapeziH = siromeno.sizitisiTrapeziH - dy1;
				if (sizitisiTrapeziH < 0) sizitisiTrapeziH = 0;
				dy1 += sizitisiTrapeziH - siromeno.sizitisiTrapeziH;

				///////////////////////////////////////

				if (!dy1)
				break;

				dy -= dy1;
			}

			Arena.prosklisiAreaDOM.css('height', prosklisiAreaH + 'px');
			Arena.sizitisiTrapeziDOM.css('height', sizitisiTrapeziH + 'px');
		},
	});


	return Arena;
};
