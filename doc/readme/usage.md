Print the documentation to stdout:

```
mdapi index.js
```

Need HTML or XML? No problem, install [commonmark][] and pipe the output:

```
mdapi index.js | commonmark
```

If you need to suppress the initial heading, use:

```
mdapi index.js --title=
```
