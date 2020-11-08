Arena.bpanel = new BPanel();
$();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.bpanel.bpanelButtonPush(PButton.slideV());

Arena.lobiInputDOM = Arena.bpanel.bpanelInputPush({
	proepiskopisi: function() {
		Arena.sizitisi.proepiskopisi(Arena.sizitisiLobiDOM);
	},

	submit: function(dom) {
		var sxolio;

		sxolio = dom.val().trim();
		if (sxolio === '')
		return;

		Selida.skiserService('sizitisiLobi', 'sxolio=' + dom.val().uri()).
		done(function(rsp) {
			dom.val('');
		}).
		fail(function(err) {
			Selida.skiserFail(err);
		});
	},
});

Arena.bpanel.bpanelButtonPush(new PButton({
	refresh: function() {
		if (Arena.sizitisiLobiDOM.data('pagomeni'))
		this.
		pbuttonTitleSet('Ρολάρισμα κειμένου δημόσιας συζήτησης').
		pbuttonIconSet('xepagoma.png');

		else
		this.
		pbuttonTitleSet('Πάγωμα κειμένου δημόσιας συζήτησης').
		pbuttonIconSet('pagoma.png');
	},
	click: function() {
		if (Arena.sizitisiLobiDOM.data('pagomeni'))
		Arena.sizitisiLobiDOM.
		scrollKato().
		removeClass('sizitisiPagomeni').
		removeData('pagomeni');

		else
		Arena.sizitisiLobiDOM.
		addClass('sizitisiPagomeni').
		data('pagomeni', true);

		this.pbuttonRefresh();
	},
}));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.bpanelSetup = function() {
	Arena.bpanel.bpanelRefresh();
	Arena.bpanelDOM.empty().
	append(Arena.bpanel.bpanelGetDOM());

	Arena.bpanelDOM.siromeno({
		init: function(e, siromeno) {
			Selida.siromenoInitDefault(e, siromeno);
			siromeno.kafenioAreaH = Arena.kafenioAreaDOM.height();
			siromeno.sizitisiLobiH = Arena.sizitisiLobiDOM.height();
		},
		moveX: false,
		move: function(dx, dy) {
			var siromeno, dy1, kafenioAreaH, sizitisiLobiH;

			if (dy === 0) return;
			siromeno = $(window).data('siromeno');
			if (!siromeno) return;

			while (1) {
				dy1 = dy;
				kafenioAreaH = siromeno.kafenioAreaH + dy1;
				if (kafenioAreaH < 0) kafenioAreaH = 0;
				dy1 -= kafenioAreaH - siromeno.kafenioAreaH;

				///////////////////////////////////////

				dy1 = dy - dy1;
				sizitisiLobiH = siromeno.sizitisiLobiH - dy1;
				if (sizitisiLobiH < 0) sizitisiLobiH = 0;
				dy1 += sizitisiLobiH - siromeno.sizitisiLobiH;

				///////////////////////////////////////

				if (!dy1)
				break;

				dy -= dy1;
			}

			Arena.kafenioAreaDOM.css('height', kafenioAreaH + 'px');
			Arena.sizitisiLobiDOM.css('height', sizitisiLobiH + 'px');
		},
	});


	return Arena;
};
