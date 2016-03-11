var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkapi:', function() {

  it('should print meta list', function(done) {
    var output = 'target/meta.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/meta.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/meta.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
