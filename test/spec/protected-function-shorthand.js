var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print @protected function shorthand', function(done) {
    var output = 'target/protected-function-function.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/protected-function-shorthand.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/protected-function-shorthand.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
