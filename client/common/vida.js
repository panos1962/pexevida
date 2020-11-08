////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Το παρόν περιέχει γενικές δομές και μεθόδους που αφορούν τόσο στον server
// όσο και στους clients, αλλά είναι εξειδικευμένες στη «Βίδα». Όλα τα
// σχετικά εντάσσονται στο singleton "Vida".

Vida = {
	// Η property "thesiMax" δείχνει τον μέγιστο αριθμό θέσης στο τραπέζι.
	// Μπορεί να φαίνεται υπερβολικό, αλλά αποδεικνύεται χρήσιμο και πολύ
	// βολικό.

	thesiMax: 4,

	// Χρησιμοποιούμε η λίστα "thesiValid" για να διατρέχουμε τις θέσεις
	// του τραπεζιού (η σειρά δεν είναι εγγυημένη από τη γλώσσα). Η λίστα
	// θα συμπληρωθεί αυτόματα κατά το startup.

	thesiValid: {},

	// Η μέθοδος "isThesi" δέχεται ένα όρισμα και ελέγχει αν το όρισμα αυτό
	// είναι δεκτό ως θέση τραπεζιού.

	isThesi: function(thesi) {
		return Vida.thesiValid[thesi];
	},

	// Η μέθοδος "oxiThesi" δέχεται ένα όρισμα και ελέγχει αν το όρισμα αυτό
	// είναι απαράδεκτο ως θέση τραπεζιού.

	oxiThesi: function(thesi) {
		return !Vida.isThesi(thesi);
	},

	// Οι παράμετροι στη λίστα "peparamProsopiki" αφορούν μόνο τον παίκτη τής
	// παραμέτρου και ως εκ τούτου κοινοποιούνται ΜΟΝΟ στον συγκεκριμένο παίκτη.

	peparamProsopiki: {
		'ΠΑΡΑΣΚΗΝΙΟ': true,
		'ΠΛΑΤΗ': true,
		'ΤΡΑΠΟΥΛΑ': true,
	},

	peparamIsProsopiki: function(param) {
		return Vida.peparamProsopiki[param];
	},

	// Οι παράμετροι στη λίστα "peparamKrifi" αφορούν τον παίκτη τής παραμέτρου
	// και κοινοποιούνται ΜΟΝΟ στον συγκεκριμένο παίκτη ΚΑΙ σε βαθμοφόρους από
	// διαχειριστές και άνω.

	peparamKrifi: {
		'ΑΞΙΩΜΑ': true,
		'DEVELOPER': true,
	},

	peparamIsKrifi: function(param) {
		return Vida.peparamKrifi[param];
	},

	peparamOxiKrifi: function(param) {
		return !Vida.peparamIsKrifi(param);
	},

	// Ακολουθεί λίστα με τις default τιμές των παραμέτρων παίκτη.

	peparamDefault: {
		'ΑΞΙΩΜΑ': 'ΘΑΜΩΝΑΣ',
		'ΚΑΤΑΣΤΑΣΗ': 'ΔΙΑΘΕΣΙΜΟΣ',
		'ΑΓΑΠΗΜΕΝΟ': 'ΒΙΔΑ',
		'ΠΛΑΤΗ': 'ΜΠΛΕ',
		'ΠΑΡΑΣΚΗΝΙΟ': 'standard.png',
		'DEVELOPER': 'ΟΧΙ',
		'ΤΡΑΠΟΥΛΑ': 'classic',
	},

	// Ακολουθεί λίστα με τις default τιμές των παραμέτρων τραπεζιού.

	trparamDefault: {
		'ΒΙΔΑ': 'ΝΑΙ',
		'ΠΡΙΒΕ': 'ΟΧΙ',
		'ΙΔΙΟΚΤΗΤΟ': 'ΟΧΙ',
		'ΔΗΛΩΣΗ': 'ΝΑΙ',
		'ΚΟΜΜΕΝΗ': 'ΝΑΙ',
		'ΟΚΤΩ': 'ΟΧΙ',
		'ΑΠΟΝΤΑ': 'ΝΑΙ',
	},

	lixi: {
		vida: [ 3551, 5551 ],
		belot: [ 1551, 751 ],
	},
};

