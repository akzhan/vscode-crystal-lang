# VSCode Extension for Crystal Language

This extension provides support for The [Crystal](https://github.com/crystal-lang) programming language.

![crystal icon](https://i.imgur.com/GoiQmzC.gif)

## Features

* Snippets
* Formatting
* Problems finder
* Document Symbols
* Syntax highlighting
* Show variable type on Hover
* Show and Peek Implementations
* Increment and decrements indentation
* Method completion for Literals and Symbols

## Requirements

You need [Crystal](https://github.com/crystal-lang) installed in your system to get compiler features like goTo implementation and diagnostics.

Some features like _syntax highlighting_, _snippets_ and _symbols_ work without Crystal compiler, so you can code Crystal on Windows if you want :smile:

## Configuration

`crystal-lang` provides some useful configuration inside `settings.json`:

```json
{
"crystal-lang.problems": "syntax",
"crystal-lang.maxNumberOfProblems": 10,
"crystal-lang.mainFile": "",
"crystal-lang.processesLimit": 3,
"crystal-lang.implementations": false,
"crystal-lang.completion": false,
"crystal-lang.types": false,
"crystal-lang.server": false,
"crystal-lang.logLevel": "error"
}
```

> On Windows the document must use `LF` instead of `CRLF` to allow symbols completion.

### Problems

`crystal-lang.problems` allow setting different error levels. By default, the problem finder just check syntax errors. The options are:

![problem finder](https://i.imgur.com/ukl1jyg.gif)

- **syntax**: check syntax and tokens (default).
- **build**: check requires, objects and methods without code gen (resource heavy).
- **none**: disable problem finder.

```json
{
"crystal-lang.problems": "syntax | build | none",
}
```

Problems are checked when a crystal document is opened or saved. If you wish you can add your customized keybinding for `Crystal Run Diagnostic` to run problem finder whenever you want.

![run diagnostic](https://i.imgur.com/bLRgbdC.png)

> Some features like **implementations** and **show type on hover** can show their own errors.

### PoblemsLimit

`crystal-lang.maxNumberOfProblems` allow to limit the amount of problems that appears in problems view. The default value is 20.

### MainFile

`crystal-lang.mainFile` says to the compiler which file should analyze.

It is useful when `"crystal-lang.problems" = "build"` in project where a main file do `require "/**"`

Also is used by features like **implementations** and show **type on hover** to specify the tool scope.

> Be sure that mainFile is a valid **absolute** filepath.

### ProcessesLimit

This extension block the amout of crystal processes executing in parallel because it doesn't use a language server yet, see [Scry](https://github.com/kofno/scry).

Commonly crystal takes milliseconds to do something like formatting, but in some projects other features like implementations or completion can take a moment. To prevent using too many resources you can set the amount of processes with:

```json
{
	"crystal-lang.processesLimit": 3,
}
```

> By default, is 3. In my computer each crystal process uses almost 50 MB and less than 1 second.

### Implementations

You can use this feature to peek or go to implementation of a method. It works per document only, full workspace navigation isn't available yet. However, you can try multiple files implementation setting mainFile in `settings.json`.

![implementations](https://i.imgur.com/Fb0HVc6.gif)

### Completion

This setting ensure to enable instance method completion using crystal tool context.

Suggestion of methods and subtypes while typing is not supported. You need to type `.` (dot) or `::` (colons) and then press `CTRL + SPACE` or `CMD + SPACE` to call method suggestion.

![instance method completion](https://i.imgur.com/3Peiizd.gif)

Basic code completion is always enabled. (Top Level, Symbols and Snippets)

![subtypes completion](https://i.imgur.com/qC9UBzC.gif)

However, you can totally disable completions in `settings.json`:

```json
{
	"editor.quickSuggestions": {
		"other": true,
		"comments": false,
		"strings": false
	}
}
```

### Types

Show type information for variables only. This feature uses `crystal tool context` to get types. Information is recalculated when the cursor changes line position.

![types on hover](https://i.imgur.com/5COCsQX.gif)

### Server (NEW)

It's **Experimental** feature using Scry and Language Server Protocol.

> Reload your editor after enable this feature.

[![Scry](https://i.imgur.com/ticTfT8.png)](https://github.com/faustinoaq/scry)

The following features are implemented:

- Formatting
- Live Diagnostics
- GoTo Definition
- Peek Definition

> Only Linux 64 bit binary is avaliable, Win32 and Mac aren't supported yet.

Scry server is distributed and auto installed with this extension.

It comes as a `.7z` file of **1.5 Mb** size, and **10.5 Mb** uncompressed.

Checksums for `scry.7z` version `0.5.0~1`

Type	| Checksum
------- | -------
**MD5** | `e53f6115f872be846d0a59618f283859`
**SHA-1** | `1b450c702265a35ac5db1e19fddf6ce116d33038`

### LogLevel

Controls the amount of data logged by Scry server.

> You can see logs in `.scry.out` located in your home directory or your workspace.

Levels avaliables:

```json
{
"type": "string",
"default": "error",
"enum": [
	"debug",
	"info",
	"warn",
	"error",
	"fatal"
]
}
```

## Messages

> **show types**, **peek implementations** and **complete instance methods** tools check code errors, if errors exists they wait until they are fixed.

Sometimes in some projects, `crystal tool` turns heavy, in this case you can check error and info messages.

![messages](https://i.imgur.com/e1G9iIi.png)

Errors and info messages are shown in developer tools:

- `ERROR: crystal formatter --check`: when crystal errors are found in your code.
- `ERROR: crystal build`: when crystal build --no-codegen failed.
- `ERROR: crystal tool context`: when crystal tool found errors in your code.
- `ERROR: spawn`: when crystal program not exist in path or `mainFile` is wrong.
- `ERROR: JSON parse`: when crystal output is different of JSON.
- `INFO: processesLimit has been reached`: your project is taking too much time to analyze.
- `INFO: implementations are disabled`: when `implementations` are disabled in settings.
- `INFO: show types on hover is disabled`: when `types` are disabled in settings.
- `INFO: instance method completion is disabled`: when `completion` is disabled in settings.

The following images show crystal status bar messages:

![crystal build](https://i.imgur.com/9nRIO5o.png)

![crystal tool context](https://i.imgur.com/xCUt9GJ.png)

![crystal tool implementations](https://i.imgur.com/7qImusH.png)

## Know issues

- Linter and formatter are implemented using Node.js `child_process`, so perfomance could be affected. You can use a different problem level.

- `macros` can produce some unwanted behaviors, disable _peek implementations, instance method completions and types on hover_ to hide errors.

- ECR syntax is very basic. You can use vscode `text.html` instead or enable emmet for `text.ecr` in your `settings.json`:

```json
{
  "emmet.syntaxProfiles": {
    "ecr": "html"
  }
}
```

- In some big projects like [crystal compiler](https://github.com/crystal-lang) itself, the setting `"crystal-lang.problems" = "build"` could be very unresponsible, use `"syntax"` instead.

- Scry server is experimental, some bug can appear. Scry is a bit heavy, it uses from 5 Mb until 500Mb of RAM in my computer.

- Also, you can disable _peek implementations, instance method completions and types on hover_ to free resources. (**Formatting** and **symbols completion** are **lightweight** features).

## More Screenshots

### Increment and decrement identation

![identation](https://i.imgur.com/V15TxFb.gif)

> Decrement `end` keyword on type is now avaliable in vscode insiders [#2262](https://github.com/Microsoft/vscode/issues/2262#issuecomment-309485218).

### Formatting code support

![formatting](https://i.imgur.com/VTeOkOm.gif)

### Syntax highlighting

![ecr](https://i.imgur.com/w9aBlIH.gif)

### Snippets

![snippets](https://i.imgur.com/GNICZSH.gif)

### Symbols

![symbols](https://i.imgur.com/6cqcXD3.gif)

### Code Outline (NEW)

Recent version of VSCode (1.13.1) allow to extensions creators show symbols in tree view. You can use the awesome [Code Outline](https://marketplace.visualstudio.com/items?itemName=patrys.vscode-code-outline) extension to see code tree of crystal document.

![code outline](https://i.imgur.com/guRDY0T.png)

### Debugging

[Native Debug](https://marketplace.visualstudio.com/items?itemName=webfreak.debug) is an excelent extension that allow you to debug crystal and other languages that compile to binary.

> Be sure of compile your crystal code with `--debug` flag

![Native Debug extension](https://i.imgur.com/mrJzrxI.png)

### Icon theme

You can use the wonderful [Nomo Dark icon theme](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-icontheme-nomo-dark) to see crystal icon.

![Nomo Dark icon theme](https://i.imgur.com/6QxIyWV.png)

## Roadmap

- Translate Crystal syntax from `.tmLanguage` to `.json`.
- Full Support for Language Server Protocol, see [Scry](https://github.com/kofno/scry)

## Release Notes

See [Changelog](https://github.com/faustinoaq/vscode-crystal-lang/blob/master/CHANGELOG.md)

## Contributing

1. Fork it https://github.com/faustinoaq/vscode-crystal-lang/fork
2. Create your feature branch `git checkout -b my-new-feature`
3. Commit your changes `git commit -am 'Add some feature'`
4. Push to the branch `git push origin my-new-feature`
5. Create a new Pull Request

## Contributors

- [@faustinoaq](https://github.com/faustinoaq) Faustino Aguilar - creator, maintainer
