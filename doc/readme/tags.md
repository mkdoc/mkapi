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
* `@deprecated`: Flag as deprecated.
* `@author`: Author meta data.
* `@version`: Version information.
* `@since`: Since version.
* `@see`: Creates a list of links, each value should be a URL if a description is given it becomes the name for the link.

Note that whilst declaring names explicitly (`@function` etc) is a little more maintenance it is deemed to be preferable to re-parsing the file to automatically extract function names.
