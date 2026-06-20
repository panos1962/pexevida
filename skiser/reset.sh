#!/usr/bin/env bash

progname=`basename "${0}"`

minima() {
	echo "$@"
	[ -t 1 -a -t 2 ] || echo "$@" >&2
}

fatal() {
	minima "$@"
	exit 2
}

if [ -x /usr/bin/node ]; then
	node="node"
elif [ -x /usr/bin/nodejs ]; then
	node="nodejs"
else
	fatal "${progname}: node/nodejs not found"
fi

[ -z "${PEXEVIDA_BASEDIR}" ] &&
export PEXEVIDA_BASEDIR="/var/opt/pexevida"

cd "${PEXEVIDA_BASEDIR}" 2>/dev/null ||
fatal "${progname}: ${PEXEVIDA_BASEDIR}: invalid directory"

basedir="$(pwd)"
nodetag="$(basename ${basedir})"
codefile="${basedir}/misc/.mistiko/reset.codes"

case $# in
1)
	;;
*)
	fatal "${0} { reset_code }"
esac

awk -v code="${1}" '$1 == code {
	found = 1
	exit(0)
}
END {
	if (found)
	exit(0)

	else
	exit(1)
}' "${codefile}"  || fatal "invalid reset code"

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

mysql -u pexevida pexevida <skiser/reset.sql ||
fatal "SQL failed"

exec skiser/skiser.sh restart
