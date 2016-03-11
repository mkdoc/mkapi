var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkapi:', function() {

  it('should print last declared @name', function(done) {
    var output = 'target/name-override.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/name-override.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/name-override.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
