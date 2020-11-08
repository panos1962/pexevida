// Στο παρόν module ορίζουμε δομές και μεθόδους που αφορούν στο console log
// και γενικότερα στην παρακολούθηση των εργασιών που εκτελούνται στον Node
// server.

Log = {};

Log.level = {
	level: 0,

	reset: function() {
		Log.level.level = 0;
	},

	push: function(s) {
		if (s)
		Log.print(s);

		Log.level.level++;
	},

	pop: function() {
		Log.level.level--;
	},
};

Log.fasi = {
	fasi: 0,

	nea: function(msg) {
		var nl;

		nl = Log.fasi.fasi > 0 ? '\n' : '';
		Log.fasi.fasi++;
		console.log(nl + 'PHASE ' + Log.fasi.fasi + ': ' + msg);
		Log.level.reset();
	},
};

Log.print = function(msg) {
	var tabs = '', i;

	for (i = 0; i <= Log.level.level; i++)
	tabs += '\t';

	console.log(tabs + msg);
}

// Η ενημέρωση είναι πρωθύστερη για ευνόητους λόγους.

Log.fasi.nea('initializing the Node server');
