## Example

Create a markdown document from the comments in a source file:

```shell
mkapi index.js --title=API > API.md
```

Set initial heading level:

```shell
mkapi index.js --title=API --level=2 > API.md
```

Include private symbols in the output:

```shell
mkapi index.js --private > API.md
```

