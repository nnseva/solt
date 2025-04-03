include ./make/solt.mk

.PHONY: all precompile compile test clean single_test uint_test bytes_test string_test address_test set_test

SOURCES=test/test_set.solt test/test_map.solt

CONTRACTS=$(foreach fname, $(notdir $(SOURCES)), contracts/$(basename $(fname)).sol)

SOME_BUILTIN_VALUE_TYPES=uint32 uint200 bytes4 bytes16 address
SOME_BUILTIN_REF_TYPES=bytes string

BV_SET_CONTRACTS=$(foreach tname, $(SOME_BUILTIN_VALUE_TYPES), contracts/$(tname)_set.sol)
BR_SET_CONTRACTS=$(foreach tname, $(SOME_BUILTIN_REF_TYPES), contracts/$(tname)_set.sol)

BV_BV_MAP_CONTRACTS=$(foreach kname, $(SOME_BUILTIN_VALUE_TYPES), $(foreach vname, $(SOME_BUILTIN_VALUE_TYPES), contracts/$(kname)_$(vname)_map.sol))
BV_BR_MAP_CONTRACTS=$(foreach kname, $(SOME_BUILTIN_VALUE_TYPES), $(foreach vname, $(SOME_BUILTIN_REF_TYPES), contracts/$(kname)_$(vname)_map.sol))
BR_BV_MAP_CONTRACTS=$(foreach kname, $(SOME_BUILTIN_REF_TYPES), $(foreach vname, $(SOME_BUILTIN_VALUE_TYPES), contracts/$(kname)_$(vname)_map.sol))
BR_BR_MAP_CONTRACTS=$(foreach kname, $(SOME_BUILTIN_REF_TYPES), $(foreach vname, $(SOME_BUILTIN_REF_TYPES), contracts/$(kname)_$(vname)_map.sol))

all: precompile compile test

precompile: contracts $(CONTRACTS) $(BV_SET_CONTRACTS) $(BR_SET_CONTRACTS) $(BV_BV_MAP_CONTRACTS) $(BV_BR_MAP_CONTRACTS) $(BR_BV_MAP_CONTRACTS) $(BR_BR_MAP_CONTRACTS)

contracts:
	+mkdir contracts

compile: precompile
	npx hardhat compile

contracts/%.sol: test/%.solt templates/solt/set.solt templates/solt/map.solt
	$(PP) $< >$@

$(BV_SET_CONTRACTS): test/test_any_set.solt templates/solt/set.solt
	$(PP) -DSET_LIBRARY=$(basename $(notdir $@))_lib -DTESTNAME=$(basename $(notdir $@)) -DSET_KEYTYPE=$(subst _set,,$(basename $(notdir $@))) -DSET_KEYTYPEARG=$(subst _set,,$(basename $(notdir $@))) $< >$@

$(BR_SET_CONTRACTS): test/test_any_set.solt templates/solt/set.solt
	$(PP) -DSET_LIBRARY=$(basename $(notdir $@))_lib -DTESTNAME=$(basename $(notdir $@)) -DSET_KEYTYPE=$(subst _set,,$(basename $(notdir $@))) -DSET_KEYTYPEARG="$(subst _set,,$(basename $(notdir $@))) memory" $< >$@

$(BV_BV_MAP_CONTRACTS): test/test_any_map.solt templates/solt/map.solt
	$(PP) -DMAP_LIBRARY=$(basename $(notdir $@))_lib -DTESTNAME=$(basename $(notdir $@)) -DMAP_KEYTYPE=$(word 1, $(subst _, ,$(basename $(notdir $@)))) -DMAP_KEYTYPEARG=$(word 1, $(subst _, ,$(basename $(notdir $@))))  -DMAP_VALUETYPE=$(word 2, $(subst _, ,$(basename $(notdir $@)))) -DMAP_VALUETYPEARG=$(word 2, $(subst _, ,$(basename $(notdir $@))))  $< >$@

$(BV_BR_MAP_CONTRACTS): test/test_any_map.solt templates/solt/map.solt
	$(PP) -DMAP_LIBRARY=$(basename $(notdir $@))_lib -DTESTNAME=$(basename $(notdir $@)) -DMAP_KEYTYPE=$(word 1, $(subst _, ,$(basename $(notdir $@)))) -DMAP_KEYTYPEARG=$(word 1, $(subst _, ,$(basename $(notdir $@))))  -DMAP_VALUETYPE=$(word 2, $(subst _, ,$(basename $(notdir $@)))) -DMAP_VALUETYPEARG="$(word 2, $(subst _, ,$(basename $(notdir $@)))) memory"  $< >$@

$(BR_BR_MAP_CONTRACTS): test/test_any_map.solt templates/solt/map.solt
	$(PP) -DMAP_LIBRARY=$(basename $(notdir $@))_lib -DTESTNAME=$(basename $(notdir $@)) -DMAP_KEYTYPE=$(word 1, $(subst _, ,$(basename $(notdir $@)))) -DMAP_KEYTYPEARG="$(word 1, $(subst _, ,$(basename $(notdir $@)))) memory" -DMAP_VALUETYPE=$(word 2, $(subst _, ,$(basename $(notdir $@)))) -DMAP_VALUETYPEARG="$(word 2, $(subst _, ,$(basename $(notdir $@)))) memory"  $< >$@

$(BR_BV_MAP_CONTRACTS): test/test_any_map.solt templates/solt/map.solt
	$(PP) -DMAP_LIBRARY=$(basename $(notdir $@))_lib -DTESTNAME=$(basename $(notdir $@)) -DMAP_KEYTYPE=$(word 1, $(subst _, ,$(basename $(notdir $@)))) -DMAP_KEYTYPEARG="$(word 1, $(subst _, ,$(basename $(notdir $@)))) memory" -DMAP_VALUETYPE=$(word 2, $(subst _, ,$(basename $(notdir $@)))) -DMAP_VALUETYPEARG=$(word 2, $(subst _, ,$(basename $(notdir $@))))  $< >$@

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
