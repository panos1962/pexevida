///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@
//
// Στο παρόν παρέχονται δομές και functions που εξυπηρετούν στη διαχείριση των διατάξεων
// περιοχών σχελίδας. Ως γνωστόν η βασική σελίδα είναι χωρισμένη στις εξής κάθετες περιοχές:
//
//	Παίκτες
//	mpanel
//
//	Καφενεία
//	kpanel
//
//	Τραπέζια καφενείου
//	tpanel
//
//	Παιχνίδι
//	cpanel
//
//	Παρτίδα
//	epanel
//
// Οι περισσότερες κάθετες περιοχές είναι χωρισμένες σε οριζόντιες περιοχές, οπότε η πλήρης
// διάταξη περιοχών διαμορφώνεται ως εξής:
//
//	Παίκτες
//		Αναζήτηση
//		apanel
//
//		Θαμώνες
//	mpanel
//
//	Καφενεία
//		Λίστα καφενείων
//
//		bpanel
//		Συζήτηση στο λόμπι
//	kpanel
//
//	Τραπέζια
//		Τραπέζια καφενείου
//
//		dpanel
//		Συζήτηση καφενείου
//	tpanel
//
//	Παιχνίδι
//	cpanel
//
//	Παρτίδα
//		lpanel
//		Προσκλήσεις
//
//		zpanel
//		Συζήτηση παρτίδας
//	epanel
//
// Οι διαστάσεις των περιοχών είναι μεταβλητές και αλλάζουν με ολίσθηση των ενδιάμεσων panels.
// Τα panels είναι εργαλειοθήκες αποτελούμενες από πλήκτρα, μέσω των οποίων ο χρήστης επιτελεί
// διάφορες ενέργειες. Τα panels είναι είτε κάθετες στήλες, είτε οριζόντιες ταινίες. Κάποια
// οριζόντια panels περιέχουν και input πεδία στα οποία ο χρήστης καταχωρεί δεδομένα, π.χ.
// σχόλιο συζήτησης, όνομα αναζητούμενου παίκτη κλπ.
//
// Όσον αφορά στις διαστάσεις των διαφόρων περιοχών, αυτές είναι όπως προείπαμε μεταβλητές.
// Το σύστημα παρέχει μια γκάμα προεπιλεγμένων επιλογών, αλλά ο χρήστης μπορεί να αλλάξει
// τις διαστάσεις των περιοχών (μετακινώντας τα ενδιάμεσα panels) και να αποθηκεύσει τις
// επιλογές του σε λίστα διατάξεων.
//
// Στο παρόν περιέχονται τα απαραίτητα εργαλεία για τη διαχείριση των διατάξεων περιοχών
// σελίδας του χρήστη.
//
// Στο παρόν χρησιμοποιούνται οι εξής συντομογραφίες:
//
// 	ΔΠΣ	Διάταξη Περιοχών Σελίδας
// 	ΠΔΔΠ	Πλαίσιο Διαχείρισης Περιοχών Σελίδας

Arena.diataxi = {
	// Η flag "frame" δείχνει αν το πλαίσιο διαχείρισης διατάξεων περιοχών
	// (ΠΔΔΠ) είναι ανοικτό. By default το ΠΔΔΠ είναι κλειστό.

	frame: false,

	// Ο χρήστης μπορεί να αποθηκεύει συγκεκριμένες διατάξεις με σκοπό να τις
	// εφαρμόζει στη σελίδα όποτε επιθυμεί. Αυτές οι διατάξεις αποθηκεύονται
	// στην database απ' όπου ανασύρονται και τοποθετούνται στο array "lista".

	lista: [],

	// Η μταβλητή "listaTora" δείχνει την τρέχουσα διάταξη από τις αποθηκευεμένες
	// διατάξεις του χρήστη. Ο χρήστης μπορεί να εναλλάσσει τις δύο πρώτες από
	// τις διατάξεις του κάνοντας κλικ στο σχετικό πλήκτρο του "mpanel".

	listaTora: 0,
};

// Η function "setup" προετοιμάζει το ΠΔΔΠ. Πρόκειται για div στο οποίο
// εμφανίζονται οι διατάξεις που έχει αποθηκεύσει ο χρήστης και panel δημιουργίας,
// ενημέρωσης και διαγραφής των διατάξεων του χρήστη.

