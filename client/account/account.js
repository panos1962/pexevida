$(window).ready(function() {
	if (Selida.oxiPektis())
	Selida.
	tabIsodos();

	else
	Selida.
	tabKlisimo();

	Account.
	setup().
	formaDOM.
	on('submit', Account.submitForma).
	on('reset', Account.resetForma);

	$('#akiroButton').
	on('click', function(e) {
		if (Account.isEgrafi())
		self.location = Selida.server;

		else
		self.close();
	});
});

Account = {};

Account.setup = function() {
	Selida.fyi.panoDOM.css('textAlign', 'left');
	Account.formaDOM = $('#accountForma');
	Account.klidiDOM = $('#klidi');
	Account.sokidok1DOM = $('#sokidok1');
	Account.sokidokDOM = $('#sokidok');
	Account.mode = $('#mode').val();

	Account.ipodoxiDOM = $('#ipodoxi');
	if (Account.isDebugMode() && Account.isDeveloper())
	Account.ipodoxiDOM.css('display', 'block');

	Account.fotofileDOM = $('#fotofile');
	$('#fotoContainer').on('click', function() {
		Account.fotofileDOM.trigger('click');
	});

	Account.loginDOM = $('#login').
	on('keyup', function(e) {
		Account.loginCkol();
	});

	Account.onomaDOM = $('#onoma');
	Account.emailDOM = $('#email');

	Account.kodikosAlagiRowDOM = $('#kodikosAlagiRow');
	Account.kodikosAlagiDOM = $('#kodikosAlagi');

	Account.kodikos1RowDOM = $('#kodikos1Row');
	Account.kodikos1DOM = $('#kodikos1');

	Account.kodikos2RowDOM = $('#kodikos2Row');
	Account.kodikos2DOM = $('#kodikos2');

	Account.kodikosRowDOM = $('#kodikosRow');
	Account.kodikosDOM = $('#kodikos');

	Account.kodikosAlagiRowDOM.on('click', Account.kodikosAlagiKlik);
	Account.prepareForInput();

	return Account;
};

Account.prepareForInput = function() {
	if (Account.isEgrafi()) {
		Account.kodikosAlagiDOM.css('display', 'none');
		Account.kodikosDOM.prop('disabled', true);
		Account.kodikos1DOM.prop('disabled', false);
		Account.kodikos2DOM.prop('disabled', false);
		Account.loginDOM.focus();
		return Account;
	}

	if (Account.kodikosAlagiRowDOM.data('alagi')) {
		Account.kodikos1RowDOM.css('display', 'table-row');
		Account.kodikos1DOM.prop('disabled', false);

		Account.kodikos2RowDOM.css('display', 'table-row');
		Account.kodikos2DOM.prop('disabled', false);

		Account.kodikosRowDOM.css('display', 'table-row');
		Account.kodikosDOM.prop('disabled', false);
	}
	else {
		Account.kodikos1RowDOM.css('display', 'none');
		Account.kodikos1DOM.prop('disabled', true);

		Account.kodikos2RowDOM.css('display', 'none');
		Account.kodikos2DOM.prop('disabled', true);

		Account.kodikosRowDOM.css('display', 'none');
		Account.kodikosDOM.prop('disabled', true);
	}

	Account.loginDOM.prop('disabled', true);
	Account.onomaDOM.focus();

	return Account;
};

Account.loginCkolTimer = null;

Account.loginCkol = function() {
	var login;

	if (Account.loginCkolTimer) {
		clearTimeout(Account.loginCkolTimer);
		Account.loginCkolTimer = null;
	}

	login = Account.loginDOM.val().trim();
	if (login === '') {
		Account.loginDOM.removeClass('kokino');
		return;
	}

	if (!login.validLogin()) {
		Account.loginDOM.addClass('kokino');
		return;
	}

	Account.loginCkolTimer = setTimeout(function() {
		Account.loginCkolTimer = null;
		Selida.ajax('logincheck', {
			login: login,
		}).
		done(function(rsp) {
			if (rsp) Account.loginDOM.addClass('kokino');
			else Account.loginDOM.removeClass('kokino');
		}).
		fail(function(err) {
			Selida.ajaxFail(err);
		});
	}, 200);
};

Account.ipodoxiCheck = function(err) {
	var ret;

	ret = Account.ipodoxiDOM.contents().text().split('@EOD@');
	if (!ret[0]) {
		if (Account.isEnimerosi()) {
			if (Account.oxiDebugMode() || Account.oxiDeveloper())
			self.close();
			return;
		}

		Account.anagelia();
		return;
	}

	switch (ret[0]) {
	case 'PAS':
		Selida.fyi.epano('Δεν δόθηκε κωδικός');
		Account.prepareForInput();
		Account.kodikosDOM.select();
		return;
	case 'AUT':
		Selida.fyi.epano('Access denied');
		Account.prepareForInput();
		Account.kodikosDOM.select();
		return;
	case 'DUP':
		Selida.fyi.epano('Η εγγραφή υπάρχει ήδη στην database');
		break;
	case 'PRM':
		Selida.fyi.epano('Απέτυχε η εγγραφή παραμέτρων χρήστη στην database');
		break;
	case 'IFE':
		Selida.fyi.epano('Παρουσιάστηκε πρόβλημα με το αρχείο εικόνας');
		break;
	case 'IMG':
		Selida.fyi.epano('Απαράδεκτο αρχείο εικόνας (απορρίφθηκε)');
		break;
	case 'HIF':
		Selida.fyi.epano('Το αρχείο εικόνας είναι μεγάλο (απορρίφθηκε)');
		break;
	default:
		Selida.fyi.epano('Παρουσιάστηκε σφάλμα κατά την ' + (Account.isEgrafi() ? 'εγγραφή' : 'ενημέρωση'));
		break;;
	}

	Account.prepareForInput();
};

