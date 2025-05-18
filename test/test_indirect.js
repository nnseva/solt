const { expect } = require("chai");

describe("Single Indirect Test", accounts => {

    beforeEach(async () => {;
        contract = await hre.ethers.deployContract("SimpleIndirectTest");
    });

    it("Test add", async () => {
        await (await contract.test_add()).wait();
        console.log("After add:", await contract.values());
    });

    it("Test add -> remove -> add", async () => {
        await (await contract.test_add_remove_add()).wait();
        console.log("After add -> remove -> add:", await contract.values());
    });
});

BigInt.random = function(power) {
    power = Number(power);
    var ret = BigInt(0);
    for(var p=0; p < power - 16; p += 16) {
        var part = BigInt(Math.floor(Math.random() * 2**16));
        ret = ret << 16n | part;
    }
    if(p < power) {
        var part = BigInt(Math.floor(Math.random() * 2**(power - p)));
        ret = ret << BigInt(power - p) | part;
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

describe("Typed Random Indirect Test", accounts => {
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
        },
        {
            name: "address",
            random: function() {
                return (BigInt.random(160)).address();
            },
            for_set: function(v) {
                return v;
            },
            for_contract: function(v) {
                return v;
            },
        },
        {
            name: "bytes4",
            random: function() {
                return (BigInt.random(4 * 8)).hex(4 * 8);
            },
            for_set: function(v) {
                return v;
            },
            for_contract: function(v) {
                return v;
            },
        },
        {
            name: "bytes16",
            random: function() {
                return (BigInt.random(16 * 8)).hex(16 * 8);
            },
            for_set: function(v) {
                return v;
            },
            for_contract: function(v) {
                return v;
            },
        },
    ];
    for(var valuetype of new Set(types)) {
        ((valuetype) => {
            it(`Test ${valuetype.name} indirect`, async () => {
                var contract = await hre.ethers.deployContract(`${valuetype.name}_indirect`);
                var set = new Set();
                for(var i=0; i < 1000; i++) {
                    var val = valuetype.random();
                    set.add(valuetype.for_set(val));
                    await (await contract.add(val)).wait();
                    var remove = Math.random() < 0.3;
                    if( remove ) {
                        var entries = [];
                        for(var e of set) {
                            if(Math.random() < 0.01) {
                                set.delete(e);
                                await (await contract.remove(valuetype.for_contract(e))).wait();
                            }
                        }
                    }
                }
                var values = await contract.values();
                expect(values.length).to.equal(BigInt(set.size));
                for(var i=await contract.first_id(); i != 0n; i=await contract.next_id(i)) {
                    var key = await contract.get_key(i);
                    expect(set.has(valuetype.for_set(key))).to.equal(true);
                }
                for(var v of set) {
                    expect(await contract.contains(valuetype.for_contract(v))).to.equal(true);
                }
            });
        })(valuetype);
    }
});
