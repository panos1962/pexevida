$(window).ready(function() {
	Selida.
	tabVida().
	tabEgrafi();

	Isodos.
	setup().
	formaDOM.
	on('submit', function() {
		if (Isodos.susami)
		return true;

		Isodos.diapistefsi();
		return false;
	});

	$('#akiroButton').
	on('click', function(e) {
		window.location = Selida.server;
	});
});

Isodos = {};

Isodos.setup = function() {
	Selida.fyi.panoDOM.css('textAlign', 'left');
	Isodos.formaDOM = $('#isodosForma');
	Isodos.loginDOM = $('#login').focus();
	Isodos.kodikosDOM = $('#kodikos');
	return Isodos;
};

Isodos.diapistefsi = function() {
	Selida.session.pektis = Isodos.loginDOM.val();
	Selida.session.klidi = Globals.randomString(10);

	Selida.fyi.pano('Έλεγχος στοιχείων εισόδου. Παρακαλώ περιμένετε…');
	Selida.ajax('checkin', {
		login: Selida.session.pektis,
		kodikos: Isodos.kodikosDOM.val(),
		klidi: Selida.session.klidi,
	}).
	done(function(rsp) {
		Selida.fyi.epano(rsp);
		if (rsp)
		return Isodos.loginDOM.focus();

		Isodos.anagelia(kodikos);
	}).
	fail(function(err) {
		Selida.ajaxFail(err);
	});
};

Isodos.anagelia = function() {
	Selida.skiserService('checkin', {
		kodikos: Isodos.kodikosDOM.val(),
	}).
	done(function(rsp) {
		Isodos.susami = true;
		Isodos.formaDOM.trigger('submit');
	}).
	fail(function(err) {
		Selida.sessionSet('pektis');
		Selida.sessionSet('klidi');
		Selida.ajax('../misc/exodos');
		Selida.skiserFail(err);
	});
};
