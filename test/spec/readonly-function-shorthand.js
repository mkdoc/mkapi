var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print @readonly function shorthand', function(done) {
    var output = 'target/readonly-function-function.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/readonly-function-shorthand.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/readonly-function-shorthand.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
