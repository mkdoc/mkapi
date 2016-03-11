var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkapi:', function() {

  it('should print method parameters', function(done) {
    var output = 'target/usage.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/params.md');
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
