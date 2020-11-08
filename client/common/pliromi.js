// Η μέθοδος πληρωμή καλείται κατά το replay μετά την όγδοη μπάζα, με σκοπό
// την καταμέτρηση των πόντων και την ενημέρωση του σκόρ της διανομής.

Trapezi.prototype.partidaPliromi = function() {
	var trapezi = this, atou, bazes13, bazes24, data = {};

	// Εντοπίζουμε και κρατάμε την τελευταία διανομή της παρτίδας.

	data.dianomi = this.trapeziTelefteaDianomi();
	if (!data.dianomi)
	return this;

	// Το χρώμα των ατού είναι εκ των ων ουκ άνευ.

	atou = this.partidaAgoraXromaGet();
	if (!atou)
	return this;

	// Εντοπίζουμε και κρατάμε την ομάδα που αγόρασε στο property
	// "agorastis" ως "13" για τους παίκτες 1 και 3, ή "24" για
	// τους παίκτες 2 και 4.

	switch (this.partidaAgorastisGet()) {
	case 1:
	case 3:
		data.agorastis = '13';
		break;
	case 2:
	case 4:
		data.agorastis = '24';
		break;
	default:
		return this;
	}

	// Στις μεταβλητές "bazes13" και "bazes24" καταχωρούμε το πλήθος των
	// μπαζών γι τις δύο ομάδες.

	bazes13 = 0;
	bazes24 = 0;

	// Οι μεταβλητές "vales13" και "vales24" δείχνουν από ποιο ψηφίο και
	// πάνω γίνεται στρογγυλοποίηση στη μεγαλύτερη δεκάδα. By default η
	// στρογγυλοποίηση στη μεγαλύτερη δεκάδα γίνεται για τα ψηφία 7-9,
	// ενώ στρογγυλοποιούμε στη μικρότερη δεκάδα για τα ψηφία 1-5. Ειδικά
	// για το ψηφίο 6 γίνεται στρογγυλοποίηση προς τα πάνω για την ομάδα
	// που έχει τον βαλέ ατού. Ακριβώς αυτό το στοιχείο θα δείξουμε με
	// τις εν λόγω μεταβλητές, δηλαδή η τιμή θα γίνει 6 για την ομάδα που
	// έχει τον βαλέ ατού στις μπάζες της.

	data.vales13 = 7;
	data.vales24 = 7;

	// Στις μεταβλητές "skor13" και "skor24" θα κρατήσουμε τα σκορ των δύο
	// ομάδων για την τελευταία διανομή.

	data.skor13 = 0;
	data.skor24 = 0;

	// Στις μεταβλητές "aeras13" και "aeras24" θα κρατήσουμε τους αέρηδες των
	// δύο ομάδων για την τελευταία διανομή.

	data.aeras13 = 0;
	data.aeras24 = 0;

	// Διατρέχουμε όλες τις μπάζες με τη σειρά που παίχτηκαν προκειμένου να
	// υπολογίσουμε τους πόντους που πήρε η κάθε ομάδα (χωρίς τυχόν αέρα).

	Globals.awalk(this.bazes, function(i, baza) {
		var pontoi, vales;

		pontoi = 0;	// οι πόντοι της μπάζας
		vales = false;	// δείχνει αν στην μπάζα περιέχεται ο βαλές ατού

		baza.cardWalk(function() {
			var xroma, axia;

			xroma = this.suitGet();
			axia = this.rankGet();

			if (xroma !== atou) {
				pontoi += Vida.axiaPontoi[axia];
				return;
			}

			pontoi += Vida.axiaPontoiAtou[axia];

			if (axia !== 'J')
			return;

			vales = true;
		});

		// Δίνουμε 10 πόντους μπόνους στην ομάδα που πήρε την τελευταία μπάζα.

		if (i === 7)
		pontoi += 10;

		switch (trapezi.bazaPios[i]) {
		case 1:
		case 3:
			bazes13++;
			data.skor13 += pontoi;
			if (vales) data.vales13 = 6;
			break;
		default:
			bazes24++;
			data.skor24 += pontoi;
			if (vales) data.vales24 = 6;
			break;
		}
	});

	// Αν κάποια ομάδα πήρε ΟΛΕΣ τις μπάζες της διανομής, πριμοδοτείται με
	// επιπλέον 90 πόντους (καπό).

	if (bazes13 === 0)
	data.skor24 += 90;

	else if (bazes24 === 0)
	data.skor13 += 90;

	// Ακολουθεί η καταμέτρηση του αέρα. Πρώτα ελέγχουμε μήπως η ομάδα που
	// απέκλεισε τον τελευταίο αέρα έχει ξεχάσει να δείξει τον δικό της
	// αέρα. Σ' αυτήν την περίπτωση θα μετρηθούν τυχόν αέρηδες της ομάδας
	// που κρατάει το μεγαλύτερο αέρα.

	this.partidaSareaForgot();

	// Ξεκινάμε την καταμέτρηση με τυχόν μπουρλότο.

	switch (this.bourloto) {
	case 1:
	case 3:
		data.aeras13 += 20;
		break;
	case 2:
	case 4:
		data.aeras24 += 20;
		break;
	}

	// Συνεχίζουμε με τρίτες, τετάρτες, πέμπτες και καρέ.

	Globals.awalk(this.aeras, function(i, aeras) {
		switch (aeras.aerasPektisGet()) {
		case 1:
		case 3:
			data.aeras13 += aeras.aerasPontoiGet();
			break;
		default:
			data.aeras24 += aeras.aerasPontoiGet();
			break;
		}
	});

	if (this.trapeziIsBelot())
	this.partidaPliromiBelot(data);

	else
	this.partidaPliromiVida(data);

	this.
	partidaSkorAdd('13', data.dianomi.dianomiSkorGet('13')).
	partidaSkorAdd('24', data.dianomi.dianomiSkorGet('24'));

	return this;
};

