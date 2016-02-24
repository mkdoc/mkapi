## Tags

The following tags are supported:

* `@function`: Marks a function declaration, the function name should be given.
* `@private`: Exclude the comment from the output.
* `@param`: Declares an argument for a function.
* `@option`: Documents an option property.
* `@usage`: Usage example(s) that appear below the first heading.

Note that whilst declaring names explicitly (`@function` etc) is a little more maintenance it is deemed to be preferable to re-parsing the file to automatically extract function names.
