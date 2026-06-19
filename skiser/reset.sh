#!/usr/bin/env bash

progname=`basename "${0}"`

if [ -x /usr/bin/node ]; then
	node="node"
elif [ -x /usr/bin/nodejs ]; then
	node="nodejs"
else
	echo "${progname}: node/nodejs not found"
	exit 2
fi

cd ../..
basedir="$(pwd)"
nodetag="$(basename ${basedir})"

cd "${basedir}/skiser" 2>/dev/null || {
	echo "${progname}: ${basedir}: invalid directory"
	exit 2
}

case $# in
1)
	;;
*)
	echo "${0} { reset_code }" >&2
	exit 1
esac

case "${1}" in
6973945456)
	;;
*)
	echo "invalid reset code"
	exit 2
esac

skiserPid() {
	ps -fC ${node} | awk '$NF == "'${nodetag}'" { print $2 + 0 }'
}

pid="$(skiserPid)"

if [ -n "${pid}" ]; then
	echo "${progname}: skiser is runing (${pid})"
	exit 2
fi

# Από εδώ και κάτω πρέπει να κάνουμε reset την database και να
# επανεκκινήσουμε τον server σκηνικού.
