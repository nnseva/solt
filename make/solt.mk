INCLUDES=$(shell find . -name 'templates' -type d)

PP=m4 $(foreach inc, $(INCLUDES), -I "$(inc)")
