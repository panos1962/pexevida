///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Στο παρόν παρέχονται global δομές και μέθοδοι που αφορούν στον skiser. Αυτά τα
// αντικείμενα θα ενταχθούν στο global singleton "Server". Παράλληλα θέτουμε το
// global αντικείμενο "Client" σε null προκειμένου να γίνεται εμφανές, οπουδήποτε
// αυτό ελεγχθεί, ότι πρόκειται για τον skiser.

Server = {};
Client = null;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Η function "readFileSync" διαβάζει ολόκληρο το περιεχόμενο ενός file και το επιστρέφει
// ως ενιαίο string. Όπως υπονοεί και το όνομά της, η διαδικασία είναι σύγχρονη, επομένως
// μπλοκάρει τον skiser και γι' αυτό το λόγο θα πρέπει να χρησιμοποιείται μόνο κατά το
// ανέβασμα, ή το κατέβασμα του skiser.

Server.readFileSync = function(path) {
	return FS.readFileSync(path, {
		encoding: 'utf8',
	}, function(err) {
		console.log(err);
	});
};

// Η function "fileExists" δέχεται το path name ενός file και ελέγχει με σύγχρονο τρόπο
// αν το file υπάρχει. Αν το file υπάρχει επιστρέφει true, αλλιώς false.

Server.fileExists = function(path) {
	try {
		FS.statSync(path);
	} catch (e) {
		return false;
	}

	return true;
};

// Η function "fileReadable" δέχεται το path name ενός file και ελέγχει με σύγχρονο τρόπο
// αν το process έχει read access στο file οπότε επιστρέφει true, αλλιώς false.

Server.fileReadable = function(path) {
	try {
		FS.closeSync(FS.openSync(path, 'r'));
	} catch (e) {
		return false;
	}

	return true;
};

// Η function "requireExisting" δέχεται το path name ενός JavaScript source file και το
// εντάσσει στο τρέχον πρόγραμμα εν είδει require, εφόσον το file υπάρχει. Αν το file
// δεν υπάρχει, εκτυπώνεται warning message στο standard error. Αν υπάρχει νεότερο
// αντίστοιχο minfied αρχείο, τότε αυτό προτιμάται.
//
// WARNING: Το αρχείο πρέπει να έχει επίθεμα ".js" το οποίο, όμως, δεν περιλαμβάνεται στο
// path που δίνεται ως παράμετρος.

Server.requireExisting = function(path) {
	var pathMin, mtimeMin, mtime;

	pathMin = path + '.min.js';
	try {
		mtimeMin = Server.fileReadable(pathMin) ? new Date(FS.statSync(pathMin).mtime).getTime() : 0;
	} catch (e) {
		mtimeMin = 0;
	}

	path += '.js';
	try {
		mtime = Server.fileReadable(path) ? new Date(FS.statSync(path).mtime).getTime() : 0;
	} catch (e) {
		mtime = 0;
	}

	if (mtimeMin > mtime)
	return require(pathMin);

	if (mtime > mtimeMin)
	return require(path);

	if (mtimeMin !== 0)
	return require(pathMin);

	console.error('WARNING: ' + path + ': required file not found');
	return null;
};
