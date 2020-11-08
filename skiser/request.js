///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η κλάση "NodeRequest" δέχεται ως παραμέτρους ένα αίτημα και το κανάλι απάντησης και
// δημιουργεί αντικείμενο που περιέχει πολλά βολικά properties και μεθόδους για τους
// μετέπειτα χειρισμούς τού συγκεκριμένου αιτήματος. Το αντικείμενο που δημιουργείται
// ονομάζεται «ενισχυμένο» αίτημα και, εκτός των άλλων, περιέχει το ίδιο το αίτημα
// και το κανάλι απάντησης.

NodeRequest = function(request, response) {
	var urlComponents;

	// Αρχικά εντάσσουμε στο ενισχυμένο αίτημα το ίδιο το αίτημα και το κανάλι
	// απάντησης.

	this.request = request;		// το αίτημα
	this.response = response;	// το κανάλι απάντησης

	// Εντάσσουμε επίσης το IP του αιτούντος client. Αν το αίτημα δρομολογήθηκε
	// μέσω proxy server ιχνηλατούμε το αρχικό IP.

	this.ip = request.headers['x-forwarded-for']; 
	this.ip = this.ip ? this.ip.split(',')[0] : request.connection.remoteAddress;
	this.ip = this.ip.validIp();

	// Κατόπιν εντάσσουμε δεδομένα που αφορούν στο url του αιτήματος από όπου
	// θα μπορέσουμε να αποσπάσουμε το είδος της ζητούμενης υπηρεσίας και τις
	// παραμέτρους του αιτήματος καθώς τα αιτήματα προς τον Node server γίνονται
	// με την μέθοδο GET και επομένως οι όποιες παράμετροι περνάνε ως παράμετροι
	// του url.

	urlComponents = URL.parse(request.url, true);
	this.serviceSet(urlComponents.pathname);
	this.url = urlComponents.query;

	// Οι μέθοδοι που ακολουθούν αφορούν στο header των δεδομένων επιστροφής.
	// Η property "content" περιέχει τον τύπο των δεδομένων και by default
	// τίθεται "text/plain". Επειδή όλα τα δεδομένα επιστροφής υποτίθενται
	// "text/*", χρησιμοποιούμε μόνο το δεύτερο συνθετικό.

	this.content = 'plain';

	this.data = {};
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η μέθοδος "header" χρησιμοποείται ως πρώτο βήμα στην απάντηση καθορίζοντας
// το είδος των δεδομένων. Η μέθοδος μπορεί να κληθεί κατ' επανάληψη καθώς
// η πραγματική αποστολή θα γίνει σε μεταγενέστερο χρόνο. Αυτό σημαίνει ότι
// μπορούμε να ξεκινήσουμε με έναν προβλεπόμενο τύπο επιστροφής και στην
// πορεία να αναθεωρήσουμε, μέχρι να αποσταλούν τα πρώτα δεδομένα προς
// το κανάλι απάντησης.

NodeRequest.prototype.header = function(tipos) {
	// Κατά την αποστολή των δεδομένων απάντησης θέτουμε null το property
	// "content", χρησιμοποιούμενο έτσι εμμέσως και ως flag αποστολής.

	if (this.content === null)
	Globals.fatal('header data already sent');

	this.content = tipos;
	return this;
};

// Η μέθοδος "headerCheck" καλείται πριν την επιστροφή οποιωνδήποτε δεδομένων
// και σκοπό έχει να στείλει τα header data εφόσον αυτά δεν έχουν ήδη αποσταλεί.
// Η μέθοδος καλείται με το πρώτο write στο κανάλι απάντησης.

NodeRequest.prototype.headerCheck = function() {
	if (this.content === null)
	return this;

	this.response.writeHead(200, {
		'Access-Control-Allow-Origin': '*',
		'Content-type': 'text/' + this.content + '; charset=utf-8',
	});
	this.content = null;
	return this;
};

NodeRequest.prototype.error = function(msg, code) {
	if (this.content === null)
	Globals.fatal('header data already sent');

	if (code === undefined)
	code = 500;

	this.response.writeHead(code, {
		'Access-Control-Allow-Origin': '*',
		'Content-type': 'text/plain; charset=utf-8',
	});
	this.content = null;
	if (msg === undefined)
	msg = 'skiser error';

	this.response.write(msg);
	this.end();
	return this;
};

// Η μέθοδος "write" αποστέλλει τμήμα της απάντησης στον αιτούντα client.
// Η μέθοδος μπορεί να κληθεί επαναληπτικά μέχρι να ολοκληρώσουμε την
// απάντηση. Χωρίς όρισμα (ή με κενό όρισμα), η μέθοδος μπορεί να
// χρησιμοποιηθεί ως flush των header data.

NodeRequest.prototype.write = function(s) {
	this.headerCheck();

	if (s === undefined)
	return this;

	if (s === null)
	return this;

	else if (typeof s === 'number')
	this.response.write(s.toString());

	else if (typeof s !== 'string')
	Globals.fatal('response.write: invalid data type');

	else if (s !== '')
	this.response.write(s);

	return this;
};

// Η μέθοδος "end" ολοκληρώνει την απάντηση προς τον αιτούντα client και
// προαιρετικά μπορεί να δεχθεί και δεδομένα τα οποία αποστέλλει ως coda
// στον client.

NodeRequest.prototype.end = function(s) {
	this.
	trapeziXeklidoma().
	headerCheck();

	if (s === undefined)
	this.response.end();

	else if (typeof s === 'number')
	this.response.end(s.toString());

	else if (typeof s !== 'string')
	Globals.fatal('response.end: invalid data type');

	else if (s !== '')
	this.response.end(s);

	else
	this.response.end();

	return this;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

NodeRequest.prototype.serviceSet = function(service) {
	this.service = service;
	return this;
};

NodeRequest.prototype.serviceGet = function() {
	return this.service;
};

NodeRequest.prototype.loginSet = function(login) {
	this.login = login;
	return this;
};

NodeRequest.prototype.loginGet = function() {
	return this.login;
};

NodeRequest.prototype.klidiSet = function(klidi) {
	this.klidi = klidi;
	return this;
};

NodeRequest.prototype.klidiGet = function() {
	return this.klidi;
};

NodeRequest.prototype.ipSet = function(ip) {
	this.ip = ip;
	return this;
};

NodeRequest.prototype.ipGet = function() {
	return this.ip;
};

NodeRequest.prototype.pektisSet = function(pektis) {
	this.pektis = pektis;
	return this;
};

NodeRequest.prototype.pektisGet = function() {
	return this.pektis;
};

NodeRequest.prototype.sinedriaSet = function(sinedria) {
	this.sinedria = sinedria;
	return this;
};

NodeRequest.prototype.sinedriaGet = function() {
	return this.sinedria;
};

NodeRequest.prototype.kafenioSet = function(kafenio) {
	this.kafenio = kafenio;
	return this;
};

NodeRequest.prototype.kafenioGet = function() {
	return this.kafenio;
};

NodeRequest.prototype.isKafenio = function() {
	return this.kafenioGet();
};

NodeRequest.prototype.oxiKafenio = function() {
	return !this.isKafenio();
};

NodeRequest.prototype.akathoristoKafenio = function() {
	if (this.isKafenio())
	return false;

	this.error('Ακαθόριστο καφενείο');
	return true;
};

NodeRequest.prototype.trapeziSet = function(trapezi) {
	var dianomi;

	delete this.dianomi;

	this.trapezi = trapezi;
	if (!trapezi)
	return this;

	this.dianomi = trapezi.trapeziTelefteaDianomi();

	return this;
};

NodeRequest.prototype.trapeziGet = function() {
	return this.trapezi;
};

NodeRequest.prototype.isTrapezi = function() {
	return this.trapeziGet();
};

NodeRequest.prototype.oxiTrapezi = function() {
	return !this.isTrapezi();
};

NodeRequest.prototype.akathoristoTrapezi = function() {
	if (this.isTrapezi())
	return false;

	this.error('Ακαθόριστο τραπέζι');
	return true;
};

NodeRequest.prototype.trapeziKlidoma = function(logos) {
	var trapezi;

	trapezi = this.trapeziGet();
	if (!trapezi) {
		this.error('Απροσδιόριστο τραπέζι για κλείδωμα');
		return false;
	}

	if (!trapezi.trapeziKlidoma(logos)) {
		this.error('Κλειδωμένο τραπέζι');
		return false;
	}

	this.trapeziKlidoma = true;
	return true;
};

NodeRequest.prototype.trapeziXeklidoma = function(logos) {
	var trapezi;

	if (!this.trapeziKlidoma)
	return this;

	trapezi = this.trapeziGet();
	if (!trapezi)
	return this;

	trapezi.trapeziXeklidoma();
	delete this.trapeziKlidoma;

	return this;
};

NodeRequest.prototype.dianomiGet = function() {
	return this.dianomi;
};

NodeRequest.prototype.isDianomi = function() {
	return this.dianomiGet();
};

NodeRequest.prototype.oxiDianomi = function() {
	return !this.isDianomi();
};

NodeRequest.prototype.akathoristiDianomi = function() {
	if (this.isDianomi())
	return false;

	this.error('Ακαθόριστη διανομή');
	return true;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η μέθοδος "anonimo" ελέχγει την ύπαρξη παραμέτρων "PK" και "KL"
// στο url. Αυτά τα στοιχεία αποτελούν τα διαπιστευτήρια του αιτούντος
// client και αν αυτά δεν υπάρχουν, τότε το αίτημα θεωρείται ανώνυμο.
// Η μέθοδος επιστρέφει true αν το αίτημα είναι ανώνυμο, αλλιώς επιστρέφει
// false και εμπλουτίζεται το ενισχυμένο αίτημα με τις δύο αυτές παραμέτρους.

NodeRequest.prototype.anonimo = function() {
	// XXX
	// Για λόγους που δεν γνωρίζω το url property, το οποίο είναι αντικείμενο,
	// παρουσιάζει έλλειψη της μεθόδου "hasOwnProperty". Γι' αυτό το λόγο
	// «δανείζομαι» τη συγκεκριμένη μέθοδο από το Object prototype, επομένως
	// o κώδικας είναι ολισθηρός σε αυτό το σημείο και σε άλλα παρόμοια.

	if (!Object.prototype.hasOwnProperty.call(this.url, 'PK')) {
	//XXX if (!this.url.hasOwnProperty('PK')) {
		this.error('ακαθόριστος αιτών παίκτης');
		return true;
	}

	if (!Object.prototype.hasOwnProperty.call(this.url, 'KL')) {
	//XXX if (!this.url.hasOwnProperty('KL')) {
		this.error('ακαθόριστο κλειδί αιτούντος');
		return true;
	}

	// Εφόσον όλα πήγαν καλά, προσθέτουμε στο ενισχυμένο αίτημα τα
	// properties "login" και "klidi".

	this.loginSet(this.url.PK);
	this.klidiSet(this.url.KL);

	return false;
};

// Η μέθοδος "nosinedria" εξετάζει αν το αίτημα είναι επώνυμο και μάλιστα αν
// υπάρχει συνεδρία στον server για τον εν λόγω παίκτη. Αν το αίτημα είναι
// ανώνυμο ή δεν υπάρχει σχετική συνεδρία επιστρέφει true, αλλιώς επιστρέφει
// false και εμπλουτίζεται το ενισχυμένο αίτημα με τη σχετική συνεδρία και
// με διάφορα άλλα πεδία (παίκτης, καφενείο, τραπέζι κλπ).

NodeRequest.prototype.nosinedria = function() {
	if (this.anonimo())
	return true;

	if (!this.pektisCheck())
	return true;

	if (!this.sinedriaCheck())
	return true;

	if (!this.ipCheck())
	return true;

	if (!this.kafenioCheck())
	return true;

	if (!this.trapeziCheck())
	return true;

	return false;
};

NodeRequest.prototype.pektisCheck = function() {
	var pektis;

	pektis = skiniko.skinikoPektisGet(this.loginGet());
	if (!pektis) {
		this.error('ανύπαρκτος αιτών παίκτης');
		return false;
	}

	this.pektisSet(pektis);
	return true;
};

NodeRequest.prototype.sinedriaCheck = function() {
	var sinedria;

	sinedria = skiniko.skinikoSinedriaGet(this.loginGet());
	if (!sinedria) {
		this.error('ανύπαρκτη συνεδρία αιτούντος');
		return false;
	}

	this.sinedriaSet(sinedria);
	return true;
};

NodeRequest.prototype.ipCheck = function() {
	var sinedria, ipRequest, ipSinedria;

	sinedria = this.sinedriaGet();
	ipSinedria = sinedria.sinedriaIpGet();

	ipRequest = this.ipGet();
	if (ipRequest === ipSinedria)
	return true;

	Globals.consoleError(this.loginGet() + ': new IP address (' + ipRequest + ' <> ' + ipSinedria + ')');
	sinedria.sinedriaIpSet(ipRequest);
	return true;
};

NodeRequest.prototype.kafenioCheck = function() {
	var sinedria, kafenio;

	sinedria = this.sinedriaGet();
	kafenio = sinedria.sinedriaKafenioGet();
	if (!kafenio) {
		delete this.kafenio;
		return true;
	}

	kafenio = skiniko.skinikoKafenioGet(kafenio);
	if (kafenio) {
		this.kafenioSet(kafenio);
		return true;
	}

	this.error('ανύπαρκτο καφενείο αιτούντος');
	return false;
};

NodeRequest.prototype.trapeziCheck = function(sinedria) {
	var sinedria, trapezi;

	sinedria = this.sinedriaGet();
	trapezi = sinedria.sinedriaTrapeziGet();
	if (!trapezi) {
		delete this.trapezi;
		return true;
	}

	trapezi = skiniko.skinikoTrapeziGet(trapezi);
	if (trapezi) {
		this.trapeziSet(trapezi);
		return true;
	}

	this.error('ανύπαρκτο τραπέζι αιτούντος');
	return false;
};

// Η μέθοδος "isvoli" ελέχγει αν το αίτημα είναι επώνυμο, έχει σχετική συνεδρία
// και αν τα διαπιστευτήρια του αιτούντος client συμπίπτουν με αυτά της σχετικής
// συνεδρίας. Αν όλα αυτά βρεθούν εντάξει επιστρέφεται false, αλλιώς επιστρέφεται
// true.

NodeRequest.prototype.isvoli = function() {
	var sinedria, trapezi;

	if (this.nosinedria())
	return true;

	sinedria = this.sinedriaGet();
	if (this.klidiGet() !== sinedria.klidiGet()) {
		this.error('απόπειρα εισβολής');
		return true;
	}

	// Η λίστα "noPoll" περιέχει τα pathnames των αυτοματοποιημένων skiser
	// requests. Αν το αίτημα δεν ανήκει σ' αυτά τα αιτήματα ενημερώνουμε
	// το poll timestamp της συνεδρίας.

	if (Server.noPoll.hasOwnProperty(this.serviceGet()))
	return false;

	// Το αίτημα δεν ήταν αυτοματοποιημένο, επομένως θεωρούμε ότι η συνεδρία
	// είναι ενεργή και επικοινωνεί με τον skiser στέλνοντας διάφορα αιτήματα.

	sinedria.sinedriaPollSet();

	// Παράλληλα κρατάμε ζωντανό και τον παίκτη.

	this.pektisGet().pektisPollSet();

	// Από τη στιγμή που έχουμε συνεδρία που επικοινωνεί με τον skiser και
	// εμπλέκεται με κάποιο τραπέζι, ανανεώνουμε το poll timestamp του εν
	// λόγω τραπεζιού.

	trapezi = this.trapeziGet();
	if (trapezi)
	trapezi.trapeziPollSet();

	return false;
};

NodeRequest.prototype.oxiTrapezi = function() {
	if (this.trapeziGet())
	return false;

	this.error('ακαθόριστο τραπέζι αιτούντος');
	return true;
};

NodeRequest.prototype.oxiPektis = function() {
	var trapezi;

	if (this.oxiTrapezi())
	return true;

	trapezi = this.trapeziGet();
	if (trapezi.trapeziThesiPekti(this.loginGet()))
	return false;

	this.error('Δεν είστε παίκτης στο τραπέζι');
	return true;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

NodeRequest.prototype.perastike = function(s) {
	return Object.prototype.hasOwnProperty.call(this.url, s);
	//XXX return this.url.hasOwnProperty(s);
};

NodeRequest.prototype.denPerastike = function(parametros, msg) {
	// Αν έχει περαστεί η συγκεκριμένη παράμετρος είμαστε εντάξει και
	// επιστρέφουμε false χωρίς να προβούμε σε περαιτέρω ενέργειες.

	if (this.perastike(parametros))
	return false;

	// Η συγκεκριμένη παράμετρος δεν έχει περαστεί. Σ' αυτή την περίπτωση
	// λειτουργούμε ανάλογα με την τιμή της δεύτερης παραμέτρου.

	// Αν δεν έχει περαστεί δεύτερη παράμετρος, τότε απλώς επιστρέφουμε true
	// χωρίς να στείλουμε κάποια απάντηση στον client και χωρίς να πειράξουμε
	// το αίτημα καθ' οιονδήποτε τρόπο.

	if (msg === undefined )
	return true;

	// Αν η δεύτερη παράμετρος φέρει την τιμή true, τότε δημιουργούμε γενικό
	// μήνυμα λάθους και προχωρούμε στην επιστροφή σφάλματος στον cinet.

	if (msg === true)
	msg = 'Δεν περάστηκε παράμετρος "' + parametros + '"';

	// Επιστρέφουμε στον client το δοθέν ή το κατασκευασμένο μήνυμα λάθους και
	// κλείνουμε το request επιστρέφοντας true.

	this.error(msg);
	return true;
};

NodeRequest.prototype.parametrosSet = function(key, val) {
	this.url[key] = val;
	return this;
};

NodeRequest.prototype.parametrosGet = function(s) {
	return this.url[s];
};
