var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print usage as AST JSON', function(done) {
    var output = 'target/usage-ast.json'
      , expected = '[\n  {\n    "tags": [\n      {\n        "tag": "usage",\n'
          + '        "name": "var",\n        "optional": false,\n        '
          + '"description": "foo = \'bar\';",\n        "type": "",\n        '
          + '"line": 1,\n        "source": "@usage var foo = \'bar\';"\n      '
          + '}\n    ],\n    "line": 0,\n    "description": "",\n    '
          + '"source": "@usage var foo = \'bar\';"\n  }\n]';

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
      , expected = '[{"tags":[{"tag":"usage","name":"var","optional":false,'
          + '"description":"foo = \'bar\';","type":"","line":1,"source":'
          + '"@usage var foo = \'bar\';"}],"line":0,"description":"","source"'
          + ':"@usage var foo = \'bar\';"}]';

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
