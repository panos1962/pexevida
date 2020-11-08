///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Στο παρόν ορίζονται δομές και μέθοδοι γενικής χρήσης που αφορούν τόσο στον skiser,
// όσο και στον client. Αυτά τα αντικείμενα εντάσσονται στο global singleton "Globals".

Globals = {};

// Η δομή "Server" ορίζεται στον server σκηνικού (skiser), ενώ η δομή "Client" ορίζεται
// στους clients. Με αυτές τις δύο δομές μπορούμε να ελέγχουμε αν βρισκόμαστε στον server
// σκηνικού ή σε client. Αρχικά απενεργοποιούμε και τις δύο δομές. 

Server = null;
Client = null;

Globals.whereCheck = function() {
	if (Server && Client)
	throw 'Both "Server" and "Client" are set!';
};

Globals.isServer = function() {
	Globals.whereCheck();
	return Server;
};

Globals.oxiServer = function() {
	return !Globals.isServer();
};

Globals.isClient = function() {
	Globals.whereCheck();
	return Client;
};

Globals.oxiClient = function() {
	return !Globals.isClient();
};

Globals.sizitisiMax = 100;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "walk" διατρέχει όλα τα στοιχεία μιας λίστας και για κάθε στοιχείο
// καλεί κάποια function με παραμέτρους το ανά χείρας κλειδί και το αντίστοιχο
// στοιχείο της λίστας. Η μέθοδος επιστρέφει το πλήθος των στοιχείων της λίστας.

Globals.walk = function(list, callback) {
	var count = 0, i;

	for (i in list) {
		count++;

		if (callback)
		callback(i, list[i]);
	}

	return count;
};

// Η function "awalk" διατρέχει όλα τα στοιχεία ενός array και για κάθε στοιχείο
// καλεί κάποια function με παραμέτρους το ανά χείρας index και το αντίστοιχο
// στοιχείο του array. Η μέθοδος επιστρέφει το πλήθος των στοιχείων του array.
// Η κύρια διαφορά της με την "walk" είναι ότι διατρέχει τα στοιχεία του array
// με τη σειρά.

