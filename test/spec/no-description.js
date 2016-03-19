var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print @name', function(done) {
    var output = 'target/no-description.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/no-description.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/no-description.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
