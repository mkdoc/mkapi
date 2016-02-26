var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should use override existing renderer', function(done) {
    var output = 'target/renderer-override.md'
      , tag = 'function'
      , registry;

    function renderer(type, token, cb) {
      expect(type.tag).to.eql(tag);
      delete registry[tag];
      cb(); 
    }

    registry = parse.register(tag, renderer);
    expect(registry).to.be.an('object');

    function complete(err) {
      if(err) {
        return done(err); 
      }
      //var contents = '' + fs.readFileSync(output);
      //expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/method.js'],
      {stream: fs.createWriteStream(output)},
      complete);
  });

});
