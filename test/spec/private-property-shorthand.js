var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print @private property shorthand', function(done) {
    var output = 'target/private-property-property.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/private-property-shorthand.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/private-property-shorthand.js'],
      {
        output: fs.createWriteStream(output),
        conf: {
          include: {
            private: true
          }
        }
      },
      complete);
  });

});
