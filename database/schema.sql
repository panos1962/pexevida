-- Στο παρόν script υπάρχουν παράμετροι που καθιστούν ευέλικτη την κατασκευή
-- της database. Πιο συγκεκριμένα:
--
--	__DATABASE__		Είναι το όνομα της database, π.χ. "pexevida",
--				"vidaprive" κλπ.
--
--	__ENGINE__		Είναι η default storage engine για τους πίνακες
--				της database, π.χ. "INNODB", "TOKUDB" κλπ. Πρέπει
--				να είναι transactional.

DROP DATABASE IF EXISTS `__DATABASE__`
;

-- Με το παρόν κατασκευάζουμε την database.

CREATE DATABASE `__DATABASE__`
DEFAULT CHARSET = utf8
DEFAULT COLLATE = utf8_general_ci
;

\! echo "database created!"

-- Καθιστούμε τρέχουσα την database που μόλις κατασκευάσαμε.

USE `__DATABASE__`;

SET STORAGE_ENGINE = __ENGINE__;

-- Ακυρώνουμε προσωρινά τα foreign key checks, όχι επειδή είναι απαραίτητο,
-- αλλά επειδή σε κάποιες μηχανές προκαλείται κάποια εμπλοκή.

SET FOREIGN_KEY_CHECKS = 0;

\! echo "creating tables…"

-- Ο πίνακας "pektis" είναι ο σημαντικότερος πίνακας της εφαρμογής και περιέχει
-- τους χρήστες της «Βίδας».

CREATE TABLE `pektis` (
	`login`		VARCHAR(64) NOT NULL COMMENT 'Login name',
	`egrafi`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία εγγραφής',
	`onoma`		VARCHAR(128) NOT NULL COMMENT 'Πλήρες όνομα παίκτη',
	`email`		VARCHAR(128) NULL DEFAULT NULL COMMENT 'e-mail address',

	-- Το password αποθηκεύεται σε SHA1 κρυπτογραφημένη μορφή.

	`kodikos`	CHARACTER(40) COLLATE utf8_bin NOT NULL COMMENT 'Password',

	PRIMARY KEY (
		`login`
	) USING BTREE
)

COMMENT = 'Πίνακας παικτών'
;

-- Στον πίνακα "peparam" κρατάμε στοιχεία και χαρακτηριστικά που αφορούν στους χρήστες,
-- π.χ. αν ο παίκτης είναι επόπτης πρέπει να βρούμε μια παράμετρο με κλειδί τη
-- λέξη "ΑΞΙΩΜΑ" και τιμή "ΕΠΟΠΤΗΣ", αν κάποιος χρήστης έχει επιλέξει ως background
-- το "tetragona.jpg" θα πρέπει να υπάρχει παράμετρος με κλειδί τη λέξη "ΠΑΡΑΣΚΗΝΙΟ"
-- και τιμή "tetragona.jpg" κλπ.
--
--	ΑΞΙΩΜΑ		ΘΑΜΩΝΑΣ
--			VIP
--			ΕΠΟΠΤΗΣ
--			ΔΙΑΧΕΙΡΙΣΤΗΣ
--			ADMINISTRATOR
--			ΠΡΟΕΔΡΟΣ
--
--	ΚΑΤΑΣΤΑΣΗ	ΔΙΑΘΕΣΙΜΟΣ
--			ΑΠΑΣΧΟΛΗΜΕΝΟΣ
--
--	ΑΓΑΠΗΜΕΝΟ	ΒΙΔΑ
--			ΜΠΟΥΡΛΟΤΟ
--
--	ΤΡΑΠΟΥΛΑ	jfitz
--			knoll
--			classic
--			nicubunu
--			aguilar
--			ilias
--
--	ΠΛΑΤΗ		ΜΠΛΕ
--			ΚΟΚΚΙΝΟ
--			ΤΥΧΑΙΟ
--
--	ΠΑΡΑΣΚΗΝΙΟ	standard.png
--			any filename in "images/paraskinio"
--
--	DEVELOPER	ΟΧΙ
--			ΝΑΙ
--
-- Ακολουθεί ανάλυση κάποιων παραμέτρων.
--
-- DEVELOPER
-- ---------
-- Η παράμετρος "DEVELOPER" τίθεται στους προγραμματιστές που αναπτύσσουν και
-- συντηρούν το πρόγραμμα. Με αυτήν την παράμετρο ενεργοποιούνται διάφορες
-- λειτουργίες που είναι χρήσιμες στους προγραμματιστές, π.χ. πλήκτρο για τον
-- έλεγχο των διαρροών μνήμης.

CREATE TABLE `peparam` (
	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Παίκτης',
	`param`		VARCHAR(32) NOT NULL COMMENT 'Παράμετρος',
	`timi`		TEXT(32768) NOT NULL COMMENT 'Τιμή παραμέτρου',

	PRIMARY KEY (
		`pektis`,
		`param`
	) USING BTREE
)

