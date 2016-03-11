var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkapi:', function() {

  it('should print @public function shorthand', function(done) {
    var output = 'target/public-function-function.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/public-function-shorthand.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/public-function-shorthand.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
