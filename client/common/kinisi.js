///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Στο παρόν υπάρχουν δομές και διαδικασίες που αφορούν στη διαχείριση των κινήσεων.
// Όλες οι μεταβολές στο σκηνικό γίνονται μέσω κινήσεων. Κάθε είδος κίνησης συνοδεύεται
// από μέθοδο του σκηνικού με όνομα "processKinisiXXXX", όπου "XXXX" είναι το είδος της
// κίνησης και μέσω της οποίας εφαρμόζονται οι σχετικές αλλαγές στο σκηνικό. Οι μέθοδοι
// διαχείρισης των κινήσεων δέχονται ως παράμετρο τα data της κίνησης. Μπορούμε να πούμε
// ότι οι μέθοδοι διαχείρισης των κινήσεων είναι για την εφαρμογή το ανάλογο των device
// drivers για ένα λειτουργικό σύστημα.
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// AT -- Arxeιοθέτηση τραπεζιού
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.

Skiniko.prototype.processKinisiAT = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	this.skinikoSinedriaWalk(function() {
		if (this.sinedriaOxiTrapezi(data.trapezi))
		return;

		this.
		sinedriaTrapeziSet().
		sinedriaSimetoxiSet();
	
	});

	skiniko.skinikoTrapeziDelete(data.trapezi);
	return this;
};

// SX -- Συσχέτιση παικτών
//
// Δεδομένα
//
//	pektis		Login name παίκτη.
//	sxetizomenos	Login name συσχετιζομένου.
//	sxesi		Είδος σχέσης.

Skiniko.prototype.processKinisiSX = function(data) {
	var pektis;

	pektis = this.skinikoPektisGet(data.pektis);
	if (!pektis)
	return this;

	pektis.
	pektisSxesiSet(data.sxetizomenos, data.sxesi);

	return this;
};

// KA -- Τέλος ακύρωσης κινήσεων
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	pektis		Login name παίκτη.

Skiniko.prototype.processKinisiKA = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	trapezi.
	trapeziAkirosiClear().
	partidaReplay();

	return this;
};

// AK -- Ακύρωση κίνησης
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	dianomi		Κωδικός διανομής.
//	pektis		Login name παίκτη.
//	energia		Κωδικός προς ακύρωσιν ενέργειας.

Skiniko.prototype.processKinisiAK = function(data) {
	var trapezi, dianomi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	dianomi = trapezi.trapeziDianomiGet(data.dianomi);
	if (!dianomi)
	return this;

	trapezi.trapeziAkirosiSet(data.pektis);

	Globals.walk(dianomi.energia, function(kodikos, energia) {
		if (kodikos >= data.energia)
		delete dianomi.energia[kodikos];
	});

	energiaArray = [];
	Globals.awalk(dianomi.energiaArray, function(i, energia) {
		var kodikos;

		kodikos = energia.energiaKodikosGet();
		if (kodikos < data.energia)
		energiaArray.push(energia);
	});
	dianomi.energiaArray = energiaArray;

	if (energiaArray.length < 2)
	trapezi.trapeziAkirosiClear();

	trapezi.partidaReplay();
	return this;
};

// TT -- Αλλαγή θέσης θέασης
//
// Δεδομένα
//
//	pektis		Login name παίκτη.
//	thesi		Νέα θέση θέασης.

Skiniko.prototype.processKinisiTT = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria)
	return this;

	sinedria.sinedriaThesiSet(data.thesi);
	return this;
};

// PS -- Παράμετρος παίκτη.
//
// Δεδομένα
//
//	pektis		Login name παίκτη.
//	param		Ονομασία παραμέτρου.
//	timi		Τιμή παραμέτρου.

Skiniko.prototype.processKinisiPS = function(data) {
	var pektis;

	pektis = this.skinikoPektisGet(data.pektis);
	if (!pektis)
	return this;

	pektis.pektisPeparamSet(data.param, data.timi);
	return this;
};

// EG -- Ενέργεια.
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	dianomi		Κωδικός διανομής.
//	kodikos		Κωδικός ενέργειας.
//	pektis		Θέση παίκτη.
//	idos		Είδος ενέργγειας.
//	data		Data ενέργειας.

Skiniko.prototype.processKinisiEG = function(data) {
	var trapezi, dianomi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	dianomi = trapezi.trapeziTelefteaDianomi();
	if (!dianomi)
	return this;

	dianomi.dianomiEnergiaPush(new Energia(data));
	return this;
};

