// Η κλάση "BPanel" απεικοζίζει button panels, όπως είναι το βασικό control panel,
// το πάνελ των emoticons, το control panel των αναζητήσεων, το control panel της
// συζήτησης κλπ. Τα button panels μπορούν να είναι κάθετα ή οριζόντια και περιέχουν
// πλήκτρα που μπορούν να είναι κατανεμημένα σε ομάδες. Σε οριζόντια button panels
// είναι πιθανό να υπάρχουν και input πεδία.

BPanel = function(props) {
	Globals.initObject(this, props);

	// Ακολουθεί array με τα πλήκτρα του panel με τη σειρά που
	// αυτά προσετέθησαν στο panel.

	this.button = [];

	// Ακολουθεί λίστα με τα πλήκτρα του panel δεικτοδοτημένη με
	// τα ids των πλήκτρων.

	this.nottub = {};

	// Το property "DOM" περιέχει το DOM element του πάνελ.

	this.DOM = $('<div>').addClass('panelContainer');

	this.omada = 1;
	this.omadaMax = 1;
};

BPanel.prototype.bpanelGetDOM = function() {
	return this.DOM;
};

BPanel.prototype.bpanelOmadaSet = function(omada) {
	if (this.bpanelOmadaGet() == omada)
	return this;

	this.omada = omada;
	this.bpanelRefresh();
	return this;
};

BPanel.prototype.bpanelOmadaGet = function() {
	return this.omada;
};

