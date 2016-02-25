var fs = require('fs')
  , assert = require('assert')
  , comments = require('comment-parser')
  , Writers = require('./writers')
  , heading = Writers.heading
  , api = require('./api')
  , render = require('./render')
  , tag = require('./tag')
  , findTag = tag.findTag
  , LANG = 'javascript'

/**
 *  var parse = require('mdapi');
 *  parse(['index.js'], {stream: process.stdout});
 *
 *  @usage
 */

/**
 *  Find a type tag for a token.
 *
 *  @private
 */
function findType(token) {
  var type = 
    findTag(api.MODULE, token)
    || findTag(api.CLASS, token)
    || findTag(api.CONSTRUCTOR, token)
    || findTag(api.FUNCTION, token)
    || findTag(api.STATIC, token)
    || findTag(api.PROPERTY, token)
    || findTag(api.CONSTANT, token);
  return type;
}

/**
 *  Write a token to the stream based on the given type tag.
 *
 *  @private
 */
function write(type, token, opts) {
  var scope = Writers();
  scope.type = type;
  scope.token = token;
  scope.opts = opts;
  scope.stream = opts.stream;
  render[type.tag].call(scope, type, token, opts); 
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
      hasModule = findTag(api.MODULE, token);
    }
    if(findTag(api.USAGE, token)) {
      usage = usage.concat([token]);
    }
  })

  // initial heading
  if(opts.heading && typeof opts.heading === 'string') {
    heading(stream, opts.heading, opts.depth); 
    opts.depth++;
  }

  if(!hasModule && usage.length) {
    render.usage(usage, opts);
  }

  // might need to render after a module declaration
  opts.usage = usage;

  // walk the ast
  ast.forEach(function(token) {
    var exclude = findTag(api.PRIVATE, token);

    var type = findType(token);

    // marked @private
    if(exclude) {
      return false; 
    }

    // render for the type tag
    if(type) {
      return write(type, token, opts); 
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
