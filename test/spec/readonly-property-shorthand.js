var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print @readonly property shorthand', function(done) {
    var output = 'target/readonly-property-property.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/readonly-property-shorthand.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/readonly-property-shorthand.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
