VER=1.2.2

SO_NAME=jquery.scrollTo
SO_ROOT=../$(SO_NAME)
SO_SRC=$(SO_NAME).js
SO_MIN=$(SO_NAME)-min.js

ZIP_FILES=$(SO_SRC) $(SO_MIN)

include ../common.mak

$(SO_SRC):
	cp $(SO_ROOT)/$@ $@

$(SO_MIN):
	cd $(SO_ROOT) && make min
	cp $(SO_ROOT)/$@ $@
	
cmdclean += rm -f $(SO_SRC) $(SO_MIN);