var mk = require('mktask');

// @task example build the example file.
function example(cb) {
  mk.doc('doc/example.md')
    .pipe(mk.pi())
    .pipe(mk.ref())
    .pipe(mk.abs())
    .pipe(mk.msg())
    .pipe(mk.out())
    .pipe(mk.dest('EXAMPLE.md'))
    .on('finish', cb);
}

// @task readme build the readme file.
function readme(cb) {
  mk.doc('doc/readme.md')
    .pipe(mk.pi())
    .pipe(mk.ref())
    .pipe(mk.abs())
    .pipe(mk.msg())
    .pipe(mk.toc({depth: 2, max: 3}))
    .pipe(mk.out())
    .pipe(mk.dest('README.md'))
    .on('finish', cb);
}

mk.task(example);
mk.task(readme);
