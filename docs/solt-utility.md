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
