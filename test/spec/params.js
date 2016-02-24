var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print method parameters', function(done) {
    var output = 'target/usage.md'
      , expected = '# foobar\n\n```javascript\nfoobar(foo, bar)\n```'
          + '\n\n* `foo` A foo parameter.\n* `bar` A bar parameter.\n\n';
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/params.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
