var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print method parameters with options', function(done) {
    var output = 'target/options.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/options.md');

    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/options.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
