Table of Contents
=================

* [Markdown API](#markdown-api)
  * [Install](#install)
  * [Usage](#usage)
  * [Tags](#tags)
  * [Cues](#cues)
    * [Member](#member)
    * [Static](#static)
    * [Inheritance](#inheritance)
  * [API](#api)
    * [parse](#parse)
      * [Options](#options)
    * [conf](#conf)
      * [LANG](#lang)
    * [tags](#tags)
      * [findTag](#findtag)
      * [collect](#collect)
    * [writers](#writers)
      * [heading](#heading)
      * [newline](#newline)
      * [fenced](#fenced)
      * [signature](#signature)
      * [parameters](#parameters)
      * [meta](#meta)
      * [see](#see)
  * [Developer](#developer)
    * [Test](#test)
    * [Cover](#cover)
    * [Lint](#lint)
    * [Clean](#clean)
    * [Readme](#readme)

Markdown API
============

[<img src="https://travis-ci.org/tmpfs/mdapi.svg?v=2" alt="Build Status">](https://travis-ci.org/tmpfs/mdapi)
[<img src="http://img.shields.io/npm/v/mdapi.svg?v=2" alt="npm version">](https://npmjs.org/package/mdapi)
[<img src="https://coveralls.io/repos/tmpfs/mdapi/badge.svg?branch=master&service=github&v=2" alt="Coverage Status">](https://coveralls.io/github/tmpfs/mdapi?branch=master).

Effective and fast API comments to commonmark compliant markdown.

Designed for small to medium sized libraries, for large projects use one of the many other documentation tools. Uses `javascript` for fenced code blocks by default but you could conceivably use this tool with any language.

See [EXAMPLE.md](https://github.com/tmpfs/mdapi/blob/master/EXAMPLE.md) or the [api](#api) for example output.

## Install

```
npm i mdapi
```

## Usage

```
mdapi [options] [files...]

  -o, --output=[FILE]  Write output to FILE (default: stdout).
  -t, --title=[VAL]    Title for initial heading.
  -l, --level=[NUM]    Initial heading level (default: 1).
  -L, --lang=[LANG]    Language for fenced code blocks (default: javascript).
  -i, --indent=[NUM]   Number of spaces for JSON (default: 2).
  -a, --ast            Print AST as JSON.
  -h, --help           Display this help and exit.
  --version            Print the version and exit.

Report bugs to https://github.com/tmpfs/mdapi/issues
```

Print the documentation to stdout:

```
mdapi index.js
```

Need HTML or XML? No problem, install [commonmark](https://github.com/jgm/commonmark.js) and pipe the output:

```
mdapi index.js | commonmark
```

## Tags

The following tags are supported:

* `@module`: Marks a module declaration, a module name should be given.
* `@class`: Marks a class declaration, a class name should be given.
* `@constructor`: Marks a class constructor function, a function name should be given.
* `@inherits`: Indicates the super class hierarchy for a constructor, accepts multiple values.
* `@function`: Marks a function declaration, the function name should be given.
* `@prototype`: Marks a prototype function declaration, a class name may be specified; default is current class scope.
* `@static`: Marks a function as static.
* `@property`: Marks a property declaration, the property name should be given.
* `@constant`: Marks a constant property, the property name should be given.
* `@default`: Default value for a property.
* `@private`: Exclude the comment from the output.
* `@param`: Declares an argument for a function.
* `@option`: Documents an option property.
* `@usage`: Usage example(s) that appear below the first heading.
* `@throws`: Function throws exception(s).
* `@deprecated`: Flag as deprecated.
* `@author`: Author meta data.
* `@version`: Version information.
* `@since`: Since version.
* `@see`: Creates a list of links, each value should be a URL if a description is given it becomes the name for the link.

Note that whilst declaring names explicitly (`@function` etc) is a little more maintenance it is deemed to be preferable to re-parsing the file to automatically extract function names.

## Cues

The generated markdown includes certain visual cues in headings:

### Member

```
.member
```

Indicates a class member.

### Static

```
#member
```

Indicates a static class member, borrowed from HTML identifiers.

### Inheritance

```
SubClass < SuperClass
```

Indicates an inheritance hierarchy, borrowed from Ruby.

## API

```javascript
var parse = require('mdapi');
parse(['index.js'], {stream: process.stdout});
```

### parse

```javascript
parse(files[, opts], cb)
```

Accepts an array of files and iterates the file contents in series
asynchronously.

Parse the comments in each file into a comment AST
and transform the AST into commonmark compliant markdown.

The callback function is passed an error on failure: `function(err)`.

* `files` Array List of files to parse.
* `opts` Object Parse options.
* `cb` Function Callback function.

#### Options

* `stream` Writable The stream to write to, default is `stdout`.
* `conf` Object Configuration overrides.
* `level` Number Initial level for the first heading, default is `1`.
* `heading` String Value for an initial heading.
* `lang` String Language for fenced code blocks, default is `javascript`.

### conf

Every aspect of the program output may be modified by changing the
configuration variables.

#### LANG

```javascript
LANG = javascript;
```

Default language for fenced code blocks.

### tags

Helper functions for working with AST comment tags.

These functions are available via a `tags` property on the scope for
render functions as well as writer functions which are bound to the
scope of the stream.

#### findTag

```javascript
findTag(id, token)
```

Finds a tag in the tag list by tag id.

Returns a tag or `null` if not found.

* `id` String The tag identifier.
* `token` Object The current AST token.

#### collect

```javascript
collect(id, token)
```

Collects all tags with the specified id.

Returns an array of tags.

* `id` String The tag identifier.
* `token` Object The current AST token.

### writers

Stream writer helper functions.

Responsible for writing to the output stream but should **not** perform
any formatting of the output string, their role is to extract the
relevant information; call a format function and write the result to
the stream appending newlines where necessary.

Render functions can access these methods using `this`.

These functions call the format functions using `this.format`.

#### heading

```javascript
heading(val, level)
```

Write a heading at the specified level.

* `val` String The value for the heading.
* `level` Number The level for the heading.

#### newline

```javascript
newline([num])
```

Write one or more newlines.

* `num` Number The number of newlines to print, default is 1.

#### fenced

```javascript
fenced(code)
```

Write a fenced code block.

* `code` String The code content for the fenced block.

#### signature

```javascript
signature(params, name, lang)
```

Write a function signature as a fenced code block.

* `params` Array List of tags.
* `name` String A name for the function.
* `lang` String A language for the info string.

#### parameters

```javascript
parameters(params)
```

Write a list of parameters.

Used for writing param, option, throws etc.

* `params` Array List of tags.

#### meta

```javascript
meta(token)
```

Write meta data (author, version, since etc) and handle writing the
deprecated notice.

* `token` Object The current token.

#### see

```javascript
see(token)
```

Write the list of see also links.

* `token` Object The current token.

## Developer

### Test

To run the test suite:

```
npm test
```

### Cover

To generate code coverage run:

```
npm run cover
```

### Lint

Run the source tree through [jshint](http://jshint.com) and [jscs](http://jscs.info):

```
npm run lint
```

### Clean

Remove generated files:

```
npm run clean
```

### Readme

To build the readme file from the partial definitions (requires [mdp](https://github.com/tmpfs/mdp)):

```
npm run readme
```

Generated by [mdp(1)](https://github.com/tmpfs/mdp).

[jshint]: http://jshint.com
[jscs]: http://jscs.info
[commonmark]: https://github.com/jgm/commonmark.js
[mdp]: https://github.com/tmpfs/mdp
