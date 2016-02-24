var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print method parameters with options', function(done) {
    var output = 'target/options.md'
      , expected = '# API\n\n## optional\n\n```javascript\noptional'
          + '(files[, opts], cb)\n```\n\n* `files` A files parameter.'
          + '\n* `opts` An options parameter.\n* `cb` A function parameter.'
          + '\n\n### Options\n\n* `foo` String A foo option.\n\n';

    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/options.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