// Η function "thesiWalk" διατρέχει με τη σειρά όλες τις θέσεις ενός τραπεζιού
// και για κάθε θέση καλεί την callback function που περνάμε ως παράμετρο.

Vida.thesiWalk = function(callback) {
	var thesi;

	for (thesi = 1; thesi <= Vida.thesiMax; thesi++)
	callback(thesi);

	return Vida;
}

// Συμπληρώνουμε τώρα το array "thesiValid" με τις δυνατές θέσεις παίκτη.

Vida.thesiWalk(function(thesi) {
	Vida.thesiValid[thesi] = thesi;
});

// Η function "peparamIsTrivial" δέχεται το είδος και την τιμή παραμέτρου
// παίκτη, και επιστρέφει true εφόσον ο συνδυασμός είναι default.

Vida.peparamIsTrivial = function(param, timi) {
	return(timi === Vida.peparamDefault[param]);
};

// Η function "trparamIsTrivial" δέχεται το είδος και την τιμή παραμέτρου
// τραπεζιού, και επιστρέφει true εφόσον ο συνδυασμός είναι default.

Vida.trparamIsTrivial = function(param, timi) {
	return(timi === Vida.trparamDefault[param]);
};

// Η μέθοδος "pektisLoginGet" δέχεται έναν παίκτη, είτε ως login name, είτε
// ως παίκτη, είτε ως συνεδρία, και επιστρέφει το login name του παίκτη.

Vida.pektisLoginGet = function(pektis) {
	if (typeof pektis === 'string')
	return pektis;

	if (pektis instanceof Pektis)
	return pektis.pektisLoginGet();

	if (pektis instanceof Sinedria)
	return pektis.sinedriaPektisGet();

	return null;
};

// Η μέθοδος "thesiEpomeni" εφαρμόζεται πάνω στη θέση κάποιου παίκτη και
// επιστρέφει την επόμενη θέση.

Number.prototype.thesiEpomeni = function(n) {
	var thesi;

	if (n === undefined)
	n = 1;

	thesi = this.valueOf() + n;

	if (thesi > Vida.thesiMax)
	return(thesi % Vida.thesiMax);

	return thesi;
};

// Η μέθοδος "thesiDexia" εφαρμόζεται πάνω στη θέση κάποιου παίκτη και
// επιστρέφει την επόμενη θέση.

Number.prototype.thesiDexia = function() {
	return this.thesiEpomeni(1);
};

// Η μέθοδος "thesiApenanti" εφαρμόζεται πάνω στη θέση κάποιου παίκτη και
// επιστρέφει την απέναντι θέση.

Number.prototype.thesiApenanti = function() {
	return this.thesiEpomeni(2);
};

// Η μέθοδος "thesiAristera" εφαρμόζεται πάνω στη θέση κάποιου παίκτη και
// επιστρέφει την προηγούμενη θέση.

Number.prototype.thesiAristera = function() {
	return this.thesiEpomeni(3);
};

// Η μέθοδος "thesiIsDexia" εφαρμόζεται πάνω στη θέση κάποιου παίκτη και επιστρέφει
// true αν η θέση αυτή βρίσκεται δεξιά από τη θέση που περνάμε ως παράμετρο.

Number.prototype.thesiIsDexia = function(thesi) {
	return(this.valueOf() === thesi.thesiEpomeni());
};

// Η μέθοδος "thesiIsApenanti" εφαρμόζεται πάνω στη θέση κάποιου παίκτη και επιστρέφει
// true αν η θέση αυτή βρίσκεται απέναντι από τη θέση που περνάμε ως παράμετρο.

Number.prototype.thesiIsApenanti = function(thesi) {
	return(this.valueOf() === thesi.thesiEpomeni(2));
};