Trapezi.prototype.partidaPliromiBelot = function(data) {
	var kremamena;

	data.skor13 += data.aeras13;
	data.skor24 += data.aeras24;

	this.roks13 = data.skor13;
	this.roks24 = data.skor24;

	kremamena = 0;

	if (data.agorastis === '13') {
		if (data.skor13 < data.skor24) {
			data.skor24 += data.skor13;
			data.skor13 = 0;
		}

		else if (data.skor13 === data.skor24) {
			kremamena = data.skor13;
			data.skor13 = 0;
		}
	}

	else {
		if (data.skor24 < data.skor13) {
			data.skor13 += data.skor24;
			data.skor24 = 0;
		}

		else if (data.skor24 === data.skor13) {
			kremamena = data.skor24;
			data.skor24 = 0;
		}
	}

	data.dianomi.dianomiSkorSet('13', data.skor13);
	data.dianomi.dianomiSkorSet('24', data.skor24);
	data.dianomi.dianomiKremamenaSet(kremamena);

	return this;
};

Trapezi.prototype.partidaPliromiVida = function(data) {
	var agora, vida, mesa, ipolipo, sinolo13, sinolo24, agora13, agora24;

	// Κρατάμε τους πόντους που δηλώθηκαν στην αγορά στο property "agora".

	agora = this.partidaAgoraPontoiGet();

	// Υπολογίζουμε συντελεστή βίδας ανάλογα με τις βίδες που κατετέθησαν
	// από τις δύο ομάδες.

	switch (this.partidaVidaCountGet()) {
	case 1:
		vida = 2;
		break;
	case 2:
		vida = 4;
		break;
	case 3:
		vida = (this.vidaOkto() ? 6 : 8);
		break;
	case 4:
		vida = (this.vidaOkto() ? 8 : 16);
		break;
	default:
		vida = 1;
		break;
	}

	sinolo13 = data.skor13 + data.aeras13;
	sinolo24 = data.skor24 + data.aeras24;

	this.roks13 = sinolo13;
	this.roks24 = sinolo24;

console.log('ΑΓΟΡΑΣΤΕΣ:', data.agorastis, 'δήλωση', agora);
console.log('ΠΡΩΤΗ ΦΑΣΗ, ομάδα 13: πόντοι', data.skor13, 'αέρας', data.aeras13);
console.log('ΠΡΩΤΗ ΦΑΣΗ, ομάδα 24: πόντοι', data.skor24, 'αέρας', data.aeras24);

	// Θα χρησιμοποιήσουμε το flag "mesa" το οποίο θα θέσουμε true αμέσως
	// μόλις διαπιστώσουμε ότι η αγορά είναι μέσα.

	mesa = false;

	// Αν οι αγοραστές έπιασαν λιγότερους πόντους από τους αμυνόμενους, ή δεν
	// συμπλήρωσαν τους δηλωμένους πόντους της αγοράς, τότε η αγορά είναι μέσα.

	if (data.agorastis === '13') {
		if ((sinolo13 < sinolo24) || (sinolo13 < agora))
		mesa = true;
	}

	else {
		if ((sinolo24 < sinolo13) || (sinolo24 < agora))
		mesa = true;
	}

	// XXX
	// Η περίπτωση ισοπαλίας είναι προς συζήτησιν.
	// Προς το παρόν θεωρούμε ότι οι αγοραστές πρέπει να πιάσουν περισσότερους
	// πόντους από τους αμυνόμενους.

	if (sinolo13 === sinolo24)
	mesa = true;

console.log('ΠΡΩΤΗ ΦΑΣΗ, mesa:', mesa);

	// Κάνουμε στρογγυλοποίηση των πόντων στην προσήκουσα δεκάδα. Η στογγυλοποίηση
	// γίνεται ως εξής: Αν το τελευταίο ψηφίο είναι 1-5 στρογγυλοποιούμε προς τα
	// κάτω. Αν το τελευταίο ψηφίο είναι 7-9 στρογγυλοποιούμε προς τα πάνω. Αν το
	// τελευταίο ψηφίο είναι 6, τότε οι πόντοι της ομάδας που έχει τον βαλέ ατού
	// στρογγυλοποιούνται προς τα πάνω, ενώ της άλλης ομάδας προς τα κάτω. Αυτό
	// το έχουμε ήδη κανονίσει καταχωρώντας το σωστό ψηφίο στις σχετικές μεταβλητές
	// "vales13" και "vales24".

	// Ξεκινάμε με στρογγυλοποίηση των πόντων της ομάδας "13".

	ipolipo = data.skor13 % 10;

	if ((ipolipo >= data.vales13) && (ipolipo <= 9))
	data.skor13 += (10 - ipolipo);

	else
	data.skor13 -= ipolipo;

	// Συνεχίζουμε με στρογγυλοποίηση των πόντων της ομάδας "24".

	ipolipo = data.skor24 % 10;

	if ((ipolipo >= data.vales24) && (ipolipo <= 9))
	data.skor24 += (10 - ipolipo);

	else 
	data.skor24 -= ipolipo;

console.log('ΔΕΥΤΕΡΗ ΦΑΣΗ, ομάδα 13: πόντοι', data.skor13, 'αέρας', data.aeras13);
console.log('ΔΕΥΤΕΡΗ ΦΑΣΗ, ομάδα 24: πόντοι', data.skor24, 'αέρας', data.aeras24);

	sinolo13 = data.skor13 + data.aeras13;
	sinolo24 = data.skor24 + data.aeras24;

	// Προβαίνουμε σε επανέλεγχο του σκορ μετά τη στρογγυλοποίηση, σε σχέση με
	// τους δηλωμένους πόντους της αγοράς.

	if (data.agorastis === '13') {
		if (sinolo13 < agora)
		mesa = true;
	}

	else {
		if (sinolo24 < agora)
		mesa = true;
	}

console.log('ΔΕΥΤΕΡΗ ΦΑΣΗ, mesa:', mesa);

	// Ακολουθεί τελική διαδικασία ελέγχου και ανακατανομής των πόντων της
	// διανομής. Οι μεταβλητές "agora13" και "agora24" θα περιέχουν τους
	// δηλωμένους πόντους της αγοράς για κάθε ομάδα.

	agora13 = 0;
	agora24 = 0;

	// Εάν, τελικώς, η αγορά έχει μπει μέσα προχωρούμε σε μηδενισμό της ομάδας
	// των αγοραστών, ενώ οι αντίπαλοι παίρνουν τα πάντα. Οι δηλωμένοι πόντοι
	// της αγοράς περνάνε στους αντιπάλους ανάλογα με τις βίδες.

	if (mesa) {
console.log('MESA', mesa);
		if (data.agorastis === '13') {
			sinolo24 += sinolo13;
			sinolo13 = 0;

			agora24 = agora * vida;
		}

		else {
			sinolo13 += sinolo24;
			sinolo24 = 0;

			agora13 = agora * vida;
		}
	}

	// Αν αγορά δεν έχει μπει μέσα αλλά έχουν δηλωθεί βίδες, οι αμυνόμενοι δεν
	// παίρνουν απολύτως τίποτα, ενώ οι δηλωμένοι πόντοι της αγοράς πολλαπλασιάζονται
	// ανάλογα με τις βίδες.

	else if (vida > 1) {
console.log('VIDA', vida);
		if (data.agorastis === '13') {
			sinolo13 += sinolo24;
			sinolo24 = 0;

			agora13 = agora * vida;
		}

		else {
			sinolo24 += sinolo13;
			sinolo13 = 0;

			agora24 = agora * vida;
		}
	}

	// Έμεινε η «φυσιολογική» περίπτωση κατά την οποία η αγορά έχει βγεί κατά τα
	// ειωθότα των αγοραστών και δεν υπάρχουν βίδες.

	else {
		if (data.agorastis === '13')
		agora13 = agora;

		else
		agora24 = agora;
	}

	sinolo13 += agora13;
	sinolo24 += agora24;

console.log('ΤΡΙΤΗ ΦΑΣΗ, ομάδα 13: πόντοι', data.skor13, 'αέρας', data.aeras13, 'δήλωση', agora13, 'σύνολο', sinolo13);
console.log('ΤΡΙΤΗ ΦΑΣΗ, ομάδα 24: πόντοι', data.skor24, 'αέρας', data.aeras24, 'δήλωση', agora24, 'σύνολο', sinolo24);

	// Περνάμε τους πόντους που υπολογίστηκαν στους πόντους της διανομής.

	data.dianomi.dianomiSkorSet('13', sinolo13);
	data.dianomi.dianomiSkorSet('24', sinolo24);

console.log('ΠΛΗΡΩΜΗ:', data.dianomi.skor13, data.dianomi.skor24);

	return this;
};
