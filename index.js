var fs = require('fs')
  , assert = require('assert')
  , comments = require('comment-parser')
  , repeat = require('string-repeater')
  , renderers = {}
  , current
  , MODULE = 'module'
  , CLASS = 'class'
  , CONSTRUCTOR = 'constructor'
  , INHERITS= 'inherits'
  , FUNCTION = 'function'
  , PROTOTYPE = 'prototype'
  , PROPERTY = 'property'
  , CONSTANT = 'constant'
  , OPTIONS_HEADING = 'Options'
  , LANG = 'javascript'
  , DEFAULT ='default' 
  , SEE = 'see'
  , USAGE ='usage' 
  , PRIVATE ='private' 
  , OPTION = 'option'
  , PARAM = 'param';

/**
 *  @usage var parse = require('mdapi');
 *  parse(['index.js'], {stream: process.stdout});
 */

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

// find the type tag
function findType(token) {
  var type = 
    findTag(MODULE, token)
    || findTag(CLASS, token)
    || findTag(CONSTRUCTOR, token)
    || findTag(FUNCTION, token)
    || findTag(PROPERTY, token)
    || findTag(CONSTANT, token);

  return type;
}

function render(type, token, opts) {
  renderers[type.tag](type, token, opts); 
}

renderers[MODULE] = renderers[CLASS] = function(tag, token, opts) {
  var stream = opts.stream;

  if(tag.tag === MODULE) {
    // reset to default level
    opts.depth = opts.level;
  }

  if(tag.name) {
    heading(stream, tag.name + ' '  + tag.description, opts.depth);
    newline(stream, 2);

    if(token.description) {
      stream.write(token.description); 
      newline(stream, 2);
    }

    opts.depth++;
  }

  see(tag, token, opts);
}

renderers[CONSTRUCTOR] = renderers[FUNCTION] = function(tag, token, opts) {
  var name = tag.name
    , nm = name
    , stream = opts.stream
    , params
    , options
    , level = opts.depth
    , val = name
    , inherits
    , construct = (tag.tag === CONSTRUCTOR)
    , proto = findTag(PROTOTYPE, token)
    , className;

  if(construct) {
    current = tag;
    inherits = findTag(INHERITS, token); 
  }

  if(!name) {
    return;
  }

  // method heading
  if(inherits) {
    nm += ' < ' + inherits.name;
  }

  if(proto) {
    nm = '.' + nm; 
  }

  heading(stream, nm, level);
  newline(stream, 2);

  // method signature
  params = collect(PARAM, token);
  if(construct) {
    val = 'new ' + name; 
  }else if(proto) {
    if(current) {
      className = current.name; 
    }

    if(proto.name) {
      className = proto.name; 
    }

    if(className) {
      val = className + '.prototype.' + name;
    }
  }
  signature(params, val, token, opts, {construct: construct});
  newline(stream, 2);

  // method description
  if(token.description) {
    stream.write(token.description);
    newline(stream, 2);
  }

  // parameter list
  parameters(stream, params);
  if(params.length) {
    newline(stream);
  }

  // options list
  options = collect(OPTION, token);
  if(options.length) {
    heading(stream, OPTIONS_HEADING, level + 1);
    newline(stream, 2);
    parameters(stream, options);
    newline(stream);
  }

  see(tag, token, opts);
}

renderers[PROPERTY] = renderers[CONSTANT] = function(tag, token, opts) {
  var name = tag.name
    , value = name
    , defaultValue = findTag(DEFAULT, token)
    , stream = opts.stream
    , fixed = (tag.tag === CONSTANT);

  if(name && defaultValue) {
    value += ' = ' + defaultValue.name + ';'
  }
  if(name) {
    heading(stream, name, opts.depth);
    newline(stream, 2);
    if(value) {
      if(fixed) {
        value = 'const ' + value;
      }
      fenced(stream, value, opts.lang) 
      newline(stream, 2);
    }
    if(token.description) {
      stream.write(token.description);
      newline(stream, 2);
    }
  }

  see(tag, token, opts);
}