Account.anagelia = function() {
	Selida.sessionSet('pektis', Account.loginDOM.val());
	Selida.sessionSet('klidi', Account.klidiDOM.val());
	Selida.skiserService('checkin', {
		kodikos: Account.kodikos1DOM.val(),
	}).
	done(function(rsp) {
		self.location = Selida.server;
	}).
	fail(function(err) {
		Selida.sessionSet('pektis');
		Selida.sessionSet('klidi');
		Selida.ajax('../misc/exodos');
		Selida.skiserFail(err);
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Account.submitForma = function() {
	var val;

	if (Account.isEgrafi()) {
		val = Account.loginDOM.val().trim();
		Account.loginDOM.val(val);
		if (!val) {
			Selida.fyi.epano('Πρέπει να καθορίσετε κάποιο login name');
			Account.loginDOM.focus();
			return false;
		}

		if (!val.validLogin()) {
			Selida.fyi.epano('Λανθασμένο login');
			Account.loginDOM.focus();
			return false;
		}

		Account.klidiDOM.val(Globals.randomString(10));
	}

	val = Account.emailDOM.val().trim();
	Account.emailDOM.val(val);
	if (val && (!val.validEmail())) {
		Selida.fyi.epano('Λανθασμένο email');
		Account.emailDOM.focus();
		return false;
	}

	if (Account.isEgrafi() && (!Account.kodikos1DOM.val())) {
		Selida.fyi.epano('Πρέπει να καθορίσετε κωδικό πρόσβασης');
		Account.kodikos1DOM.select();
		return false;
	}

	if (Account.kodikos1DOM.val() !== Account.kodikos2DOM.val()) {
		Selida.fyi.epano('Καθορίσατε διαφορετικούς κωδικούς πρόσβασης');
		Account.kodikos1DOM.select();
		return false;
	}

	if (Account.kodikosAlagiRowDOM.data('alagi')) {
		val = Account.kodikosDOM.val();
		Account.sokidokDOM.val(val).prop('disabled', false);
	}
	else {
		Account.sokidokDOM.prop('disabled', true);
	}

	// Ο πρώτος από τους δύο κωδικούς μεταφέρεται έτσι κι αλλιώς.
	// Σε περίπτωση εγγραφής είναι απαραίτητος, ενώ σε περίπτωση
	// ενημέρωσης θα χρειαστεί μόνο εφόσον έχουμε αλλαγή κωδικού,
	// αλλά δεν πειράζει να περαστεί ούτως ή άλλως.

	Account.sokidok1DOM.val(Account.kodikos1DOM.val());

	return true;
};

// Κατά το reset της φόρμας φροντίζουμε να επαναφέρουμε και το
// κεφάλαιο αλλαγής κωδικών στην αρχική του κατάσταση, δηλαδή
// το καθιστούμε κρυφό και ανενεργό.

Account.resetForma = function() {
	Account.prepareForInput();
	Account.kodikosAlagiRowDOM.data('alagi', true).trigger('click');
	return true;
};

Account.kodikosAlagiKlik = function() {
	if (Account.kodikosAlagiRowDOM.data('alagi')) {
		Account.kodikosAlagiRowDOM.removeData('alagi');
		Account.kodikos1RowDOM.css('display', 'none');
		Account.kodikos1DOM.prop('disabled', true);

		Account.kodikos2RowDOM.css('display', 'none');
		Account.kodikos2DOM.prop('disabled', true);

		Account.kodikosRowDOM.css('display', 'none');
		Account.kodikosDOM.prop('disabled', true);

		Account.onomaDOM.focus();
	}
	else {
		Account.kodikosAlagiRowDOM.data('alagi', true);
		Account.kodikos1RowDOM.css('display', 'table-row');
		Account.kodikos1DOM.prop('disabled', false).focus();

		Account.kodikos2RowDOM.css('display', 'table-row');
		Account.kodikos2DOM.prop('disabled', false);

		Account.kodikosRowDOM.css('display', 'table-row');
		Account.kodikosDOM.prop('disabled', false);
	}
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Account.isEgrafi = function() {
	return(Account.mode === 'egrafi');
};

Account.isEnimerosi = function() {
	return(Account.mode === 'enimerosi');
};

Account.isDebugMode = function() {
	return Debug.flagGet('debug');
};

Account.oxiDebugMode = function() {
	return !Account.isDebugMode();
};

Account.isDeveloper = function() {
	return Account.developer;
};

Account.oxiDeveloper = function() {
	return !Account.isDeveloper();
};
