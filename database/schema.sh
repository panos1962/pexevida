#!/usr/bin/env bash

progname=`basename $0`

usage() {
	echo "usage: ${progname} [ -d database ] [ -e { INNODB | TOKUDB } ] [ file... ]" >&2
	exit 1
}

dbname="pexevida"
engine="INNODB"
err=

while getopts ":d:e:" opt
do
	case "${opt}" in
	d)
		dbname="${OPTARG}"
		;;
	e)
		engine="${OPTARG}"
		;;
	\?)
		usage
		;;
	esac
done

case "${dbname}" in
pexevida)
	;;
*)
	echo "${progname}: ${dbname}: invalid database name" >&2
	err="yes"
	;;
esac

case "${engine}" in
INNODB)
	;;
TOKUDB)
	;;
*)
	echo "${progname}: ${engine}: invalid storage engine" >&2
	err="yes"
	;;
esac

[ -n "${err}" ] && exit 2

shift `expr "${OPTIND}" - 1`

sed "s/__DATABASE__/${dbname}/g
s/__ENGINE__/${engine}/g
/^--/d" $*