Arena.diataxi.setup = function() {
	Arena.diataxi.DOM = $('<div>').
	attr('id', 'diataxiFrame').
	addClass('dialogos').

	// Ακολουθούν τα σχετικά με το κουμπάκι κλεισίματος επάνω δεξιά.

	append(Selida.klisimo(function(e) {
		Arena.mpanel.bpanelButtonGet('diataxiSave').click();
		Arena.inputRefocus();
	}).
	attr('title', 'Κλείσιμο')).

	// Ακολουθεί ο τίτλος του ΠΔΔΠ.

	append($('<div>').addClass('dialogosTitlos').text('Διατάξεις περιοχών σελίδας')).

	// Ακολουθεί το panel διαχείρισης στο οποίο ενυπάρχουν ένα input
	// πεδίο που αφορά στην ονομασία της διάταξης και κάποια πλήκτρα
	// με τα οποία ο χρήστης αποθηκεύει και διαγράφει διατάξεις.

	append($('<div>').addClass('diataxiPanel').

	// Όλα τα παραπάνω παρέχονται σε HTML form προκειμένου να έχουμε
	// χειρισμό submit.

	append($('<form>').

	// Ακολουθεί το input πεδίο που αφορά στην ονομασία της διάταξης.

	append(Arena.diataxi.inputOnomasiaDOM = $('<input>').addClass('diataxiOnomasiaInput')).

	// Ακολουθεί εικονίδιο ολίσθησης καθώς το ΠΔΔΠ θέλουμε να είναι συρόμενο.

	append($('<img>').attr('src', 'ikona/misc/baresV.png').addClass('diataxiBaresIcon')).

	// Ακολουθεί πλήκτρο καταχώρησης. Αυτό το πλήκτρο επιτελεί διττή λειτουργία.
	// Αρχικά λειτουργεί ως πλήκτρο δημιουργία νέας διατάξεως και στη συνέχεια
	// λειτουργεί ως πλήκτρο αποθήκευσης της διάταξης στην database.

	append(Arena.diataxi.saveButtonDOM = $('<button>').text('Καταχώρηση')).
	addClass('diataxiButton').attr('type', 'submit').

	// Ακολουθεί το πλήκτρο διαγραφής με το οποίο διαγράφουμε την τρέχουσα
	// διάταξη. Για να διαγράψουμε κάποια διάταξη πρέπει πρώτα να την
	// «φορτώσουμε» κάνοντας κλικ επάνω στη διάταξη. Το πλήκτρο είναι
	// εμφανές μόνον όσο υπάρχει τρέχουσα (φορτωμένη) διάταξη.

	append(Arena.diataxi.diagrafiButtonDOM = $('<button>').text('Διαγραφή').
	addClass('diataxiButton').attr('type', 'button').css('display', 'none').
	on('click', Arena.diataxi.diagrafi)).

	// Ακολουθεί πλήκτρο «αποφόρτωσης» διάταξης, με το οποίο επαναφέρουμε
	// το ΠΔΔΠ στην αρχική του κατάσταση, όπου δεν υπάρχει κάποια τρέχουσα
	// διάταξη προκειμένου αυτή να αποθηκευθεί ή να διαγραφεί.

	append(Arena.diataxi.neaButtonDOM = $('<button>').text('Νέα').
	addClass('diataxiButton').attr('type', 'button').css('display', 'none').
	on('click', Arena.diataxi.katharismos)).

	// Ακολουθεί κώδικας που αφορά στο submit το οποίο εκτελείται με το
	// πλήκτρο "Καταχώρηση/Αποθήκευση" και με το ENTER.

	on('submit', Arena.diataxi.submit))).

	// Ακολουθεί η περιοχή εμφάνισης των διατάξεων του χρήστη, όπου εμφανίζονται
	// οι διατάξεις του χρήστη, από μια σε κάθε γραμμή. Ο χρήστης μπορεί να
	// επιλέξει κάποια διάταξη κάνοντας κλικ επάνω στην ονομασία της διάταξης
	// και με τον τρόπο αυτόν να την καταστήσει τρέχουσα προκειμένου είτε να
	// την εφαρμόσει στη σελίδα, είτε να τη διαγράψει, είτε να της αλλάξει
	// τα δεδομένα σύμφωνα με την τρέχουσα διάταξη των περιοχών της σελίδας.

	// Ο χρήστης μπορεί, ακόμη, να αλλάξει θέση σε κάποια διάταξη με ολίσθηση
	// της διάταξης προς τα πάνω ή προς τα κάτω. Οι δύο πρώτες διατάξεις
	// θεωρούνται διατάξεις καφενείου και παρτίδας αντίστοιχα. Διάταξη
	// καφενείου είναι αυτή που βολεύει το χρήστη όσο αυτός δεν παίζει,
	// ή δεν παρακολουθεί σε κάποιο τραπέζι, μηδενίζεται τελείως το πλάτος
	// της περιοχής παιχνιδιού, προσκλήσεων και συζήτησης της παρτίδας,
	// ενώ η διάταξη παρτίδας βολεύει όταν ο χρήστης παίζει ή παρακολουθεί
	// σε κάποιο τραπέζι.

	append(Arena.diataxi.itemAreaDOM = $('<div>').addClass('diataxiItemArea').
	sortable({
		axis: 'y',
		cursor: 'ns-resize',
		handle: '.diataxiKodikos',
		update: function(e, ui) {
			Arena.diataxi.soseOles();
		},
	}).
	disableSelection().

	// Ο listener που ακολουθεί είναι απαραίτητος για να μην ολισθαίνει
	// το ΠΔΔΠ όταν μετακινούμε κάποια διάταξη πάνω/κάτω. Αυτό συμβαίνει
	// επειδή το ΠΔΔΠ είναι συρόμενο.

	on('mousedown', function(e) {
		e.stopPropagation();
	}));

	// Καθιστούμε το ΠΔΔΠ συρόμενο και το προσαρτούμε στη σελίδα μας.

	Arena.diataxi.
	fereData().
	DOM.siromeno().
	appendTo(Selida.ofelimoDOM);

//Arena.mpanel.bpanelButtonGet('diataxiSave').click();
	return Arena;
};

