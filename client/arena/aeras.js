var ego;

// ΑΕΡΑΣ -- Client module
//
// Στο παρόν module ορίζονται δομές και διαδικασίες που αφορούν στον καθορισμό,
// στον έλεγχο και στην υποβολή του «αέρα». Ο αέρας καθορίζεται από το πρώτο και
// το τελευταίο φύλλο του συνδυασμού. Στην περίπτωση του καρέ αυτά τα φύλλα μπορούν
// να είναι οποιαδήποτε από τα τέσσερα (όμοια) φύλλα.
//
// Οτιδήποτε αφορά στον καθορισμό του αέρα του παίκτη κρατείται στο singleton
// "Tsoxa.aerasIpovoli" το οποίο δημιουργείται με το πάτημα του σχετικού πλήκτρου
// στο control panel. Όσο υπάρχει η λίστα "Tsoxa.aerasIpovoli" θεωρούμε ότι η
// διαδικασία καθορισμού του αέρα βρίσκεται σε εξέλιξη.
//
// Η λίστα περιλαμβάνει:
//
//	proto		Πρόκειται για το πρώτο φύλλο του συνδυασμού.
//
//	telefteo	Πρόκειται για το τελευταίο φύλλο του συνδυασμού. Σε περίπτωση
//			καρέ μπορεί να είναι οποιοδήποτε από τα υπόλοιπα (τρία) φύλλα
//			του συνδυασμού.

Tsoxa.aerasIpovoliClear = function() {
	delete Tsoxa.aerasIpovoli;
	return Tsoxa;
};

Tsoxa.aerasIpovoliReset = function() {
	Tsoxa.aerasIpovoli = {};
	return Tsoxa;
};

Tsoxa.isAerasIpovoli = function() {
	return Tsoxa.aerasIpovoli;
};

Tsoxa.aerasIpovoliProtoSet = function(filo) {
	Tsoxa.aerasIpovoli.proto = filo;
	return Tsoxa;
};

Tsoxa.aerasIpovoliProtoGet = function() {
	return Tsoxa.aerasIpovoli.proto;
};

Tsoxa.aerasIpovoliTelefteoSet = function(filo) {
	Tsoxa.aerasIpovoli.telefteo = filo;
	return Tsoxa;
};

Tsoxa.aerasIpovoliTelefteoGet = function() {
	return Tsoxa.aerasIpovoli.telefteo;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Tsoxa.aerasIpovoliLathos = function(data) {
	var xroma, axia1, axia2, t;

	data.trapezi = ego.trapeziGet();
	if (!data.trapezi)
	return true;

	data.thesi = data.trapezi.partidaEpomenosGet();
	if (!data.thesi)
	return true;

	data.aeras1 = Tsoxa.aerasIpovoliProtoGet();
	data.aeras2 = Tsoxa.aerasIpovoliTelefteoGet();

	xroma = data.aeras1.suitGet();

	// Αν το πρώτο και το τελευταίο φύλλο του αέρα είναι
	// ετερόχρωμα, τότε πρόκειται για καρέ και περνάμε
	// τον έλεγχο του αέρα στην αντίστοιχη function.

	if (data.aeras2.suitGet() !== xroma)
	return Tsoxa.aerasIpovoliLathosKare(data);

	// Πρόκειται για αέρα εκτός καρέ, ήτοι τρίτες, τετάρτες
	// και πέμπτες.

	// Ξεκινάμε βάζοντας στη σωστή σειρά τα δύο ακραία φύλλα
	// του συνδυασμού.

	axia1 = Vida.axiaAeras[data.aeras1.rankGet()];
	axia2 = Vida.axiaAeras[data.aeras2.rankGet()];

	if (axia1 > axia2) {
		t = data.aeras1;
		data.aeras1 = data.aeras2;
		data.aeras2 = t;

		t = axia1;
		axia1 = axia2;
		axia2 = t;
	}

	// Οι τρίτες έχουν διαφορά 2, ενώ οι πέμπτες έχουν διαφορά 4.
	// Τυχόν άλλες διαφορές σημαίνουν λανθασμένο αέρα.

	t = axia2 - axia1;
	if ((t < 2) || (t > 4))
	return true;

	data.aeras = new filajsHand();
	for (t = axia1; t <= axia2; t++)
	data.aeras.cardPush(new filajsCard({
		suit: xroma,
		rank: Vida.aerasAxia[t],
	}));

	return Tsoxa.aerasIpovoliFilaCheck(data);
};

Tsoxa.aerasIpovoliLathosKare = function(data) {
	var axia;

	axia = data.aeras1.rankGet();
	switch (axia) {
	case '7':
	case '8':
		return true;
	}

	// Αν τα δύο φύλλα δεν είναι της ιδίας αξίας, τότε
	// δεν πρόκειται για καρέ.

	if (data.aeras2.rankUnlike(axia))
	return true;

	data.aeras = new filajsHand();
	filajs.suitWalk(function(xroma) {
		data.aeras.cardPush(new filajsCard({
			suit: xroma,
			rank: axia,
		}));
	});

	return Tsoxa.aerasIpovoliFilaCheck(data);
};

// H function που ακολουθεί ελέγχει αν τα φύλλα του υποβαλλόμενου αέρα
// είναι φύλλα που όντως περιέχονται στα φύλλα του παίκτη και δεν έχουν
// ήδη επιδειχθεί σε προηγούμενη επίδειξη αέρος.

Tsoxa.aerasIpovoliFilaCheck = function(data) {
	var fila, filaLen, aerasLen, i, j, filo;

	fila = data.trapezi.partidaFilaGet(data.thesi);
	filaLen = fila.cardsCount();
	aerasLen = data.aeras.cardsCount();

	for (i = 0; i < aerasLen; i++) {
		for (j = 0; j < filaLen; j++) {
			filo = fila.cardGet(j);

			// Πρώτα ελέγχουμε αν το υπό έλεγχο φύλλο έχει
			// ήδη επιδειχθεί ως αέρας σε προηγούμενη φάση.

			if (filo.data('aeras'))
			continue;

			if (data.aeras.cardGet(i).like(filo))
			break;
		}

		if (j === filaLen)
		return true;
	}

	return false;
};
