all:
	@(cd client/common && make -s)
	@(cd client/lib && make -s)
	@(cd client/arena && make -s)

check:
	@find . -name '*.min.js' -type f -print

cleanup:
	@find . -name '*.min.js' -type f -print -exec rm {} \;

init:
	@[ -d skiser/log ] || mkdir skiser/log
	@[ -d client/photo ] || (cd client && ../misc/mkphotodir.awk)