COMMENT = 'Παράμετροι παικτών'
;

-- Στον πίνακα "profinfo" περιέχονται πληροφορίες που αφορούν τους παίκτες.
-- Το πεδίο "pektis" είναι ο παίκτης στον οποίο αφορά η πληροφορία, ενώ το
-- πεδίο "sxoliastis" είναι ο συντάκτης.
--
-- Οι πληροφορία που δίνει ο παίκτης για τον εαυτό του είναι δημόσια, ενώ
-- όλες οι υπόλοιπες πληροφορίες είναι προσβάσιμες μόνο από τον εκάστοτε
-- σχολιαστή.

CREATE TABLE `profinfo` (
	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Παίκτης',
	`sxoliastis`	VARCHAR(64) NOT NULL COMMENT 'Σχολιαστής',
	`kimeno`	TEXT(32768) NOT NULL COMMENT 'Κείμενο παρατήρησης',

	PRIMARY KEY (
		`pektis`,
		`sxoliastis`
	) USING BTREE,

	INDEX (
		`sxoliastis`
	) USING HASH
)

COMMENT = 'Πίνακας πληροφοριών προφίλ παίκτη'
;

-- Ο πίνακας "sxesi" περιέχει τις σχέσεις μεταξύ των παικτών. Η πληροφορία είναι
-- προσβάσιμη μόνο από τον παίκτη που καθορίζει τη σχέση.

CREATE TABLE `sxesi` (
	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Login name του παίκτη',
	`sxetizomenos`	VARCHAR(64) NOT NULL COMMENT 'Login name του σχετιζόμενου παίκτη',

	-- Η σχέση "ΤΑΙΡΙ" είναι υπερσχέση της σχέσης "ΦΙΛΟΣ" με επιπλέον το ταίριαγμα σε
	-- απέναντι θέσεις του τραπεζιού.

	`sxesi`	ENUM(
		'ΤΑΙΡΙ',
		'ΦΙΛΟΣ',
		'ΑΠΟΚΛΕΙΣΜΕΝΟΣ'
	) NOT NULL COMMENT 'Είδος σχέσης',

	`pote`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία δημιουργίας',

	PRIMARY KEY (
		`pektis`,
		`sxetizomenos`
	) USING BTREE,

	INDEX (
		`sxetizomenos`
	) USING HASH
)

COMMENT = 'Πίνακας σχέσεων'
;

-- Ο πίνακας "minima" περιέχει την αλληλογραφία των παικτών. Πράγματι, οι παίκτες,
-- εκτός από την άμεση επικοινωνία μέσω του chat, μπορούν να επικοινωνούν και με
-- προσωπικά μηνύματα τα οποία αποστέλλουν ο ένας στον άλλον.

CREATE TABLE `minima` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`apostoleas`	VARCHAR(64) NOT NULL COMMENT 'Αποστολέας',
	`paraliptis`	VARCHAR(64) NOT NULL COMMENT 'Παραλήπτης',
	`kimeno`	TEXT(32768) NOT NULL COMMENT 'Κείμενο μηνύματος',
	`pote`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία αποστολής',
	`status`	ENUM(
		'ΑΔΙΑΒΑΣΤΟ',
		'ΔΙΑΒΑΣΜΕΝΟ'
	) NOT NULL DEFAULT 'ΑΔΙΑΒΑΣΤΟ' COMMENT 'Κατάσταση μηνύματος',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`apostoleas`
	) USING HASH,

	INDEX (
		`paraliptis`
	) USING HASH
)

COMMENT = 'Πίνακας μηνυμάτων αλληλογραφίας'
;

-- Ο πίνακας "diataxi" περιέχει τις διατάξεις περιοχών σελίδας που δημιουργούν και
-- αποθηκεύουν οι χρήστες.

CREATE TABLE `diataxi` (
	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Παίκτης',
	`taxinomisi`	INTEGER(2) UNSIGNED NOT NULL COMMENT 'Κωδικός ταξινόμησης',
	`onomasia`	VARCHAR(128) NOT NULL COMMENT 'Ονομασία',
	`data`		VARCHAR(256) NOT NULL COMMENT 'Δεδομένα διάταξης',

	INDEX (
		`pektis`
	) USING HASH
)

COMMENT = 'Πίνακας διατάξεων περιοχών σελίδας'
;

-- Ο πίνακας "kafenio" περιέχει τα καφενεία της εφαρμογής. Κάθε καφενείο περιέχει τραπέζια
-- και θαμώνες και έχει τη δική του συζήτηση.

