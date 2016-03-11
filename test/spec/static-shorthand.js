var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkapi:', function() {

  it('should print @static shorthand', function(done) {
    var output = 'target/static-property.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/static-shorthand.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/static-shorthand.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
