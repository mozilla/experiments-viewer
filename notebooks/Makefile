CONVERTER=py2ipynb.py

.PHONY: all notebook

all: notebook

notebook:
	@curl -s -L https://raw.githubusercontent.com/yianni/py2ipynb/master/$(CONVERTER) -o .$(CONVERTER)
	@- for f in *.py; do \
		python .$(CONVERTER) $$f $(basename $$f).ipynb ; \
	done
	@rm .$(CONVERTER)
