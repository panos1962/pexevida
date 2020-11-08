Arena.epanel = new BPanel();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.epanel.bpanelButtonPush(PButton.enalagi(Arena.epanel));
Arena.epanel.bpanelButtonPush(PButton.slideH());

Arena.epanel.bpanelButtonPush(new PButton({
	id: 'arxiki',
	img: 'ikona/misc/mazemaPano.png',
	title: 'Αρχική σειρά εργαλείων',
	click: function(e) {
		Arena.epanel.bpanelOmadaSet(2);
		Arena.epanel.bpanelButtonGet('enalagi').pbuttonGetDOM().strofi({
			strofi: -90,
			duration: 200,
		});
	},
}));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.epanel.omadaMax = 1;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.epanelSetup = function() {
	Globals.awalk(Arena.epanel.lefkoma, function(i, setaki) {
		var omada, dir;

		omada = i + 1;
		dir = 'ikona/emoticon/set' + omada + '/';
		Globals.awalk(setaki, function(i, emoticon) {
			Arena.epanel.bpanelButtonPush(button = new PButton({
				img: dir + emoticon,
				omada: omada,
				emoticon: i + 1,
				click: function(e) {
					Arena.inputTrexon.val(Arena.inputTrexon.val() +
						'^E' + this.omada + ':' + this.emoticon + '^');
					Arena.inputTrexon.trigger('keyup');
				},
			}));
		});
	});

	Arena.epanel.bpanelRefresh();
	Arena.epanelDOM = $('#epanel').
	append(Arena.epanel.bpanelGetDOM()).
	siromeno({
		init: Arena.enotitaPanelInit,
		moveY: false,
		move: function(dx) {
			var siromeno, dx1, pektisW, kafenioW, trapeziW, partidaW, sizitisiW, bodyW;

			if (dx === 0) return;
			siromeno = $(window).data('siromeno');
			if (!siromeno) return;

			///////////////////////////////////////

			dx1 = dx;
			sizitisiW = siromeno.sizitisiW + dx1;
			if (sizitisiW < 0) sizitisiW = 0;
			else if (sizitisiW > 500) sizitisiW = 500;
			dx1 -= sizitisiW - siromeno.sizitisiW;

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

			dx -= dx1;
			bodyW = siromeno.bodyW + dx;
			Selida.bodyDOM.css('width', bodyW + 'px');

			Arena.enotitaPlatosSet(pektisW, kafenioW, trapeziW, partidaW, sizitisiW);
		},
	});

	return Arena;
};

Arena.epanel.lefkoma = [
	[
		'pikra.png',
		'mati.png',
		'dakri.png',
		'klama.png',
		'tromos.png',
		'thimos.png',
		'ekplixi.png',
		'mataki.png',
		'gelaki.png',
		'gelio.png',
		'love.png',
	],
	[
		'hi.gif',
		'mati.png',
		'doubt.png',
		'binelikia.gif',
		'plastis.gif',
		'ipopto.gif',
		'klama.png',
		'oxi.gif',
		'glosa.png',
		'toulipa.gif',
		'angry.png',
	],
	[
		'boss.png',
		'smile.png',
		'look.png',
		'haha.png',
		'oops.png',
		'misdoubt.png',
		'doubt.png',
		'pudency.png',
		'beated.png',
		'sad.png',
		'ah.png',
	],
	[
		'angry.png',
		'ft.png',
		'eek.png',
		'razz.png',
		'shame.png',
		'lovely.png',
		'sad.png',
		'smile.png',
		'lol.png',
		'shuai.png',
		'sweat.png',
	],
	[
		'matia.gif',
		'binelikia.gif',
		'kapikia.gif',
		'bouketo.gif',
		'kakos.gif',
		'plastis.gif',
		'malakia.gif',
		'lol.gif',
		'love.gif',
		'oxi.gif',
		'tromos.gif',
	],
	[
		'hi.gif',
		'koroidia.gif',
		'matakia.gif',
		'toulipa.gif',
		'ipopto.gif',
		'aporia.gif',
		'klaps.gif',
		'ekplixi.gif',
		'tromos.gif',
		'binelikia.gif',
		'nani.gif',
	],
	[
		'gialiko.png',
		'glosa.png',
		'kokinisma.png',
		'mousitsa.png',
		'mataki.png',
		'gelaki.png',
		'lol.png',
		'love.png',
		'apogoitefsi.png',
		'zimia.png',
		'dakri.png',
	],
	[
		'kardia.png',
		'xara.png',
		'tomata.png',
		'gelaki.png',
		'kokinizo.png',
		'kamenos.png',
		'mati.png',
		'glosa.png',
		'keratas.png',
		'what.png',
		'devil.png',
	],
];