CREATE TABLE `kafenio` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`onomasia`	VARCHAR(128) NOT NULL DEFAULT '' COMMENT 'Ονομασία καφενείου',
	`dimiourgos`	VARCHAR(64) NULL DEFAULT NULL COMMENT 'Login name δημιουργού',
	`enarxi`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία δημιουργίας',
	`idiotikotita`	ENUM(
		'ΔΗΜΟΣΙΟ',
		'ΠΡΙΒΕ'
	) NOT NULL DEFAULT 'ΔΗΜΟΣΙΟ' COMMENT 'Καθεστώς ιδιωτικότητας',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`dimiourgos`
	) USING HASH
)

COMMENT = 'Πίνακας καφενείων'
;

-- Ο πίνακας "diapiste" περιέχει διαπιστευτήρια για πριβέ καφενεία. Πράγματι, για να
-- εισέλθει κάποιος παίκτης σε πριβέ καφενείο πρέπει να είναι ο δημιουργός τού καφενείου,
-- ή να διαθέτει διαπιστευτήρια. Διαπιστεύσεις για πριβέ καφενείο μπορεί να κάνει μόνον
-- ο δημιουργός τού καφενείου.

CREATE TABLE `diapiste` (
	`kafenio`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Κωδικός καφενείου',
	`pektis`	VARCHAR(64) NULL DEFAULT NULL COMMENT 'Login name διαπιστευμένου',
	`epidosi`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία διαπίστευσης',

	PRIMARY KEY (
		`kafenio`,
		`pektis`
	) USING BTREE,

	INDEX (
		`pektis`
	) USING HASH
)

COMMENT = 'Πίνακας διαπιστευτηρίων'
;

-- Ο πίνακας "trapezi" είναι ο σημαντικότερος πίνακας της εφαρμογής μετά τον πίνακα
-- "pektis". Ο πίνακας περιέχει όλα τα ενεργά τραπέζια καθώς και όλα τα τραπέζια που
-- δημιουργήθηκαν κατά καιρούς και στα οποία μοιράστηκε έστω μια διανομή. Το πεδίο
-- "arxio" είναι πολύ σημαντικό και δείχνει ποια από τα τραπέζια είναι ενεργά και
-- ποια έχουν αρχειοθετηθεί. Τα τραπέζια στα οποία το πεδίο "arxio" είναι null είναι
-- ενεργά, ενώ στα τραπέζια που το πεδίο είναι συμπληρωμένο δείχνει τη στιγμή της
-- αρχειοθέτησής τους, δηλαδή τη στιγμή που και ο τελευταίος παίκτης του τραπεζιού
-- εγκατέλειψε το τραπέζι.
--
-- Τα τραπέζια μπορούν, όμως, να αρχειοθετηθούν ακόμη και όταν υπάρχουν παίκτες
-- εφόσον έχει περάσει αρκετός χρόνος χωρίς κάποιος παίκτης του τραπεζιού να έχει
-- επαφή με τον server.

CREATE TABLE `trapezi` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`kafenio`	INTEGER(10) NULL NOT NULL COMMENT 'Κωδικός καφενείου',
	`stisimo`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε δημιουργήθηκε',
	`poll`		TIMESTAMP NOT NULL COMMENT 'Last poll time',
	`arxio`		TIMESTAMP NULL DEFAULT NULL COMMENT 'Αρχειοθέτηση τραπεζιού',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`kafenio`
	) USING HASH,

	INDEX (
		`arxio`
	) USING BTREE
)

COMMENT = 'Πίνακας τραπεζιών'
;

-- Ο πίνακας "sinthesi" δείχνει τους παίκτες του τραπεζιού. Για κάθε τραπέζι ΠΡΕΠΕΙ
-- να υπάρχουν ΑΚΡΙΒΩΣ 4 εγγραφές με αριθμούς 1, 2, 3, 4, με τον δημιουργό αρχικά στη
-- θέση 1.

CREATE TABLE `sinthesi` (
	`trapezi`	INTEGER(10) UNSIGNED NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`thesi`		INTEGER(1) NOT NULL COMMENT 'Θέση παίκτη/θεατή',
	`pektis`	VARCHAR(64) NULL DEFAULT NULL COMMENT 'Login name παίκτη',

	-- Το πεδίο "apodoxi" δείχνει αν ο παίκτης στη συγκεκριμένη θέση έχει αποδεχθεί
	-- τους όρους της παρτίδας και είναι έτοιμος για την εκκίνηση της παρτίδας.

	`apodoxi`	ENUM(
		'ΝΑΙ',
		'ΟΧΙ'
	) NOT NULL DEFAULT 'ΟΧΙ' COMMENT 'Αποδοχή όρων παρτίδας',

	-- Όταν ο παίκτης εξέρχεται από το τραπέζι δεν εκκενώνουμε τη θέση, παρά θέτουμε
	-- το πεδίο "exodos" στη χρονική στιγμή εξόδου. Ουσιαστικά η θέση θεωρείται κενή
	-- όταν το πεδίο "exodos" είναι συμπληρωμένο.

	`exodos`	TIMESTAMP NULL DEFAULT NULL COMMENT 'Χρονική στιγμή εξόδου από το τραπέζι',

	PRIMARY KEY (
		`trapezi`,
		`thesi`
	) USING BTREE,

	INDEX (
		`pektis`
	) USING HASH
)

