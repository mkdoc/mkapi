var fs = require('fs')
  , assert = require('assert')
  , comments = require('comment-parser')
  , Writers = require('./lib/writers')
  , conf = require('./lib/conf')
  , render = require('./lib/render')
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
    this.findTag(conf.MODULE, token)
    || this.findTag(conf.CLASS, token)
    || this.findTag(conf.CONSTRUCTOR, token)
    || this.findTag(conf.FUNCTION, token)
    || this.findTag(conf.STATIC, token)
    || this.findTag(conf.PROPERTY, token)
    || this.findTag(conf.CONSTANT, token);
  return type;
}

/**
 *  Gets the scope for render function calls.
 *
 *  @private
 */
function getScope(state, opts) {
  var scope = Writers();
  // state for the entire execution
  scope.state = state;

  // parse options
  scope.opts = opts;

  // stream to write to
  scope.stream = opts.stream;
  return scope;
}

/**
 *  Write a token to the stream based on the given type tag.
 *
 *  @private
 */
function write(type, token, opts) {
  this.type = type;
  this.token = token;
  render[type.tag].call(this, type, token, opts); 
}

/**
 *  Iterate input files in series asynchronously.
 *
 *  @private
 *  
 *  @function concat
 *
 *  @param {Array} files List of input files to load.
 *  @param {Function} it File iterator function.
 *  @param {Function} cb Callback function.
 */
function each(files, it, cb) {
  var file = files.shift();
  if(!file) {
    return cb(null); 
  } 
  function onRead(err, contents) {
    if(err) {
      return cb(err); 
    }
    it(file, contents, function(err) {
      // callback reported an error
      if(err) {
        return cb(err); 
      }
      each(files, it, cb);
    });
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
  var scope = this
    , stream = this.stream
    , json
    , usage = []
    , hasModule = false
    , indent = typeof(opts.indent) === 'number' && !isNaN(opts.indent) 
        ? Math.abs(opts.indent) : 2;

  // state of the depth level
  // TODO: move to state object
  opts.depth = opts.level;

  if(opts.ast) {
    json = JSON.stringify(ast, undefined, indent);
    return stream.write(json, cb); 
  }

  // pre-processing
  ast.forEach(function(token) {
    if(!hasModule) {
      hasModule = scope.findTag(conf.MODULE, token);
    }
    if(scope.findTag(conf.USAGE, token)) {
      usage = usage.concat([token]);
    }
  })

  // initial heading
  if(opts.heading && typeof opts.heading === 'string') {
    this.heading(stream, opts.heading, opts.depth); 
    opts.depth++;
  }

  if(!hasModule && usage.length) {
    render.usage.call(this, usage, opts);
  }

  // might need to render after a module declaration
  opts.usage = usage;

  // walk the ast
  ast.forEach(function(token) {
    var exclude = scope.findTag(conf.PRIVATE, token);
    var type = findType.call(scope, token);

    // marked @private
    if(exclude) {
      return false; 
    }

    // render for the type tag
    if(type) {
      // TODO: make this async
      return write.call(scope, type, token, opts);
    }
  })

  cb();
}

// jscs:disable maximumLineLength
/**
 *  Accepts an array of files and iterates the file contents in series 
 *  asynchronously.
 *
 *  Parse the comments in the each file into a comment AST 
 *  and transform the AST into commonmark compliant markdown.
 *
 *  The callback function is passed an error on failure: 
 *  `function(err)`.
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

  // state for the entire execution
  var state = {}
    , stream
    , called = false
    , scope;

  opts = opts || {};

  // stream to print to
  stream = opts.stream =
    (opts.stream !== undefined) ? opts.stream : process.stdout;

  // starting level for headings
  opts.level = opts.level || 1;

  // language for fenced code blocks
  opts.lang = opts.lang !== undefined ? opts.lang : parse.LANG;

  function done(err) {
    /* istanbul ignore if: guard against error race condition */
    if(called) {
      return;
    }
    cb(err || null); 
    called = true;
  }

  stream.once('error', done);

  // set scope after opts are parsed
  scope = getScope(state, opts);

  each(files.slice(),
    function onLoad(file, result, next) {
      var ast = comments(result.toString('utf8'), {trim: true});
      // update file state
      scope.file = {info: file, result: result};
      print.call(scope, ast, opts, next);
    },
    function onComplete(err) {
      if(err) {
        return done(err);
      }

      /* istanbul ignore else: never write to stdout in tests */
      if(stream !== process.stdout) {
        stream.once('finish', done);
        stream.end(); 
      }else{
        done();
      }
    });
}

/**
 *  Default language for fenced code blocks.
 *
 *  @property {String} LANG
 *  @default javascript
 */
parse.LANG = LANG;

module.exports = parse;
