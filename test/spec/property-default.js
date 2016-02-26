var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print @property with @default', function(done) {
    var output = 'target/property-default.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/property-default.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/property-default.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
