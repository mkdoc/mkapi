var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print @throws', function(done) {
    var output = 'target/throws.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/throws.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/throws.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
