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

Meta tags are rendered as a list at the top of the block below the symbol description:

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
* `@returns`: Document a return value.

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

Sets the symbol name and optionally specifies the type of the symbol (see [type tags](#type-tags)).

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