COMMENT = 'Παίκτες τραπεζιού'
;

-- Ο πίνακας "simetoxi" δείχνει τους νυν και πρώην συμμετέχοντες παίκτες και θεατές
-- στο τραπέζι. Ουσιαστικά κρατάμε σε ποια θέση συμμετέχει ο παίκτης/θεατής την
-- τελευταία φορά που επισκέφθηκε το τραπέζι.
--
-- Ο πίνακας είναι πρόχειρος και κρατάει στοιχεία μόνο για τα ενεργά τραπέζια. Αυτός
-- είναι ο λόγος που δεν έχουμε hard links.

CREATE TABLE `simetoxi` (
	`trapezi`	INTEGER(10) UNSIGNED NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`pektis`	VARCHAR(64) NULL DEFAULT NULL COMMENT 'Login name παίκτη/θεατή',
	`thesi`		INTEGER(1) NOT NULL COMMENT 'Θέση παίκτη/θεατή',
	`idiotita`	ENUM(
		'ΠΑΙΚΤΗΣ',
		'ΘΕΑΤΗΣ'
	) NULL DEFAULT NULL COMMENT 'Τρόπος συμμετοχής στο τραπέζι',

	PRIMARY KEY (
		`trapezi`,
		`pektis`
	) USING BTREE
)

COMMENT = 'Συμμετέχοντες παίκτες/θεατές τραπεζιού'
;

-- Στον πίνακα "trparam" κρατάμε στοιχεία και χαρακτηριστικά που αφορούν στο
-- τραπέζι και στην παρτίδα που εξελίσσεται στο τραπέζι, π.χ. αν το τραπέζι
-- είναι δημόσιο ή πριβέ, κλειστό ή ανοικτό κλπ.
--
--	ΒΙΔΑ		ΝΑΙ
--			ΟΧΙ
--
--	ΛΗΞΗ		3551 (βίδα)
--			1551 (μπουρλότο)
--
--	ΠΡΙΒΕ		ΟΧΙ
--			ΝΑΙ
--
--	ΑΝΟΙΚΤΟ		ΝΑΙ
--			ΟΧΙ
--
--	ΦΙΛΙΚΗ		ΟΧΙ
--			ΝΑΙ
--
--	ΕΠΕΤΕΙΑΚΗ	ΟΧΙ
--			ΝΑΙ
--
--	ΙΔΙΟΚΤΗΤΟ	ΟΧΙ
--			ΝΑΙ
--
--	ΑΟΡΑΤΟ		ΟΧΙ
--			ΝΑΙ
--
-- ΑΟΡΑΤΟ
-- ------
-- Η παράμετρος "ΑΟΡΑΤΟ" δείχνει αν το τραπέζι είναι αόρατο. Τα αόρατα τραπέζια
-- δεν εμφανίζονται στο καφενείο, οπότε ο μόνος τρόπος να τα προσπελάσει κανείς
-- είναι μέσω προσκλήσεως. Αν υπάρχουν θεατές στο τραπέζι τότε και οι θεατές τού
-- τραπεζιού καθίστανται αόρατοι.
--
-- ΙΔΙΟΚΤΗΤΟ
-- ---------
-- Η παράμετρος "ΙΔΙΟΚΤΗΤΟ" δείχνει αν το τραπέζι είναι ιδιόκτητο ή όχι. Αν το
-- τραπέζι είναι ιδιόκτητο, τότε μόνο ο δημιουργός μπορεί να θέσει ή να αλλάξει
-- διάφορες παραμέτρους του τραπεζιού. Επίσης, είναι ο μόνος που μπορεί να
-- προσκαλέσει η να αποκλείσει θεατές και συμπαίκτες, με λίγα λόγια στα
-- ιδιόκτητα τραπέζια ο δημιουργός είναι ο απόλυτος κυρίαρχος των παραμέτρων
-- του παιχνιδιού. Δημιουργός θεωρείται ο παίκτης που βρίσκεται στη θέση 1.
--
-- ΠΡΙΒΕ
-- -----
-- Η παράμετρος "ΠΡΙΒΕ" αφορά στην πρόσβαση των υπολοίπων παικτών στο
-- τραπέζι. Αν το τραπέζι είναι δημόσιο, τότε οποιοσδήποτε μπορεί να εισέλθει
-- ως θεατής στο τραπέζι, ενώ αν είναι πριβέ, τότε απαιτείται πρόσκληση.
-- Για συμμετοχή στο παιχνίδι, ή στη συζήτηση του τραπεζιού, απαιτείται
-- πρόσκληση είτε το τραπέζι είναι δημόσιο, είτε όχι.
--
-- ΑΝΟΙΚΤΟ
-- -------
-- Η παράμετρος "ΑΝΟΙΚΤΟ" αφορά στο δικαίωμα των θεατών να βλέπουν τα φύλλα
-- των παικτών.

