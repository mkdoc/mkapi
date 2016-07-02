var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should listen for file event', function(done) {
    var output = 'target/listen-file-event.md';

    function file(file, buffer) {
      // scope is the Writer scope for execution
      expect(this.conf).to.be.an('object');
      expect(file).to.be.a('string');
      //expect(Buffer.isBuffer(buffer)).to.eql(true);
      done(); 
    }

    var notifier = parse(
      ['test/fixtures/event.js'],
      {output: fs.createWriteStream(output)});

    notifier.on('file', file);
  });

  it('should listen for ast event', function(done) {
    var output = 'target/listen-ast-event.md';

    function ast(tokens) {
      // scope is the Writer scope for execution
      expect(this.conf).to.be.an('object');
      expect(tokens).to.be.an('array');
      done(); 
    }

    var notifier = parse(
      ['test/fixtures/event.js'],
      {output: fs.createWriteStream(output)});

    notifier.on('ast', ast);
  });

  it('should listen for finish event', function(done) {
    var output = 'target/listen-finish-event.md';

    function finish() {
      // scope is the Writer scope for execution
      expect(this.conf).to.be.an('object');
      done(); 
    }

    var notifier = parse(
      ['test/fixtures/event.js'],
      {output: fs.createWriteStream(output)});

    notifier.on('finish', finish);
  });

});
