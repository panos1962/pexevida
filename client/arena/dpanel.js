Arena.dpanel = new BPanel();
$();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.dpanel.bpanelButtonPush(PButton.slideV());

Arena.kafenioInputDOM = Arena.dpanel.bpanelInputPush({
	proepiskopisi: function() {
		Arena.sizitisi.proepiskopisi(Arena.sizitisiKafenioDOM);
	},

	submit: function(dom) {
		var sxolio;

		sxolio = dom.val().trim();
		if (sxolio === '')
		return;

		Selida.skiserService('sizitisiKafenio', 'sxolio=' + dom.val().uri()).
		done(function(rsp) {
			dom.val('');
		}).
		fail(function(err) {
			Selida.skiserFail(err);
		});
	},
});

Arena.dpanel.bpanelButtonPush(new PButton({
	refresh: function() {
		if (Arena.sizitisiKafenioDOM.data('pagomeni'))
		this.
		pbuttonTitleSet('Ρολάρισμα κειμένου συζήτησης καφενείου').
		pbuttonIconSet('xepagoma.png');

		else
		this.
		pbuttonTitleSet('Πάγωμα κειμένου συζήτησης καφενείου').
		pbuttonIconSet('pagoma.png');
	},
	click: function() {
		if (Arena.sizitisiKafenioDOM.data('pagomeni'))
		Arena.sizitisiKafenioDOM.
		scrollKato().
		removeClass('sizitisiPagomeni').
		removeData('pagomeni');

		else
		Arena.sizitisiKafenioDOM.
		addClass('sizitisiPagomeni').
		data('pagomeni', true);

		this.pbuttonRefresh();
	},
}));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.dpanelSetup = function() {
	Arena.dpanel.bpanelRefresh();
	Arena.dpanelDOM.empty().
	append(Arena.dpanel.bpanelGetDOM());

	Arena.dpanelDOM.siromeno({
		init: function(e, siromeno) {
			Selida.siromenoInitDefault(e, siromeno);
			siromeno.trapeziAreaH = Arena.trapeziAreaDOM.height();
			siromeno.sizitisiKafenioH = Arena.sizitisiKafenioDOM.height();
		},
		moveX: false,
		move: function(dx, dy) {
			var siromeno, dy1, trapeziAreaH, sizitisiKafenioH;

			if (dy === 0) return;
			siromeno = $(window).data('siromeno');
			if (!siromeno) return;

			while (1) {
				dy1 = dy;
				trapeziAreaH = siromeno.trapeziAreaH + dy1;
				if (trapeziAreaH < 0) trapeziAreaH = 0;
				dy1 -= trapeziAreaH - siromeno.trapeziAreaH;

				///////////////////////////////////////

				dy1 = dy - dy1;
				sizitisiKafenioH = siromeno.sizitisiKafenioH - dy1;
				if (sizitisiKafenioH < 0) sizitisiKafenioH = 0;
				dy1 += sizitisiKafenioH - siromeno.sizitisiKafenioH;

				///////////////////////////////////////

				if (!dy1)
				break;

				dy -= dy1;
			}

			Arena.trapeziAreaDOM.css('height', trapeziAreaH + 'px');
			Arena.sizitisiKafenioDOM.css('height', sizitisiKafenioH + 'px');
		},
	});


	return Arena;
};
