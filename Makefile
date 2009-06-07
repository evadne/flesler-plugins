SUBDIRS=${shell ls -1p | fgrep /}

%:
	for dir in $(SUBDIRS); do \
		(cd $$dir && make $@) \
	done

.PHONY: %