CREATE TABLE `trparam` (
	`trapezi`	INTEGER(10) UNSIGNED NOT NULL COMMENT 'Τραπέζι',
	`param`		VARCHAR(32) NOT NULL COMMENT 'Παράμετρος',
	`timi`		TEXT(32768) NOT NULL COMMENT 'Τιμή παραμέτρου',

	PRIMARY KEY (
		`trapezi`,
		`param`
	) USING BTREE
)

COMMENT = 'Παράμετροι τραπεζιών'
;

-- Ο πίνακας προσκλήσεων περιέχει τις προσκλήσεις που αποστέλλονται μεταξύ
-- των παικτών. Για να παίξει κάποιος παίκτης σε κάποιο τραπέζι πρέπει να
-- λάβει πρόσκληση από κάποιον από τους ήδη υπάρχοντες παίκτες.

CREATE TABLE `prosklisi` (
	`trapezi`	INTEGER(10) UNSIGNED NULL COMMENT 'Κωδικός τραπεζιού',
	`apo`		VARCHAR(64) NOT NULL COMMENT 'Οικοδεσπότης',
	`pros`		VARCHAR(64) NOT NULL COMMENT 'Προσκεκλημένος',
	`epidosi`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε επιδόθηκε',

	PRIMARY KEY (
		`trapezi`,
		`apo`,
		`pros`
	) USING BTREE,

	INDEX (
		`apo`
	) USING HASH,

	INDEX (
		`pros`
	) USING HASH
)

COMMENT='Πίνακας προσκλήσεων'
;

-- Ο πίνακας "sxolio" περιέχει όλα τα σχόλια των συζητήσεων που εξελίσσονται
-- δημόσια, σε καφενείο, ή σε κάποιο τραπέζι.

CREATE TABLE `sxolio` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Ομιλών παίκτης',
	`xoros`		ENUM(
		'LOBBY',
		'ΚΑΦΕΝΕΙΟ',
		'ΤΡΑΠΕΖΙ'
	) NOT NULL COMMENT 'Χώρος εξέλιξης συζήτησης',

	-- Το πεδίο "traka" δείχνει τον κωδικό καφενείου/τραπεζιού στο οποίο
	-- αφορά το εν λόγω σχόλιο συζήτησης. Αν είναι null σημαίνει δημόσια
	-- συζήτηση στο lobby.

	`traka`		INTEGER(10) UNSIGNED NULL DEFAULT NULL COMMENT 'Κωδικός τραπεζιού/καφενείου',

	`kimeno`	TEXT(32768) NOT NULL COMMENT 'Κείμενο σχολίου',
	`pote`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε ειπώθηκε',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`xoros`,
		`traka`
	) USING BTREE
)

COMMENT = 'Πίνακας συζητήσεων'
;

-- Με το παρόν κατασκευάζουμε τον πίνακα των διανομών. Κάθε τραπέζι έχει πολλές
-- διανομές που απαρτίζουν την παρτίδα που παίχτηκε στο τραπέζι και κάθε διανομή
-- έχει πολλές ενέργειες που είναι όλες οι κινήσεις που γίνονται στη διανομή:
-- μοίρασμα, δηλώσεις, αγορά κλπ. Η διανομή περιέχει ουσιαστικά τη θέση του παίκτη
-- που μοίρασε και τα οικονομικά στοιχεία της διανομής, δηλαδή τους πόντους της
-- κάθε ομάδας. Τα οικονομικά στοιχεία συμπληρώνονται, βεβαίως, κατά το τέλος
-- της διανομής.

CREATE TABLE `dianomi` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`trapezi`	INTEGER(10) UNSIGNED NOT NULL COMMENT 'Κωδικός τραπεζιού',
	`enarxi`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Μοίρασμα διανομής',

	-- Η θέση του παίκτη που μοιράζει. Παίρνει τιμές 1, 2, 3 και 4, κυκλικά
	-- και στην πρώτη διανομή τού τραπεζιού παίρνει την τιμή 1.

	`dealer`	INTEGER(1) NOT NULL COMMENT 'Ποιος μοιράζει',

	-- Τα πεδία "skor13" και "skor24" συμπληρώνονται με το τέλος της διανομής
	-- και περιέχουν τους πόντους που «έπιασε» η κάθε ομάδα.

	`skor13`	INTEGER(6) NOT NULL DEFAULT 0 COMMENT 'Σκορ πρώτης ομάδας',
	`skor24`	INTEGER(6) NOT NULL DEFAULT 0 COMMENT 'Σκορ δεύτερης ομάδας',
	`kremamena`	INTEGER(6) NOT NULL DEFAULT 0 COMMENT 'Κρεμάμενα',

	-- Το πεδίο "telos" είναι το timestamp του τέλους τής διανομής, δηλαδή τής
	-- στιγμής τής πληρωμής. Όσο το πεδίο "telos" παραμένει null, η διανομή
	-- βρίσκεται σε εξέλιξη.

	`telos`		TIMESTAMP NULL DEFAULT NULL COMMENT 'Τέλος διανομής',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`trapezi`
	) USING HASH
)

