///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

Arena.kafinfo = {};

Arena.kafinfo.setup = function() {
	Arena.kafinfoDOM = $('#kafinfo').addClass('dialogos').
	append($('<div>').addClass('dialogosTitlos').text('Διαχείριση καφενείου')).

	append(Selida.klisimo(function(e) {
		Arena.kafinfo.klisimo();
		Arena.inputRefocus();
	}).
	attr('title', 'Κλείσιμο')).

	append($('<table>').

	append($('<tr>').
	append($('<td>').addClass('formaPrompt').text('Κωδικός')).
	append($('<td>').addClass('formaPedio').
	append(Arena.kafinfo.kodikosDOM = $('<input>').attr('id', 'kafinfoKodikos').prop('disabled', true)))).

	append($('<tr>').
	append($('<td>').addClass('formaPrompt').text('Ονομασία')).
	append($('<td>').addClass('formaPedio').
	append(Arena.kafinfo.onomasiaDOM = $('<input>').attr('id', 'kafinfoOnomasia').
	on('change', function(e) {
		var kafenio, onomasia;

		kafenio = Arena.kafinfo.kodikosDOM.val();
		if (!kafenio)
		return;

		onomasia = $(this).val().trim();

		Selida.fyi.pano('Αλλαγή ονομασίας καφενείου σε "' + onomasia + '". Παρακαλώ περιμένετε…');
		Selida.skiserService('kafenioOnomasia', 'kafenio=' + kafenio, 'onomasia=' + onomasia.uri()).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
		});
	})))).

	append($('<tr>').
	append($('<td>').addClass('formaPrompt').text('Δημιουργός')).
	append($('<td>').addClass('formaPedio').
	append(Arena.kafinfo.dimiourgosDOM = $('<input>').attr('id', 'kafinfo.dimiourgos').prop('disabled', true)))).

	append($('<tr>').
	append($('<td>').addClass('formaPrompt').text('Πριβέ')).
	append($('<td>').addClass('formaPedio').
	append(Arena.kafinfo.priveDOM = $('<input>').attr('type', 'checkbox').
	on('change', function(e) {
		var kafenio, prive;

		kafenio = Arena.kafinfo.kodikosDOM.val();
		if (!kafenio)
		return;

		prive = !$(this).prop('checked');

		Selida.fyi.pano('Μετατροπή καφενείου σε ' + (prive ? 'δημόσιο' : 'πριβέ') + '. Παρακαλώ περιμένετε…');
		Selida.skiserService('kafenio' + (prive ? 'Dimosio' : 'Prive'), 'kafenio=' + kafenio).
		done(function(rsp) {
			Selida.fyi.epano(rsp);
			Arena.inputTrexon = Arena.kafinfo.onomasiaDOM;
		}).
		fail(function(err) {
			Selida.skiserFail(err);
			Selida.ixos.beep();
			Arena.inputTrexon = Arena.kafinfo.priveDOM;
		});
	})))));

	Arena.kafinfoDOM.siromeno();

	return Arena;
};

Arena.kafinfo.anigma = function(focusDelay) {
	Arena.kafinfoDOM.css('display', 'block');
	Arena.kafinfo.anikto = true;

	if (focusDelay)
	setTimeout(function() {
		Arena.kafinfo.onomasiaDOM.focus();
	}, focusDelay);

	else
	Arena.kafinfo.onomasiaDOM.focus();

	return Arena;
};

Arena.kafinfo.klisimo = function() {
	Arena.kafinfoDOM.css('display', 'none');
	delete Arena.kafinfo.anikto;

	return Arena;
};

Arena.kafinfo.alagi = function(kafenio) {
	var dimiourgos;

	if (!kafenio) {
		Arena.kafinfo.kodikosDOM.val('');
		Arena.kafinfo.onomasiaDOM.val('');
		Arena.kafinfo.dimiourgosDOM.val('');
		Arena.kafinfo.priveDOM.prop('checked', false);
		Arena.kafinfo.disable();
		return Arena;
	}

	dimiourgos = kafenio.kafenioDimiourgosGet();

	Arena.kafinfo.kodikosDOM.val(kafenio.kafenioKodikosGet());
	Arena.kafinfo.onomasiaDOM.val(kafenio.kafenioOnomasiaGet());
	Arena.kafinfo.dimiourgosDOM.val(dimiourgos);
	Arena.kafinfo.priveDOM.prop('checked', kafenio.kafenioIsPrive());

	if (dimiourgos.isEgo())
	Arena.kafinfo.enable();

	else
	Arena.kafinfo.disable();

	return Arena;
}

Arena.kafinfo.enable = function() {
	Arena.kafinfo.onomasiaDOM.prop('disabled', false);
	Arena.kafinfo.priveDOM.prop('disabled', false);

	return Arena;
};

Arena.kafinfo.disable = function() {
	Arena.kafinfo.onomasiaDOM.prop('disabled', true);
	Arena.kafinfo.priveDOM.prop('disabled', true);

	return Arena;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
