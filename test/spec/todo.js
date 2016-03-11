var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mkapi:', function() {

  it('should print @todo', function(done) {
    var output = 'target/todo.md'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/todo.md');
    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/todo.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
