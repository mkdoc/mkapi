var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print optional parameters', function(done) {
    var output = 'target/optional.md'
      , expected = '# API\n\n## optional\n\n```javascript\noptional'
          + '(files[, options], cb)\n```\n\n* `files` A files parameter.\n'
          + '* `options` An options parameter.\n* `cb`'
          + ' A function parameter.\n\n';

    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/optional.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
