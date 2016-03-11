var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkapi:', function() {

  it('should print with multiple input files', function(done) {
    var output = 'target/multiple.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/multiple.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/property.js', 'test/fixtures/function.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
