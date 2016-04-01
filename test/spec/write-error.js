var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should callback with error on write stream error', function(done) {
    var stream = fs.createWriteStream('target/write-error.md');

    function complete(err) {
      function fn() {
        throw err; 
      }
      expect(fn).throws(/write after end/i);
      done(); 
    }

    stream.end('');

    // write after end
    parse(
      ['test/fixtures/property.js'],
      {output: stream},
      complete);
  });

});
