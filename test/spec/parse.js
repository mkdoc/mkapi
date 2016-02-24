var fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should parse own docs', function(done) {
    function complete(err) {
      if(err) {
        return done(err); 
      }
      done(); 
    }
    parse(
      ['index.js'],
      //{stream: fs.createWriteStream('target/parsed.md')}, 
      complete);
  });

});
