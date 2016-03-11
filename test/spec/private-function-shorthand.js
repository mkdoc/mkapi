var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkapi:', function() {

  it('should print @private function shorthand', function(done) {
    var output = 'target/private-function-function.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/private-function-shorthand.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/private-function-shorthand.js'],
      {
        stream: fs.createWriteStream(output),
        conf: {
          include: {
            private: true
          }
        }
      },
      complete);
  });

});
