var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print @property with @constant', function(done) {
    var output = 'target/property-constant.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/property-constant.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/property-constant.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
