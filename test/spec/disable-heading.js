var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print usage without heading', function(done) {
    var output = 'target/usage-no-heading.md'
      , expected = '```javascript\nvar foo = \'bar\';\n```\n\n';
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/usage.js'],
      {stream: fs.createWriteStream(output), heading: false},
      complete);
  });

});
