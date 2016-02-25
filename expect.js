// rebuild the expectations, used when formatting 
// styles have changed
var execSync = require('child_process').execSync
  , expectations =       
    [
      {
        files: ['test/fixtures/usage.js'],
        output: 'test/fixtures/expect/usage-ast.json',
        args: '--ast'
      },
      {
        files: ['test/fixtures/usage.js'],
        output: 'test/fixtures/expect/usage-ast-compact.json',
        args: '--ast --indent=0'
      },
      {
        files: ['test/fixtures/description.js'],
        output: 'test/fixtures/expect/description.md'
      },
      {
        files: ['test/fixtures/usage.js'],
        output: 'test/fixtures/expect/usage-no-heading.md',
        args: '--title='
      }
    ];

expectations.forEach(function(item) {
  var cmd = './bin/mdapi' + (item.args ? ' ' + item.args : '') 
    + ' ' + item.files + ' >' + item.output;
  //console.dir(cmd);
  execSync(cmd);
})
