var fs = require('fs')
  , assert = require('assert')
  , comments = require('comment-parser')
  , Writers = require('./lib/writers')
  , Tag = require('./lib/tag')
  //, render = require('./lib/render');

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
    this.tags.findTag(this.conf.MODULE, token)
    || this.tags.findTag(this.conf.CLASS, token)
    || this.tags.findTag(this.conf.CONSTRUCTOR, token)
    || this.tags.findTag(this.conf.FUNCTION, token)
    || this.tags.findTag(this.conf.STATIC, token)
    || this.tags.findTag(this.conf.PROPERTY, token)
    || this.tags.findTag(this.conf.CONSTANT, token);
  return type;
}

/**
 *  Gets the scope for render function calls.
 *
 *  @private
 */
function getScope(conf, state, opts) {
  var scope = Writers()
    , stream = opts.stream
    , k;

  // bind writers to the stream scope
  for(k in scope) {
    // must all be functions
    scope[k] = scope[k].bind(scope);
  }

  // expose tags on the primary scope for render functions
  // and on the stream scope for writers
  scope.tags = stream.tags = {};
  for(k in Tag) {
    scope.tags[k] = stream.tags[k] = Tag[k];
  }

  // pass configuration object in scope
  scope.conf = conf;

  // state for the entire execution
  scope.state = state;

  // parse options
  scope.opts = opts;

  // stream to write to
  scope.stream = stream;

  // alias the render map at the top-level
  scope.render = conf.render;

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
  this.render[type.tag].call(this, type, token, opts); 
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

  if(opts.ast) {
    json = JSON.stringify(ast, undefined, indent);
    return stream.write(json, cb); 
  }

  // pre-processing
  ast.forEach(function(token) {
    if(!hasModule) {
      hasModule = scope.tags.findTag(scope.conf.MODULE, token);
    }
    if(scope.tags.findTag(scope.conf.USAGE, token)) {
      usage = usage.concat([token]);
    }
  })

  if(!hasModule && usage.length) {
    this.render.usage.call(this, usage, opts);
  }

  // might need to render after a module declaration
  opts.usage = usage;

  // walk the ast
  ast.forEach(function(token) {
    var exclude = scope.tags.findTag(scope.conf.PRIVATE, token);
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
 *  Parse the comments in each file into a comment AST 
 *  and transform the AST into commonmark compliant markdown.
 *
 *  The callback function is passed an error on failure: `function(err)`.
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
    , scope
    , config = require('./lib/conf');

  opts = opts || {};

  // stream to print to
  stream = opts.stream =
    (opts.stream !== undefined) ? opts.stream : process.stdout;

  // starting level for headings
  opts.level = opts.level || 1;

  // language for fenced code blocks
  opts.lang = opts.lang !== undefined ? opts.lang : config.LANG;

  // state of the depth level
  state.depth = opts.level;

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
  scope = getScope(config, state, opts);

  // initial heading
  if(opts.heading && typeof opts.heading === 'string') {
    scope.heading(opts.heading, state.depth); 
    state.depth++;
    // global header written
    state.header = true;
  }

  each(files.slice(),
    function onLoad(file, result, next) {

      var ast = comments(result.toString('utf8'), {trim: true});

      // update file state
      scope.file = {info: file, buffer: result};

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

module.exports = parse;
