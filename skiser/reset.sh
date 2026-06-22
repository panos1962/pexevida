#!/usr/bin/env bash

# Το παρόν script χρησιμοποιείται σε καταστάσεις έκτακτης ανάγκης, όπου
# έχει «πέσει» ο server σκηνικού και το site δεν λειτουργεί. Σε τέτοιες
# περιπτώσεις, συνήθως, η δυσλειτουργία του server σκηνικού οφείλεται σε
# κάποια ενέργεια (κίνηση) την οποία ο server σκηνικού δεν κατάφερε να
# διαχειριστεί με τον προσήκοντα τρόπο· είναι καταστάσεις που θυμίζουν
# το panic στα παλαιά UNIX συστήματα.
#
# Στις περιπτώσεις, λοιπόν, όπου έχει πάψει να λειτουργεί ο server σκηνικού,
# μπορούμε να τον επανεκκινήσουμε, ωστόσο είναι πολύ πιθανόν κάποια από τις
# τελευταίες κινήσεις να έχει προκαλέσει το πρόβλημα, οπότε η λειτουργία τού
# server σκηνικού θα επαναδιακοπεί. Για να είμαστε σίγουροι ότι ο server
# σκηνικού θα επανεκκινήσει σωστά, μπορούμε να διαγράψουμε όλες τις
# παρτίδες και τις τρέχουσες συνεδρίες, και κατόπιν να επανεκκινήσουμε
# τον server σκηνικού σε ένα «καθαρό» τοπίο.
#
# Το πρόγραμμα μπορεί να «τρέξει» είτε απευθείας σε κάποιο interactive
# shell session, είτε εξ αποστάσεως με αίτημα μέσω διαδικτύου. Το αίτημα,
# τη στιγμή που γράφονται αυτές οι γραμμές είναι:
#
#	http://opasopa.gr/vida/reset?code=XXXX
#
# Εναλλακτικά, μπορούμε από απομεμακρυσμένο shell session να δώσουμε την
# εντολή:
#
#	curl 'http://opasopa.gr/reset/index.php?code=XXXX'
#
# όπου "XXXX" είναι κάποιος κωδικός που έχει δοθεί σε πρόσωπα εμπιστοσύνης
# τα οποία μπορούν να επανεκκινήσουν τον server. Οι εν λόγω κωδικοί είναι
# καταγεγραμμένοι στο αρχείο "misc/.mistiko/reset.codes". Πιο συγκεκριμένα,
# σε αυτό το αρχείο έχουμε μία γραμμή για κάθε δεκτό κωδικό, όπου ο κωδικός
# είναι το πρώτο πεδίο (λέξη) της γραμμής, ενώ όλα τα υπόλοιπα πεδία μπορούν
# να χρησιμοποιηθούν για την καταγραφή της επανεκκίνησης· στο ίδιο αρχείο
# μπορούμε να γράψουμε και σχόλια που είναι γραμμές που εκκινούν με "#".

progname=`basename "${0}"`

[ -z "${PEXEVIDA_BASEDIR}" ] &&
export PEXEVIDA_BASEDIR="/var/opt/pexevida"

lockdir="${PEXEVIDA_BASEDIR}/misc/reset.lck"

cleanup() {
	[ -d "${lockdir}" ] && rmdir "${lockdir}"
}

minima() {
	echo "$@"
	[ -t 1 -a -t 2 ] || echo "$@" >&2
}

fatal() {
	minima "$@"
	exit 2
}

cd "${PEXEVIDA_BASEDIR}" ||
fatal "${progname}: ${PEXEVIDA_BASEDIR}: invalid directory"

if [ -x /usr/bin/node ]; then
	node="node"
elif [ -x /usr/bin/nodejs ]; then
	node="nodejs"
else
	fatal "${progname}: node/nodejs not found"
fi

mkdir "${lockdir}" 2>/dev/null || {
	echo "${progname}: reset is running" >&2
	echo "Κάποιος έχει ήδη εκκινήσει τη διαδικασία επαναφοράς"
	exit 2
}

trap "trap 0; cleanup; exit 2" 0 1 2 3 15

nodetag="$(basename ${PEXEVIDA_BASEDIR})"
codefile="${PEXEVIDA_BASEDIR}/misc/.mistiko/reset.codes"

case $# in
1)
	;;
*)
	fatal "${0} { reset_code }"
esac

pektis="$(awk -v code="${1}" 'NF < 1 {
	next
}
$1 == "#" {
	next
}
$1 == code {
	found = 1
	print $2
	exit(0)
}
END {
	if (found)
	exit(0)

	else
	exit(1)
}' "${codefile}")"  || fatal "invalid reset code"

skiserPid() {
	ps -fC ${node} | awk '$NF == "'${nodetag}'" { print $2 + 0 }'
}

pid="$(skiserPid)"

[ -n "${pid}" ] && {
	echo "${progname}: skiser is active (pid: ${pid})" >&2
	echo "Ο server σκηνικού δείχνει ενεργός (process id: ${pid})"
	exit 2
}

# Από εδώ και κάτω πρέπει να κάνουμε reset την database και να
# επανεκκινήσουμε τον server σκηνικού.

export MYSQL_PWD="$(sed 's;[^a-zA-Z0-9];;g' misc/.mistiko/bekadb)"

if [ -n "${pektis}" ]; then
	minima="Player \"${pektis}\" restarted the server."
else
	minima="Server restarted."
fi

sed 's/__minima__/'"${minima}"'/' "${PEXEVIDA_BASEDIR}/skiser/reset.sql" |\
mysql -u pexevida pexevida ||
fatal "SQL failed"

skiser/skiser.sh restart
ret="$?"

cleanup
exit $ret
