## Tags

The following tags are supported:

* `@name`: Sets the symbol name and optionally the symbol type.
* `@module`: Marks a module declaration, a module name should be given.
* `@class`: Marks a class declaration, a class name should be given.
* `@constructor`: Marks a class constructor function, a function name should be given.
* `@inherits`: Indicates the super class hierarchy for a constructor, accepts multiple values.
* `@function`: Marks a function declaration, the function name should be given.
* `@member`: Marks a member of a class; a class name may be specified; default is current class scope.
* `@static`: Marks a member as static.
* `@property`: Property declaration, the property name should be given.
* `@constant`: Constant property, the property name should be given.
* `@default`: Default value for a property.
* `@private`: Member is private, excluded from the output by default.
* `@param`: Declares an argument for a function.
* `@option`: Documents an option property.
* `@usage`: Usage example(s) that appear below the first heading.
* `@throws`: Function throws exception(s).
* `@deprecated`: Flag as deprecated.
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