// Η function "prokat" δέχεται ως παράμετρο έναν κωδικό προκατασκευασμένης ΔΠΣ και
// εφαρμόζει την συγκεκριμένη ΔΠΣ στη σελίδα. Οι προκατασκευασμένες ΔΠΣ είναι:
//
//	0	Οικονομική διάταξη. Εμφανίζονται οι θαμώνες, τα καφενεία και τα
//		τραπέζια, ενώ οι περιοχές που αφορούν στην παρτίδα είναι μηδενικές.
//
//	1	Εμφανίζονται οι θαμώνες, τα καφενεία, τα τραπέζια και η τσόχα χωρίς
//		τα υπόλοιπα στοιχεία παρτίδας.
//
//	2	Διάταξη παρτίδας. Εμφανίζονται οι θαμώνες, η τσόχα και τα στοιχεία
//		παρτίδας (προσκλήσεις, συζήτηση κλπ).
//
//	3	Διάταξη lobby. Εμφανίζονται οι θαμώνες, τα καφενεία και τα τραπέζια
//		με έμφαση στις σχετικές συζητήσεις. Δεν εμφανίζεται η τσόχα και τα
//		στοιχεία παρτίδας.

Arena.diataxi.prokat = function(diataxi) {
	switch (diataxi) {
	case 1:
		Arena.kafenioEnotitaDOM.css('width', '159px');
		Arena.trapeziEnotitaDOM.css('width', '319px');
		Arena.pexnidiEnotitaDOM.css('width', '600px');
		Arena.partidaEnotitaDOM.css('width', '0px');
		break;
	case 2:
		Arena.kafenioEnotitaDOM.css('width', '0px');
		Arena.trapeziEnotitaDOM.css('width', '0px');
		Arena.pexnidiEnotitaDOM.css('width', '600px');
		Arena.partidaEnotitaDOM.css('width', '478px');
		break;
	case 3:
		Arena.kafenioEnotitaDOM.css('width', '442px');
		Arena.trapeziEnotitaDOM.css('width', '636px');
		Arena.pexnidiEnotitaDOM.css('width', '0px');
		Arena.partidaEnotitaDOM.css('width', '0px');
		break;
	default:
		Arena.kafenioEnotitaDOM.css('width', '297px');
		Arena.trapeziEnotitaDOM.css('width', '324px');
		Arena.pexnidiEnotitaDOM.css('width', '0px');
		Arena.partidaEnotitaDOM.css('width', '0px');
		break;
	}

	Arena.
	platosSetup().
	panelInputPlatosSet().
	inputRefocus();

	return Arena.diataxi;
};

