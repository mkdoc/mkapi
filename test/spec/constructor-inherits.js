var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print @constructor with @inherits', function(done) {
    var output = 'target/constructor-inherits.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/constructor-inherits.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/constructor-inherits.js'],
      {output: fs.createWriteStream(output)},
      complete);
  });

});
