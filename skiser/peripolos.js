Peripolos = {};

// Στο αντικείμενο "ergasia" περιέχονται οι θεσμοθετημένες εργασίες ελέγχου.
// Κάθε εργασία έχει τη δική της περίοδο ελέγχου και τη δική της funtion με
// την οποία διενεργεί τον έλεγχο.

Peripolos.ergasia = {
	dbconn:			{ period: 3600, action: 'DB.check' },
	trapezi:		{ period:   31, action: 'Service.trapezi.check' },
	sinedria:		{ period:   19, action: 'Service.sinedria.check' },
	feredata:		{ period:   11, action: 'Service.feredata.check' },
	trapeziKlidoma:		{ period:    7, action: 'Service.trapezi.klidomaCheck' },
};

/*
Peripolos.ergasia.trapezi.period = 3;
*/

// Η μέθοδος "setup" στήνει τους βασικούς κύκλους ελέγχου.

Peripolos.setup = function() {
	var i;

	Log.fasi.nea('Setting up patrol jobjs');
	Log.print('Calculating session timeouts');
	Log.level.push();

	// Αν κάποια συνεδρία δεν έχει υποβάλει αίτημα feredata μέσα σε εύλογο χρονικό
	// διάστημα, ο skiser θεωρεί ότι η συνεδρία έχει διακοπεί και την καταργεί.

	Peripolos.sinedriaTimeout = Service.feredata.timeout + parseInt(Peripolos.ergasia.feredata.period) + 2;
	Log.print('timeout for "sinedria" set to ' + Peripolos.sinedriaTimeout + ' seconds');

	// Αν κάποια συνεδρία δεν έχει υποβάλει κάποιο άλλο αίτημα πλην των αυτόματων
	// τακτικών αιτημάτων ενημέρωσης, ο skiser την καταργεί για να αποδεσμεύσει
	// πόρους.

	Peripolos.inactiveTimeout = 3600;
	Log.print('timeout for "inactive" set to ' + Peripolos.inactiveTimeout + ' seconds');

	Log.level.pop();

	Log.print('initializing patrol jobs');
	Log.level.push();
	for (i in Peripolos.ergasia) {
		Log.print('initializing "' + i + '" check (every ' + Peripolos.ergasia[i].period + ' sec)');
		Peripolos.ergasia[i].period *= 1000;
		eval('setInterval(' + Peripolos.ergasia[i].action + ', ' + Peripolos.ergasia[i].period + ');');
	}
	Log.level.pop();

	Log.print('Service.trapezi.kenoTimeout = ' + Service.trapezi.kenoTimeout);
	Log.print('Service.trapezi.oxiKenoTimeout = ' + Service.trapezi.oxiKenoTimeout);
};
