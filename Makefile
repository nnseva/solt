.PHONY: all precompile compile test clean single_test set_test map_test

PP=npx solt pp --stderr

SOURCES=test/test_set.solt test/test_map.solt

CONTRACTS=$(foreach fname, $(notdir $(SOURCES)), contracts/$(basename $(fname)).sol)

SOME_BUILTIN_TYPES=uint32 uint200 bytes4 bytes16 address bytes string

SET_CONTRACTS=$(foreach tname, $(SOME_BUILTIN_TYPES), contracts/$(tname)_set.sol)

MAP_CONTRACTS=$(foreach kname, $(SOME_BUILTIN_TYPES), $(foreach vname, $(SOME_BUILTIN_TYPES), contracts/$(kname)_$(vname)_map.sol))

DOLLAR=$

all: precompile compile test

precompile: contracts $(CONTRACTS) $(SET_CONTRACTS) $(MAP_CONTRACTS)

contracts:
	+mkdir contracts

compile: precompile
	npx hardhat compile

contracts/%.sol: test/%.solt templates/solt/set.solt templates/solt/map.solt
	$(PP) $< >$@

$(SET_CONTRACTS): test/test_any_set.solt templates/solt/set.solt
	$(PP) -D SET_LIBRARY=$(basename $(notdir $@))_lib -D TESTNAME=$(basename $(notdir $@)) -D SET_KEYTYPE=$(subst _set,,$(basename $(notdir $@))) $< >$@

$(MAP_CONTRACTS): test/test_any_map.solt templates/solt/map.solt
	$(PP) -D MAP_LIBRARY=$(basename $(notdir $@))_lib -D TESTNAME=$(basename $(notdir $@)) -D MAP_KEYTYPE=$(word 1, $(subst _, ,$(basename $(notdir $@)))) -D MAP_VALUETYPE=$(word 2, $(subst _, ,$(basename $(notdir $@)))) $< >$@

test: compile single_test set_test map_test

single_test: compile
	npx hardhat test --grep Single

set_test: compile
	for i in $(SOME_BUILTIN_TYPES); do npx hardhat test --grep "${DOLLAR}i set"; done

map_test: compile
	for i in $(SOME_BUILTIN_TYPES); do for j in $(SOME_BUILTIN_TYPES); do npx hardhat test --grep "${DOLLAR}i => ${DOLLAR}j map"; done; done

clean:
	+rm -r contracts/*
