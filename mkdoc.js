var mk = require('mktask');

// @task readme build the readme file.
function readme(cb) {
  mk.doc('doc/readme.md')         // read markdown source document
    .pipe(mk.pi())                // parse processing instructions
    .pipe(mk.ref())               // include link references
    .pipe(mk.abs())               // make links absolute
    .pipe(mk.msg())               // append generator message
    .pipe(mk.out())               // convert abstract syntax tree to markdown
    .pipe(mk.dest('README.md'))   // write the result to a file
    .on('finish', cb);            // proceed to next task
}

mk.task(readme);
