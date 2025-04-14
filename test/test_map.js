const { expect } = require("chai");

BigInt.random = function(power) {
    power = Number(power);
    var ret = BigInt(0);
    for(var p=0; p < power - 16; p += 16) {
        var part = BigInt(Math.floor(Math.random() * 2**16));
        ret = ret << 16n | part;
    }
    if(p < power) {
        var part = BigInt(Math.floor(Math.random() * 2**(power - p)));
        ret = ret << 16n | part;
    }
    return ret;
};

BigInt.prototype.hex = function(power) {
    power = Number(power);
    var hsize = Math.floor(power / 8);
    if(power % 8)
        hsize += 1;
    return ethers.toBeHex(BigInt(this), hsize);
}

BigInt.prototype.address = function() {
    return ethers.getAddress(ethers.toBeHex(BigInt(this), 20));
}

describe("Single Map Test", accounts => {
    it('Complex Map', async() => {
        var contract = await hre.ethers.deployContract('ComplexMapTest');
        await (await contract.test_map_set()).wait();
    });
});

describe("Typed Random Map Test", accounts => {
    var types = [
        {
            name: "uint32",
            random: function() {
                return BigInt.random(32);
            },
            for_set: function(v) {
                return v;
            },
            for_contract: function(v) {
                return v;
            },
            spoil: function(v) {
                if(v < 2n ** 32n - 1n)
                    return v + 1n;
                return v - 1n;
            }
        },
        {
            name: "uint200",
            random: function() {
                return BigInt.random(200);
            },
            for_set: function(v) {
                return v;
            },
            for_contract: function(v) {
                return v;
            },
            spoil: function(v) {
                if(v < 2n ** 200n - 1n)
                    return v + 1n;
                return v - 1n;
            }
        },
        {
            name: "address",
            random: function() {
                return BigInt.random(160).address();
            },
            for_set: function(v) {
                return v;
            },
            for_contract: function(v) {
                return v;
            },
            spoil: function(v) {
                v = ethers.toBigInt(v);
                if(v < 2n ** 160n - 1n)
                    return (v + 1n).address();
                return (v - 1n).address();
            }
        },
        {
            name: "bytes4",
            random: function() {
                return BigInt.random(4 * 8).hex(4 * 8);
            },
            for_set: function(v) {
                return v;
            },
            for_contract: function(v) {
                return v;
            },
            spoil: function(v) {
                v = ethers.toBigInt(v);
                if(v < 2n ** (4n * 8n) - 1n)
                    return (v + 1n).hex(4 * 8);
                return (v - 1n).hex(4 * 8);
            }
        },
        {
            name: "bytes16",
            random: function() {
                return BigInt.random(16 * 8).hex(16 * 8);
            },
            for_set: function(v) {
                return v;
            },
            for_contract: function(v) {
                return v;
            },
            spoil: function(v) {
                v = ethers.toBigInt(v);
                if(v < 2n ** (16n * 8n) - 1n)
                    return (v + 1n).hex(16 * 8);
                return (v - 1n).hex(16 * 8);
            }
        },
        {
            name: "string",
            random: function() {
                return BigInt.random(256).toString();
            },
            for_set: function(v) {
                return v;
            },
            for_contract: function(v) {
                return v;
            },
            spoil: function(v) {
                return v + 'q';
            }
        },
        {
            name: "bytes",
            random: function() {
                return ethers.toUtf8Bytes(BigInt.random(256).toString());
            },
            for_set: function(v) {
                return ethers.toUtf8String(v);
            },
            for_contract: function(v) {
                return ethers.toUtf8Bytes(v);
            },
            spoil: function(v) {
                return ethers.toUtf8Bytes(ethers.toUtf8String(v) + 'q');
            }
        },
    ];
    for(var keytype of new Set(types)) {
        for(var valuetype of new Set(types)) {
            ((keytype, valuetype) => {
                it(`Test ${keytype.name} => ${valuetype.name} map`, async () => {
                    var contract = await hre.ethers.deployContract(`${keytype.name}_${valuetype.name}_map`);
                    var map = new Map();
                    for(var i=0; i < 1000; i++) {
                        var key = keytype.random();
                        var val = valuetype.random();
                        map.set(keytype.for_set(key), valuetype.for_set(val));
                        await (await contract.set(key, val)).wait();
                        var remove = Math.random() < 0.3;
                        if( remove ) {
                            var entries = [];
                            for(var e of map) {
                                if(Math.random() < 0.01) {
                                    map.delete(e[0]);
                                    await (await contract.remove(keytype.for_contract(e[0]))).wait();
                                }
                            }
                        }
                    }
                    expect(await contract.length()).to.equal(BigInt(map.size));
                    for(var i=0; i < map.size; i++) {
                        var k, v;
                        [k, v] = await contract.at(BigInt(i));
                        expect(map.has(keytype.for_set(k))).to.equal(true);
                        expect(
                            map.get(keytype.for_set(k))
                        ).to.equal(
                            valuetype.for_set(v)
                        )
                    }
                    for(var e of map) {
                        expect(await contract.contains(keytype.for_contract(e[0]))).to.equal(true);
                    }
                    for(var e of map) {
                        expect(
                            valuetype.for_set(valuetype.for_contract(e[1]))
                        ).to.equal(
                            valuetype.for_set(await contract.get(keytype.for_contract(e[0])))
                        );
                    }
                    for(var e of map) {
                        var exists, v;
                        [exists, v] = await contract.safe_get(keytype.for_contract(e[0]));
                        expect(exists).to.equal(true);
                        expect(
                            valuetype.for_set(v)
                        ).to.equal(
                            valuetype.for_set(valuetype.for_contract(e[1]))
                        )
                        var spoilee = keytype.spoil(keytype.for_contract(e[0]));
                        [exists, v] = await contract.safe_get(spoilee);
                        expect(exists).to.equal(map.has(keytype.for_set(spoilee)))
                    }
                    await (await contract.cleanup()).wait();
                });
            })(keytype, valuetype);
        }
    }
});
