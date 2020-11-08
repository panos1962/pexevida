%.min.js : %.js
	@echo "common/$@: JS compression"
	@yui-compressor --verbose --line-break 70 --charset UTF-8 -o $@ $<

all: \
	globals.min.js \
	kinisi.min.js \
	vida.min.js \
	skiniko.min.js \
	partida.min.js \
	pliromi.min.js \
	energia.min.js

cleanup:
	@rm -f *.min.js
