var fs = require('fs')
  , assert = require('assert')
  , comments = require('comment-parser')
  , repeat = require('string-repeater')
  , api = require('./api')
  , renderers = {}
  , current

  , PRIVATE ='private' 
  , MODULE = 'module'
  , CLASS = 'class'
  , CONSTRUCTOR = 'constructor'
  , INHERITS = 'inherits'
  , FUNCTION = 'function'
  , PROTOTYPE = 'prototype'
  , STATIC = 'static'
  , PARAM = 'param'
  , RETURN = 'return'
  , PROPERTY = 'property'
  , CONSTANT = 'constant'
  , LANG = 'javascript'
  , DEFAULT ='default' 
  , DEPRECATED = 'deprecated'
  , AUTHOR = 'author'
  , VERSION = 'version'
  , SINCE = 'since'
  , SEE = 'see'
  , USAGE ='usage' 
  , OPTION = 'option'
  , THROWS = 'throws'

/**
 *  var parse = require('mdapi');
 *  parse(['index.js'], {stream: process.stdout});
 *
 *  @usage
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
    || findTag(STATIC, token)
    || findTag(PROPERTY, token)
    || findTag(CONSTANT, token);
  return type;
}

function render(type, token, opts) {
  renderers[type.tag](type, token, opts); 
}

renderers.usage = function(tokens, opts) {
  var stream = opts.stream;
  tokens.forEach(function(token) {
    fenced(stream, token.description, opts.lang);
    newline(stream, 2);
  });
}

renderers[MODULE] = renderers[CLASS] = function(tag, token, opts) {
  var stream = opts.stream
    , isModule = tag.tag === MODULE;

  if(isModule) {
    // reset to default level
    opts.depth = opts.level;
  }

  if(tag.name) {
    heading(stream, tag.name + ' '  + tag.description, opts.depth);

    meta(token, opts);

    if(opts.usage.length) {
      renderers.usage(opts.usage, opts); 
    }

    if(token.description) {
      stream.write(token.description); 
      newline(stream, 2);
    }

    opts.depth++;
  }

  see(tag, token, opts);
}

renderers[CONSTRUCTOR] =
  renderers[STATIC] =
  renderers[FUNCTION] = function(tag, token, opts) {
  var name = tag.name
    , nm = name
    , stream = opts.stream
    , params
    , options
    , level = opts.depth
    , val = name
    , inherits
    , construct = (tag.tag === CONSTRUCTOR)
    , isStatic = (tag.tag === STATIC)
    , throwables
    , proto = findTag(PROTOTYPE, token)
    , retval = findTag(RETURN, token)
    , className;

  if(construct) {
    current = tag;
    inherits = findTag(INHERITS, token); 
  }

  if(!name) {
    return;
  }

  // method inheritance
  if(inherits) {
    nm += ' < ' + inherits.name;
    if(inherits.description) {
      nm += ' < ' + inherits.description.split(/\s+/).join(' < ');
    }
  }

  if(isStatic) {
    nm = '#' + nm; 
  }else if(proto) {
    nm = '.' + nm; 
  }

  heading(stream, nm, level);

  // method signature
  params = collect(PARAM, token);
  if(construct) {
    val = 'new ' + name; 
  }else if(isStatic) {
    if(tag.description) {
      name = tag.description + '.' + name; 
    }
    val = 'static ' + name; 
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

  meta(token, opts);

  // method description
  if(token.description) {
    stream.write(token.description);
    newline(stream, 2);
  }

  if(retval) {
    stream.write('Returns ' + retval.name + ' ' + retval.description);
    newline(stream, 2);
  }

  // parameter list @param
  parameters(stream, params);
  if(params.length) {
    newline(stream);
  }

  // options list @option
  options = collect(OPTION, token);
  if(options.length) {
    heading(stream, api.header.OPTIONS, level + 1);
    parameters(stream, options);
    newline(stream);
  }

  throwables = collect(THROWS, token);

  if(throwables.length) {
    heading(stream, api.header.THROWS, level + 1);
    // Errors @throws
    parameters(stream, throwables);
    if(params.length) {
      newline(stream);
    }
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

    if(value) {
      if(fixed) {
        value = 'const ' + value;
      }
      fenced(stream, value, opts.lang) 
      newline(stream, 2);
    }

    meta(token, opts);

    if(token.description) {
      stream.write(token.description);
      newline(stream, 2);
    }
  }

  see(tag, token, opts);
}

function meta(token, opts) {
  var stream = opts.stream
    , deprecated = findTag(DEPRECATED, token)
    , author = findTag(AUTHOR, token)
    , version = findTag(VERSION, token)
    , since = findTag(SINCE, token)
    , hasMeta = Boolean(author || version || since)
    , list = '* **';

  if(deprecated) {
    stream.write('> **Deprecated:** '
      + deprecated.name + ' ' + deprecated.description);
    newline(stream, 2);
  }

  if(author) {
    stream.write(list + AUTHOR + '** `' + author.name + '`'); 
    newline(stream);
  }

  if(version) {
    stream.write(list + VERSION + '** `' + version.name + '`'); 
    newline(stream);
  }

  if(since) {
    stream.write(list + SINCE + '** `' + since.name + '`');
    newline(stream);
  }

  if(hasMeta) {
    newline(stream);
  }
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
  newline(stream, 2);
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
    , usage = []
    , hasModule = false
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

  // pre-processing
  ast.forEach(function(token) {
    if(!hasModule) {
      hasModule = findTag(MODULE, token);
    }
    if(findTag(USAGE, token)) {
      usage = usage.concat([token]);
    }
  })

  // initial heading
  if(opts.heading && typeof opts.heading === 'string') {
    heading(stream, opts.heading, opts.depth); 
    opts.depth++;
  }

  if(!hasModule && usage.length) {
    renderers.usage(usage, opts);
  }

  // might need to render after a module declaration
  opts.usage = usage;

  // walk the ast
  ast.forEach(function(token) {
    var exclude = findTag(PRIVATE, token);

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
