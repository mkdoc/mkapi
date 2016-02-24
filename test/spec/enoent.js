var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should callback with error on missing file', function(done) {
    function complete(err) {
      function fn() {
        throw err; 
      }
      expect(fn).throws(Error);
      expect(fn).throws(/enoent/i);
      done(); 
    }
    parse(
      ['test/fixtures/non-existent.js'],
      complete);
  });

});