COMMENT = 'Πίνακας διανομών'
;

-- Ο πίνακας "energia" περιέχει τις ενέργειες που γίνονται στα τραπέζια. Κάθε ενέργεια
-- εντάσσεται στα πλαίσια μιας διανομής και κάθε διανομή εντάσσεται σε κάποιο τραπέζι.

CREATE TABLE `energia` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`dianomi`	INTEGER(10) UNSIGNED NOT NULL COMMENT 'Κωδικός διανομής',

	-- Η θέση του παίκτη που αφορά στη συγκεκριμένη ενέργεια, π.χ. σε ενέργεια
	-- τύπου "ΔΙΑΝΟΜΗ" είναι ο dealer, σε ενέργεια τύπου "ΑΓΟΡΑ" είναι ο
	-- τζογαδόρος κλπ.

	`pektis`	INTEGER(1) NOT NULL COMMENT 'Θέση παίκτη που εκτελεί την ενέργεια',

	`idos`	ENUM(
		'ΔΙΑΝΟΜΗ',
		'ΔΗΛΩΣΗ',
		'ΕΠΤΑΡΙ',
		'ΦΥΛΛΟ',
		'ΜΠΑΖΑ',
		'ΑΕΡΑΣ',
		'CLAIM',
		'ΠΑΡΑΙΤΗΣΗ'
	) NOT NULL COMMENT 'Είδος ενέργειας',

	-- Το πεδίο "data" περιέχει τα δεδομένα της ενέργειας και έχουν συγκεκριμένο
	-- συντακτικό και περιεχόμενο, ανάλογα με το είδος της ενέργειας, π.χ.
	-- σε είδος ενέργειας "ΔΙΑΝΟΜΗ" είναι τα φύλλα των παικτών 1, 2, 3 και 4
	-- με αυτή τη σειρά, επομένως πρόκειται για string 64 χαρακτήρων. Αν το
	-- είδος της ενέργειας είναι "ΔΗΛΩΣΗ", τότε τα δεδομένα της ενέργειας είναι
	-- το χρώμα της αγοράς συνοδευόμενο από τους πόντους, π.χ. "H120" που σημαίνει
	-- «120 κούπες», "C200" που σημαίνει «200 σπαθιά» κλπ.
	-- Ενέργειες τύπου "ΑΕΡΑΣ" παίρνουν τη μορφή "[345][SCDH][9TJQKA]", π.χ. "3C9"
	-- σημαίνει «τρίτη στο εννιά σπαθί», "4HK" σημαίνει «τετάρτη στο ρήγα κούπα»
	-- και "5DQ" σημαίνει «πέμπτη στην ντάμα καρό».
	-- Τα καρέ δηλώνονται με ενέργειες της μορφής "Q[9TJQKA]", π.χ. "QT" σημαίνει
	-- καρέ του δέκα, ενώ "QK" σημαίνει καρέ του ρήγα.
	-- Τέλος, το μπουρλότο δηλώνεται με "BL".
	--
	-- Παραθέτουμε δείγματα από διάφορα είδη ενεργειών:
	--
	--	ΔΙΑΝΟΜΗ		HKCKDAS9CQDJSTHTSACTHAC7C9S7H8SKC8CADTH7HJHQD9S8CJD7SJH9DQDKSQD8
	--	ΔΗΛΩΣΗ		D120
	--	ΦΥΛΛΟ		H9
	--	ΑΕΡΑΣ		4CK
	--	CLAIM
	--	ΑΚΥΡΩΣΗ
	--	ΠΛΗΡΩΜΗ		120:42

	`data`		VARCHAR(1024) NOT NULL COMMENT 'Δεδομένα ενέργειας',

	`pote`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Χρονική στιγμή',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`dianomi`
	) USING HASH
)

COMMENT ='Πίνακας ενεργειών'
;

-- Ο πίνακας "sizitisi" περιέχει όλα τα σχόλια των συζητήσεων που εξελίσσονται
-- στα τραπέζια, στα καφενεία, ή στο lobby.

CREATE TABLE `sizitisi` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Ομιλών παίκτης',
	`trapezi`	INTEGER(10) UNSIGNED NULL COMMENT 'Κωδικός τραπεζιού',
	`kafenio`	INTEGER(10) UNSIGNED NULL COMMENT 'Κωδικός καφενείου',

	`sxolio`	TEXT(32768) NOT NULL COMMENT 'Κείμενο σχολίου',
	`pote`		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Πότε ειπώθηκε',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE
)