// DN -- Διανομή.
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	kodikos		Κωδικός διανομής.
//	dealer		Θέση dealer.
//
// Optional
//	pliromi		Κωδικός προηγούμενης διανομής
//	skor13		Πόντοι ομάδας "13" προηγούμενης διανομής
//	skor24		Πόντοι ομάδας "24" προηγούμενης διανομής
//	kremamena	Κρεμάμενα προηγούμενης διανομής

Skiniko.prototype.processKinisiDN = function(data) {
	var trapezi, dianomi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	dianomi = trapezi.trapeziDianomiGet(data.pliromi);
	if (dianomi) {
		dianomi.dianomiSkorSet('13', data.skor13)
		dianomi.dianomiSkorSet('24', data.skor24)
		dianomi.dianomiKremamenaSet(data.kremamena)
	}

	trapezi.
	trapeziDianomiPush(new Dianomi({
		kodikos: data.kodikos,
		dealer: data.dealer,
	})).
	partidaReplay();

	return this;
};

// XA -- Διαπραγμάτευση όρων παιχνιδιού
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	pektis		Login name παίκτη.
//	thesi		Θέση παίκτη.

Skiniko.prototype.processKinisiXA = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	trapezi.trapeziApodoxiSet(data.thesi);
	return this;
};

// AX -- Αποδοχή όρων παιχνιδιού
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	pektis		Login name παίκτη.
//	thesi		Θέση παίκτη.

Skiniko.prototype.processKinisiAX = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	trapezi.trapeziApodoxiSet(data.thesi, true);
	return this;
};

// KL -- Διαπίστευση παίκτη σε καφενείο
//
// Δεδομένα
//
//	kafenio		Κωδικός καφενείου.
//	pektis		Login name παίκτη.

Skiniko.prototype.processKinisiKL = function(data) {
	this.skinikoDiapisteSet(new Diapiste(data));
	return this;
};

// KX -- Αποπομπή παίκτη από καφενείο
//
// Δεδομένα
//
//	kafenio		Κωδικός καφενείου.
//	pektis		Login name παίκτη.

Skiniko.prototype.processKinisiKX = function(data) {
	this.skinikoDiapisteDelete(new Diapiste(data));
	return this;
};

// PH -- Από παίκτης θεατής
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	pektis		Login name του παίκτη.
//	thesi		Σε ποια θέση.

Skiniko.prototype.processKinisiPH = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria)
	return this;

	trapezi = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (trapezi)
	trapezi.trapeziTheatisDelete(data.pektis);

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	trapezi.
	trapeziPektisSet(data.thesi).
	trapeziTheatisSet(data.pektis);

	sinedria.
	sinedriaKafenioSet(trapezi.trapeziKafenioGet()).
	sinedriaTrapeziSet(data.trapezi).
	sinedriaThesiSet(data.thesi).
	sinedriaSimetoxiSet('ΘΕΑΤΗΣ');

	return this;
};

// HP -- Από θεατής παίκτης
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	pektis		Login name του παίκτη.
//	thesi		Σε ποια θέση.

Skiniko.prototype.processKinisiHP = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria)
	return this;

	trapezi = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (trapezi)
	trapezi.trapeziTheatisDelete(data.pektis);

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	trapezi.
	trapeziTheatisDelete(data.pektis).
	trapeziPektisSet(data.thesi, data.pektis);

	sinedria.
	sinedriaKafenioSet(trapezi.trapeziKafenioGet()).
	sinedriaTrapeziSet(data.trapezi).
	sinedriaThesiSet(data.thesi).
	sinedriaSimetoxiSet('ΠΑΙΚΤΗΣ');

	return this;
};

// LH -- Αποδοχή πρόσκλησης με τοποθέτηση ως θεατή.
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	pektis		Login name του θεατή.

Skiniko.prototype.processKinisiLH = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria)
	return this;

	trapezi = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (trapezi)
	trapezi.trapeziTheatisDelete(data.pektis);

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	trapezi.
	trapeziTheatisSet(data.pektis);

	sinedria.
	sinedriaKafenioSet(trapezi.trapeziKafenioGet()).
	sinedriaTrapeziSet(data.trapezi).
	sinedriaThesiSet(1).
	sinedriaSimetoxiSet('ΘΕΑΤΗΣ');

	return this;
};

// LP -- Αποδοχή πρόσκλησης ως παίκτη
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	pektis		Login name του παίκτη.
//	thesi		Login name του παραλήπτη.

