////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////@

// Ακολουθούν τα σχετικά με τις υπηρεσίες που θα προσφέρει ο skiser.
// Οι υπηρεσίες ορίζονται σε δικά τους modules. Υπάρχουν modules που
// ορίζουν μια υπηρεσία, υπάρχουν όμως και modules που ορίζουν πολλές
// παρεμφερείς υπηρεσίες.

Service = {};

Log.level.push();
require('./service/misc.js');
require('./service/sxesi.js');
require('./service/akirosi.js');
require('./service/aeras.js');
require('./service/pexnidi.js');
require('./service/agora.js');
require('./service/peparam.js');
require('./service/prosklisi.js');
require('./service/trapezi.js');
require('./service/sizitisi.js');
require('./service/kafenio.js');
require('./service/sinedria.js');
require('./service/feredata.js');
Log.level.pop();

// Στο αντικείμενο "router" περιέχονται οι υπηρεσίες που προσφέρει ο server.
// Σε κάθε "υπηρεσία" αντιστοιχούμε μια function που θα κληθεί με παράμετρο
// το ίδιο το αίτημα όπως αυτό διαμορφώνεται μετά τον έλεγχο και την αρχική
// επεξεργασία που υφίσταται από τον server.

Server.router = {
	'/kornaTrapezi': Service.misc.kornaTrapezi,
	'/sxesiSet': Service.sxesi.set,
	'/filaPrev': Service.pexnidi.filaPrev,
	'/apontaOn': Service.trapezi.apontaOn,
	'/apontaOff': Service.trapezi.apontaOff,
	'/vidaOkto': Service.trapezi.vidaOkto,
	'/vidaDekaexi': Service.trapezi.vidaDekaexi,
	'/eptariAlagi': Service.agora.eptariAlagi,
	'/trapeziLixi': Service.trapezi.lixiSet,
	'/akirosiStop': Service.akirosi.stop,
	'/akirosi': Service.akirosi.start,
	'/aerasApodoxi': Service.aeras.apodoxi,
	'/aerasIpovoli': Service.aeras.ipovoli,
	'/filo': Service.pexnidi.filo,
	'/agoraDilosi': Service.agora.dilosi,
	'/thesiTheasis': Service.sinedria.thesiTheasis,
	'/peparamSet': Service.peparam.set,
	'/trapeziIxodopa': Service.trapezi.ixodopa,
	'/trapeziApodoxi': Service.trapezi.apodoxi,
	'/kafenioApopompi': Service.kafenio.apopompi,
	'/kafenioDiapistefsi': Service.kafenio.diapistefsi,
	'/theatisPektis': Service.trapezi.theatisPektis,
	'/pektisTheatis': Service.trapezi.pektisTheatis,
	'/prosklisiApodoxi': Service.prosklisi.apodoxi,
	'/prosklisiDiagrafi': Service.prosklisi.diagrafi,
	'/prosklisiEpidosi': Service.prosklisi.epidosi,
	'/trapeziDiataxi': Service.trapezi.diataxi,
	'/trapeziKomeniAllow': Service.trapezi.komeniAllow,
	'/trapeziKomeniDisallow': Service.trapezi.komeniDisallow,
	'/trapeziDilosiAllow': Service.trapezi.dilosiAllow,
	'/trapeziDilosiDisallow': Service.trapezi.dilosiDisallow,
	'/trapeziElefthero': Service.trapezi.elefthero,
	'/trapeziIdioktito': Service.trapezi.idioktito,
	'/trapeziVida': Service.trapezi.vida,
	'/trapeziBelot': Service.trapezi.belot,
	'/trapeziDimosio': Service.trapezi.dimosio,
	'/trapeziPrive': Service.trapezi.prive,
	'/trapeziExodos': Service.trapezi.exodos,
	'/trapeziEpilogi': Service.trapezi.epilogi,
	'/trapeziNeo': Service.trapezi.neo,
	'/sizitisiTrapezi': Service.sizitisi.trapezi,
	'/sizitisiKafenio': Service.sizitisi.kafenio,
	'/sizitisiLobi': Service.sizitisi.lobi,
	'/kafenioOnomasia': Service.kafenio.onomasia,
	'/kafenioPrive': Service.kafenio.prive,
	'/kafenioDimosio': Service.kafenio.dimosio,
	'/kafenioExodos': Service.kafenio.exodos,
	'/kafenioEpilogi': Service.kafenio.epilogi,
	'/kafenioNeo': Service.kafenio.neo,
	'/metavoles': Service.feredata.metavoles,
	'/skiniko': Service.feredata.freska,
	'/checkin': Service.sinedria.checkin,
	'/exodos': Service.sinedria.exodos,
};

// Ακολουθούν υπηρεσίες που ζητούνται μεν, αλλά αγνοούνται και δεν επιστρέφουν
// αποτελέσματα ούτε εκτελούν κάποιες διεργασίες. Η υπηρεσία "favicon.ico" είναι
// κλήση που ζητείται από πολλούς browsers by default μετά την αίτηση οποιασδήποτε
// σελίδας, αλλά ο παρών server δεν χρειάζεται να απαντάει σε τέτοιου είδους
// αιτήματα.

Server.off = {
	'/favicon.ico': 0,
};

// Ακολουθούν υπηρεσίες που δεν πρέπει να επηρεάζουν το timestamp επαφής της
// συνεδρίας καθώς εκτελούνται αυτόματα από το πρόγραμμα ακόμη και αν ο παίκτης
// δεν κάνει καμία απολύτως ενέργεια.

Server.noPoll = {
	'/metavoles': 0,
};