COMMENT = 'Πίνακας συζητήσεων'
;

-- Ο πίνακας "sinedria" περιέχει τους ενεργούς παίκτες. Για κάθε χρήστη που εισέρχεται
-- στο καφενείο δημιουργείται ένα record συνεδρίας και με βάση το record αυτό γίνεται
-- η περαιτέρω επικοινωνία του χρήστη με τον server.
--
-- Όταν η συνεδρία λήξει, τότε αρχειοθετείται στον πίνακα "istoriko". Η λήξη μιας
-- συνεδρίας γίνεται είτε όταν ο παίκτης εξέλθει ρητά από το καφενείο, είτε όταν
-- περάσει αρκετός χρόνος χωρίς επαφή του χρήστη με τον server.

CREATE TABLE `sinedria` (
	-- Κάθε συνεδρία έχει ως πρωτεύον στοιχείο της το login name τού παίκτη,
	-- το οποίο μάλιστα χρησιμοποιείται ως primary key.

	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Παίκτης',

	-- Το πεδίο "klidi" είναι string 10 χαρακτήρων και δημιουργείται αυτόματα
	-- κατά την εισαγωγή του record στην database, δηλαδή με την είσοδο ή την
	-- εγγραφή του παίκτη. Το κλειδί αποθηκεύεται σε cookie και χρησιμοποιείται
	-- κατόπιν για την πιστοποίηση των κλήσεων Ajax προς τον Node server.

	`klidi`		CHARACTER(10) NOT NULL COMMENT 'Κλειδί πιστοποίησης',

	-- Στο πεδίο "IP" κρατάμε την IP του client από τον οποίο δημιουργήθηκε η
	-- συνεδρία. Όσον αφορά στο μέγεθος της IP, ειδωμένης ως character string
	-- και όχι ως bit sequence, το θέμα έχει περιπλακεί μετά την εισαγωγή τής
	-- IPv6. Σε διάφορα blogs αναφέρονται διάφορες τιμές για το σωστό μήκος
	-- μιας IP address, π.χ. 39, 45 κλπ, επομένως μια τιμή 64 χαρακτήρων πρέπει
	-- να με καλύπτει.

	`ip`		VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'IP address',

	`isodos`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Είσοδος',

	-- Το πεδίο "poll" δείχνει την τελευταία επαφή τού παίκτη με τον server στα
	-- πλαίσια της συγκεκριμένης συνεδρίας.

	`poll`		TIMESTAMP NOT NULL COMMENT 'Τελευταία επαφή',

	-- Τα παρακάτω στοιχεία ονομάζονται στοιχεία θέσης. Πρόκειται για το τρέχον
	-- καφενείο στο οποίο είναι τοποθετημένος ο παίκτης, το τραπέζι του παίκτη/θεατή,
	-- η θέση στην οποία παίζει/παρακολουθεί και για το αν συμμετέχει ως παίκτης
	-- ή ως θεατής.

	`kafenio`	INTEGER(10) UNSIGNED NULL DEFAULT NULL COMMENT 'Τρέχον καφενείο παίκτη',
	`trapezi`	INTEGER(10) UNSIGNED NULL DEFAULT NULL COMMENT 'Τρέχον τραπέζι παίκτη',
	`thesi`		INTEGER(1) NULL DEFAULT NULL COMMENT 'Θέση παίκτη/θεατή',
	`simetoxi`	ENUM(
		'ΠΑΙΚΤΗΣ',
		'ΘΕΑΤΗΣ'
	) NULL DEFAULT NULL COMMENT 'Τρόπος συμμετοχής σε τραπέζι',

	PRIMARY KEY (
		`pektis`
	) USING BTREE,

	INDEX (
		`kafenio`
	) USING HASH,

	INDEX (
		`trapezi`
	) USING HASH
)

COMMENT = 'Πίνακας συνεδριών'
;

-- Ο πίνακας "istoriko" αρχειοθετεί τις συνεδρίες που κλείνουν.

