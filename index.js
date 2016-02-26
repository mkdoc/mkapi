var fs = require('fs')
  , assert = require('assert')
  , comments = require('comment-parser')
  , merge = require('merge')
  , Writers = require('./lib/writers')
  , Comment = require('./lib/comment')
  , registry = {};

// prevent conflict on constructor keyword
registry.constructor = null;

/**
 *  var parse = require('mdapi');
 *  parse(['index.js'], {stream: process.stdout});
 *
 *  @usage
 */

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

  // bind format functions to scope
  for(k in conf.format) {
    conf.format[k] = conf.format[k].bind(scope);
  }

  // pass configuration object in scope
  scope.conf = conf;

  // state for the entire execution
  scope.state = state;

  // parse options
  scope.opts = opts;

  // stream to write to
  scope.stream = stream;

  // pass in the registry
  scope.registry = registry;

  // alias the render map at the top-level
  var render = scope.render = conf.render;

  // alias the format functions at the top-level
  scope.format = conf.format;

  // set up default renderers
  defaults(conf, render);

  // bind registered renderers
  for(k in registry) {
    if(typeof registry[k] === 'function') {
      render[k] = registry[k].bind(scope);
    }
  }

  return scope;
}

/**
 *  Iterate input files in series asynchronously.
 *
 *  @private
 *  
 *  @function each
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
  var stream = this.stream
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
  function preprocess(token) {
    // wrap tokens
    token = new Comment(token, this);

    if(!hasModule) {
      hasModule = token.find(this.conf.MODULE);
    }

    // gather usage blocks
    if(token.find(this.conf.USAGE)) {
      usage = usage.concat([token]);
    }

    return token;
  }

  this.ast = ast = ast.map(preprocess.bind(this));

  if(!hasModule && usage.length) {
    this.usage(usage, opts.lang);
  }

  // might need to render after a module declaration
  opts.usage = usage;

  var comments = ast.slice();

  // walk the ast
  var run = (function(err) {
    var token = comments.shift();

    // completed all tokens or render function errored
    if(!token || err) {
      return cb(err || null);
    }

    var exclude = token.find(this.conf.PRIVATE);
    var info = token.getDetail();

    // marked @private
    if(exclude && (this.opts.includePrivate === false)) {
      return false; 
    }

    // render for the type tag
    if(info && info.id && (typeof this.render[info.id] === 'function')) {
      // call render function async
      this.render[info.id](info.type, token, function(err) {
        run(err || null); 
      });
    }else{
      // continue processing
      run();
    }
  }).bind(this);

  run();

  //cb();
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
 *  @option {Object} conf Configuration overrides.
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
    // default config
    , config = require('./lib/conf')
    // comment parser options
    , parser = {trim: true};

  opts = opts || {};

  // merge user configuration with default config
  if(opts.conf) {
    opts.conf = merge(true, config, opts.conf); 
  }

  // stream to print to
  stream = opts.stream =
    (opts.stream !== undefined) ? opts.stream : process.stdout;

  assert(stream.write instanceof Function, 'stream expected to have write()');

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

  // get scope after opts have been configured
  scope = getScope(config, state, opts);

  // initial heading
  if(opts.heading && typeof opts.heading === 'string') {
    scope.heading(opts.heading, state.depth); 
    state.depth++;
    // global header written
    state.header = true;
  }

  each(
    files.slice(),
    function onFile(file, result, next) {
      var ast = comments(result.toString('utf8'), parser);
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
    }
  );
}

/**
 *  Register a render function for a given type tag.
 *
 *  @function register
 *  @param {String} type The type name for the tag.
 *  @param {Function} renderer The render function.
 */
function register(type, renderer) {
  // mutated getter
  if(type && !renderer) {
    return registry[type];
  }
  if(typeof renderer === 'function') {
    registry[type] = renderer;
  }
  return registry;
}

/**
 *  Register default renderer mappings.
 *
 *  @private
 *  @function defaults
 *  @param {Object} conf The program configuration.
 *  @param {Object} render The map of render functions.
 */
function defaults(conf, render) {
  // do not overwrite previously registered renders
  function set(key, method) {
    if(!register(key)) {
      register(key, method);
    }
  }
  set(conf.MODULE, render._class);
  set(conf.CLASS, render._class);
  set(conf.CONSTRUCTOR, render._function);
  set(conf.STATIC, render._function);
  set(conf.FUNCTION, render._function);
  set(conf.PROPERTY, render._property);
  set(conf.CONSTANT, render._property);
}

parse.register = register;

module.exports = parse;
