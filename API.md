## API

### parse

```javascript
parse(files[, opts], cb)
```

```javascript
var parse = require('mkapi')
   , parse(['index.js'], {output: process.stdout});
```

Accepts an array of files and iterates the file contents in series 
 asynchronously.

 Parse the comments in each file into a comment AST 
 and transform the AST into commonmark compliant markdown.

 The callback function is passed an error on failure: `function(err)`.

Returns an event notifier.

* `files` Array List of files to parse.
* `opts` Object Parse options.
* `cb` Function Callback function.

#### Options

* `output` Writable The stream to write to, default is `stdout`.
* `conf` Object Configuration overrides.
* `level` Number Initial level for the first heading, default is `1`.
* `title` String Value for an initial heading.
* `lang` String Language for fenced code blocks, default is `javascript`.

#### Events

* `error` when a processing error occurs.
* `file` when a file buffer is available.
* `ast` when the comment AST is available.
* `finish` when all files have been parsed.

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

### tag

```javascript
tag(name[, opts])
```

Adds a tag to the list of known tags.

 Use this to create custom tags.

Returns the tag definition.

* `name` String The name of the tag, do not include `@`.
* `opts` Object An object whose fields are merged with the tag 
 definition.

### Tag

```javascript
new Tag()
```

Encapsulates a tag definition.

### Comment

Encapsulates operations on a comment AST token.

 This implementation uses a cache map to look up tags in the 
 underlying list of tags.

#### .getDetail

```javascript
getDetail.prototype.getDetail([names])
```

Get the details name, type tag and id for this comment.

Returns an object with `name`, `type` and `id`.

* `names` Array List of custom tag names.

#### .getInfo

```javascript
getInfo.prototype.getInfo(method)
```

Gets an info object containing generic tag lookups.

 If the `method` parameter is given the object is decorated with 
 fields specific to the `function` type.

* `method` Boolean Inject function specific information.

#### .find

```javascript
find.prototype.find(id)
```

Finds the last tag in the tag list by tag id.

Returns a tag or `undefined` if not found.

* `id` String The tag identifier.

#### .collect

```javascript
collect.prototype.collect(id)
```

Collects all tags with the specified id.

Returns an array of tags.

* `id` String The tag identifier.

### conf

Every aspect of the program output may be modified by changing the 
 configuration variables.

 Constants representing each of the recognised tags are exposed on this 
 module, for example: `this.conf.MODULE` yields `module`.

#### names

```javascript
Array names
```

List of default tag names.

#### title

```javascript
Object title
```

Variables for headings and notices, eg: `Deprecated`.

#### shorthand

```javascript
Array shorthand
```

List of tag names that support the shorthand symbol type.

#### format

```javascript
Object format
```

Map of format functions.

* [formats module](#formats)

#### cues

```javascript
Object cues
```

Map of variables for visual cues.

#### render

```javascript
Object render
```

Map of render functions.

* [render module](#render)

#### include

```javascript
Object include
```

Map of symbol types to include.

#### LANG

```javascript
String LANG = javascript;
```

Default language for fenced code blocks.

### formats

Provides string format functions.

#### heading

```javascript
heading(val, level)
```

Gets a heading string.

Returns the heading.

* `val` String The value for the heading.
* `level` Number The level for the heading.

#### meta

```javascript
meta(val, title)
```

Gets a list item for the meta data.

Returns a list item for the meta data.

* `val` Object The value for the heading.
* `title` String A prefix for the meta item.

#### fenced

```javascript
fenced(code, info)
```

Gets a fenced code block.

Returns a fenced code block.

* `code` String The content for the code block.
* `info` String A language info string.

#### deprecated

```javascript
deprecated(tag)
```

Gets a deprecated notice.

Returns a deprecation notice.

* `tag` Object The deprecated tag.

#### signature

```javascript
signature(params)
```

Gets a function signature.

Returns a function signature.

* `params` Array Collection of param tags.

#### parameter

```javascript
parameter(tag)
```

Gets a list item for parameter listings.

Returns a parameter list item.

* `tag` Object The param tag.

#### returns

```javascript
returns(token, tag)
```

Gets a returns statement.

Returns the returns value.

* `token` Object the current AST token.
* `tag` Object The returns tag.

#### link

```javascript
link(tag)
```

Gets a link from a tag.

Returns formatted string.

* `tag` Object The see tag.

#### getAccess

```javascript
getAccess(opts)
```

Gets the access modifier for a symbol.

Returns the access for the symbol.

* `opts` Object Format options describing the symbol.

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


* `TODO` remove magic strings.
* `tag` Object The declaring tag.
* `opts` Object Format options describing the function.
* `title` String An existing title for the function.

#### getTodo

```javascript
getTodo(tag)
```

Gets the todo list.

Returns The list of todo items.


* `TODO` remove magic strings.
* `tag` Object The declaring tag.

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

output writer helper functions.

 Responsible for writing to the output output but should **not** perform 
 any formatting of the output string, their role is to extract the 
 relevant information; call a format function and write the result to 
 the output appending newlines where necessary.

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

#### Writer < EventEmitter

```javascript
new Writer()
```

Writer helper functions, an instance of this class is 
 the scope for program execution and is decorated with additional 
 fields when parse is called.

