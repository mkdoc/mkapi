var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print @property without description', function(done) {
    var output = 'target/property-no-description.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/property-no-description.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/property-no-description.js'],
      {output: fs.createWriteStream(output)},
      complete);
  });

});
