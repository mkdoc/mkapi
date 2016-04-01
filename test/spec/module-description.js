var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print @module with description parameter', function(done) {
    var output = 'target/module-description.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/module-description.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/module-description.js'],
      {output: fs.createWriteStream(output)},
      complete);
  });

});
