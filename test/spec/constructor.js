var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print @constructor', function(done) {
    var output = 'target/constructor.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/constructor.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/constructor.js'],
      {output: fs.createWriteStream(output)},
      complete);
  });

});
