var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print method parameters w/ types', function(done) {
    var output = 'target/usage.md'
      , expected = '# API\n\n## foo\n\n```javascript\nfoo(foo)\n```\n\n'
          + '* `foo` String A foo parameter.\n\n';

    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/param-types.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
