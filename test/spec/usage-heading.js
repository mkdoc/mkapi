var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print usage with custom heading', function(done) {
    var output = 'target/usage-heading.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/usage-heading.md');
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
      {stream: fs.createWriteStream(output), heading: 'API'},
      complete);
  });

});
