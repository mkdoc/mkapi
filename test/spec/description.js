var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkapi:', function() {

  it('should print method description', function(done) {
    var output = 'target/description.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/description.md');

    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }

    parse(
      ['test/fixtures/description.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
