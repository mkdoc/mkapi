var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print member of current constructor', function(done) {
    var output = 'target/member-current-constructor.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/member-current-constructor.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/member-current-constructor.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
