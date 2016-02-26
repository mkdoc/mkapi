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