Skiniko.prototype.processKinisiLP = function(data) {
	var sinedria, trapezi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria)
	return this;

	trapezi = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (trapezi)
	trapezi.trapeziTheatisDelete(data.pektis);

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	trapezi.
	trapeziTheatisDelete(data.pektis).
	trapeziPektisSet(data.thesi, data.pektis);

	sinedria.
	sinedriaKafenioSet(trapezi.trapeziKafenioGet()).
	sinedriaTrapeziSet(data.trapezi).
	sinedriaThesiSet(data.thesi).
	sinedriaSimetoxiSet('ΠΑΙΚΤΗΣ');

	return this;
};

// XL -- Ανάκληση/διαγραφή πρόσκλησης
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	apo		Login name του παίκτη που επιδίδει την πρόσκληση.
//	pros		Login name του παραλήπτη.

Skiniko.prototype.processKinisiXL = function(data) {
	var trapezi, sinedria;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	trapezi.trapeziProsklisiDelete(data.apo, data.pros);

	if (trapezi.trapeziIsDimosio())
	return this;

	sinedria = this.skinikoSinedriaGet(data.pros);
	if (!sinedria)
	return this;

	if (sinedria.sinedriaOxiTrapezi(data.trapezi))
	return this;

	if (sinedria.sinedriaIsPektis())
	return this;

	trapezi.
	trapeziTheatisDelete(data.pros);

	sinedria.
	sinedriaTrapeziSet().
	sinedriaThesiSet().
	sinedriaSimetoxiSet();

	return this;
};

// PL -- Επίδοση πρόσκλησης
//
// Δεδομένα
//
//	trapezi		Κωδικός τραπεζιού.
//	apo		Login name του παίκτη που επιδίδει την πρόσκληση.
//	pros		Login name του παραλήπτη.

Skiniko.prototype.processKinisiPL = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	trapezi.trapeziProsklisiSet(new Prosklisi(data));

	return this;
};

// OK -- Αλλαγή διάταξης παικτών
//
// Δεδομένα
//
//	pektis		Login name του παίκτη που κάνει την αλλαγή.
//	kafenio		Κωδικός καφενείου.
//	onomasia	Ονομασία καφενείου.

Skiniko.prototype.processKinisiOK = function(data) {
	var kafenio;

	kafenio = this.skinikoKafenioGet(data.kafenio);
	if (!kafenio)
	return this;

	kafenio.kafenioOnomasiaSet(data.onomasia);

	return this;
};

// DX -- Αλλαγή διάταξης παικτών
//
// Δεδομένα
//
//	pektis		Login name του παίκτη που κάνει την αλλαγή.
//	trapezi		Κωδικός τραπεζιού.
//	sinthesi	Object σύνθεσης

Skiniko.prototype.processKinisiDX = function(data) {
	var trapezi, thesi, pektis, sinedria;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	for (thesi in data.sinthesi) {
		pektis = data.sinthesi[thesi];
		trapezi.trapeziPektisSet(thesi, pektis);

		sinedria = this.skinikoSinedriaGet(pektis);
		if (!sinedria)
		continue;

		sinedria.sinedriaThesiSet(thesi);
	}

	return this;
};

// TP -- Παράμετρος τραπεζιού
//
// Δεδομένα
//
//	pektis		Login name του παίκτη που κάνει την αλλαγή.
//	trapezi		Κωδικός τραπεζιού.
//	param		Είδος παραμέτρου τραπεζιού, π.χ. "ΠΡΙΒΕ"
//	timi		Τιμή παραμέτρου, π.χ. "NAI"

Skiniko.prototype.processKinisiTP = function(data) {
	var trapezi;

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	trapezi.
	trapeziTrparamSet(data.param, data.timi);

	return this;
};

// IK -- Αλλαγή ιδιωτικότητας καφενείου
//
// Δεδομένα
//
//	pektis		Login name του παίκτη που κάνει την αλλαγή.
//	kafenio		Κωδικός καφενείου.
//	idiotikotita	Καθεστώς ιδιωτικότητας (ΔΗΜΟΣΙΟ, ΠΡΙΒΕ).

Skiniko.prototype.processKinisiIK = function(data) {
	var kafenio;

	kafenio = this.skinikoKafenioGet(data.kafenio);
	if (!kafenio)
	return this;

	kafenio.
	kafenioPriveSet(data.idiotikotita === 'ΠΡΙΒΕ');

	return this;
};

