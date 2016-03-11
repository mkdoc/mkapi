var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkapi:', function() {

  it('should print @static with @function', function(done) {
    var output = 'target/static-function.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/static-function.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/static-function.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