function see(tag, token, opts) {
  var all = collect(SEE, token)
    , stream = opts.stream;
  if(all.length) {
    all.forEach(function(link) {
      if(link.name) {
        var val = '* [' + (link.description || link.name) + ']'
          + '(' + link.name + ')';
        stream.write(val);
        newline(stream);
      }
    })
    newline(stream);
  }
}


// print a heading
function heading(stream, str, level) {
  stream.write(repeat('#', level) + ' ' + str); 
}

// print newline(s)
function newline(stream, num) {
  num = num || 1; 
  stream.write(repeat('\n', num)); 
}

// print a fenced code block
function fenced(stream, code, lang) {
  stream.write('```'); 
  if(typeof lang === 'string') {
    stream.write(lang); 
  }
  newline(stream);
  stream.write(code);
  newline(stream);
  stream.write('```'); 
}

// print the function signature
function signature(params, name, token, opts) {
  var sig = '('
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

  fenced(opts.stream, name + sig, opts.lang);
  return params;
}

// print a list of parameters
function parameters(stream, params) {
  params.forEach(function(param) {
    var name = param.name
      , type = '';

    if(param.type) {
      type = param.type + ' '; 
    }
    stream.write('* `' + name + '` ' + type + param.description);
    newline(stream);
  })
}


/**
 *  Concatenate input files into a single string.
 *
 *  @private
 *  
 *  @function concat
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
 *  @function print
 *
 *  @param {Object} ast The parsed comments abstract syntax tree.
 *  @param {Object} opts Parse options.
 *  @param {Function} cb Callback function.
 */
function print(ast, opts, cb) {
  var stream = opts.stream
    , called = false
    , json
    , indent = typeof(opts.indent) === 'number' && !isNaN(opts.indent) 
        ? Math.abs(opts.indent) : 2;

  // state of the depth level
  opts.depth = opts.level;

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

    /* istanbul ignore else: never print to stdout in test env */
    if(stream !== process.stdout) {
      stream.write(json); 
      return stream.end(done);
    }else{
      return stream.write(json);
    }
  }

  // initial heading
  if(opts.heading && typeof opts.heading === 'string') {
    heading(stream, opts.heading, opts.depth); 
    newline(stream, 2);
    opts.depth++;
  }

  // walk the ast
  ast.forEach(function(token) {
    //var tag = findTag(FUNCTION, token)
    var exclude = findTag(PRIVATE, token)
      , usage = findTag(USAGE, token)

    if(usage) {
      fenced(stream, usage.name + ' ' + usage.description, opts.lang);
      newline(stream, 2);
    }

    var type = findType(token);

    // marked @private
    if(exclude) {
      return false; 
    }

    // render for the type tag
    if(type) {
      return render(type, token, opts); 
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

// jscs:disable maximumLineLength
/**
 *  Accepts an array of files and concatenates them in the order given 
 *  to a string. 
 *
 *  Parse the comments in the resulting string into an AST 
 *  and transform the AST into commonmark compliant markdown.
 *
 *  The callback function is passed an error and also the AST on success: 
 *  `function(err, ast)`.
 *
 *  @function parse
 *
 *  @param {Array} files List of files to parse.
 *  @param {Object} [opts] Parse options.
 *  @param {Function} cb Callback function.
 *
 *  @option {Writable} stream The stream to write to, default is `stdout`.
 *  @option {Number} level Initial level for the first heading, default is `1`.
 *  @option {String} heading Value for an initial heading.
 *  @option {String} lang Language for fenced code blocks, default is `javascript`.
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

  // language for fenced code blocks
  opts.lang = opts.lang !== undefined ? opts.lang : parse.LANG;

  concat(files.slice(), null, function onLoad(err, result) {
    if(err) {
      return cb(err); 
    }
    var ast = comments(result, {trim: true});
    function onPrint(err) {
      if(err) {
        return cb(err);
      }
      cb(null, ast);
    }
    print(ast, opts, onPrint);
  })
}

/**
 *  Default language for fenced code blocks.
 *
 *  @property {String} LANG
 *  @default javascript
 */
parse.LANG = LANG;

module.exports = parse;
