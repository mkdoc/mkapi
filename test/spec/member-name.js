var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print member with specified name', function(done) {
    var output = 'target/member-name.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/member-name.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/member-name.js'],
      {output: fs.createWriteStream(output)},
      complete);
  });

});