Number.prototype.thesiOxiApenanti = function(thesi) {
	return !this.thesiIsApenanti(thesi);
};

// Η μέθοδος "thesiIsAristera" εφαρμόζεται πάνω στη θέση κάποιου παίκτη και επιστρέφει
// true αν η θέση αυτή βρίσκεται αριστερά από τη θέση που περνάμε ως παράμετρο.

Number.prototype.thesiIsAristera = function(thesi) {
	return(this.valueOf() === thesi.thesiEpomeni(3));
};

// Η μέθοδος "thesiIsOmada" εφαρμόζεται στη θέση κάποιου παίκτη και επιστρέφει
// true εφόσον πρόκειται για παίκτη της ιδίας ομάδας με τον παίκτη που περνάμε
// ως παράμετρο.

Number.prototype.thesiIsOmada = function(thesi) {
	return((this.valueOf() % 2) === (thesi % 2));
};

// Η μέθοδος "thesiIsOmada" εφαρμόζεται στη θέση κάποιου παίκτη και επιστρέφει
// true εφόσον πρόκειται για παίκτη της αντίπαλης ομάδας με τον παίκτη που
// περνάμε ως παράμετρο.

Number.prototype.thesiIsAntipalos = function(thesi) {
	return !this.thesiIsOmada(thesi)
};

Number.prototype.thesiSxetikiPerigrafi = function(thesi) {
	if (this.thesiIsDexia(thesi))
	return 'βρίσκεται δεξιά σας';

	if (this.thesiIsAristera(thesi))
	return 'βρίσκεται αριστερά σας';

	if (this.thesiIsApenanti(thesi))
	return 'βρίσκεται απέναντί σας';

	return 'παρακολουθείτε';
};

String.prototype.isPektis = function() {
	return(this.valueOf() === 'ΠΑΙΚΤΗΣ');
}

String.prototype.oxiPektis = function() {
	return !this.isPektis();
}

String.prototype.isTheatis = function() {
	return(this.valueOf() === 'ΘΕΑΤΗΣ');
}