// Η function "enalagi" εναλλάσσει τις δύο πρώτες διατάξεις του χρήστη.
// Συμβατικά θεωρούμε ότι η πρώτη διάταξη αφορά σε άποψη lobby/καφενείου,
// ενώ η δεύτερη αφορά σε mode παρτίδας.

Arena.diataxi.enalagi = function() {
	if (Arena.diataxi.lista.length <= 0) {
		Selida.fyi.epano('Δεν υπάρχουν καταχωρημένες διατάξεις');
		return Arena.diataxi;
	}

	Arena.diataxi.listaTora++;
	if (Arena.diataxi.listaTora > 1)
	Arena.diataxi.listaTora = 0;
	else if (Arena.diataxi.listaTora >= Arena.diataxi.lista.length)
	Arena.diataxi.listaTora = 0;

	Arena.diataxi.efarmogi(Arena.diataxi.listaTora);
	return Arena.diataxi;
};

Arena.diataxi.efarmogi = function(n) {
	var diataxi, enotita, data;

	if ((n < 0) || (n >= Arena.diataxi.lista.length)) {
		Selida.fyi.epano('Απροσδιόριστη διάταξη περιοχών σελίδας');
		return Arena.diataxi;
	}

	diataxi = Arena.diataxi.lista[n];
	Selida.fyi.pano('Διάταξη περιοχών: <span class="entona prasino">' + diataxi.o + '</span>');

	enotita = diataxi.d.split(',');
	if (enotita.length != 5)
	return Arena.diataxi;

	data = enotita[0].split(':');
	if (data.length === 2) {
		Arena.pektisEnotitaDOM.css('width', parseInt(data[0]) + 'px');
	}

	data = enotita[1].split(':');
	if (data.length === 2) {
		Arena.kafenioEnotitaDOM.css('width', parseInt(data[0]) + 'px');
	}

	data = enotita[2].split(':');
	if (data.length === 2) {
		Arena.trapeziEnotitaDOM.css('width', parseInt(data[0]) + 'px');
	}

	Arena.pexnidiEnotitaDOM.css('width', parseInt(enotita[3]) + 'px');

	data = enotita[4].split(':');
	if (data.length === 2) {
		Arena.partidaEnotitaDOM.css('width', parseInt(data[0]) + 'px');
	}

	Arena.
	platosSetup().
	panelInputPlatosSet().
	inputRefocus();

	return Arena.diataxi;
};

Arena.diataxi.frameAnigma = function() {
	Arena.diataxi.fereData();
	Arena.diataxi.DOM.finish().fadeIn(100, function() {
		Arena.diataxi.frame = true;
		Arena.diataxi.inputOnomasiaDOM.focus();
	});

	return Arena.diataxi;
};

Arena.diataxi.frameKlisimo = function() {
	Arena.diataxi.DOM.finish().fadeOut(100, function() {
		Arena.diataxi.frame = false;
		Arena.inputRefocus();
	});

	return Arena.diataxi;
};

Arena.diataxi.fereData = function() {
	Arena.diataxi.itemAreaDOM.empty();

	$.post('arena/diataxi.php').
	done(Arena.diataxi.loadData).
	fail(function(err) {
		console.error(err);
	});

	return Arena.diataxi;
};

Arena.diataxi.loadData = function(data) {
	var i, diataxi;

	try {
		('Arena.diataxi.lista = [' + data + '];').evalAsfales();
	} catch(e) {
		Selida.fyi.epano('λανθασμένα δεδομένα διατάξεων περιοχών σελίδας');
		console.error(data);
		Arena.diataxi.lista = [];
	}

	for (i = 0; i < Arena.diataxi.lista.length; i++) {
		diataxi = Arena.diataxi.lista[i];

		Arena.diataxi.itemAreaDOM.
		append($('<div>').addClass('diataxiItem ui-state-default').
		attr('k', '_' + diataxi.k).
		data('kodikos', diataxi.k).
		data('data', diataxi.d).
		append($('<div>').addClass('diataxiKodikos ui-icon ui-icon-arrowthick-2-n-s')).
		append($('<div>').addClass('diataxiOnomasia').
		text(diataxi.o).
		on('click', function() {
			var diataxi = $(this).parent();

			Arena.diataxi.clearEpilogi().
			kodikosSet(diataxi.addClass('diataxiEpilogi').data('kodikos')).
			inputOnomasiaDOM.val($(this).text()).select();

			Arena.diataxi.saveButtonDOM.text('Αποθήκευση');
			Arena.diataxi.neaButtonDOM.css('display', 'inline-block');
			Arena.diataxi.diagrafiButtonDOM.css('display', 'inline-block');
		})));
	}

	Arena.diataxi.
	katharismos();

	return Arena.diataxi;
};

