# Solidity Templates

The Solidity Templates `solt` package contains utilities for using *type-agnostic*, customized Solidity templates in your contract.

The Solidity Templates library provided by the `solt` package also contains a number of ready-to-use templates. The `solt` utilities allow using these templates in your code *without copying and modifying* them for your needs, so your code remains granulated, encapsulated, and reusable.

## Inspiration of the Solidity Templates

The Solidity language has a number of options to make the development of the contract easier through encapsulation. It allows using libraries to hide the details of the implementation and make the code reusable. But such reusable code remains type-dependent.

The Solidity Templates utility bundle improves code encapsulation and reusability options of the Solidity language. It makes it possible to write and reuse the *type-agnostic* code, having a single source of such code for any of all (or a big subset of) types, define literal constants, or even blocks of code, and embed them into your code in form looking like a function or procedure call.

## Main idea of the Solidity Templates

The Solidity Templates package uses a preprocessor for contracts. The developer can use all preprocessor directives directly inside the code of the developed contract.

## What the Solidity Templates utilities do

The `solt` utilities allow using preprocessor directives in the code of your contract, like in `C` or `C++` code. The utilities embed the preprocessor into the development pipeline.

## What is a Solidity Template file

Every Solidity Template file has extension `.solt` and can be used in your Solidity contract using the `#include` directive of the preprocessor, like `.h` files for `C/C++` code. The template may contain any valid Solidity code, customized by the preprocessor directives. You can use preprocessor branches, including and excluding parts of your code depending on the preprocessor condition expressions, preprocessor definitions, which create names associated with the Solidity code, variable names, constants, libraries, other contracts, etc.

All Solidity Template files of the library reside in the `templates` folder of the package, or its' subfolders.

## Platform

The Solidity Templates utilities are based on the GNU Make and node.js. So any Linux platform with the node.js installed looks appropriate. Using the Solidity Templates on any other POSIX-compliant platform is also available as far as you can install base command-line utilities like `find`, GNU Make, and node.js.

## Contribution

### Core templates library contribution

The author is very appretiated to include any extension of the core Solidity Templates library with the new Solidity templates.

### Solidity Templates utilities

The existent preprocessor is far from ideal. I'm glad to see any ideas, or even implementations of the more sophisticated preprocessor implementing the extended view of the preprocessing, sophisticated language extentions like `C++` templates or something.

The author also appretiates any support for utilities on different execution platforms.

## Big thanks

The following repositories were used as initial sources of the code for the Solidity Templates library

- https://github.com/OpenZeppelin/openzeppelin-contracts
