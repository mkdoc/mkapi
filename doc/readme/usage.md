Print the documentation to stdout:

```
mdapi index.js
```

Need HTML or XML? No problem, install [commonmark][] and pipe the output:

```
mdapi index.js | commonmark
```

From code pass files and options:

```javascript
var parse = require('mdapi');
parse(['index.js'], {stream: process.stdout});
```
