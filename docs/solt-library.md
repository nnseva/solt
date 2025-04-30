# Solt Library

The `solt` library provides reusable templates designed to enhance Solidity contract development. This library is intended to expand over time.

## Set Library Template

The `set` library template is defined in the `solt/set.solt` file.

This template implements an enumerable, storage-based set type with arbitrary keys, determined by your contract code. The key type must be a valid Solidity [mapping](https://docs.soliditylang.org/en/latest/types.html#mapping-types) key type, including:

- `int`/`uint` of any bit width
- `fixed`/`ufixed`
- `bytes` of fixed width
- `address`
- `bytes` and `string` of dynamic width

The _set library_ allows:

- Adding and removing keys, with the same complexity as Solidity [mapping](https://docs.soliditylang.org/en/latest/types.html#mapping-types).
- Retrieving the number of stored keys (`O(1)` complexity).
- Enumerating stored keys in an arbitrary order (`O(1)` complexity).
- Checking whether a key exists in the set, with the same complexity as Solidity [mapping](https://docs.soliditylang.org/en/latest/types.html#mapping-types).

## Using the _Set Library_ in Your Code

To integrate the `set` template, define two template parameters: `SET_KEYTYPE` and `SET_LIBRARY`.

Use the `include_with` directive to include the set template with locally defined parameters. Alternatively, if parameters have already been defined earlier in your code or passed via the preprocessor command line, use `include` instead.

### Template Parameters

- `SET_LIBRARY` – Specifies the name of the generated Solidity _set library_.
    - This name must be unique within your contract project per Solidity requirements.
    - Although the _set library_ is generated, it is _not deployed as a separate contract_, meaning your contract can be deployed directly without linking to a library.
- `SET_KEYTYPE` – Defines the _key type_ stored in the set.

The _set library_ declares the set data structure as `Set`. You reference this type by prepending the _set library_ name and using the dot (`.`) notation:

```
// define the set type of uint256
<%- include_with('solt/set.solt', {
    SET_LIBRARY: 'uint256_set',
    SET_KEYTYPE: 'uint256'
}) -%>
contract MyContract {
    using uint256_set for uint256_set.Set;
```

In this example:

- The `include_with` directive inserts the `solt/set.solt` template with parameters `SET_LIBRARY` and `SET_KEYTYPE`.
- The _set library_ name is defined as `uint256_set`, and the _key type_ is `uint256`.

Inside the contract, the _set library_ is used to declare a variable and call library functions:

```
    uint256_set.Set private uint256set;
    ...
    uint256set.add(1);
```

### Defining Multiple _Set Libraries_

You can include the _set library_ template multiple times to define multiple _set libraries_ for different key types:

```
// define the type set of uint256
<%- include_with('solt/set.solt', {
    SET_LIBRARY: 'uint256_set',
    SET_KEYTYPE: 'uint256'
}) -%>
// define the type set of strings
<%- include_with('solt/set.solt', {
    SET_LIBRARY: 'string_set',
    SET_KEYTYPE: 'string'
}) -%>
// define the type set of addresses
<%- include_with('solt/set.solt', {
    SET_LIBRARY: 'address_set',
    SET_KEYTYPE: 'address'
}) -%>
```

Use these libraries inside your contract:

```
contract MyContract {
    using uint256_set for uint256_set.Set;
    using string_set for string_set.Set;
    using address_set for address_set.Set;

    uint256_set.Set private keys;
    string_set.Set private names;
    string_set.Set private values;
    address_set.Set private accounts;
...
}
```

## _Set Library_ Functions

- `add(key)` – Adds a key to the set. Returns `true` if successful, `false` if the key already exists.
- `remove(key)` – Removes a key from the set. Returns `true` if removed, `false` if the key was not found.
- `contains(key)` – Checks whether the set contains the given key.
- `length()` – Returns the number of stored keys in the set.
- `at(uint i)` – Retrieves the key at index `i` (`0-based`).
    - The ordering of keys may change when modifying the set.

## _Set_ Data Structure

The `Set` data structure is defined within the _set library_ and contains all necessary data:

- `values` – A dynamic array holding all stored keys.
    - You can iterate over this array directly, instead of using `at(uint i)`.
    - _Do not modify this member directly to avoid data inconsistencies._
- `positions` – A mapping storing key indices (shifted by `+1`).
    - _Do not modify this member directly to maintain integrity._

## Map Library Template

The `map` library template is defined in the `solt/map.solt` file.

This template implements a storage-based map type with enumerable keys of an arbitrary simple type defined by your contract, along with an arbitrary value type. The _key type_ must be a valid Solidity [mapping](https://docs.soliditylang.org/en/latest/types.html#mapping-types) key type, such as:

- `int`/`uint` (any bit width)
- `fixed`/`ufixed`
- `bytes` (fixed width)
- `address`
- `bytes` and `string` (dynamic width)

The _value type_ of the map can be any standard Solidity [mapping](https://docs.soliditylang.org/en/latest/types.html#mapping-types) value type, including arrays and structs.

The _map library_ provides efficient operations for:

- Adding and removing key/value pairs, with the same complexity as Solidity [mapping](https://docs.soliditylang.org/en/latest/types.html#mapping-types).
- Retrieving the number of stored keys (`O(1)` complexity).
- Enumerating stored keys in an arbitrary order (`O(1)` complexity).
- Checking whether a key exists and retrieving its associated value with the same complexity as Solidity [mapping](https://docs.soliditylang.org/en/latest/types.html#mapping-types).

## Using the _Map Library_ in Your Code

To integrate the `map` template, define three template parameters: `MAP_KEYTYPE`, `MAP_VALUETYPE`, and `MAP_LIBRARY`.

Use the `include_with` directive to include the map template with locally defined parameters. If the parameters have already been set earlier in your code or passed via the preprocessor command line, you can use `include` instead.

### Template Parameters

- `MAP_LIBRARY` – Specifies the name of the generated Solidity _map library_.
    - This name must be unique within your contract project per Solidity requirements.
    - Although the _map library_ is generated, it is _not deployed as a separate contract_, meaning your contract can be deployed directly without linking to an external library.
- `MAP_KEYTYPE` – Defines the _key type_ stored in the map.
- `MAP_VALUETYPE` – Defines the _value type_ stored in the map.

The _map library_ declares the map data structure as `Map`. You reference this type by prepending the _map library_ name and using the dot (`.`) notation:

```
// define the map type of uint256 mapped to string
<%- include_with('solt/map.solt', {
    MAP_LIBRARY: 'uint256_string_map',
    MAP_VALUETYPE: 'string',
    MAP_KEYTYPE: 'uint256'
}) -%>
contract MyContract {
    using uint256_string_map for uint256_string_map.Map;
```

In this example:

- The `include_with` directive inserts the `solt/map.solt` template with parameters `MAP_LIBRARY`, `MAP_KEYTYPE`, and `MAP_VALUETYPE`.
- The _map library_ name is defined as `uint256_string_map`, the _key type_ is `uint256`, and the _value type_ is `string`.

Inside the contract, the _map library_ is used to define a variable and call library functions:

```
    uint256_string_map.Map private uint256stringmap;
    ...
    uint256stringmap.set(1, 'hello, World!');
```

### Defining Multiple _Map Libraries_

You can include the _map library_ template multiple times to define separate _map libraries_ for different key and value types:

```
<%- include_with('solt/map.solt', {
    MAP_LIBRARY: 'uint256_string_map',
    MAP_KEYTYPE: 'uint256'
    MAP_VALUETYPE: 'string'
}) -%>
<%- include_with('solt/map.solt', {
    MAP_LIBRARY: 'uint256_address_map',
    MAP_KEYTYPE: 'uint256'
    MAP_VALUETYPE: 'address'
}) -%>
```

Use these libraries inside your contract:

```
contract MyContract {
    using uint256_string_map for uint256_string_map.Map;
    using uint256_address_map for uint256_address_map.Map;

    uint256_string_map.Map private names;
    uint256_address_map.Map private accounts;
...
}
```

## _Map Library_ Functions

- `set(key, value)` – Adds a new key/value pair or updates an existing one.
    - Returns `true` if the key is new.
    - Returns `false` if the key already exists, meaning the new value replaces the old one.
- `remove(key)` – Removes an existing key/value pair from the map.
    - Returns `true` if successfully removed.
    - Returns `false` if the key does not exist.
- `contains(key)` – Checks whether the map contains the given key.
- `length()` – Returns the number of stored keys.
- `at(uint i)` – Retrieves the key at index `i` (`0-based`).
    - The ordering of keys may change when modifying the map.
- `safe_get(key)` – Returns a tuple containing:
    - A boolean indicating whether the key exists.
    - The associated value (zero-filled if the key does not exist).
- `get(key)` – Retrieves the stored value associated with the key.
    - If the key does not exist, the function triggers `revert("Not existent")`.


## _Map_ Data Structure

The `Map` data structure is defined within the _map library_ and stores all necessary data:

- `keys` – A `set` type whose library name is derived from the map type name with the `_set` suffix.
    - This set contains all map keys.
    - You can analyze or iterate over it arbitrarily instead of using map functions.
    - _Avoid modifying this member directly to prevent data inconsistencies._
- `values` – A mapping that stores key-value pairs.
    - You can analyze this member directly instead of calling map functions.
    - _Avoid modifying this member directly to maintain integrity._

# Direct Index Library Template

The `index_direct` library template is defined in the `solt/index_direct.solt` file.

This template implements an ordered, storage-based index type with arbitrary unique keys of type determined by your contract code.
The key type must be a valid Solidity fixed size type, including:

- `int`/`uint` of any bit width
- `fixed`/`ufixed`
- `bytes` of fixed width
- `address`

Any unique value of the key type except the _Zero_ one may be stored in the direct index. The _Zero_ value plays a special role
to markup absence of the key in the index, therefore, it can't be a key itself. For different types, the _Zero_ value
is an initial value of just reserved memory cell: `0` for numeric types, `0x0` for `address`, or zero-padded
bytes sequence of fixed width.

The _direct index library_ allows:

- Adding and removing keys (`O(log(n))` complexity)
- Searching lowest (first) and highest (last) key value (`O(log(n))` complexity)
- Enumerating stored keys in the sequential ascending and descending order (`O(1)` complexity)
- Checking whether the key exists in the index, with the same complexity as Solidity [mapping](https://docs.soliditylang.org/en/latest/types.html#mapping-types)

## Using the _Direct Index Library_ in Your Code

To integrate the `index_direct` template, define two template parameters: `DIRECT_KEYTYPE` and `DIRECT_LIBRARY`.

Use the `include_with` directive to include the direct index template with locally defined parameters. Alternatively, if parameters have already been defined earlier in your code or passed via the preprocessor command line, use `include` instead.

### Template Parameters

- `DIRECT_LIBRARY` – Specifies the name of the generated Solidity _direct index library_.
    - This name must be unique within your contract project per Solidity requirements.
    - Although the _direct index library_ is generated, it is _not deployed as a separate contract_, meaning your contract can be deployed directly without linking to a library.
- `DIRECT_KEYTYPE` – Defines the _key type_ stored in the index.

The _direct index library_ declares the index data structure as `Index`. You reference this type by prepending the _direct index library_ name and using the dot (`.`) notation:

```
// define the direct index type of uint256
<%- include_with('solt/index_direct.solt', {
    DIRECT_LIBRARY: 'uint256_index',
    DIRECT_KEYTYPE: 'uint256'
}) -%>
contract MyContract {
    using uint256_index for uint256_index.Index;
```

In this example:

- The `include_with` directive inserts the `solt/index_direct.solt` template with parameters `DIRECT_LIBRARY` and `DIRECT_KEYTYPE`.
- The _direct index library_ name is defined as `uint256_index`, and the _key type_ is `uint256`.

Inside the contract, the _direct index library_ is used to declare a variable and call library functions:

```
    uint256_index.Index private uint256index;
    ...
    uint256index.add(1);
```

### Defining Multiple _Direct Index Libraries_

You can include the _direct index library_ template multiple times to define multiple _direct index libraries_ for different key types:

```
// define the type index of uint256
<%- include_with('solt/index_direct.solt', {
    DIRECT_LIBRARY: 'uint256_index',
    DIRECT_KEYTYPE: 'uint256'
}) -%>
// define the type set of addresses
<%- include_with('solt/index_direct.solt', {
    DIRECT_LIBRARY: 'address_index',
    DIRECT_KEYTYPE: 'address'
}) -%>
```

Use these libraries inside your contract:

```Solidiry
contract MyContract {
    using uint256_index for uint256_index.Index;
    using address_index for address_index.Index;

    uint256_index.Index private keys;
    address_index.Index private accounts;
...
}
```

## _Direct Index Library_ Functions

- `add(key)` – Adds a key to the index. Returns `true` if successful, `false` if the key already exists. The _Zero_ value can't be added to the index.
- `remove(key)` – Removes a key from the index. Returns `true` if removed, `false` if the key was not found. The _Zero_ value can't be removed from the index.
- `contains(key)` – Checks whether the index contains the given key.
- `first()` - Returns the first key in the index, or _Zero_
- `last()` - Returns the last key in the index, or _Zero_
- `next(key)` - Returns the next key in the index, following the passed one, or _Zero_
- `prev(key)` - Returns the previous key in the index, followed by the passed one, or _Zero_

The following code iterates all keys in the index `keys` in the _ascending_ order:

```
    for(<%- argtype(DIRECT_KEYTYPE) -%> i=keys.first(); i != 0; i=keys.next(i)) {
        // do something
    }
```

The following code iterates all keys in the index `keys` in the _descending_ order:

```
    for(<%- argtype(DIRECT_KEYTYPE) -%> i=keys.last(); i != 0; i=keys.prev(i)) {
        // do something
    }
```


## _Direct Index_ Data Structure

The `Index` data structure is defined within the _direct index library_ and contains all necessary data:

- `root` - The root key of the balanced red-black tree containing all keys
- `nodes` - mapping reflecting keys to the nodes of the balanced red-black tree

Every node has the `Node` structure type. The `Node` structure type is the following:

- `parent` - parent key
- `left` - left key
- `right` - right key
- `red` - flag of red or black color of the node

- You can iterate over this data structure directly, to analize a tree, when necessary.
- _Do not modify these members directly to avoid data inconsistencies._

# Indirect Index Library Template

The `index_indirect` library template is defined in the `solt/index_indirect.solt` file.

This template implements an ordered, storage-based index type with arbitrary unique keys of type determined by your contract code.
The key type can be any valid Solidity type, including:

- `int`/`uint` of any bit width
- `fixed`/`ufixed`
- `bytes` of fixed width
- `address`

You also can use any structure and/or variable-length type of the key. To do this, you should additionally define a special code to
compare two key values, which returns the order between them.

Any unique key value can be stored in the index.

The _indirect index library_ allows:

- Adding and removing keys (`O(log(n))` complexity)
- Searching lowest (first) and highest (last) key value (`O(log(n))` complexity)
- Enumerating stored keys in the sequential ascending and descending order (`O(1)` complexity)
- Checking whether the key exists in the index (`O(log(n))` complexity)

## Using the _Indirect Index Library_ in Your Code

To integrate the `index_indirect` template, define two template parameters: `INDIRECT_KEYTYPE` and `INDIRECT_LIBRARY`.

If you are using non-fixed type of the key, you also should define a special comparator code in the third `INDIRECT_KEYCOMPARE` parameter.

The `INDIRECT_KEYCOMPARE` parameter of the template should contain a piece of valid Solidity code which
compares two keys, `key1`, and `key2`. The code should evaluate comparison and return `true`, if `key1` is
less than `key2`. If the `INDIRECT_KEYCOMPARE` parameter is absent, the code `return key1 < key2;`
is used (notice the semicolon at the end of the code).

Use the `include_with` directive to include the indirect index template with locally defined parameters. Alternatively, if parameters have already been defined earlier in your code or passed via the preprocessor command line, use `include` instead.

### Template Parameters

- `INDIRECT_LIBRARY` – Specifies the name of the generated Solidity _indirect index library_.
    - This name must be unique within your contract project per Solidity requirements.
    - Although the _indirect index library_ is generated, it is _not deployed as a separate contract_, meaning your contract can be deployed directly without linking to a library.
- `INDIRECT_KEYTYPE` – Defines the _key type_ stored in the index.
- `INDIRECT_KEYCOMPARE` - Defines a piece of code to compare two key values, `key1` and `key2`, default is `return key1 < key2;`

The _indirect index library_ declares the index data structure as `Index`. You reference this type by prepending the _indirect index library_ name and using the dot (`.`) notation:

```
// define the indirect index type of uint256
<%- include_with('solt/index_indirect.solt', {
    INDIRECT_LIBRARY: 'uint256_index',
    INDIRECT_KEYTYPE: 'uint256'
}) -%>
contract MyContract {
    using uint256_index for uint256_index.Index;
```

In this example:

- The `include_with` directive inserts the `solt/index_indirect.solt` template with parameters `INDIRECT_LIBRARY` and `INDIRECT_KEYTYPE`.
- The _indirect index library_ name is defined as `uint256_index`, and the _key type_ is `uint256`.

Inside the contract, the _indirect index library_ is used to declare a variable and call library functions:

```
    uint256_index.Index private uint256index;
    ...
    uint256index.add(1);
```

### Defining Multiple _Indirect Index Libraries_

You can include the _indirect index library_ template multiple times to define multiple _indirect index libraries_ for different key types:

```
// define the type index of uint256
<%- include_with('solt/index_indirect.solt', {
    INDIRECT_LIBRARY: 'uint256_index',
    INDIRECT_KEYTYPE: 'uint256'
}) -%>
// define the type set of addresses
<%- include_with('solt/index_indirect.solt', {
    INDIRECT_LIBRARY: 'address_index',
    INDIRECT_KEYTYPE: 'address'
}) -%>
```

Use these libraries inside your contract:

```Solidiry
contract MyContract {
    using uint256_index for uint256_index.Index;
    using address_index for address_index.Index;

    uint256_index.Index private keys;
    address_index.Index private accounts;
...
}
```

## _Indirect Index Library_ Functions

- `add(key)` – Adds a key to the index. Returns `true` if successful, `false` if the key already exists.
- `remove(key)` – Removes a key from the index. Returns `true` if removed, `false` if the key was not found.
- `get_id(key)` - Returns an integer ID of the key. The ID has a type `uint` and is always non-zero. The value `0` means absence.
- `get_key(id)` - Returns the key associated with this ID. If the ID is not present in the index, returns a non-initialized key type value.
- `contains_id(id)` – Checks whether the index contains the given ID. Use it to ensure that the ID is present in the index.
- `contains(key)` – Checks whether the index contains the given key.
- `first_id()` - Returns the first ID in the index, or `0`.
- `first()` - Returns the first key in the index, or a non-initialized key type value.
- `last_id()` - Returns the last ID in the index, or `0`.
- `last()` - Returns the last key in the index, or a non-initialized key type value.
- `next_id(id)` - Returns the next ID in the index, following the passed one, or `0`.
- `next(key)` - Returns the next key in the index, following the passed one, or a non-initialized key type value.
- `prev_id(id)` - Returns the previous ID in the index, followed by the passed one, or `0`.
- `prev(key)` - Returns the previous key in the index, followed by the passed one, or a non-initialized key type value.

The following code effectively iterates all keys in the index in the _ascending_ order:

```
    for(uint i=keys.first_id(); i != 0; i=keys.next_id(i)) {
        <%- argtype(INDIRECT_KEYTYPE) -%> key = keys.get_key(i);
        // do something
    }
```

The following code iterates all keys in the index in the _descending_ order:

```
    for(uint i=keys.last_id(); i != 0; i=keys.prev_id(i)) {
        <%- argtype(INDIRECT_KEYTYPE) -%> key = keys.get_key(i);
        // do something
    }
```

You also can iterate all keys in the index in the _ascending_ or _descending_ order by the following code, much less effective although:

```
    for(<%- argtype(INDIRECT_KEYTYPE) -%> key i=keys.first(); keys.contains(key); key=keys.next(key)) {
        // do something
    }
```

```
    for(<%- argtype(INDIRECT_KEYTYPE) -%> key=keys.last(); keys.contains(key); key=keys.prev(key)) {
        // do something
    }
```

## _Indirect Index_ Data Structure

The `Index` data structure is defined within the _indirect index library_ and contains all necessary data:

- `root` - The root ID of the balanced red-black tree containing all keys
- `latest` - The latest assigned ID
- `nodes` - mapping reflecting ID to the nodes of the balanced red-black tree

Every node has the `Node` structure type. The `Node` structure type is the following:

- `parent` - parent ID
- `left` - left ID
- `right` - right ID
- `key` - the key value associated with the ID referring this node
- `red` - flag of red or black color of the node

- You can iterate over this data structure directly, to analize a tree, when necessary.
- _Do not modify these members directly to avoid data inconsistencies._
