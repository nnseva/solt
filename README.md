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
    mapping(<%- MAP_KEYTYPE -%> => <%- MAP_VALUETYPE -%>) my_map;
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

# Documentation

## [SOLT utility](docs/solt-utility.md)

## [SOLT library](docs/solt-library.md)