String.prototype.oxiTheatis = function() {
	return !this.isTheatis();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Παραλλάσσουμε τη λίστα περιγραφικών ονομάτων των φυλών παιγνιοχάρτων,
// προκειμένου αυτές να εμφανίζονται στα ελληνικά.

filajs.suitDesc = {
	S:	'ΜΠΑΣΤΟΥΝΙΑ',
	C:	'ΣΠΑΘΙΑ',
	D:	'ΚΑΡΑ',
	H:	'ΚΟΥΠΕΣ',
};

// Ακολουθεί λίστα δεικτοδοτημένη με την αξία φύλλου όπου κάθε αξία
// αντιστοιχίζεται με τους πόντους που μετράει το αντίστοιχο φύλλο.

Vida.axiaPontoi = {
	7:	0,
	8:	0,
	9:	0,
	T:	10,
	J:	2,
	Q:	3,
	K:	4,
	A:	11,
};

// Στα ατού ο βαλές και το εννιάρι μετράνε διαφορετικούς πόντους,
// επομένως δημιουργούμε άλλη λίστα πόντων για τα ατού.

Vida.axiaPontoiAtou = {
	7:	0,
	8:	0,
	9:	14,
	T:	10,
	J:	20,
	Q:	3,
	K:	4,
	A:	11,
};

// Ακολουθεί λίστα δεικτοδοτημένη με την αξία των φύλλων, όπου κάθε
// αξία αντιστοιχίζεται με τη δύναμη του αντίστοιχου φύλλου.

Vida.axiaDinami = {
	7:	1,
	8:	2,
	9:	3,
	J:	4,
	Q:	5,
	K:	6,
	T:	7,
	A:	8,
};

// Στα ατού ο βαλές και το εννιάρι είναι τα ισχυρότερα φύλλα, επομένως
// δημιουργούμε ξεχωριστή λίστα δύναμης κατά αξία για τα ατού.

Vida.axiaDinamiAtou = {
	7:	1,
	8:	2,
	Q:	3,
	K:	4,
	T:	5,
	A:	6,
	9:	7,
	J:	8,
};

// Το array "aerasAxia" βάζει σε σειρά τα φύλλα ανάλογα με την αξία τους,
// όπως αυτά ταξινομούνται στις τρίτες, τετάρτες και πέμπτες. Ουσιαστικά
// πρόκειται για τη φυσική σειρά των φύλλων όσον αφορά στην αξία τους.

Vida.aerasAxia = [
	'7',
	'8',
	'9',
	'T',
	'J',
	'Q',
	'K',
	'A',
];

// Με βάση το array "aerasAxia" δημιουργούμε την αντίστροφη λίστα,
// δεικτοδοτημένη με την αξία των φύλλων.

Vida.axiaAeras = {};
Globals.awalk(Vida.aerasAxia, function(i, axia) {
	Vida.axiaAeras[axia] = i;
});

// Η function "isAponta" ελέγχει μια χαρτωσιά και επιστρέφει true εφόσον
// η χαρτωσιά περιέχει μόνον άποντα φύλλα. Ως δεύτερη παράμετρο περνάμε
// το χρώμα των ατού. Η function δέχεται και μεμονωμένα φύλλα στη θέση
// της χαρτωσιάς.

Vida.isAponta = function(x, atou) {
	var i, xroma, axia;

	// Αν πρόκειται περί χαρτωσιάς, ελέγχουμε ένα προς ένα τα
	// φύλλα της χαρτωσιάς και με το πρώτο έμποντο επιστρέφουμε
	// false.

	if (x instanceof filajsHand) {
		for (i = x.cardsCount() - 1; i >= 0; i--) {
			if (Vida.oxiAponta(x.cardGet(i), atou))
			return false;
		}

		return true;
	}

	if (!(x instanceof filajsCard))
	return false;

	xroma = x.suitGet();
	axia = x.rankGet();

	return !(xroma === atou ? Vida.axiaPontoiAtou[axia] : Vida.axiaPontoi[axia]);
};

Vida.oxiAponta = function(x, atou) {
	return !Vida.isAponta(x, atou);
};

// Η function "isEptari" δέχεται μια χαρτωσιά και ένα χρώμα, και επιστρέφει
// true εφόσον στη χαρτωσιά περιέχεται το επτάρι στο συγκεκριμένο χρώμα.
// Στη θέση της χαρτωσιάς μπορούμε να δώσουμε και μεμονωμένα φύλλα.

Vida.isEptari = function(x, xroma) {
	var i;

	// Αν πρόκειται περί χαρτωσιάς ελέγχουμε ένα προς ένα τα
	// φύλλα της χαρτωσιάς και αν εντοπιστεί το αναζητούμενο
	// επτάρι επιστρέφουμε true.

	if (x instanceof filajsHand) {
		for (i = x.cardsCount() - 1; i >= 0; i--) {
			if (Vida.isEptari(x.cardGet(i), xroma))
			return true;
		}

		return false;
	}

	if (!(x instanceof filajsCard))
	return false;

	return(x.suitLike(xroma) && x.rankLike('7'));
};

Vida.oxiEptari = function(x, xroma) {
	return !Vida.isEptari(x, xroma);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η κλάση "Dilosi" αφορά στις δηλώσεις αγοράς. Οι δηλώσεις μπορούν να είναι
// διαφόρων ειδών:
//
//	ΠΑΣΟ
//
//	ΒΙΔΑ
//
//	ΑΠΟΝΤΑ
//
//	ΧΡΩΜΑ (μπουρλότο)
//
//	ΧΡΩΜΑ & ΠΟΝΤΟΙ (βίδα)
//
// Ως strings παριστάνονται ως εξής:
//
//	ΠΑΣΟ		P
//
//	ΒΙΔΑ		V
//
//	ΧΡΩΜΑ		S, C, D, H
//
//	ΧΡΩΜΑ & ΠΟΝΤΟΙ	[SCDH]NNNN, π.χ. "S120" σημαίνει 120 μπαστούνια

Dilosi = function(props) {
	var xroma, pontoi;

	if (typeof props !== 'string') {
		Globals.initObject(this, props);
		return this;
	}

	switch (props.valueOf()) {
	case 'P':
		return this.dilosiPasoSet();
	case 'V':
		return this.dilosiVidaSet();
	case '0':
		return this.dilosiApontaSet();
	}

	xroma = props.substr(0, 1);
	if (filajs.notSuit(xroma))
	return this;

	this.dilosiXromaSet(xroma);

	pontoi = props.substr(1);
	if (!pontoi)
	return this;

	pontoi = parseInt(pontoi)
	if (isNaN(pontoi))
	return this;

	if ((pontoi < 80) || (pontoi % 10))
	return this;

	this.dilosiPontoiSet(pontoi);
};

Dilosi.prototype.dilosiPasoSet = function() {
	this.paso = true;
	return this;
};

Dilosi.prototype.dilosiIsPaso = function() {
	return this.paso;
};

Dilosi.prototype.dilosiOxiPaso = function() {
	return !this.dilosiIsPaso();
};

Dilosi.prototype.dilosiVidaSet = function() {
	this.vida = true;
	return this;
};

Dilosi.prototype.dilosiIsVida = function() {
	return this.vida;
};

Dilosi.prototype.dilosiOxiVida = function() {
	return !this.dilosiIsVida();
};

Dilosi.prototype.dilosiApontaSet = function() {
	this.aponta = true;
	return this;
};

Dilosi.prototype.dilosiIsAponta = function() {
	return this.aponta;
};

Dilosi.prototype.dilosiOxiAponta = function() {
	return !this.dilosiIsAponta();
};

Dilosi.prototype.dilosiXromaSet = function(xroma) {
	this.xroma = xroma;
	return this;
};

Dilosi.prototype.dilosiXromaGet = function() {
	return this.xroma;
};

Dilosi.prototype.dilosiIsXroma = function() {
	return this.dilosiXromaGet();
};

Dilosi.prototype.dilosiOxiXroma = function() {
	return !this.dilosiIsXroma();
};

Dilosi.prototype.dilosiPontoiSet = function(pontoi) {
	this.pontoi = pontoi;
	return this;
};

Dilosi.prototype.dilosiPontoiGet = function() {
	return this.pontoi;
};

Dilosi.prototype.dilosiIsAgora = function() {
	if (this.dilosiIsPaso())
	return false;

	if (this.dilosiIsVida())
	return false;

	if (this.dilosiIsAponta())
	return false;

	return true;
};

String.prototype.string2dilosi = function() {
	return new Dilosi(this.valueOf());
};

Dilosi.prototype.dilosi2string = function() {
	var s, pontoi;

	if (this.dilosiIsPaso())
	return 'P';

	if (this.dilosiIsVida())
	return 'V';

	if (this.dilosiIsAponta())
	return '0';

 	s = this.dilosiXromaGet();

 	pontoi = this.dilosiPontoiGet();
	if (pontoi)
	s += this.dilosiPontoiGet();

	return s;
};

Dilosi.prototype.dilosiLektiko = function() {
	var pontoi, s;

	if (this.dilosiIsPaso())
	return 'ΠΑΣΟ';

	if (this.dilosiIsVida())
	return 'ΒΙΔΑ';

	if (this.dilosiIsAponta())
	return 'ΑΠΟΝΤΑ';

	pontoi = this.dilosiPontoiGet();
	s = (pontoi ? pontoi + ' ' : '');

	return s + this.dilosiXromaGet().filajsSuitDesc();
};

// Η μέθοδος "dilosiIsDilosi" ελέγχει την ανά χείρας δήλωση να είναι ίδια με τη
// δήλωση που περνάμε ως παράμετρο.

Dilosi.prototype.dilosiIsDilosi = function(dilosi) {
	if (!dilosi)
	return false;

	if (this.dilosiIsPaso() && dilosi.dilosiIsPaso())
	return true;

	if (this.dilosiIsVida() && dilosi.dilosiIsVida())
	return true;

	if (this.dilosiIsAponta() && dilosi.dilosiIsAponta())
	return true;

	if (this.dilosiXromaGet() !== dilosi.dilosiXromaGet())
	return false;

	if (this.dilosiPontoiGet() !== dilosi.dilosiPontoiGet())
	return false;

	return true;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η κλάση "Aeras" απεικονίζει τους αέρηδες, δηλαδή τρίτες, τετάρτες, πέμπτες
// και καρέ (το μπουρλότο δεν λογίζεται ως «αέρας» με την έννοια ότ δεν περνά
// από τις κλασικές διαδικασίες έγκρισης κλπ). Στον constructor περνάμε τη θέση
// του παίκτη που επιδεικνύει τον αέρα, τη χαρτωσιά του αέρα ως string και το
// χρώμα των ατού.
//
// Η κλάση είναι υποκλάση της χαρτωσιάς ("filajsHand").

Aeras = function(pektis, xartosia, atou) {
	var i, count, filo, axia, xroma;

	// Κάνουμε reset τον αέρα ως χαρτωσιά.

	this.reset();

	// Το property "pektis" δείχνει τη θέση του παίκτη που καταθέτει
	// τον ανά χείρας αέρα.

	this.pektis = pektis;

	// Το property "taxi" περιέχει έναν αριθμό που δείχνει τη δυναμικότητα
	// του αέρα. Τα καρέ είναι υψηλότερης δυναμικότητας από τις σειρές.
	// Στα καρέ η δυναμικότητα καθορίζεται από το φύλλο του καρέ, ενώ στις
	// σειρές η δυναμικότητα καθορίζεται από το πλήθος των φύλλων, από το
	// μεγαλύτερο φύλλο και, τέλος, από το αν είναι στα ατού ή όχι.
	//
	// Η τάξη είναι ένας 4-ψήφιος αριθμός που για τις σειρές αποκωδικοποιείται
	// ως εξής:
	//
	//	1ΠΦΑ
	//	 |||
	//	 ||+---- 1 για τα ατού, αλλιώς 0
	//	 |+----- Η αξία του τελευταίου φύλλου της σειράς (από 2 έως 7)
	//	 +------ Το πλήθος των φύλλων της σειράς (3, 4, 5)
	//
	// Όσον αφορά στα καρέ:
	//
	//	2003	ντάμες
	//	2004	ρηγάδες
	//	2005	δεκάρια
	//	2006	άσοι
	//	2007	εννιάρια
	//	2008	βαλέδες

	this.taxi = 0;

	// Το property "pontoi" περιέχει την αξία του αέρα σε πόντους. Τα καρέ
	// πιάνουν 100 πόντους, με εξαίρεση τα εννιάρια που πιάνουν 150 και τους
	// βαλέδες που πιάνουν 200. Οι τρίτες πιάνουν 20, οι τετάρτες 50 και οι
	// πέμπτες 100.

	this.pontoi = 0;

	if (!xartosia)
	return this;

	for (i = 0; i < xartosia.length; i += 2) {
		filo = new filajsCard(xartosia.substr(i, 2));
		this.cardPush(filo);
	}

	count = this.cardsCount();
	if (count < 3)
	return this;

	// Η μεταβλητή "filo" κρατάει το τελευταίο φύλλο του αέρα. Σε τρίτες,
	// τετάρτες και πέμπτες πρόκειται για το μεγαλύτερο φύλλο του αέρα.

	axia = filo.rankGet();
	xroma = filo.suitGet();

	// Εάν το πρώτο φύλλο του αέρα είναι της ιδίας αξίας με το τελευταίο,
	// τότε πρόκειται για καρέ.

	if (this.cardGet(0).rankGet() === axia) {
		this.kare = true;
		this.taxi = 2000 + Vida.axiaDinamiAtou[axia];

		switch (filo.rankGet()) {
		case 'J':
			this.pontoi = 200;
			break;
		case '9':
			this.pontoi = 150;
			break;
		case 'A':
		case 'T':
		case 'K':
		case 'Q':
			this.pontoi = 100;
			break;
		default:
			delete this.kare;
			this.taxi = 0;
			break;
		}
	}

	// Αλλιώς πρόκειται για σειρά.

	else {
		this.sira = true;
		this.taxi = 1000;
		this.taxi += count * 100;
 		this.taxi += Vida.axiaAeras[axia] * 10;

		if (xroma === atou)
		this.taxi += 1;

		switch (count) {
		case 3:
			this.pontoi = 20;
			break;
		case 4:
			this.pontoi = 50;
			break;
		case 5:
			this.pontoi = 100;
			break;
		default:
			delete this.sira;
			this.taxi = 0;
		}
	}
};

// Πρόκειται για υποκλάση της χαρτωσιάς.

Aeras.prototype = new filajsHand();

Aeras.prototype.aerasPektisGet = function() {
	return this.pektis;
};

Aeras.prototype.aerasTaxiGet = function() {
	return this.taxi;
};

Aeras.prototype.aerasPontoiGet = function() {
	return this.pontoi;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Baza = function() {
	this.bazaReset();
};

Baza.prototype = new filajsHand();

Baza.prototype.bazaReset = function() {
	this.reset();
	this.pektis = [];
	return this;
};

Baza.prototype.bazaFiloPush = function(filo, pektis) {
	this.cardPush(filo);
	this.pektis.push(pektis);
	return this;
};

Baza.prototype.bazaFiloGet = function(n) {
	return this.cardGet(n);
};

Baza.prototype.bazaPektisGet = function(n) {
	return this.pektis[n];
};

Baza.prototype.bazaMikos = function() {
	return this.cardsCount();
};

Baza.prototype.bazaXromaGet = function() {
	var filo;

	filo = this.bazaFiloGet(0);
	if (!filo)
	return undefined;

	return filo.suitGet();
};

Baza.prototype.bazaCopy = function(baza) {
	var i, len;

	this.bazaReset();

	if (!baza)
	return this;

	len = baza.bazaMikos();

	for (i = 0; i < len; i++)
	this.bazaFiloPush(baza.bazaFiloGet(i), baza.bazaPektisGet(i));

	return this;
};

Baza.prototype.bazaFiloWalk = function(callback) {
	var i, pektis, filo;

	for (i = 0;; i++) {
		pektis = this.bazaPektisGet(i);
		if (!pektis) break;

		filo = this.cardGet(i);
		if (!filo) break;

		callback(this.bazaPektisGet(i), this.bazaFiloGet(i));
	}

	return this;
};

Baza.prototype.bazaPios = function(trapezi) {
	var xromaAtou, xromaBaza, atou, max, pios;

	xromaAtou = trapezi.partidaAgoraXromaGet();
	xromaBaza = this.bazaXromaGet();

	atou = false;
	max = 0;
	pios = undefined;

	this.bazaFiloWalk(function(pektis, filo) {
		var xroma, axia, dinami;

		xroma = filo.suitGet();
		if (xromaBaza === undefined)
		xromaBaza = xroma;

		axia = filo.rankGet();
		dinami = (xroma === xromaAtou ? Vida.axiaDinamiAtou[axia] : Vida.axiaDinami[axia]);

		if (xroma === xromaAtou) {
			if (!atou) {
				atou = true;
				max = dinami;
				pios = pektis;
				return;
			}

			if (dinami <= max)
			return;

			max = dinami;
			pios = pektis;
			return;
		}

		if (atou)
		return;

		if (xroma !== xromaBaza)
		return;

		if (dinami <= max)
		return;

		max = dinami;
		pios = pektis;
	});

	return pios;
};