Arena.diataxi.kodikosSet = function(kodikos) {
	if (Arena.diataxi.kodikos === kodikos)
	Arena.diataxi.efarmogi(Arena.diataxi.kodikos - 1).frameKlisimo();

	else
	Arena.diataxi.kodikos = kodikos;

	return Arena.diataxi;
};

Arena.diataxi.clearEpilogi = function() {
	Arena.diataxi.DOM.find('.diataxiEpilogi').removeClass('diataxiEpilogi');
	return Arena.diataxi;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.diataxi.submit = function() {
	var onomasia;

	onomasia = Arena.diataxi.inputOnomasiaDOM.val().trim();
	if (!onomasia) {
		Arena.diataxi.saveButtonDOM.text('Αποθήκευση');
		Arena.diataxi.inputOnomasiaDOM.
		val((new Date).toLocaleString()).
		select();
		return false;
	}

	Selida.fyi.pano('Αποθήκευση διάταξης περιοχών σελίδας. Παρακαλώ περιμένετε…');
	$.post('arena/diataxi.php', {
		kodikos: Arena.diataxi.kodikos,
		onomasia: onomasia,
		data: Arena.diataxi.diataxiData(),
	}).
	done(function(rsp) {
		Selida.fyi.pano('Αποθηκεύτηκε επιτυχώς η τρέχουσα διάταξη περιοχών σελίδας!');
		Arena.diataxi.itemAreaDOM.empty();
		Arena.diataxi.loadData(rsp);
	}).
	fail(function(err) {
		Selida.fyi.epano('Παρουσιάστηκε σφάλμα κατά την αποθήκευση διάταξης περιοχών σελίδας');
		console.error(err);
	});

	return false;
};

Arena.diataxi.diataxiData = function() {
	var x = '';

	x += Arena.pektisEnotitaDOM.width() + ':';
	x += Arena.anazitisiAreaDOM.height() + ',';
	x += Arena.kafenioEnotitaDOM.width() + ':';
	x += Arena.kafenioAreaDOM.height() + ',';
	x += Arena.trapeziEnotitaDOM.width() + ':';
	x += Arena.trapeziAreaDOM.height() + ',';
	x += Arena.pexnidiEnotitaDOM.width() + ',';
	x += Arena.partidaEnotitaDOM.width() + ':';
	x += Arena.prosklisiAreaDOM.height();

	return x;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.diataxi.soseOles = function() {
	var lista;

	lista = Arena.diataxi.itemAreaDOM.sortable('toArray', {attribute:'k'});
	Globals.awalk(lista, function(i, item) {
		lista[i] = item.substr(1);
	});

	Selida.fyi.pano('Αποθήκευση διατάξεων περιοχών σελίδας. Παρακαλώ περιμένετε…');
	$.post('arena/diataxi.php', {
		lista: lista,
	}).
	done(function(rsp) {
		Selida.fyi.pano('Αποθηκεύτηκαν επιτυχώς οι διατάξεις περιοχών σελίδας!');
		Arena.diataxi.itemAreaDOM.empty();
		Arena.diataxi.loadData(rsp);
	}).
	fail(function(err) {
		Selida.fyi.epano('Παρουσιάστηκε σφάλμα κατά την αποθήκευση διατάξεων περιοχών σελίδας');
		console.error(err);
	});

	return false;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.diataxi.katharismos = function() {
	Arena.diataxi.kodikos = Arena.diataxi.DOM.find('.diataxiItem').length + 1;

	Arena.diataxi.saveButtonDOM.text('Καταχώρηση');
	Arena.diataxi.neaButtonDOM.css('display', 'none');
	Arena.diataxi.diagrafiButtonDOM.css('display', 'none');

	Arena.diataxi.clearEpilogi().
	inputOnomasiaDOM.val('').focus();

	return Arena.diataxi;
};

Arena.diataxi.diagrafi = function() {
	$.post('arena/diataxi.php', {
		diagrafi: Arena.diataxi.kodikos,
	}).
	done(function(rsp) {
		Arena.diataxi.itemAreaDOM.empty();
		Arena.diataxi.loadData(rsp);
	}).
	fail(function(err) {
		Selida.ajaxFail(err);
	});

	return Arena.diataxi;
};
