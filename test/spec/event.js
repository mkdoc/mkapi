var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print @event', function(done) {
    var output = 'target/event.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/event.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/event.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
