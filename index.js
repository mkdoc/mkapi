var fs = require('fs')
  , assert = require('assert')
  , comments = require('comment-parser')
  , repeat = require('string-repeater')
  , USAGE ='usage' 
  , PRIVATE ='private' 
  , NAME = 'name'
  , PARAM = 'param';

/**
 *  @usage var parse = require('mdapi');
 *  parse(['index.js'], {stream: process.stdout});
 */

/**
 *  Concatenate input files into a single string.
 *
 *  @private
 *  
 *  @name concat
 *
 *  @param {Array} files List of input files to load.
 *  @param {String} output The output string.
 *  @param {Function} cb Callback function.
 */
function concat(files, output, cb) {
  var file = files.shift();
  output = output || '';
  function onRead(err, contents) {
    if(err) {
      return cb(err); 
    }
    output += contents;
    if(!files.length) {
      return cb(null, output); 
    } 
    concat(files, output, cb);
  }
  fs.readFile(file, onRead);
}

/** 
 *  Print markdown from the parsed AST.
 *
 *  @private
 *
 *  @name print
 *
 *  @param {Object} ast The parsed comments abstract syntax tree.
 *  @param {Object} opts Parse options.
 *  @param {Function} cb Callback function.
 */
function print(ast, opts, cb) {
  var stream = opts.stream
    , level = opts.level
    , called = false
    , json
    , indent = typeof(opts.indent) === 'number' && !isNaN(opts.indent) 
        ? Math.abs(opts.indent) : 2;

  function done(err) {
    /* istanbul ignore if: guard against error race condition */
    if(called) {
      return;
    }
    cb(err || null); 
    called = true;
  }

  stream.once('error', done);

  if(opts.ast) {
    json = JSON.stringify(ast, undefined, indent);

    if(stream !== process.stdout) {
      stream.write(json); 
      return stream.end(done);
    }else{
      return stream.write(json);
    }
  }

  // find a tag
  function findTag(name, ast) {
    for(var i = 0;i < ast.tags.length;i++) {
      if(ast.tags[i].tag === name) {
        return ast.tags[i]; 
      }
    }
  }

  // collect tags
  function collect(name, ast) {
    var o = [];
    for(var i = 0;i < ast.tags.length;i++) {
      if(ast.tags[i].tag === name) {
        o.push(ast.tags[i]);
      }
    }
    return o;
  }


  // print a heading
  function heading(str, level) {
    stream.write(repeat('#', level) + ' ' + str); 
  }

  // print newline(s)
  function newline(num) {
    num = num || 1; 
    stream.write(repeat('\n', num)); 
  }

  // print a fenced code block
  function fenced(code, lang) {
    stream.write('```'); 
    if(typeof lang === 'string') {
      stream.write(lang); 
    }
    newline();
    stream.write(code);
    newline();
    stream.write('```'); 
  }

  // print the function signature
  function signature(name, token) {
    var sig = '('
      , params = collect(PARAM, token);
    params.forEach(function(param, index) {
      if(param.optional) {
        sig += '['; 
      }
      if(index) {
        sig += ', '; 
      }
      sig += param.name;
      if(param.optional) {
        sig += ']'; 
      }
    })

    sig += ')';

    fenced(name + sig, opts.lang);
    return params;
  }

  // initial heading
  if(opts.heading && typeof opts.heading === 'string') {
    heading(opts.heading, level); 
    newline(2);
    level++;
  }

  // walk the ast
  ast.forEach(function(token) {
    var tag = findTag(NAME, token)
      , exclude = findTag(PRIVATE, token)
      , name
      , usage = findTag(USAGE, token)
      , params;

    if(usage) {
      fenced(usage.name + ' ' + usage.description, opts.lang);
      newline(2);
    }

    if(exclude || (!tag || !tag.name)) {
      return; 
    }

    name = tag.name;
    
    // method heading
    heading(name, level);
    newline(2);

    // method signature
    params = signature(name, token);
    newline(2);

    // method description
    if(token.description) {
      stream.write(token.description);
      newline(2);
    }

    // parameter list
    params.forEach(function(param) {
      var name = param.name
        , type = '';

      if(param.type) {
        type = param.type + ' '; 
      }
      stream.write('* `' + name + '` ' + type + param.description);
      newline();
    })

    if(params.length) {
      newline();
    }

  })

  stream.once('finish', done);

  /* istanbul ignore else: never write to stdout in tests */
  if(stream !== process.stdout) {
    stream.end(); 
  }else{
    done();
  }
}

/**
 *  Parse an array of files into a markdown string.
 *
 *  @name parse
 *
 *  @param {Array} files List of files to parse.
 *  @param {Object} [opts] Parse options.
 *  @param {Function} cb Callback function.
 */
function parse(files, opts, cb) {
  assert(Array.isArray(files), 'array of files expected');

  if(typeof opts === 'function') {
    cb = opts; 
    opts = null;
  }

  assert(cb instanceof Function, 'callback function expected');

  opts = opts || {};

  // stream to print to
  opts.stream = opts.stream !== undefined ? opts.stream : process.stdout;

  // starting level for headings
  opts.level = opts.level || 1;

  opts.heading = opts.heading !== undefined ? opts.heading : 'API';

  // language for function signature
  opts.lang = opts.lang !== undefined ? opts.lang : 'javascript';

  concat(files.slice(), null, function onLoad(err, result) {
    if(err) {
      return cb(err); 
    }

    var ast = comments(result);

    function onPrint(err) {
      if(err) {
        return cb(err);
      }
      cb();
    }

    print(ast, opts, onPrint);
  })
}

module.exports = parse;