// XT -- Έξοδος από τραπέζι
//
// Με την κίνηση αποχώρησης από τραπέζι κάνουμε γνωστό στο σκηνικό ότι κάποιος
// παίκτης αποχωρεί από το τραπέζι στο οποίο βρίσκεται.
//
// Δεδομένα
//
//	pektis		Το login name του παίκτη που κάνει την επιλογή.

Skiniko.prototype.processKinisiXT = function(data) {
	var sinedria, trapezi, thesi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria)
	return this;

	trapezi = skiniko.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (trapezi) {
		trapezi.trapeziTheatisDelete(data.pektis);
		thesi = trapezi.trapeziThesiPekti(data.pektis);
		if (thesi)
		trapezi.trapeziPektisSet(thesi);
	}

	sinedria.
	sinedriaTrapeziSet().
	sinedriaThesiSet().
	sinedriaSimetoxiSet();

	return this;
};

// ET -- Επιλογή τραπεζιού
//
// Με την κίνηση επιλογής τραπεζιού κάνουμε γνωστό στο σκηνικό ότι κάποιος
// παίκτης έχει επιλέξει κάποιο τραπέζι.
//
// Δεδομένα
//
//	pektis		Το login name του παίκτη που κάνει την επιλογή.
//	kafenio		Ο κωδικός καφενείου του τραπεζιού.
//	trapezi		Ο κωδικός τραπεζιού που επιλέγει ο παίκτης.

Skiniko.prototype.processKinisiET = function(data) {
	var sinedria, trapezi, kafenio, thesi;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria)
	return this;

	trapezi = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (trapezi)
	trapezi.trapeziTheatisDelete(data.pektis);

	trapezi = this.skinikoTrapeziGet(data.trapezi);
	if (!trapezi)
	return this;

	kafenio = this.skinikoKafenioGet(data.kafenio);
	if (!kafenio)
	return this;

	for (thesi = Vida.thesiMax; thesi > 0; thesi--) {
		if (trapezi.trapeziPektisGet(thesi) === data.pektis)
		break;
	}

	if (thesi)
	simetoxi = 'ΠΑΙΚΤΗΣ';

	else {
		thesi = 1;
		simetoxi = 'ΘΕΑΤΗΣ';
		trapezi.trapeziTheatisSet(data.pektis);
	}

	sinedria.
	sinedriaKafenioSet(data.kafenio).
	sinedriaTrapeziSet(data.trapezi).
	sinedriaThesiSet(thesi).
	sinedriaSimetoxiSet(simetoxi);

	return this;
};

// NT -- Νέο τραπέζι
//
// Με την κίνηση νέου τραπεζιού κάνουμε γνωστό στο σκηνικό ότι δημιουργήθηκε νέο
// τραπέζι.
//
// Δεδομένα
//
//	trapezi		Ο κωδικός του τραπεζιού.
//	pektis		Το login name του δημιουργού.
//
// Optional
//
//	bourloto	1 αν πρόκειται για παρτίδα μπουρλότου.

Skiniko.prototype.processKinisiNT = function(data) {
	var trapezi;

	if (!data.hasOwnProperty('trapezi'))
	return this;

	trapezi = new Trapezi({
		kodikos: data.trapezi,
		kafenio: data.kafenio,
	}).
	trapeziPektisSet(1, data.pektis);

	if (data.bourloto)
	trapezi.trapeziBelotSet();

	this.skinikoTrapeziSet(trapezi);
	return this;
};

// SZ -- Ένταξη σχολίου σε συζήτηση
//
// Δεδομένα
//
//	pektis		Το login name του συντάξαντα παίκτη.
//	kafenio		Αν υπάρχει είναι ο κωδικός καφενείου.
//	trapezi		Αν υπάρχει είναι ο κωδικός τραπεζιού.
//	sxolio		Το κείμενο του σχολίου.
//	pote		Η χρονική στιγμή

Skiniko.prototype.processKinisiSZ = function(data) {
	var sizitisi, traka;

	sizitisi = new Sizitisi(data);
	if (data.hasOwnProperty('kafenio')) {
		delete sizitisi.trapezi;
		traka = this.skinikoKafenioGet(data.kafenio);
		if (traka)
		traka.kafenioSizitisiSet(sizitisi);

		return this;
	}

	if (data.hasOwnProperty('trapezi')) {
		delete sizitisi.kafenio;
		traka = this.skinikoTrapeziGet(data.trapezi);
		if (traka)
		traka.trapeziSizitisiSet(sizitisi);

		return this;
	}

	this.skinikoSizitisiSet(sizitisi);
	return this;
};

