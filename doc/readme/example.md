## Example

Print the documentation to stdout:

```
mkapi index.js
```

Create a markdown document from the comments in a source file:

```shell
mkapi index.js --title=API -o API.md
```

Set initial heading level:

```shell
mkapi index.js --title=API --level=2 -o API.md
```

Include private symbols in the output:

```shell
mkapi index.js --private -o API.md
```

