Table of Contents
=================

* [Markdown API](#markdown-api)
  * [Install](#install)
  * [Usage](#usage)
  * [Comments](#comments)
  * [Description](#description)
  * [Tags](#tags)
    * [Meta Tags](#meta-tags)
    * [Notice Tags](#notice-tags)
    * [General Tags](#general-tags)
    * [Type Tags](#type-tags)
    * [Modifier Tags](#modifier-tags)
    * [Function Tags](#function-tags)
    * [Property Tags](#property-tags)
    * [Shorthand Tags](#shorthand-tags)
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
    * [parse](#parse)
      * [Options](#options)
    * [register](#register)
    * [Tag](#tag)
    * [Comment](#comment)
      * [describe](#describe)
      * [getDetail](#getdetail)
      * [getInfo](#getinfo)
      * [find](#find)
      * [collect](#collect)
    * [conf](#conf)
      * [title](#title)
      * [format](#format)
      * [cues](#cues)
      * [LANG](#lang)
    * [format](#format-1)
      * [heading](#heading)
      * [meta](#meta)
      * [fenced](#fenced)
      * [deprecated](#deprecated)
      * [signature](#signature)
      * [parameter](#parameter)
      * [returns](#returns)
      * [link](#link)
      * [property](#property)
      * [inherits](#inherits)
      * [method](#method)
    * [render](#render)
      * [_class](#_class)
      * [_function](#_function)
      * [_property](#_property)
    * [writers](#writers)
      * [heading](#heading-1)
      * [newline](#newline)
      * [fenced](#fenced-1)
      * [signature](#signature-1)
      * [parameters](#parameters)
      * [meta](#meta-1)
      * [describe](#describe-1)
      * [see](#see)
  * [Developer](#developer)
    * [Test](#test)
    * [Cover](#cover)
    * [Expect](#expect)
    * [Example](#example)
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

From code pass files and options:

```javascript
var parse = require('mdapi');
parse(['index.js'], {stream: process.stdout});
```

## Comments

Comments are parsed from `/**...*/` at the moment, later the aim is to support other styles of comment declarations.

## Description

Whilst many [tags](#tags) allow for a description parameter it is recommended that the description starts the comment so that it is more prominent.

```javascript
/**
 *  Module description.
 *
 *  @module ModuleName
 */
```

If you only have a short description use the `description` tag parameter:

```javascript
/**
 *  @module ModuleName Short module description.
 */
```

## Tags

The general syntax for tags is:

```javascript
@tag {type} name description
```

When a tag name is enclosed in `[]` it is deemed to be optional, for example:

```javascript
/**
 *  @name {function} noop
 *  @param {Function} [cb] Callback function.
 */
```

### Meta Tags

Meta tags are rendered as a list at the top of the block:

* `@author`: Author meta data.
* `@version`: Version information.
* `@since`: Since version.
* `@license`: License information.

### Notice Tags

Notice tags are rendered as blockquote elements at the top or below meta tags when present:

* `@deprecated`: Flag symbol as deprecated.
* `@todo`: Note something yet to be done.

### General Tags

The following tags are ways to add information to the output.

* `@name`: Sets the symbol name and optionally the symbol type.
* `@usage`: Usage example(s) that appear below the first heading.
* `@see`: Creates a list of links, each value should be a URL if a description is given it becomes the name for the link.

### Type Tags

A type tag maps to a render function, see the [render api docs](#render).

* `@module`: Symbol is a module.
* `@class`: Symbol is a class.
* `@constructor`: Symbol is a constructor function.
* `@function`: Symbol is a function.
* `@property`: Symbol is a property.

You can specify the type using the tag itself:

```javascript
/**
 *  @function getName  
 *  @protected
 */
```

Or you can use [shorthand tags](#shorthand-tags):

```javascript
/**
 *  @protected {function} getName
 */
```

### Modifier Tags

Modifier tags give information about a symbol:

* `@inherits`: Indicates the super class hierarchy for `@constructor` or `@class`.
* `@member`: Symbol is a member of an object.
* `@static`: Symbol is static.
* `@constant`: Constant symbol, implies `@readonly`.
* `@private`: Member is private, excluded from the output by default.
* `@protected`: Member is protected.
* `@public`: Member is public.
* `@abstract`: Member is abstract.
* `@readonly`: Member is read-only.

### Function Tags

Tags specific to the `{function}` type:

* `@param`: Declares an argument for a function.
* `@option`: Documents an option property.
* `@throws`: Function throws exception(s).

### Property Tags

Tags specific to the `{property}` type:

* `@default`: Default value for a property.

### Shorthand Tags

Type identifiers may be specified to some tags using a type `{id}`, the syntax is:

```javascript
@name {type} <name> [description]
```

* `@name`: Set the name and type.
* `@static`: Set the name, type and mark as static.
* `@constant`: Set the name, type and mark as a constant.
* `@public`: Set the name, type and mark as public.
* `@private`: Set the name, type and mark as private.
* `@protected`: Set the name, type and mark as protected.

For example to declare a `function` symbol with the name `noop`:

```javascript
@name {function} noop
```

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

Document inheritance hierarchy for a constructor function or class.

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
register(type[, renderer])
```

Register a render function for a given type tag.

Without the `renderer` option attempts to return a render function
for the specified type.

Returns a renderer or the registry.

* `type` String The type name for the tag.
* `renderer` Function The render function.

### Tag

```javascript
new Tag()
```

Encapsulates a tag definition.

### Comment

Encapsulates operation on a comment AST token.

#### describe

```javascript
describe(type, concat)
```

Returns a description for a comment.

* `type` Object The declaring type tag.
* `concat` Boolean Whether to concatenate the name and description.

#### getDetail

```javascript
getDetail([names])
```

Get the details name, type tag and id for this comment.

Returns an object with `name`, `type` and `id`.

* `names` Array List of custom tag names.

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

Finds the last tag in the tag list by tag id.

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

### format

Provides string format functions.

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

* `tag` Object The param tag.

#### returns

```javascript
returns(tag)
```

Gets a returns statement.

Returns formatted string.

* `tag` Object The returns tag.

#### link

```javascript
link(tag)
```

Gets a link from a tag.

Returns formatted string.

* `tag` Object The see tag.

#### property

```javascript
property(tag, opts)
```

Gets a property code string.

Returns formatted string.

* `tag` String The declaring tag.
* `opts` Object Format options describing the property.

#### inherits

```javascript
inherits(tag, opts)
```

Gets the inheritance string for a class or constructor.

* `tag` Object The declaring tag.
* `opts` Object Format options describing the function.

#### method

```javascript
method(tag, opts[, title])
```

Gets the heading title for a function.

* `tag` Object The declaring tag.
* `opts` Object Format options describing the function.
* `title` String An existing title for the function.

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

#### describe

```javascript
describe(type, token)
```

Print the description for a token.

* `type` Object The declaring type tag.
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

### Expect

Builds the test expectations, should be done when the format changes or the code is updated:

```
npm run expect
```

### Example

Builds [EXAMPLE.md](https://github.com/tmpfs/mdapi/blob/master/EXAMPLE.md):

```
npm run example
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