CREATE TABLE `istoriko` (
	`kodikos`	INTEGER(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Παίκτης',
	`ip`		VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'IP address',
	`isodos`	TIMESTAMP NOT NULL COMMENT 'Είσοδος',
	`exodos`	TIMESTAMP NOT NULL COMMENT 'Έξοδος',

	PRIMARY KEY (
		`kodikos`
	) USING BTREE,

	INDEX (
		`pektis`
	) USING HASH
)

COMMENT ='Πίνακας συνεδριών (αρχείο)'
;

-- Ο πίνακας "isfora" περιέχει τις εισφορές που κάνουν οι παίκτες για τα
-- έξοδα του server.

CREATE TABLE `isfora` (
	`pektis`	VARCHAR(64) NOT NULL COMMENT 'Παίκτης',
	`imerominia`	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Ημερομηνία καταβολής',

	-- Το ποσό της εισφοράς δίδεται σε λεπτά, π.χ. 50 ευρώ γράφεται 5000,
	-- 40.50 ευρώ γράφεται 4050 κοκ.

	`poso`		NUMERIC(6) NOT NULL COMMENT 'Ποσό',

	INDEX (
		`pektis`
	) USING HASH,

	INDEX (
		`imerominia`
	) USING BTREE
)

COMMENT ='Πίνακας εισφορών'
;

\! echo "tables created!"

\! echo "creating relations…"

-- Στο παρόν παρατίθενται όλα τα foreign keys, δηλαδή οι συσχετίσεις
-- μεταξύ των πινάκων τής database.

-- Πίνακας παραμέτρων παίκτη ("peparam")

ALTER TABLE `peparam` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας πληροφοριών προφίλ ("profinfo")

ALTER TABLE `profinfo` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `profinfo` ADD FOREIGN KEY (
	`sxoliastis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας σχέσεων ("sxesi")

ALTER TABLE `sxesi` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `sxesi` ADD FOREIGN KEY (
	`sxetizomenos`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας μηνυμάτων ("minima")

ALTER TABLE `minima` ADD FOREIGN KEY (
	`apostoleas`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `minima` ADD FOREIGN KEY (
	`paraliptis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας διατάξεων περιοχών σελίδας ("diataxi")

ALTER TABLE `diataxi` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας διαπιστευτηρίων ("diapiste")

ALTER TABLE `diapiste` ADD FOREIGN KEY (
	`kafenio`
) REFERENCES `kafenio` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `diapiste` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας σύνθεσης τραπεζιών ("sinthesi")

ALTER TABLE `sinthesi` ADD FOREIGN KEY (
	`trapezi`
) REFERENCES `trapezi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `sinthesi` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE
;

-- Πίνακας παραμέτρων τραπεζιού ("trparam")

ALTER TABLE `trparam` ADD FOREIGN KEY (
	`trapezi`
) REFERENCES `trapezi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας προσκλήσεων ("prosklisi")

ALTER TABLE `prosklisi` ADD FOREIGN KEY (
	`trapezi`
) REFERENCES `trapezi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `prosklisi` ADD FOREIGN KEY (
	`apo`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `prosklisi` ADD FOREIGN KEY (
	`pros`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας διανομών ("dianomi")

ALTER TABLE `dianomi` ADD FOREIGN KEY (
	`trapezi`
) REFERENCES `trapezi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας ενεργειών ("energia")

ALTER TABLE `energia` ADD FOREIGN KEY (
	`dianomi`
) REFERENCES `dianomi` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας συνεδριών ("sinedria")

ALTER TABLE `sinedria` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `sinedria` ADD FOREIGN KEY (
	`kafenio`
) REFERENCES `kafenio` (
	`kodikos`
) ON UPDATE CASCADE
;

ALTER TABLE `sinedria` ADD FOREIGN KEY (
	`trapezi`
) REFERENCES `trapezi` (
	`kodikos`
) ON UPDATE CASCADE
;

-- Ιστορικό συνεδριών ("istoriko")

ALTER TABLE `istoriko` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

-- Πίνακας εισφορών ("isfora")

ALTER TABLE `isfora` ADD FOREIGN KEY (
	`pektis`
) REFERENCES `pektis` (
	`login`
) ON UPDATE CASCADE ON DELETE CASCADE
;

\! echo "database relations created!"

\! echo "creating triggers…"

DELIMITER //
CREATE TRIGGER `neo_trapezi` BEFORE INSERT ON `trapezi`
FOR EACH ROW
BEGIN
	IF (NEW.`poll` < NEW.`stisimo`) THEN
		SET NEW.`poll` = NEW.`stisimo`;
	END IF;
END;//
DELIMITER ;

DELIMITER //
CREATE TRIGGER `nea_sinedria` BEFORE INSERT ON `sinedria`
FOR EACH ROW
BEGIN
	IF (NEW.`poll` < NEW.`isodos`) THEN
		SET NEW.`poll` = NEW.`isodos`;
	END IF;
END;//
DELIMITER ;

DELIMITER //
CREATE TRIGGER `neo_istoriko` BEFORE INSERT ON `istoriko`
FOR EACH ROW
BEGIN
	SET NEW.`exodos` = NOW();
END;//
DELIMITER ;

\! echo "database triggers created!"

\! echo "creating views…"

-- Το view "partida" περιλαμβάνει τα ενεργά τραπέζια, δηλαδή τις παρτίδες
-- που βρίσκονται σε εξέλιξη.

CREATE VIEW `partida` AS SELECT *
FROM `trapezi`
WHERE `arxio` IS NULL
ORDER BY `kodikos` DESC
;

\! echo "views created!"

-- Επαναφέρουμε την προσωρινή ακύρωση του foreign key check.

SET FOREIGN_KEY_CHECKS = 1;
