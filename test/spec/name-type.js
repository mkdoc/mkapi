var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print @name {type} Name', function(done) {
    var output = 'target/name-type.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/name-type.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/name-type.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
