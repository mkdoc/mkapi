var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('mdapi:', function() {

  it('should print usage as AST JSON', function(done) {
    var output = 'target/usage-ast.json'
      , expected = '[\n  {\n    "tags": [\n      {\n        "tag": "usage",'
          + '\n        "name": "",\n        "optional": false,\n        '
          + '"type": "",\n        "description": "",\n        "line": 3,'
          + '\n        "source": "@usage"\n      }\n    ],\n    "line": 0,'
          + '\n    "description": "var foo = \'bar\';",\n    "source": '
          + '"var foo = \'bar\';\\n\\n@usage"\n  }\n]';

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
      , expected = '[{"tags":[{"tag":"usage","name":"","optional":false,'
          + '"type":"","description":"","line":3,"source":"@usage"}],'
          + '"line":0,"description":"var foo = \'bar\';","source":'
          + '"var foo = \'bar\';\\n\\n@usage"}]';

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