BPanel.prototype.bpanelEpomeniOmada = function() {
	this.omada++;
	if (this.omada > this.omadaMax)
	this.omada = 1;

	this.bpanelRefresh();
	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Με τη μέθοδο "bpanelButtonPush" εισάγουμε πλήκτρα στο πάνελ. Τα πλήκτρα
// εμφανίζονται με τη σειρά που τα εισάγουμε.

BPanel.prototype.bpanelButtonPush = function(button) {
	var id, omada;

	button.pbuttonPanelSet(this);
	this.button.push(button);

	id = button.pbuttonIdGet();
	if (id) this.nottub[id] = button;

	this.bpanelGetDOM().append(button.pbuttonGetDOM());

	omada = button.pbuttonOmadaGet();
	if (omada && (omada > this.omadaMax))
	this.omadaMax = omada;

	return this;
};

BPanel.prototype.bpanelButtonGet = function(id) {
	return this.nottub[id];
};

BPanel.prototype.bpanelButtonWalk = function(callback) {
	Globals.awalk(this.button, function(i, button) {
		callback.call(button);
	});

	return this;
};

BPanel.prototype.bpanelRefresh = function(omada) {
	if (omada) this.omada = omada;
	this.bpanelButtonWalk(function() {
		this.
		pbuttonRefresh().
		pbuttonDisplay();
	});

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Με τη μέθοδο "bpanelInputPush" εισάγουμε input πεδία στο πάνελ. Τα input
// πεδία εμφανίζονται με τη σειρά που τα εισάγουμε. Η μέθοδος επιστρέφει το
// jQuery dome element list του input πεδίου.

BPanel.prototype.bpanelInputPush = function(opts) {
	var dom;

	dom = $('<input>').addClass('panelInput').
	on('keyup', function(e) {
		switch (e.which) {
		case 27:
			if ((!dom.data('skoupaki')) && Arena.escapeButtonGet())
			return;

			e.stopPropagation();

			dom.
			removeData('skoupaki').
			val('');

			if (opts.hasOwnProperty('proepiskopisi'))
			opts.proepiskopisi();

			if (Selida.oxiKinito())
			dom.focus();
			return;
		case 13:
			// Αν έχει δοθεί submit function στις παραμέτρους,
			// την καλούμε με παράμετρο το input jQuery element.

			if (opts.hasOwnProperty('submit'))
			opts.submit(dom);

			if (Selida.oxiKinito())
			dom.focus();

			return;
		default:
			if (opts.hasOwnProperty('proepiskopisi'))
			opts.proepiskopisi();
		}
	});

	// Αν έχει περαστεί id στις παραμέτρους, τότε αυτό το id καθίσταται
	// dom element id του input jQuery element.

	if (opts.hasOwnProperty('id'))
	dom.attr('id', opts.id);

	// Εντάσσουμε το νεόκοπο input element στο button panel.

	this.bpanelGetDOM().append(dom);

	// Εντάσσουμε πλήκτρο υποβολής στο button panel, εκτός και αν έχει
	// δοθεί ρητή άρνηση.

	if (!opts.hasOwnProperty('noenter'))
	this.bpanelButtonPush(new PButton({
		img: 'enter.png',
		title: 'Υποβολή',
		click: function() {
			dom.trigger(jQuery.Event('keyup', {which:13}));
		},
	}));

	// Εντάσσουμε πλήκτρο καθαρισμού στο button panel, εκτός και αν έχει
	// δοθεί ρητή άρνηση.

	if (!opts.hasOwnProperty('noclear'))
	this.bpanelButtonPush(new PButton({
		img: 'clear.png',
		title: 'Καθαρισμός',
		click: function() {
			dom.
			data('skoupaki', true).
			trigger(jQuery.Event('keyup', {which:27}));
		},
	}));

	// Επιστρέφουμε το jQuery element του νεόκοπου input πεδίου.

	return dom;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

PButton = function(props) {
	var img, src;

	Globals.initObject(this, props, {
		functions: true,
	});

	// Κάθε panel button μπορεί να αποθηκεύσει key/value pairs.

	this.dataList = {};

	this.DOM = $('<div>').addClass('panelButton').
	data('button', this).
	append(img = $('<img>').addClass('panelIcon')).
	on('click', function(e) {
		var button, panel;

		button = $(this).data('button');
		panel = button.pbuttonPanelGet();

		if (typeof panel.clickCommon === 'function')
		panel.clickCommon(e, button);

		if (typeof button.click === 'function')
		button.click.call(button, e);
	});

	if (typeof this.mousedown === 'function')
	this.DOM.on('mousedown', function(e) {
		var button;

		button = $(this).data('button');
		button.mousedown.call(button, e);
	});

	if (typeof this.enter === 'function')
	this.DOM.on('mouseenter', function(e) {
		var button;

		button = $(this).data('button');
		button.enter.call(button, e);
	});

	if (typeof this.leave === 'function')
	this.DOM.on('mouseleave', function(e) {
		var button;

		button = $(this).data('button');
		button.leave.call(button, e);
	});

	if (this.hasOwnProperty('title'))
	this.DOM.attr('title', this.title);

	if (this.hasOwnProperty('img')) {
		src = this.img.match(/[/]/) ? this.img : 'ikona/panel/' + this.img;
		img.attr('src', src);
	}
};

PButton.prototype.pbuttonPanelSet = function(panel) {
	this.panel = panel;
	return this;
};

PButton.prototype.pbuttonPanelGet = function() {
	return this.panel;
};

PButton.prototype.pbuttonTitleSet = function(s) {
	this.title = s;
	this.pbuttonGetDOM().attr('title', s);
	return this;
};

PButton.prototype.pbuttonIconSet = function(src) {
	if (!src.match(/[/]/))
	src = 'ikona/panel/' + src;

	this.pbuttonIconGetDOM().attr('src', src);
	return this;
};

PButton.prototype.pbuttonIdGet = function() {
	return this.id;
};

PButton.prototype.pbuttonOmadaGet = function() {
	return this.omada;
};

PButton.prototype.pbuttonCheck = function() {
	// Τα πλήκτρα που δεν έχουν καθορισμένη μέθοδο
	// ελέγχου κατάστασης θεωρούνται πάντα ενεργά.

	if (!this.hasOwnProperty('check'))
	return true;

	return this.check.call(this);
};

PButton.prototype.pbuttonIsEnergo = function() {
	var panel, omada;

	panel = this.pbuttonPanelGet();
	if (!panel) return false;

	// Τα πλήκτρα που δεν έχουν καθορισμένη ομάδα εμφανίζονται σε όλες τις ομάδες.

	omada = this.pbuttonOmadaGet();
	if (omada && (omada != panel.bpanelOmadaGet()))
	return false;

	return this.pbuttonCheck();
};

PButton.prototype.pbuttonGetDOM = function() {
	return this.DOM;
};

PButton.prototype.pbuttonIconGetDOM = function() {
	return this.pbuttonGetDOM().find('.panelIcon');
};

PButton.prototype.pbuttonRefresh = function() {
	if (this.hasOwnProperty('refresh'))
	this.refresh.call(this);

	return this;
};

PButton.prototype.pbuttonDisplay = function() {
	this.pbuttonGetDOM().css('display', this.pbuttonIsEnergo() ? 'inline-block' : 'none');
	return this;
};

PButton.prototype.pbuttonHide = function() {
	this.pbuttonGetDOM().css('display', 'none');
	return this;
};

PButton.prototype.pbuttonShow = function() {
	this.pbuttonGetDOM().css('display', 'block');
	return this;
};

PButton.prototype.pbuttonDexia = function() {
	this.pbuttonGetDOM().addClass('panelButtonDexia');
	return this;
};

PButton.prototype.pbuttonLock = function(working) {
	var img;

	if (this.lock)
	return this;

	this.lock = true;

	if (working) {
		img = this.pbuttonIconGetDOM();
		if (img)
		img.working(true);
	}

	return this;
};

PButton.prototype.pbuttonRelease = function(working) {
	var img;

	delete this.lock;

	if (working) {
		img = this.pbuttonIconGetDOM();
		if (img)
		img.working(false);
	}

	return this;
};

PButton.prototype.pbuttonEpilogiSet = function(naiOxi) {
	if (naiOxi === undefined)
	naiOxi = true;

	if (naiOxi)
	this.pbuttonGetDOM().addClass('panelButtonEpilogi');

	else
	this.pbuttonGetDOM().removeClass('panelButtonEpilogi');

	return this;
};

PButton.prototype.pbuttonEkremesSet = function(naiOxi) {
	if (naiOxi === undefined)
	naiOxi = true;

	if (naiOxi)
	this.pbuttonGetDOM().addClass('panelButtonEkremes');

	else
	this.pbuttonGetDOM().removeClass('panelButtonEkremes');

	return this;
};

// Η μέθοδος "data" μιμείται την αντίστοιχη jQuery μέθοδο, επομένως μπορούμε
// να περάσουμε ζεύγος τιμών key/value προκειμένου να αποθηκεύσουμε κάποια τιμή,
// ή μόνο το key προκειμένου να πάρουμε την αποθηκευμένη τιμή.

PButton.prototype.data = function(tag, val) {
	if (val === undefined)
	return this.dataList[tag];

	this.dataList[tag] = val;
	return this;
};

// Η μέθοδος "removeData" μιμείται την αντίστοιχη jQuery μέθοδο, επομένως διαγράφει
// την αποθηκευμένη τιμή για το key που περνάμε ως παράμετρο. Αν δεν περάσουμε
// συγκεκριμένο key, τότε διαγράφουμε όλα τα αποθηκευμένα key/value pairs.

PButton.prototype.removeData = function(tag) {
	if (tag === undefined)
	this.dataList = {};

	else
	delete this.dataList[tag];

	return this;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

PButton.enalagi = function(panel) {
	return new PButton({
		id: 'enalagi',
		img: '4Balls.png',
		title: 'Εναλλαγή εργαλείων',
		click: function(e) {
			panel.bpanelEpomeniOmada();
			this.pbuttonGetDOM().strofi({
				strofi: 90,
				duration: 200,
			});
		},
	});
};

PButton.slideH = function() {
	return new PButton({
		img: 'ikona/misc/baresV.png',
		title: 'Οριζόντια μετακίνηση',
		mousedown: function(e) {
			this.pbuttonGetDOM().parents('.panel').trigger(e);
		},
	});
};

PButton.slideV = function() {
	return new PButton({
		img: 'ikona/misc/baresH.png',
		title: "Μετακίνηση καθ' ύψος",
		mousedown: function(e) {
			this.pbuttonGetDOM().parents('.panel').trigger(e);
		},
	});
};
