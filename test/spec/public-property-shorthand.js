var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkapi:', function() {

  it('should print @public property shorthand', function(done) {
    var output = 'target/public-property-property.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/public-property-shorthand.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/public-property-shorthand.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
