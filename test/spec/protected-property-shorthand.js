var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print @protected property shorthand', function(done) {
    var output = 'target/protected-property-property.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/protected-property-shorthand.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/protected-property-shorthand.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
