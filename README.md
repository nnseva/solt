[![Tests](https://github.com/nnseva/solt/actions/workflows/test.yml/badge.svg)](https://github.com/nnseva/solt/actions/workflows/test.yml)

# Solidity Templates

The `solt` package provides utilities for working with _type-agnostic_, customizable Solidity templates within your smart contracts.

This package includes the Solidity Templates library, which offers a collection of ready-to-use templates. With `solt`, you can integrate these templates into your code _without the need for manual copying or modification_. This keeps your code modular, well-encapsulated, and highly reusable.

## Installation

To install the library from the GitHub repository, use the following command:

```
npm install nnseva/solt
```

## Motivation Behind Solidity Templates

Solidity itself offers features to simplify contract development through encapsulation. Developers can use libraries to abstract implementation details and make code reusable. However, standard libraries are strongly type-dependent, limiting their flexibility.

The Solidity Templates utility bundle extends Solidity’s encapsulation and reusability capabilities by enabling _type-agnostic_ code usage. It allows developers to:

-   Maintain a single source for reusable logic across multiple types or a broad subset of types.
-   Define customizable code blocks.
-   Seamlessly embed these blocks into their contracts.

## Preprocessor Used

The most suitable preprocessor we have identified for this purpose is [EJS](https://github.com/mde/ejs) developed by [Matthew Eernisse](https://github.com/mde). 
Originally designed as a templating engine for HTML pages, EJS offers a stable and highly customizable solution that is flexible enough to support Solidity-based templating.

The `solt` utility deliberately leverages [EJS](https://github.com/mde/ejs) to provide a streamlined approach to contract templating.

## Solidity Template Example

You can find examples of Solidity Templates within the package's source code. Below is a simple example demonstrating basic usage:

```
/// SPDX-License-Identifier: LGPL3
pragma solidity >= 0.5 < 0.9;
<%- include('solt/std.solt') -%>

// Use the map library template

struct MyContent {
    uint32 content;
    bool first;
}

// the map of MyContent
<%- include_with('solt/map.solt', {
    MAP_LIBRARY: 'my_content_map',
    MAP_KEYTYPE: 'uint256',
    MAP_VALUETYPE: 'MyContent'
}) -%>

contract ComplexMapTest {
    using my_content_map for my_content_map.Map;
    my_content_map.Map private my_map;
    
    function test_map_set() public {
        {
            my_map.set(1, MyContent(1, true));
            my_map.set(5, MyContent(11, true));
            ...
            bool exists;
            MyContent memory m;
            m = my_map.get(1);
            (exists, m) = my_map.safe_get(11);
            (exists, m) = my_map.safe_get(44);
            ...
        }
    }
}
```

## Functionality of Solidity Templates Utilities

The `solt pp` utility initiates the preprocessor and compiles your templated Solidity code. It seamlessly integrates into your development workflow, allowing you to automate template processing within your contract development pipeline.

To run the utility using `npx`, execute the following command:

```
npx solt pp src/my_contract.solt -o contracts/my_contract.sol
```

By default, `solt pp` automatically searches for templates within the `templates` subfolder of any installed package. This eliminates the need to manually specify template directories. However, this behavior can be disabled if needed.

Additional utilities prefixed with `solt` will be introduced in future versions.

## What Is a Solidity Template File?

A Solidity Template file uses the `.solt` extension and can be included in your Solidity contract using the preprocessor’s `include` directive. The directive follows this syntax:

```
<%- include('solt/std.solt') -%>
```

### Using Preprocessor Variables

Preprocessor variables can be introduced within an included template file or passed via the command line. These variables can then be used anywhere in your code, like this:

```
    mapping< <%- MAP_KEYTYPE -%> => <%- MAP_VALUETYPE -%> > my_map;
```


### Writing Your Own Preprocessing Logic

You can define custom preprocessing logic, introduce new variables, and even embed JavaScript directly within the template:

```
<% SET_KEYTYPE=MAP_KEYTYPE -%>
<%
argtype = function(name) {
    if(is_valuetype(name)) return name;
    return `${name} memory`;
}
-%>
...
    function get(self, <%- argtype(MAP_KEYTYPE) -%> key) internal view returns(<%- argtype(MAP_VALUETYPE) -%>) {
        ...
    }
...
```


### Compiling the Template Code

Your Solidity contract itself acts as a template. The final contract is generated from your code and placed in the `contracts` folder, ready for compilation with any Solidity compiler, such as `solc`.

While you can use any file extension for template files, adopting `.solt` as a standard practice improves consistency and clarity.


## Platform Compatibility

The Solidity Templates utilities are built on `Node.js`, making them compatible with any POSIX-compliant system where `Node.js` is installed. While Windows may work, compatibility is not guaranteed.

## Contribution

### Expanding the Core Templates Library

Contributions that extend the Solidity Templates library with additional reusable Solidity templates are highly valued and welcomed.

### Improving Solidity Templates Utilities

Although the existing preprocessor is effective, it is not perfect. Contributions are encouraged, whether in the form of ideas or direct implementations of more advanced preprocessing mechanisms—such as support for extended templating concepts like `C++` templates.

Additionally, any assistance in testing `solt` across different execution environments is greatly appreciated.

### Acknowledgments

The following repositories served as foundational references for the Solidity Templates library:

- [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)

The following libraries were integral to implementing key features of utilities:

- [EJS](https://github.com/mde/ejs) – Used as the core templating engine
- [Argparse](https://github.com/nodeca/argparse) – Used for command-line parameter parsing


# SOLT Utility

Currently, the `solt` utility includes only one command: `pp` (the preprocessor). More commands will be introduced in future updates.

To view all available options for the utility, use the following command:

```
npx solt
```

or

```
npx solt -h
```

**Note:** General help does not include details for specific commands. To view help information for a specific command, run it without parameters:

```
npx solt pp
```

or

```
npx solt pp -h
```

## Preprocessor

The `solt pp` command runs the preprocessor, processing one or more template files along with template variables, additional template directories, and other options. These options apply universally to all input files.

### Usage

If the `solt` package is installed locally, you can run it with `npx`. All examples below assume usage via `npx`:

```
npx solt pp
```

Executing `solt pp` without arguments displays a brief help message:


```
> npx solt pp
usage: solt pp [-h] [--template-folder FOLDER] [--template-folder-] [-I FOLDER] [-D VARIABLE] [-o OUTPUT] [--stderr] [FILE ...]

positional arguments:
  FILE                  Files to be processed. All files are joined together in the output. You can use `--` to separate files from options

optional arguments:
  -h, --help            show this help message and exit
  --template-folder FOLDER
                        The template search path is collected searching this folder name in the installed packages. The default is `templates`
  --template-folder-    Turn off the --template-folder option, no any folder will be searched in the installed packages
  -I FOLDER             Extend the template search path. Repeat the option to extend the list
  -D VARIABLE           Define variables in form of `VARIABLE=VALUE` or `VARIABLE`. Repeat the option to extend the list
  -o OUTPUT             Output file. Leave it blank or absent to stream everything to the STDOUT
  --stderr              Redirect all console messages to stderr
```

It is recommended to run `solt pp` from the root directory of your project to ensure correct template file name resolution.

### Output File

The preprocessor generates all processed code into a single output file. By default, this is the standard output (`stdout`), but you can specify a file using the `-o` option.

The preprocessor also produces diagnostic messages at different levels (WARNING, INFO, and DEBUG). These messages are directed to stdout, meaning they may be mixed with the generated code. To prevent this, use the `--stderr` option to redirect diagnostic output to stderr instead:

```
> npx solt pp --stderr src/mycontract.solt >contracts/mycontract.sol
```

Alternatively, if you want to keep diagnostic messages in stdout while writing the generated code to a separate file, use the `-o` option:

```
> npx solt pp src/mycontract.solt -vvv -o contracts/mycontract.sol >solt.log 2>solt.err
```

Diagnostics messages generated at the ERROR level are always directed to the `stderr`.

### Template Search Path

The preprocessor searches for templates in multiple locations.

1.  **User-defined directories:** Any directories specified via the `-I name` command-line option are included in the search path. You can specify multiple directories by repeating `-I name`.
2.  **Installed package templates**: The preprocessor automatically searches for a `templates` subfolder within all locally and globally installed packages. Only direct `templates` subfolders are considered.

The search follows a sequential order. As soon as a matching template file is found, it is included for processing.

#### Example: Template Inclusion

Suppose your `src/mycontract.solt` file contains the following directive:

```
<%- include('some/file.solt') -%>
```

You run the preprocessor with:

```
> npx solt pp src/mycontract.solt -o contracts/mycontract.sol
```

If an installed package `X` contains `templates/some/file.solt`, this file will be included at the directive's location, and the final output will be saved as `contracts/mycontract.sol`.

If your own package directory also contains `templates/some/file.solt`, your file will take priority and override the version provided by package `X`.

#### Defining Custom Template Folders

If your templates are stored in a custom folder (e.g., `src/templates`), the preprocessor will not find them unless the custom folder is explicitly specified:

```
> npx solt pp src/mycontract.solt -o contracts/mycontract.sol -I src/templates
```

Now, if `src/templates/some/file.solt` exists, it will be included instead of any versions found in installed packages.

You can specify multiple custom template folders using multiple `-I` options:

```
> npx solt pp src/mycontract.solt -o contracts/mycontract.sol -I src/templates -I additional/templates -I extra/template/directory
```

#### Disabling Package Template Search

If you prefer to exclude searching templates in installed packages (including your own), disable the automatic search using:

```
> npx solt pp src/mycontract.solt -o contracts/mycontract.sol --template-folder-
```

This will result in an error because the required template file (`some/file.solt`) cannot be found. You can explicitly define a template folder to resolve this:

```
> npx solt pp src/mycontract.solt -o contracts/mycontract.sol --template-folder- -I templates
```

#### Customizing the Default Template Folder Name

By default, the preprocessor searches for templates in the `templates` folder within installed packages. You can change this default folder name using:

```
> npx solt pp src/mycontract.solt -o contracts/mycontract.sol --template-folder stencil
```

In this case, the `stencil` folder will be searched instead of `templates`.

### Preprocessor Variables

Preprocessor variables can be passed via the command line using the `-D NAME=VALUE` option or the shortened format `-D NAME`. In the shortened format, the variable is automatically assigned a value of `1`.

These variables can be referenced within template code using the following syntax:

```
<%- NAME -%>
```

For example, if you run the `solt pp` command as:


```
> npx solt pp src/mycontract.solt -o contracts/mycontract.sol -D NAME=VALUE
```

The directive `<%- NAME -%>` in the template will be replaced with `VALUE` in the output.

### Include Directives

The predefined `include` directive allows inserting the processed code from an included template into the source file:

```
<%- include('solt/std.solt') -%>
```

The preprocessor searches for included templates within the templates path, as explained in the [Template Search Path](#template-search-path) section.

The `solt/std.solt` template introduces an additional directive, `include_with`, which allows redefining variables specifically for the included template:

```
<%- include_with('solt/set.solt', {
    SET_KEYTYPE: 'uint',
    SET_LIBRARY: 'mylibrary'
}) -%>
```

If any of the variables specified in the `include_with` options were previously defined, they will revert to their original values once processing of the directive is complete. This ensures that variables defined within `include_with` act as _local_ variables, affecting only the context of the included file.

### Customizing Templates

All preprocessing directives in Solidity Templates are enclosed within special brackets, `<%` and `%>`, known as _tags_.

Inside these brackets, you can write JavaScript code, referred to as _scriptlets_. Scriptlets allow you to define new template variables, modify existing ones, and introduce custom directives.

The templating engine maintains the context of scriptlet execution within the `locals` JavaScript variable. This context persists across subsequent scriptlets within the same template and even carries over when including another template. This capability allows you to define contextual data once and reuse it across different sections of the template. For examples of such declarations, refer to `solt/std.solt`.

### Template Tags

Solidity Templates leverage various types of tags, each serving a specific purpose in preprocessing. Their behavior is based on [EJS](https://github.com/mde/ejs) conventions:

- `<%` – _Scriptlet tag_: Used for control flow logic, does not produce output.
- `<%_` – _Whitespace Slurping Scriptlet_: Removes all preceding whitespace.
- `<%-` – Outputs the value directly into the template.
- `<%=` – Outputs the value as a valid string literal. Unlike standard EJS, which performs automatic HTML escaping, `solt` modifies this behavior to ensure proper escaping for string literals instead. To correctly format a string literal in the output, enclose the directive in quotes, e.g., `"<%= VAR -%>"`.
- `<%#` – Comment tag: No execution, no output.
- `%>` – Standard closing tag.
- `-%>` – _Trim-mode tag_: Removes the newline immediately following it.
- `_%>` – _Whitespace Slurping End Tag_: Strips all trailing whitespace.

Additionally, the following sequences allow literal output of bracket characters:

- `<%%` – Outputs `<%` as plain text.
- `%%>` – Outputs `%>` as plain text.


### Standard Template Extensions

The `solt/std.solt` template extends preprocessing capabilities by introducing additional directives and functions, including:

- `<%- include_with(name, { varname1: value1, varname2: value2, ...}) -%>` Includes the template `name` while locally redefining variables. See [Include directives](#include-directives) for details.
- `<%- is_valuetype(name) -%>` Solidity-specific function that determines whether the type specified in `name` is a value type. Returns `true` for types like `uint256` or `bytes16` and `false` for types like `string` or `bytes`. This function can also be used in scriptlets as `is_valuetype(name)` for type-checking.
- `<%- argtype(name) -%>` Solidity-specific function that applies `is_valuetype()` to determine the appropriate type for function arguments, return values, or local variables.
    - Returns the type unchanged for value types (`uint256` → `uint256`).
    - Adds `memory` for reference types (`string` → `string memory`).

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
    uint256.Set private uint256set;
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
