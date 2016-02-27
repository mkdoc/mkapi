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

The following tags are supported:

* `@name`: Sets the symbol name and optionally the symbol type.
* `@module`: Symbol is a module. 
* `@class`: Symbol is a class. 
* `@constructor`: Symbol is a constructor function.
* `@inherits`: Indicates the super class hierarchy for `@constructor` or `@class`.
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
* `@see`: Creates a list of links, each value should be a URL if a description is given it becomes the name for the link.

### Meta Tags

Meta tags are rendered as a list at the top of the block:

* `@author`: Author meta data.
* `@version`: Version information.
* `@since`: Since version.
* `@license`: License information.

### Type Tags

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

A type tag maps to a render function, see the [render api docs](#render).

The following type identifiers are supported and map to corresponding render functions:

* `module`: Symbol is a module.
* `class`: Symbol is a class.
* `constructor`: Symbol is a class constructor.
* `function`: Symbol is a function.
* `property`: Symbol is a property.

### Shorthand Tags

Type identifiers may be specified to some tags using `{id}` using the syntax:

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
