var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkapi:', function() {

  it('should print @static with @property', function(done) {
    var output = 'target/static-property.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/static-property.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/static-property.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
