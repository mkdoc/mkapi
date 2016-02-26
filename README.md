Table of Contents
=================

* [Markdown API](#markdown-api)
  * [Install](#install)
  * [Usage](#usage)
  * [Tags](#tags)
    * [Types](#types)
    * [Flags](#flags)
    * [Name](#name)
    * [Module](#module)
    * [Class](#class)
    * [Constructor](#constructor)
    * [Inherits](#inherits)
  * [Cues](#cues)
    * [Member](#member)
    * [Static](#static)
    * [Inheritance](#inheritance)
  * [API](#api)
    * [each](#each)
    * [print](#print)
    * [parse](#parse)
      * [Options](#options)
    * [register](#register)
    * [defaults](#defaults)
    * [Comment](#comment)
      * [getInfo](#getinfo)
      * [find](#find)
      * [collect](#collect)
    * [conf](#conf)
      * [heading](#heading)
      * [meta](#meta)
      * [fenced](#fenced)
      * [deprecated](#deprecated)
      * [signature](#signature)
      * [parameter](#parameter)
      * [returns](#returns)
      * [link](#link)
      * [property](#property)
      * [method](#method)
      * [title](#title)
      * [format](#format)
      * [cues](#cues)
      * [LANG](#lang)
    * [render](#render)
      * [_class](#_class)
      * [_function](#_function)
      * [_property](#_property)
    * [writers](#writers)
      * [Writer](#writer)
      * [heading](#heading-1)
      * [newline](#newline)
      * [fenced](#fenced-1)
      * [signature](#signature-1)
      * [parameters](#parameters)
      * [meta](#meta-1)
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

Declarative, extensible, language neutral and fast API comments to commonmark compliant markdown.

Designed for small to medium sized libraries, for large projects use one of the many other documentation tools. Uses `javascript` for fenced code blocks by default but you can [configure](#conf) this library for any language.

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

The general syntax for tags is:

```javascript
@tag [{type}] [name] [description]
```

When a tag name is enclosed in `[]` it is deemed to be optional, for example:

```javascript
/**
 *  @name {function} noop
 *  @param {Function} [cb] Callback function.
 */
```

The following tags are supported:

* `@name`: Sets the symbol name and optionally the symbol type.
* `@module`: Symbol is a module. 
* `@class`: Symbol is a class. 
* `@constructor`: Symbol is a constructor function.
* `@inherits`: Indicates the super class hierarchy for `@constructor`.
* `@function`: Symbol is a function.
* `@member`: Symbol is a member of an object.
* `@static`: Symbol is static.
* `@property`: Symbol is a property.
* `@constant`: Constant symbol, implies `@readonly`.
* `@default`: Default value for a property.
* `@private`: Member is private, excluded from the output by default.
* `@param`: Declares an argument for a function.
* `@option`: Documents an option property.
* `@usage`: Usage example(s) that appear below the first heading.
* `@throws`: Function throws exception(s).
* `@deprecated`: Flag symbol as deprecated.
* `@author`: Author meta data.
* `@version`: Version information.
* `@since`: Since version.
* `@see`: Creates a list of links, each value should be a URL if a description is given it becomes the name for the link.

### Types

The following symbol type identifiers are supported:

* `module`: Symbol is a module.
* `class`: Symbol is a class.
* `constructor`: Symbol is a class constructor.
* `member`: Symbol is a member of an object.
* `function`: Symbol is a function.
* `property`: Symbol is a property.

A type maps to a render function, see the [render api docs](#render).

Type identifiers may be specified using `{id}` to the following tags:

* `@name`: Set the name and type.
* `@static`: Set the name, type and mark as static.
* `@constant`: Set the name, type and mark as a constant.

For example to declare a `function` symbol with the name `noop`:

```javascript
@name {function} noop
```

### Flags

Flag tags should not be given values:

* `@private`: Flag symbol as private.
* `@protected`: Flag symbol as protected.
* `@public`: Flag symbol as public.
* `@readonly`: Flag symbol as read-only.

### Name

```javascript
@name [{type}] <name>
```

Sets the symbol name and optionally specifies the type of the symbol (see [types](#types)).

```javascript
/**
 *  @name {function} FunctionName
 */
```

```javascript
/**
 *  @name FunctionName
 *  @function
 */
```

### Module

```javascript
@module <name>
```

Document a module.

```javascript
/**
 *  Module description.
 *
 *  @module ModuleName
 */
```

### Class

```javascript
@class <name>
```

Document a class.

```javascript
/**
 *  Class description.
 *
 *  @class ClassName
 */
```

### Constructor

```javascript
@constructor <name>
```

Document a constructor function.

```javascript
/**
 *  Constructor description.
 *
 *  @constructor ConstructorName
 */
```

### Inherits

```javascript
@inherits <superclass...>
```

Document inheritance hierarchy for a constructor function.

```javascript
/**
 *  Constructor description.
 *
 *  @constructor ConstructorName
 *  @inherits EventEmitter Object
 */
```

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

### each

```javascript
each(files, it, cb)
```

Iterate input files in series asynchronously.

* `files` Array List of input files to load.
* `it` Function File iterator function.
* `cb` Function Callback function.

### print

```javascript
print(ast, opts, cb)
```

Print markdown from the parsed AST.

* `ast` Object The parsed comments abstract syntax tree.
* `opts` Object Parse options.
* `cb` Function Callback function.

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

### register

```javascript
register(type, renderer)
```

Register a render function for a given type tag.

* `type` String The type name for the tag.
* `renderer` Function The render function.

### defaults

```javascript
defaults(conf, render)
```

Register default renderer mappings.

* `conf` Object The program configuration.
* `render` Object The map of render functions.

### Comment

Encapsulates operation on a comment AST token.

#### getInfo

```javascript
getInfo(method)
```

Gets an info object containing generic tag lookups.

If the `method` parameter is given the object is decorated with
fields specific to the `function` type.

* `method` Boolean Inject function specific information.

#### find

```javascript
find(id)
```

Finds the first tag in the tag list by tag id.

Returns a tag or `null` if not found.

* `id` String The tag identifier.

#### collect

```javascript
collect(id)
```

Collects all tags with the specified id.

Returns an array of tags.

* `id` String The tag identifier.

### conf

Every aspect of the program output may be modified by changing the
configuration variables.

Constants representing each of the recognised tags are exposed on this
module, for example: `this.conf.MODULE` yields `module`.

#### heading

```javascript
heading(val, level)
```

Gets a heading string.

Returns formatted string.

* `val` String The value for the heading.
* `level` Number The level for the heading.

#### meta

```javascript
meta(val, title)
```

Gets a list item for the meta data.

Returns formatted string.

* `val` Object The value for the heading.
* `title` String A prefix for the meta item.

#### fenced

```javascript
fenced(code, info)
```

Gets a fenced code block.

Returns formatted string.

* `code` String The content for the code block.
* `info` String A language info string.

#### deprecated

```javascript
deprecated(tag)
```

Gets a deprecated notice.

Returns formatted string.

* `tag` Object The deprecated tag.

#### signature

```javascript
signature(params)
```

Gets a function signature.

Returns formatted string.

* `params` Array Collection of param tags.

#### parameter

```javascript
parameter(tag)
```

Gets a list item for parameter listings.

Returns formatted string.

* `tag` tag The param tag.

#### returns

```javascript
returns(tag)
```

Gets a returns statement.

Returns formatted string.

* `tag` tag The returns tag.

#### link

```javascript
link(tag)
```

Gets a link from a tag.

Returns formatted string.

* `tag` tag The see tag.

#### property

```javascript
property(tag, value)
```

Gets a property code string.

Returns formatted string.

* `tag` tag The declaring tag.
* `value` tag A tag containing a value for the property.

#### method

```javascript
method(tag, opts)
```

Gets the heading title for a function.

* `tag` Object The declaring tag.
* `opts` Object Format options describing the function.

#### title

```javascript
title
```

Variables for headings and notices, eg: `Deprecated`.

#### format

```javascript
format
```

Map of format functions.

#### cues

```javascript
cues
```

Map of variables for visual cues.

#### LANG

```javascript
LANG = javascript;
```

Default language for fenced code blocks.

### render

Default render functions.

Render functions are called asynchronously and must invoke the callback
function to process the next comment.

#### _class

```javascript
_class(type, token, cb)
```

Render a class (or module) block.

* `type` Object The tag that initiated the render.
* `token` Object The current comment AST token.
* `cb` Function Callback function.

#### _function

```javascript
_function(type, token, cb)
```

Render a function block.

* `type` Object The tag that initiated the render.
* `token` Object The current comment AST token.
* `cb` Function Callback function.

#### _property

```javascript
_property(type, token, cb)
```

Render a property block.

* `type` Object The tag that initiated the render.
* `token` Object The current comment AST token.
* `cb` Function Callback function.

### writers

Stream writer helper functions.

Responsible for writing to the output stream but should **not** perform
any formatting of the output string, their role is to extract the
relevant information; call a format function and write the result to
the stream appending newlines where necessary.

Render functions can access these methods using `this`.

These functions call the format functions using `this.format`.

#### Writer

```javascript
new Writer()
```

Writer scope.

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
