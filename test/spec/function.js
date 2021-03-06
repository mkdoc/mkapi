var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print with @function', function(done) {
    var output = 'target/function.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/function.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/function.js'],
      {output: fs.createWriteStream(output)},
      complete);
  });

});
