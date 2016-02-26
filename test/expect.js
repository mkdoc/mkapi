// rebuild the expectations, used when formatting 
// styles have changed
var parse = require('../index')
  , fs = require('fs')
  , expectations =       
    [
      {
        files: ['test/fixtures/module.js'],
        output: 'test/fixtures/expect/module.md'
      },
      {
        files: ['test/fixtures/class.js'],
        output: 'test/fixtures/expect/class.md'
      },
      {
        files: ['test/fixtures/class-inherits.js'],
        output: 'test/fixtures/expect/class-inherits.md'
      },
      {
        files: ['test/fixtures/constructor-inherits.js'],
        output: 'test/fixtures/expect/constructor-inherits.md'
      },
      {
        files: ['test/fixtures/constructor.js'],
        output: 'test/fixtures/expect/constructor.md'
      },
      {
        files: ['test/fixtures/member-name.js'],
        output: 'test/fixtures/expect/member-name.md'
      },
      {
        files: ['test/fixtures/member-current-class.js'],
        output: 'test/fixtures/expect/member-current-class.md'
      },
      {
        files: ['test/fixtures/member-current-constructor.js'],
        output: 'test/fixtures/expect/member-current-constructor.md'
      },
      {
        files: ['test/fixtures/meta.js'],
        output: 'test/fixtures/expect/meta.md'
      },
      {
        files: ['test/fixtures/deprecated.js'],
        output: 'test/fixtures/expect/deprecated.md'
      },
      {
        files: ['test/fixtures/see.js'],
        output: 'test/fixtures/expect/see.md'
      },
      {
        files: ['test/fixtures/name.js'],
        output: 'test/fixtures/expect/name.md'
      },
      {
        files: ['test/fixtures/name-override.js'],
        output: 'test/fixtures/expect/name-override.md'
      },
      {
        files: ['test/fixtures/name-type.js'],
        output: 'test/fixtures/expect/name-type.md'
      },
      {
        files: ['test/fixtures/returns.js'],
        output: 'test/fixtures/expect/returns.md'
      },
      {
        files: ['test/fixtures/usage.js'],
        output: 'test/fixtures/expect/usage-ast.json',
        opts: {
          ast: true
        }
      },
      {
        files: ['test/fixtures/usage.js'],
        output: 'test/fixtures/expect/usage-ast-compact.json',
        opts: {
          ast: true,
          indent: 0
        }
      },
      {
        files: ['test/fixtures/description.js'],
        output: 'test/fixtures/expect/description.md'
      },
      {
        files: ['test/fixtures/usage.js'],
        output: 'test/fixtures/expect/usage.md'
      },
      {
        files: ['test/fixtures/usage.js'],
        output: 'test/fixtures/expect/usage-no-lang.md',
        opts: {
          lang: false
        }
      },
      {
        files: ['test/fixtures/params.js'],
        output: 'test/fixtures/expect/params.md'
      },
      {
        files: ['test/fixtures/param-types.js'],
        output: 'test/fixtures/expect/param-types.md'
      },
      {
        files: ['test/fixtures/options.js'],
        output: 'test/fixtures/expect/options.md'
      },
      {
        files: ['test/fixtures/options.js'],
        output: 'test/fixtures/expect/options.md'
      },
      {
        files: ['test/fixtures/optional.js'],
        output: 'test/fixtures/expect/optional.md'
      },
      {
        files: ['test/fixtures/usage.js', 'test/fixtures/method.js'],
        output: 'test/fixtures/expect/multiple.md'
      },
      {
        files: ['test/fixtures/usage.js'],
        output: 'test/fixtures/expect/usage-heading.md',
        opts: {
          heading: 'API'
        }
      },
      {
        files: ['test/fixtures/usage.js'],
        output: 'test/fixtures/expect/usage-no-heading.md',
        opts: {
          heading: false
        }
      }
    ];

/**
 *  Iterate the expectation configuration and write results to disc.
 *
 *  @function expected
 */
function expected() {
  var info = expectations.shift();
  if(!info) {
    return; 
  }
  info.opts = info.opts || {};
  info.opts.stream = fs.createWriteStream(info.output);
  parse(info.files, info.opts, function(err) {
    if(err) {
      console.error(err.stack); 
      process.exit(1);
    }
    var contents = '' + fs.readFileSync(info.output);
    if(!contents) {
      console.error('wrote empty file: ' + info.output); 
      process.exit(1);
    }
    expected();
  })
}

expected();
