# Makefile to build all plugins
# Author: Ariel Flesler
# --
# Runs on a linux-based enviroment (Cygwin can be used on Windows).
# In order to minify, it requires the YUI compressor.
# You must set the $YUI enviroment variable with the jar's path.

NAME=${shell basename $(value PWD)}
VER?=unversioned

SRC=$(NAME).js
MIN=$(NAME)-min.js

VER_NAME=$(NAME)-$(VER)

SRCV=$(VER_NAME).js
MINV=$(VER_NAME)-min.js

ZIP=$(VER_NAME).zip
ZIP_FILES += $(SRC) $(MIN) changes.txt

all: deploy

# Deploy Files

$(ZIP): $(ZIP_FILES)
	zip -r9 $(ZIP) $(ZIP_FILES)

zip:$(ZIP)

deploy:$(ZIP) $(SRCV) $(MINV)
	
# Source File
# $(SRC) is not .PHONY so you need to do make -B to make it run
$(SRC):
	$(add-version) -i $(SRC)
	$(add-date) -i $(SRC)

src:$(SRC)

$(SRCV):$(SRC)
	cp $(SRC) $(SRCV)

# Minified File

$(MIN):$(SRC)
	java -jar $(YUI) $(SRC) -o $(MIN)

min: $(MIN)
	
$(MINV):$(MIN)
	cp $(MIN) $(MINV)	

# ---Replacements--- #

# Version
define add-version
sed -e 's/^\(.*@version \)[0-9a-z.]\+\(.*\)$|/\1$(VER)\2/'
endef

# Date
TODAY=${shell date +%m\\/%d\\/%Y}
define add-date
sed -e 's/^\(.*Date: \)[0-9/]\+\(.*\)$|/\1$(TODAY)\2/'
endef

# ---Cleaning--- #

# Can be extended
define cmdclean
rm -f $(MIN) $(SRCV) $(MINV) $(ZIP);
endef

clean:
	$(cmdclean)

.PHONY: clean deploy min
