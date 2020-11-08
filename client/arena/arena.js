Arena = {
	// Η property "pexnidiPlatos" δείχνει το πλάτος
	// της τσόχας σε pixels.

	pexnidiPlatos: 600,

	bazaFiloWidth: 84,
	bazaFiloDuration: 360,

	bazaPektiWidth: 12,
	bazaPektiDuration: 500,

	skorNoticeDuration: 1500,

	eptariAgoraDuration1: 800,
	eptariAgoraDuration2: 500,

	eptariAlagiDuration1: 800,
	eptariAlagiDuration2: 500,
};

skiniko = new Skiniko();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

$(window).ready(function() {
	Selida.
	tabAccount().
	tabExodos().
	fyi.pano('Καλώς ήλθατε στον ιστότοπο της βίδας', 0).
	fyi.kato('Καλή διασκέδαση!');

	Arena.setup();
	skiniko.stisimo();

	if (Debug.flagGet('diataxi'))
	Arena.diataxi.prokat(Debug.flagGet('diataxi'));
}).
on('resize', function() {
	Arena.
	heightSetup();
});

Arena.unload = function() {
	if (Arena.unloaded)
	return;

	Arena.unloaded = true;

	Arena.
	paraskinio.klisimo();
};

$(window).
on('beforeunload', function() {
	Arena.unload();
}).
on('unload', function() {
	Arena.unload();
}).
on('focus', function() {
	setTimeout(function() {
		Arena.inputRefocus();
	}, 100);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Arena.setup = function() {
	Arena.height = Selida.ofelimoDOM.height();

	Arena.
	diafimisiSetup().
	enotitaSetup().
	titlosSetup().
	panelSetup().
	platosSetup().
	heightSetup().
	diataxi.setup().
	kafinfo.setup().
	profinfo.setup().
	dialogos.setup().
	prosklisiSetup().
	sizitisi.setup().
	inputSetup().
	escapeSetup();

	return Arena;
};

Arena.diafimisiSetup = function() {
	$('#diafimisi').append(Selida.klisimo());
	return Arena;
};

Arena.platosSetup = function() {
	var w = 0;

	w += Arena.pektisEnotitaDOM.outerWidth();
	w += Arena.mpanelDOM.outerWidth();
	w += Arena.kafenioEnotitaDOM.outerWidth();
	w += Arena.kpanelDOM.outerWidth();
	w += Arena.trapeziEnotitaDOM.outerWidth();
	w += Arena.tpanelDOM.outerWidth();
	w += Arena.pexnidiEnotitaDOM.outerWidth();
	w += Arena.cpanelDOM.outerWidth();
	w += Arena.epanelDOM.outerWidth();
	w += Arena.partidaEnotitaDOM.outerWidth();

	Selida.bodyDOM.css('width', w + 'px');

	return Arena;
};

Arena.heightSetup = function() {
	var h, h1;

	h = $(window).innerHeight();
	h -= Selida.toolbarDOM.outerHeight();
	h -= Selida.fyi.panoDOM.outerHeight();
	h -= Selida.fyi.katoDOM.outerHeight();
	h -= Selida.ribbonDOM.outerHeight();
	h -= 50;
	if (h < 600)
	h = 600;

	Selida.ofelimoDOM.css('height', h + 'px');

	h1 = h;
	h1 -= Arena.anazitisiAreaDOM.outerHeight();
	h1 -= Arena.apanelDOM.outerHeight();
	h1 -= Arena.a1panelDOM.outerHeight();
	h1 -= 1;
	if (h1 < 0) {
		Arena.anazitisiAreaDOM.css('height', '-=' + (-h1) + 'px'); 
		h1 = 0;
	}
	Arena.thamonasAreaDOM.css('height', h1 + 'px');

	h1 = h;
	h1 -= Arena.kafenioAreaDOM.outerHeight();
	h1 -= Arena.bpanelDOM.outerHeight();
	h1 -= 1;
	Arena.sizitisiLobiDOM.css('height', h1 + 'px');

	h1 = h;
	h1 -= Arena.trapeziAreaDOM.outerHeight();
	h1 -= Arena.dpanelDOM.outerHeight();
	h1 -= 1;
	Arena.sizitisiKafenioDOM.css('height', h1 + 'px');

	h1 = h;
	h1 -= Arena.lpanelDOM.outerHeight();
	h1 -= Arena.prosklisiAreaDOM.outerHeight();
	h1 -= Arena.zpanelDOM.outerHeight();
	h1 -= 1;
	Arena.sizitisiTrapeziDOM.css('height', h1 + 'px');

	h1 = h;
	h1 -= Arena.tsoxaDOM.outerHeight();
	h1 -= 30;
	Arena.theatisAreaDOM.css('height', h1 + 'px');

	return Arena;
};

// Όταν αυξομειώνουμε τα πλάτη των βασικών ενοτήτων της σελίδας, μεριμνούμε
// ιδιαίτερα για την πρώτη ενότητα (θαμώνες, αναζητήσεις κλπ). Πιο συγκεκριμένα,
// λαμβάνεται ιδιαίτερη μέριμνα εφόσον έχουμε ανοικτό το πλαίσιο διαχείρισης
// διατάξεων περιοχών (ΠΔΔΠ). Η ιδιαίτερη μέριμνα αφορά στη διευκόλυνση του
// χρήστη να κρατήσει αναλλοίωτο το πλάτος της συγκεκριμένης ενότητας, ώστε
// να μην μετακινείται το "mpanel" καθώς ο χρήστης αλλάζει διατάξεις.
//
// Παρατηρείται, λοιπόν, το εξής φαινόμενο: Αν ο χρήστης έχει ανοικτό το ΠΔΔΠ,
// κάθε απόπειρα μείωσης του πλάτους της επίμαχης ενότητας κάτω του default
// πλάτους (154px), σκαλώνει μέχρι το πλάτος να μειωθεί αρκετά. Αν το ΠΔΔΠ
// είναι κλειστό, τότε η αυξομείωση του πλάτους της επίμαχης περιοχής δεν
// παρουσιάζει ιδιαιτερότητες.

Arena.pektisPlatosSet = function(w) {
	if (w < 0)
	return 0;

	if (!Arena.diataxi.frame)
	return w;

	if (w < 100)
	return w;

	if (w > 154)
	return w;

	return 154;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.enotitaSetup = function() {
	//$('.enotita').css('height', Arena.height + 'px');

	Arena.
	pektisEnotitaSetup().
	kafenioEnotitaSetup().
	trapeziEnotitaSetup().
	pexnidiEnotitaSetup().
	partidaEnotitaSetup();

	return Arena;
};

Arena.pektisEnotitaSetup = function() {
	var h;

	Arena.pektisEnotitaDOM = $('#pektisEnotita').
	append(Arena.anazitisiAreaDOM = $('<div>').attr('id', 'anazitisiArea').addClass('katevato')).
	append(Arena.apanelDOM = $('<div>').addClass('panelH')).
	append(Arena.a1panelDOM = $('<div>').addClass('panelH')).
	append(Arena.thamonasAreaDOM = $('<div>').attr('id', 'thamonasArea').addClass('katevato'));

	h = Arena.pektisEnotitaDOM.outerHeight();
	h -= Arena.anazitisiAreaDOM.outerHeight();
	h -= Arena.apanelDOM.outerHeight();
	h -= Arena.a1panelDOM.outerHeight();
	Arena.thamonasAreaDOM.css('height', h + 'px');

	return Arena;
};

Arena.kafenioEnotitaSetup = function() {
	var h;

	Arena.kafenioEnotitaDOM = $('#kafenioEnotita').
	append(Arena.kafenioAreaDOM = $('<div>').attr('id', 'kafenioArea').addClass('katevato')).
	append(Arena.bpanelDOM = $('<div>').addClass('panelH')).
	append($('<div>').addClass('sizitisiLabel').text('Lobby')).
	append(Arena.sizitisiLobiDOM = $('<div>').attr('id', 'sizitisiLobi').addClass('katevato'));

	h = Arena.kafenioEnotitaDOM.outerHeight();
	h -= Arena.kafenioAreaDOM.outerHeight();
	h -= Arena.bpanelDOM.outerHeight();
	Arena.sizitisiLobiDOM.css('height', h + 'px');

	return Arena;
};

Arena.trapeziEnotitaSetup = function() {
	var h;

	Arena.trapeziEnotitaDOM = $('#trapeziEnotita').
	append(Arena.trapeziAreaDOM = $('<div>').attr('id', 'trapeziArea').addClass('katevato')).
	append(Arena.dpanelDOM = $('<div>').addClass('panelH')).
	append(Arena.sizitisiKafenioLabelDOM = $('<div>').addClass('sizitisiLabel').text('Καφενείο')).
	append(Arena.sizitisiKafenioDOM = $('<div>').attr('id', 'sizitisiKafenio').addClass('katevato'));

	h = Arena.trapeziEnotitaDOM.outerHeight();
	h -= Arena.trapeziAreaDOM.outerHeight();
	h -= Arena.dpanelDOM.outerHeight();
	Arena.sizitisiKafenioDOM.css('height', h + 'px');

	return Arena;
};

Arena.pexnidiEnotitaSetup = function() {
	Arena.pexnidiEnotitaDOM = $('#pexnidiEnotita');

	Arena.pexnidiEnotitaDOM.
	append(Arena.tsoxaDOM = $('<div>').attr('id', 'tsoxa').addClass('tsoxa')).
	append(Arena.theatisAreaDOM = $('<div>').attr({
		id: 'tsoxaTheatisArea',
		title: 'Χώρος θεατών',
	}));

	Tsoxa.setup();

	return Arena;
};

Arena.partidaEnotitaSetup = function() {
	var h;

	Arena.partidaEnotitaDOM = $('#partidaEnotita').
	append(Arena.lpanelDOM = $('<div>').attr('id', 'lpanel').addClass('panelH')).
	append(Arena.prosklisiAreaDOM = $('<div>').attr('id', 'prosklisiArea').addClass('katevato')).
	append(Arena.zpanelDOM = $('<div>').addClass('panelH')).
	append(Arena.sizitisiTrapeziLabelDOM = $('<div>').addClass('sizitisiLabel').text('Τραπέζι')).
	append(Arena.sizitisiTrapeziDOM = $('<div>').attr('id', 'sizitisiTrapezi').addClass('katevato'));

	h = Arena.partidaEnotitaDOM.outerHeight();
	h -= Arena.lpanelDOM.outerHeight();
	h -= Arena.prosklisiAreaDOM.outerHeight();
	h -= Arena.zpanelDOM.outerHeight();
	Arena.sizitisiTrapeziDOM.css('height', h + 'px');

	return Arena;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.titlosSetup = function() {
	Arena.titlosDOM = $('#toolbarCenterTitlos');
	Arena.titlosRefresh();

	return Arena;
};

Arena.titlosRefresh = function() {
	var trapezi;

	trapezi = ego.trapeziGet();

	if (!trapezi)
	Arena.titlosDOM.html('Μπουρλότο &#x2726; Βίδα');

	else if (trapezi.trapeziIsVida())
	Arena.titlosDOM.text('Βίδα!');

	else
	Arena.titlosDOM.text('Μπουρλότο!');

	return Arena;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.panelSetup = function() {
	Arena.
	apanelSetup().
	a1panelSetup().
	mpanelSetup().
	bpanelSetup().
	kpanelSetup().
	dpanelSetup().
	tpanelSetup().
	cpanelSetup().
	lpanelSetup().
	zpanelSetup().
	epanelSetup();

	Selida.panelSetup();

	return Arena;
};

// Η function "enotitaPanelInit" καλείται κατά το mousedown ολίσθησης σε όλα
// τα βασικά κάθετα panels της εφαρμογής και σκοπό έχει τον εμπλουτισμό τού
// συρόμενου αντικειμένου με τα πλάτη όλων των ενοτήτων, καθώς αυτά τα πλάτη
// πρόκειται να αλλαχθούν με σκοπό την επαναδιάταξη των ενοτήτων.

Arena.enotitaPanelInit = function(e, siromeno) {
	Selida.siromenoInitDefault(e, siromeno);
	siromeno.bodyW = Selida.bodyDOM.width();
	siromeno.pektisW = Arena.pektisEnotitaDOM.width();
	siromeno.kafenioW = Arena.kafenioEnotitaDOM.width();
	siromeno.trapeziW = Arena.trapeziEnotitaDOM.width();
	siromeno.partidaW = Arena.pexnidiEnotitaDOM.width();
	siromeno.sizitisiW = Arena.partidaEnotitaDOM.width();
};

// Η function "enotitaPlatosSet" καλείται κατά το mouseup λήξης ολίσθησης στα
// βασικά κάθετα panels της εφαρμογής και σκοπό έχει την εφαρμογή των πλατών
// που έχουν προκύψει κατά την ολίσθηση.

Arena.enotitaPlatosSet = function(pektis, kafenio, trapezi, partida, sizitisi) {
	Arena.pektisEnotitaDOM.css('width', pektis + 'px');
	Arena.kafenioEnotitaDOM.css('width', kafenio + 'px');
	Arena.trapeziEnotitaDOM.css('width', trapezi + 'px');
	Arena.pexnidiEnotitaDOM.css('width', partida + 'px');
	Arena.partidaEnotitaDOM.css('width', sizitisi + 'px');
	Arena.panelInputPlatosSet();
};

Arena.panelInputPlatosSet = function() {
	Arena.anazitisiInputDOM.css('width', parseInt(Arena.pektisEnotitaDOM.width() * 0.4) + 'px');
	Arena.lobiInputDOM.css('width', parseInt(Arena.kafenioEnotitaDOM.width() * 0.4) + 'px');
	Arena.kafenioInputDOM.css('width', parseInt(Arena.trapeziEnotitaDOM.width() * 0.4) + 'px');
	Arena.trapeziInputDOM.css('width', parseInt(Arena.partidaEnotitaDOM.width() * 0.4) + 'px');
	return Arena;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Arena.paraskinio = {
	win: null,
	button: $(),
};

Arena.paraskinio.open = function() {
	Arena.paraskinio.klisimo();
	Arena.paraskinio.win = window.open(Selida.server + 'paraskinio',
		'_blank', 'top=' + (window.screenY + 200) + ',left=' +
		(window.screenX + 230) + ',width=720,height=490,scrollbars=1');
	Arena.paraskinio.button.addClass('panelButtonEkremes');

	return Arena;
};

Arena.paraskinio.klisimo = function() {
	if (!Arena.paraskinio.win)
	return Arena;

	Arena.paraskinio.win.close();
	delete Arena.paraskinio.win;
	Arena.paraskinio.button.removeClass('panelButtonEkremes');

	return Arena;
};

Arena.paraskinioAlagi = function(img) {
	$(document.body).css('backgroundImage', img);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Υπάρχουν κάποια input πεδία που πρέπει να παραμένουν focused ό,τι και αν
// κάνει ο χρήστης πάνω στην αρένα, π.χ. κλικ σε κάποιο άσχετο σημείο της
// σελίδας. Αυτά τα input πεδία είναι το πεδίο αναζητήσεων, και τα τρία
// input πεδία συζήτησης (λόμπι, καφενείο, τραπέζι).

Arena.inputSetup = function() {
	Arena.anazitisiInputDOM.inputTrexonSet();
	Arena.lobiInputDOM.inputTrexonSet();
	Arena.kafenioInputDOM.prop('disabled', true).inputTrexonSet();
	Arena.trapeziInputDOM.prop('disabled', true).inputTrexonSet();

	Arena.inputTrexon = Arena.lobiInputDOM;
	if (Selida.oxiKinito())
	Arena.inputTrexon.focus();

	$(document).
	on('mouseup', function(e) {
		Arena.inputRefocus();
	});

	$('textarea,input').
	on('mouseup', function(e) {
		e.stopPropagation();
	});

	Arena.panelInputPlatosSet();
	return Arena;
};

Arena.inputRefocus = function(e) {
	var fld;

	if (e) {
		e.preventDefault();
		e.stopPropagation();
	}

	if (Selida.isKinito())
	return Arena;

	if (!Arena.inputTrexon)
	return Arena;

	fld = Arena.inputTrexon;
	if ((!fld.prop('disabled')) && (fld.width() > 0)) {
		fld.focus();
		return Arena;
	}

	fld = (fld === Arena.trapeziInputDOM ? Arena.kafenioInputDOM : Arena.trapeziInputDOM);
	if ((!fld.prop('disabled')) && (fld.width() > 0)) {
		fld.focus();
		return Arena;
	}

	fld = (fld === Arena.trapeziInputDOM ? Arena.kafenioInputDOM : Arena.trapeziInputDOM);
	if ((!fld.prop('disabled')) && (fld.width() > 0)) {
		fld.focus();
		return Arena;
	}

	fld = Arena.lobiInputDOM;
	if ((!fld.prop('disabled')) && (fld.width() > 0)) {
		fld.focus();
		return Arena;
	}

	fld = Arena.anazitisiInputDOM;
	if ((!fld.prop('disabled')) && (fld.width() > 0)) {
		fld.focus();
		return Arena;
	}

	Arena.inputTrexon.focus();
	return Arena;
};

Arena.inputTrexonSet = function() {
	var trapezi, kafenio;

	if ((trapezi = ego.trapeziGet()) && (trapezi !== ego.trapeziPrinGet()))
	Arena.inputTrexon = Arena.trapeziInputDOM;

	else if ((kafenio = ego.kafenioGet()) && (kafenio !== ego.kafenioPrinGet()))
	Arena.inputTrexon = Arena.kafenioInputDOM;

	if (!Arena.inputTrexon.prop('disabled'))
	return Arena;

	if (trapezi)
	Arena.inputTrexon = Arena.trapeziInputDOM;

	else if (kafenio)
	Arena.inputTrexon = Arena.kafenioInputDOM;

	else
	Arena.inputTrexon = Arena.lobiInputDOM;

	return Arena;
};

// Η jQuery function "inputTrexonSet" καλείται στα input πεδία που επιθυμούμε
// να παραμένουν focused.

jQuery.fn.inputTrexonSet = function() {
	var jql;

	jql = this.
	on('focus', function() {
		Arena.inputTrexon = jql;
	});

	return this;
};

Arena.escapeSetup = function() {
	$(document).on('keyup', function(e) {
		var button;

		switch (e.which) {

		// Κάποιες φορές δίνεται επιλογή στον παίκτη να κάνει κάποια επιλογή, π.χ.
		// δήλωση αγοράς, συμμετοχή κλπ. Σ' αυτές τις επιλογές συμπεριλαμβάνεται
		// συνήθως και επιλογή ΠΑΣΟ. Παρέχουμε, λοιπόν, εύκολο τρόπο να δηλωθεί
		// το πάσο μέσω του πλήκτρου Escape.

		case 27:
			button = Arena.escapeButtonGet();
			if (!button)
			return;

			if (button.data('escape'))
			return;

			e.stopPropagation();
			button.
			addClass('tsoxaButtonOplismeno').
			data('escape', true).
			trigger('click');
			break;
		}
	});

	return Arena;
};

// Στις περιπτώσεις που παρέχεται επιλογή ΠΑΣΟ μέσω σχετικού πλήκτρου, δίνουμε
// τη δυνατότητα στον παίκτη να πατήσει το πλήκτρο Escape αντί του σχετικού
// πλήκτρου. Προϋπόθεση γι' αυτό είναι το πλήκτρο να φέρει id "escapeButton".
// Η μέθοδος "escapeButtonGet" επιστρέφει ακριβώς αυτό το πλήκτρο ως jQuery
// list με ΑΚΡΙΒΩΣ ΕΝΑ dom element.

Arena.escapeButtonGet = function() {
	var escapeButton;

	escapeButton = $('#escapeButton');
	return(escapeButton.length === 1 ? escapeButton : null);
};
