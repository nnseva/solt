include ./make/solt.mk

.PHONY: all precompile compile test clean single_test uint_test bytes_test string_test address_test set_test

SOURCES=test/test_set.solt test/test_map.solt

CONTRACTS=$(foreach fname, $(notdir $(SOURCES)), contracts/$(basename $(fname)).sol)

SOME_BUILTIN_TYPES=uint32 uint200 bytes4 bytes16 address bytes string

SET_CONTRACTS=$(foreach tname, $(SOME_BUILTIN_TYPES), contracts/$(tname)_set.sol)

MAP_CONTRACTS=$(foreach kname, $(SOME_BUILTIN_TYPES), $(foreach vname, $(SOME_BUILTIN_TYPES), contracts/$(kname)_$(vname)_map.sol))

all: precompile compile test

precompile: contracts $(CONTRACTS) $(SET_CONTRACTS) $(MAP_CONTRACTS)

contracts:
	+mkdir contracts

compile: precompile
	npx hardhat compile

contracts/%.sol: test/%.solt templates/solt/set.solt templates/solt/map.solt
	$(PP) $< >$@

$(SET_CONTRACTS): test/test_any_set.solt templates/solt/set.solt
	$(PP) -DSET_LIBRARY=$(basename $(notdir $@))_lib -DTESTNAME=$(basename $(notdir $@)) -DSET_KEYTYPE=$(subst _set,,$(basename $(notdir $@))) $< >$@

$(MAP_CONTRACTS): test/test_any_map.solt templates/solt/map.solt
	$(PP) -DMAP_LIBRARY=$(basename $(notdir $@))_lib -DTESTNAME=$(basename $(notdir $@)) -DMAP_KEYTYPE=$(word 1, $(subst _, ,$(basename $(notdir $@)))) -DMAP_VALUETYPE=$(word 2, $(subst _, ,$(basename $(notdir $@)))) $< >$@

test: compile single_test set_test uint_test bytes_test string_test address_test

single_test: compile
	npx hardhat test --grep Single

set_test: compile
	npx hardhat test --grep "Typed Random Set Test"

uint_test: compile
	npx hardhat test --grep "uint.*=>"

bytes_test: compile
	npx hardhat test --grep "bytes.*=>"

string_test: compile
	npx hardhat test --grep "string.*=>"

address_test: compile
	npx hardhat test --grep "address.*=>"

clean:
	+rm -r contracts/*
