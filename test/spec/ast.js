var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index').parse;

describe('mkapi:', function() {

  it('should print usage as AST JSON', function(done) {
    var output = 'target/usage-ast.json'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/usage-ast.json');

    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/usage.js'],
      {stream: fs.createWriteStream(output), ast: true},
      complete);
  });

  it('should print usage as AST JSON with indent', function(done) {
    var output = 'target/usage-ast-indent.json'
      , expected = '' + fs.readFileSync(
          'test/fixtures/expect/usage-ast-compact.json');

    function complete(err) {
      if(err) {
        return done(err); 
      }
      var contents = '' + fs.readFileSync(output);
      expect(contents).to.eql(expected);
      done(); 
    }
    parse(
      ['test/fixtures/usage.js'],
      {stream: fs.createWriteStream(output), ast: true, indent: 0},
      complete);
  });

});
