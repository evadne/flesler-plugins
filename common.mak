NAME=jquery.$(PLUGIN)
VER=$(shell cat version.txt)

SRC=$(NAME).js
MIN=$(NAME)-min.js

VER_NAME=$(NAME)-$(VER)

SRCV=$(VER_NAME).js
MINV=$(VER_NAME)-min.js

ZIP=$(VER_NAME).zip
ZIP_FILES=$(SRC) $(SRCV) $(MIN) $(MINV) changes.txt

all: deploy

$(ZIP): $(ZIP_FILES)
	zip -r9 $(ZIP) $(ZIP_FILES)

$(SRC):
	;
	
$(SRCV):$(SRC)
	cp $(SRC) $(SRCV)

$(MIN):$(SRC)
	java -jar $(YUI) $(SRC) -o $(MIN)

min: $(MIN)
	
$(MINV):$(MIN)
	cp $(MIN) $(MINV)
	
deploy:$(ZIP)

clean:
	rm -f $(MIN) $(SRCV) $(MINV) $(ZIP)

.PHONY: clean deploy min
