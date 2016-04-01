var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print optional parameters', function(done) {
    var output = 'target/optional.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/optional.md');

    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/optional.js'],
      {output: fs.createWriteStream(output)},
      complete);
  });

});
