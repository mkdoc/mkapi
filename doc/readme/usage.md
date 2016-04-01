Print the documentation to stdout:

```
mkapi index.js
```

Need HTML or XML? No problem, install [commonmark][] and pipe the output:

```
mkapi index.js | commonmark
```

From code pass files and options:

```javascript
var parse = require('mkapi');
parse(['index.js'], {output: process.stdout});
```