// XK -- Έξοδος από καφενείο
//
// Με την κίνηση αποχώρησης από καφενείο κάνουμε γνωστό στο σκηνικό ότι κάποιος
// παίκτης αποχωρεί από το καφενείο στο οποίο βρίσκεται.
//
// Δεδομένα
//
//	pektis		Το login name του παίκτη που κάνει την επιλογή.

Skiniko.prototype.processKinisiXK = function(data) {
	var sinedria;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria)
	return this;

	sinedria.sinedriaKafenioSet();

	return this;
};

// EK -- Επιλογή καφενείου
//
// Με την κίνηση επιλογής καφενείου κάνουμε γνωστό στο σκηνικό ότι κάποιος
// παίκτης έχει επιλέξει κάποιο καφενείο.
//
// Δεδομένα
//
//	pektis		Το login name του παίκτη που κάνει την επιλογή.
//	kafenio		Ο κωδικός καφενείου που επιλέγει ο παίκτης.

Skiniko.prototype.processKinisiEK = function(data) {
	var sinedria, kafenio;

	sinedria = this.skinikoSinedriaGet(data.pektis);
	if (!sinedria)
	return this;

	kafenio = this.skinikoKafenioGet(data.kafenio);
	if (!kafenio)
	return this;

	sinedria.sinedriaKafenioSet(data.kafenio);

	return this;
};

// NK -- Νέο καφενείο
//
// Με την κίνηση νέου καφενείου κάνουμε γνωστό στο σκηνικό ότι δημιουργήθηκε νέο
// καφενείο.
//
// Δεδομένα
//
//	kafenio		Περιέχει τα στοιχεία του καφενείου.

Skiniko.prototype.processKinisiNK = function(data) {
	if (!data.hasOwnProperty('kafenio'))
	return this;

	this.skinikoKafenioSet(new Kafenio(data.kafenio));

	return this;
};

// PK -- Νέος παίκτης
//
// Δεδομένα
//
//	Τα στοιχεία τού παίκτη.

Skiniko.prototype.processKinisiPK = function(data) {
	this.skinikoPektisSet(new Pektis(data));
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SN -- Νέα συνεδρία
//
// Με την κίνηση νέας συνεδρία κάνουμε γνωστό στο σκηνικό ότι δημιουργήθηκε νέα
// συνεδρία, δηλαδή ότι κάποιος εισήλθε (ή επανεισήλθε) στο καφενείο.
//
// Δεδομένα
//
//	sinedria	Περιέχει τα στοιχεία της συνεδρίας.
//
// Προαιρετικά δεδομένα
//
//	pektis		Περιέχει τα στοιχεία του παίκτη της συνεδρίας και παρέχεται
//			συνήθως όταν ο παίκτης δεν υπάρχει στο σκηνικό.

Skiniko.prototype.processKinisiSN = function(data) {
	var sinedria, trapezi;

	if (data.hasOwnProperty('pektis'))
	this.skinikoPektisSet(new Pektis(data.pektis));

	sinedria = this.skinikoSinedriaGet(data.sinedria.pektis);
	if (!sinedria)
	this.skinikoSinedriaSet(sinedria = new Sinedria(data.sinedria));

	trapezi = this.skinikoTrapeziGet(sinedria.sinedriaTrapeziGet());
	if (!trapezi)
	return this;

	if (sinedria.sinedriaOxiTheatis())
	return this;

	trapezi.trapeziTheatisSet(data.sinedria.pektis);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// NS -- Διαγραφή συνεδρίας
//
// Με την κίνηση διαγραφής συνεδρία κάνουμε γνωστό στο σκηνικό ότι κάποια συνεδρία
// έχει λήξει, δηλαδή ότι κάποιος εξήλθε από το καφενείο, ή το πρόγραμμα τον απόδιωξε
// ως ανενεργό.
//
// Δεδομένα
//
//	login	Το login name του παίκτη της συνεδρίας.

Skiniko.prototype.processKinisiNS = function(data) {
	this.skinikoSinedriaDelete(data.login);
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SL -- Χαιρετισμός κατά την είσοδο/επανείσοδο συνεδρίας
//
// Αμέσως μετά την είσοδο του παίκτη, ή την επώνυμη επαναφόρτωση του καφενείου λαμβάνει
// χώρα χαιρετισμός.
//
// Δεδομένα
//
//	login	Το login name του παίκτη της συνεδρίας.

Skiniko.prototype.processKinisiSL = function(data) {
	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
