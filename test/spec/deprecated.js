var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkapi:', function() {

  it('should print @deprecated', function(done) {
    var output = 'target/deprecated.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/deprecated.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/deprecated.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