Globals.awalk = function(list, callback) {
	var i;

	for (i = 0; i < list.length; i++) {
		if (callback)
		callback(i, list[i]);
	}

	return i;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Ακολουθούν functions σχετικές με ημερομηνία και ώρα.

// Η function "torams" επιστρέφει το τρέχον timestamp σε milliseconds,
// με όρους της μηχανής στην οποία εκτελείται.

Globals.torams = function() {
	return (new Date).getTime();
};

// Η function "tora" επιστρέφει το τρέχον timestamp σε seconds,
// με όρους της μηχανής στην οποία εκτελείται.

Globals.tora = function() {
	return Math.floor((new Date).getTime() / 1000);
};

// Η function "toramsServer" επιστρέφει το τρέχον timestamp
// σε milliseconds, με όρους του server. Η διαφορά ώρας μεταξύ
// server και client δίνεται στην property "timeDif" και είναι
// σε seconds.

Globals.toramsServer = function() {
	var t;

	t = Globals.torams();

	if (Client)
	t += Selida.timeDif * 1000;

	return t;
};

// Η function "toraServer" επιστρέφει το τρέχον timestamp
// σε seconds, με όρους του server.

Globals.toraServer = function() {
	var t;

	t = Globals.tora();

	if (Client)
	t += Selida.timeDif;

	return t;
};

// Η function "pote" δέχεται ένα timestamp και εμφανίζει το χρονικό διάστημα
// μέχρι την τρέχουσα χρονική στιγμή σε πιο ανθρώπινη μορφή. Το τρέχον timestamp
// λογίζεται με όρους της μηχανής στην οποία εκτελείται.

Globals.pote = function(ts) {
	var tora, dif, x, msg;

	tora = Globals.tora();
	dif = tora - ts;
	if (dif < 60)
	return 'τώρα';

	if (dif < 3600) {
		x = parseInt(dif / 60);
		return(isNaN(x) ? '' : 'πριν ' + x + ' λεπτ' + (x < 2 ? 'ό' : 'ά'));
	}

	if (dif < 86400) {
		x = parseInt(dif / 3600);
		if (isNaN(x))
		return '';

		msg = 'πριν ' + x + ' ώρ' + (x < 2 ? 'α' : 'ες');
		dif -= (x * 3600);
		x = parseInt(dif / 60);
		return (isNaN(x) ? msg : msg + ' και ' + x + ' λεπτ' + (x < 2 ? 'ό' : 'ά'));
	}
	
	// Μετατρέπουμε το timestamp σε αντικείμενο ημερομηνίας, προκειμένου
	// να εκτυπώσουμε την ημερομηνία σε μορφή "dd/mm/yyyy, hh:mm".

	ts = new Date(ts * 1000);
	return Globals.mera(ts) + ', ' + Globals.ora(ts);
};

// Η function "poteOra" είναι παρόμοια με την "pote" καθώς τυπώνει την ώρα για
// το τρέχον 24ωρο, ενώ για παλαιότερες χρονικές στιγμές τυπώνει και την ημέρα.

Globals.poteOra = function(ts, full) {
	var tora, toraMera, toraMinas, toraEtos, poteMera, poteMinas, poteEtos;

	tora = new Date(full ? 0 : Globals.torams());
	toraMera = tora.getDate();
	toraMinas = tora.getMonth();
	toraEtos = tora.getFullYear();

	ts = new Date(ts * 1000);
	poteMera = ts.getDate();
	poteMinas = ts.getMonth();
	poteEtos = ts.getFullYear();

	return((poteEtos === toraEtos) && (poteMinas === toraMinas) && (poteMera === toraMera) ?
		Globals.ora(ts) : Globals.mera(ts, full) + ', ' + Globals.ora(ts, full));
};

// Η function "mera" δίνει την τρέχουσα ημερομηνία στη μηχανή που τρέχει.
// Μπορούμε να δώσουμε και συγκεκριμένη ώρα ως παράμετρο.

Globals.mera = function(d, full) {
	var s, x;

	if (!d) d = new Date;
	else if (typeof d === 'number') d = new Date(d * 1000);

	s = '';

	x = d.getDate();
	if (x < 10) s += '0';
	s += x;
	s += '/';

	x = d.getMonth() + 1;
	if (x < 10) s += '0';
	s += x;
	s += '/'; 

	x = d.getFullYear();
	if (full || (x < 2000)) s += x;
	else {
		x %= 100;
		if (x < 10) s += '0';
		s += x;
	}

	return s;
};

// Η function "ora" δίνει την τρέχουσα ώρα στη μηχανή που τρέχει.
// Μπορούμε να δώσουμε και συγκεκριμένη ώρα ως παράμετρο.

Globals.ora = function(d, seconds) {
	var s, x;

	if (!d) d = new Date;
	else if (typeof d === 'number') d = new Date(d * 1000);

	s = '';

	x = d.getHours();
	if (x < 10) s += '0';
	s += x + ':';

	x = d.getMinutes();
	if (x < 10) s += '0';
	s += x;

	if (seconds === undefined)
	seconds = false;

	if (seconds) {
		s += ':';
		x = d.getSeconds();
		if (x < 10) s += '0';
		s += x;
	}

	return s;
};

Globals.meraOra = function(seconds) {
	var tora = new Date;

	return Globals.mera(tora) + ', ' + Globals.ora(tora, seconds);
};

Globals.consoleLog = function(msg) {
	console.log(msg, '(' + Globals.meraOra(true) + ')');
};

Globals.consoleError = function(msg) {
	console.error(msg, '(' + Globals.meraOra(true) + ')');
};

Globals.fatal = function(err) {
	if (typeof err === 'string')
	Globals.consoleError(err);

	throw err;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η κλήση που ακολουθεί εξυπηρετεί στη λειτουργία άλλων μεθόδων.

;(function() {
	var ipOctet = '(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])';

	Globals.loginRE = new RegExp('^[a-zA-Z][a-zA-Z0-9_!@#=.:+-]*$');
	Globals.emailRE = new RegExp('^[a-zA-Z0-9_\.-]+\@([a-zA-Z0-9-]+\\.)+([a-zA-Z0-9]{2,4})+$');

	Globals.ipRE = new RegExp('^(?:' + ipOctet + '\\.){3}' + ipOctet + '$');
	Globals.ipv4mappedRE = new RegExp('^::[fF]{4}:(?:' + ipOctet + '\\.){3}' + ipOctet + '$');
})();

// Η μέθοδος "validIp" ελέγχει ένα string ως προς το εαν είναι
// είναι δεκτό IP. Αν ναι το επιστρέφει, αλλιώς επιστρέφει κενό
// string.

// XXX
// Μην διώξετε το valueOf() στις επιστροφές. Φαίνεται να δημιουργεί πρόβλημα
// στο "sinedria.ip.json()" και δεν το έχω ψάξει για να ξέρω πού ακριβώς
// οφείλεται.

String.prototype.validIp = function() {
	if (this.match(Globals.ipv4mappedRE))
	return this.valueOf();

	if (this.match(Globals.ipRE))
	return this.valueOf();

	return '';
};

// Η μέθοδος "validEmail" ελέγχει ένα string ως email address. Αν
// είναι δεκτό το επιστρέφει, αλλιώς επιστρέφει κενό string.

String.prototype.validEmail = function() {
	return this.match(Globals.emailRE) ? this : '';
};

// Η μέθοδος "validLogin" ελέγχει ένα string ως login name. Αν
// είναι δεκτό το επιστρέφει, αλλιώς επιστρέφει κενό string.

String.prototype.validLogin = function() {
	return this.match(Globals.loginRE) ? this : '';
};

// Η μέθοδος "json" επιστρέφει json safe μορφή του ανά χείρας string.

String.prototype.json = function(nl) {
	return Globals.json(this.valueOf(), nl);
};

// Η μέθοδος "uri" μετατρέπει ένα string σε μορφή ασφαλή
// ώστε να χρησιμοποιηθεί ως URI component.

String.prototype.uri = function() {
	return encodeURIComponent(this);
};

String.prototype.evalAsfales = new Function('', "var x; eval('x = ' + this.valueOf() + ';'); return x;");

String.prototype.isNai = function() {
	return(this.valueOf() === 'ΝΑΙ');
};

String.prototype.oxiNai = function() {
	return !this.isNai();
};

String.prototype.isOxi = function() {
	return(this.valueOf() === 'ΟΧΙ');
};

String.prototype.oxiOxi = function() {
	return !this.isOxi();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "json" δέχεται μια παράμετρο και την μετατρέπει σε
// μορφή ασφαλή ώστε να χρησιμοποιηθεί ως rvalue σε δομές json.
// Η function δεν δίδεται ως string method ώστε να δύναται να
// χρησιμοποιηθεί σε οποιαδήποτε μεταβλητή και όχι μόνο σε strings.
//
// Μπορούμε να περάσουμε και δεύτερη παράμετρο με την οποία λέμε
// αν θέλουμε αντικατάσταση των control χαρακτήρων μέσα στα strings.
// Control χαρακτήρες είναι τα newlines, τα carriage returns, τα
// tabs κλπ. By default αυτή η παράμετρος λογίζεται true, επομένως
// όταν δεν θέλουμε αντικατάσταση των control χαρακτήρων, περνάμε
// παράμετρο με τιμή false.

Globals.json = function(s, nl) {
	var err = false, x;

	if (s === undefined)
	err = 'undefined data';

	else if (s === null)
	err = 'null data';

	else {
		switch (typeof s)  {
		case 'number':
			return s;
		case 'string':
			x = s.replace(/\\/g, '\\\\');
			if (nl === undefined)
			nl = true;

			if (nl)
			x = x.replace(/[\n\r\f\v\b\t]/g, ' ');

			return "'" + x.replace(/'/g, '\\\'') + "'";
		default:
			err = s + ': invalid data type';
			break;
		}
	}

	Globals.fatal('Globals.json: ' + err);
};

// Η μέθοδος "random" επιστρέφει έναν τυχαίο ακέραιο μεταξύ των τιμών που δίνονται
// ως παράμετροι (inclusive). Π.χ. η κλήση Globals.random(5, 10) μπορεί να δώσει 5,
// 6, 7, 8, 9 και 10.

Globals.random = function(min, max) {
	switch (arguments.length) {
	case 0:
		min = 0;
		max = 999999999;
		break;
	case 1:
		max = min;
		min = 0;
		break;
	}

	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Η μέθοδος "randomString" επιστρέφει ένα τυχαίο string με μήκος που καθορίζεται
// από τις παραμέτρους. Το string αποτελείται από γράμματα του λατινικού αλφαβήτου,
// αλλά αν θέλουμε μπορούμε να περάσουμε αυθαίρετο string από το οποίο θα επιλεγούν
// χαρακτήρες.

Globals.randomString = function(min, max, pool) {
	var ret;

	if (max === undefined)
	max = min;

	if (pool === undefined)
	pool = 'abcdefghijklmnopqrstuvwxyz';

	ret = '';
	max = Globals.random(min, max);

	for (min = 0; min < max; min++)
	ret += pool.substr(Globals.random(pool.length - 1), 1);

	return ret;
};

// Η function "initObj" χρησιμοποιείται συνήθως στην αρχικοποίηση αντικειμένων.
// Δέχεται ένα αντικείμενο και μια λίστα και θέτει τα στοιχεία τής λίστας ως
// properties του αντικειμένου. Αν το αντικείμενο είχε κάποια properties πριν
// την εφαρμογή τής μεθόδου, αυτά τα properties διατηρούνται. By default τα
// properties τύπου function δεν αντιγράφονται, μπορούμε όμως να αντιγράψουμε
// και αυτά δίνοντας κατάλληλες options στην τρίτη παράμετρο.

Globals.initObject = function(obj, props, opt) {
	var i;

	if (opt === undefined) opt = {
		functions: false,
		recursive: true,
	};

	for (i in props) {
		if (props[i] === null)
		obj[i] = null;

		else if (typeof props[i] === 'function') {
			if (opt.functions)
			obj[i] = props[i];
		}

		else if (typeof props[i] !== 'object')
		obj[i] = props[i];

		else if (opt.recursive) {
			if (props[i] instanceof Array)
			obj[i] = Globals.initObject([], props[i]);

			else
			obj[i] = Globals.initObject({}, props[i]);
		}

		else
		obj[i] = props[i];
	}

	return obj;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Debug = {
	flags: {},
};

Debug.flagSet = function(flag, val) {
	if (val === undefined)
	val = true;

	Debug.flags[flag] = val;
};

Debug.flagGet = function(flag) {
	return Debug.flags[flag];
};

Debug.memoryGet = function() {
	var i, count = 0;

	try {
		for (i in jQuery.cache)
		count++;
	} finally {
		return count;
	}
};
