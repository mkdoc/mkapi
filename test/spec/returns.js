var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print @returns', function(done) {
    var output = 'target/returns.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/returns.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/returns.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
