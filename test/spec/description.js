var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print method description', function(done) {
    var output = 'target/description.md'
      , expected = '# API\n\n## description\n\n```javascript\ndescription()\n'
          + '```\n\nDescription of the function.\n\n';

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
