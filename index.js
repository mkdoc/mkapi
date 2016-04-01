var fs = require('fs')
  , assert = require('assert')
  , comments = require('comment-parser')
  , merge = require('merge')
  , Writer = require('./lib/writers')
  , Comment = require('./lib/comment')
  // renderer registry
  , registry = {}
  // tag definitions
  , tags = {};

// prevent conflict on constructor keyword
tags.constructor = registry.constructor = null;

/**
 *  Gets the scope for render function calls.
 *
 *  @private {function} getScope
 *  @param {Object} the configuration.
 *  @param {Object} the current execution state.
 *  @param {Object} opts the parse options.
 */
function getScope(conf, state, opts) {
  var scope = new Writer()
    , output = opts.output
    , k;

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

  // output to write to
  scope.output = output;

  // pass in the registry
  scope.registry = registry;

  // alias the render map at the top-level
  var render = scope.render = conf.render;

  // alias the format functions at the top-level
  scope.format = conf.format;

  // set up default renderers
  defaults(scope, conf, render);

  // bind registered renderers
  for(k in registry) {
    render[k] = registry[k].bind(scope);
  }

  return scope;
}

/**
 *  Iterate input files in series asynchronously.
 *
 *  @private {function} each
 *  @param {Array} files list of input files to load.
 *  @param {Function} it file iterator function.
 *  @param {Function} cb callback function.
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
 *  @private {function} print
 *  @param {Object} ast The parsed comments abstract syntax tree.
 *  @param {Object} opts Parse options.
 *  @param {Function} cb Callback function.
 */
function print(ast, opts, cb) {
  var output = this.output
    , json
    //, usage = []
    //, hasModule = false
    , indent = typeof(opts.indent) === 'number' && !isNaN(opts.indent) 
        ? Math.abs(opts.indent) : 2;

  if(opts.ast) {
    json = JSON.stringify(ast, undefined, indent);
    return output.write(json, cb); 
  }

  var comments = ast.slice();

  // walk the ast
  var run = (function walk(err) {
    var token = comments.shift();

    // completed all tokens or render function errored
    if(!token || err) {
      return cb(err || null);
    }

    token = new Comment(token, this);

    var exclude = token.find(this.conf.PRIVATE);
    var info = token.getDetail(this.conf.custom);

    // marked @private
    if(exclude && (this.conf.include[this.conf.PRIVATE] !== true)) {
      return run(); 
    }

    // render for the type tag
    if(info && info.id
      && (typeof this.render[info.id] === 'function')) {

      // call render function async
      this.render[info.id](info.type, token, function(err) {
        run(err || null); 
      });

    }else{
      // TODO: warn here?
      // continue processing
      run();
    }
  }).bind(this);

  run();
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
 *  @usage 
 *
 *  var parse = require('mkapi')
 *    , parse(['index.js'], {output: process.stdout});
 *
 *  @function parse
 *  @param {Array} files List of files to parse.
 *  @param {Object} [opts] Parse options.
 *  @param {Function} cb Callback function.
 *
 *  @option {Writable} output The stream to write to, default is `stdout`.
 *  @option {Object} conf Configuration overrides.
 *  @option {Number} level Initial level for the first heading, default is `1`.
 *  @option {String} heading Value for an initial heading.
 *  @option {String} lang Language for fenced code blocks, default is `javascript`.
 *
 *  @event error when a processing error occurs.
 *  @event file when a file buffer is available.
 *  @event ast when the comment AST is available.
 *  @event finish when all files have been parsed.
 *
 *  @returns an event notifier.
 */
function parse(files, opts, cb) {
  assert(Array.isArray(files), 'array of files expected');

  if(typeof opts === 'function') {
    cb = opts; 
    opts = null;
  }

  //assert(cb instanceof Function, 'callback function expected');

  // state for the entire execution
  var state = {}
    , output
    , called = false
    , scope
    // default config
    , config = require('./lib/conf')
    // comment parser options
    , parser = {trim: true};

  opts = opts || {};

  // merge user configuration with default config
  if(opts.conf) {
    config = merge(true, config, opts.conf); 
  }

  // output to print to
  output = opts.output =
    (opts.output !== undefined) ? opts.output : process.stdout;

  assert(output.write instanceof Function, 'output expected to have write()');

  // starting level for headings
  opts.level = opts.level || 1;

  // language for fenced code blocks
  state.lang = opts.lang = opts.lang !== undefined ? opts.lang : config.LANG;

  // state of the depth level
  state.depth = opts.level;

  function done(err) {
    /* istanbul ignore if: guard against error race condition */
    if(called) {
      return;
    }
    called = true;
    if(err) {
      return scope.emit('error', err);
    }
    scope.emit('finish')
  }

  output.once('error', done);

  // get scope after opts have been configured
  scope = getScope(config, state, opts);

  if(typeof cb === 'function') {
    scope
      .once('error', cb)
      .once('finish', cb);
  }

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
      scope.emit('file', file, result);
      var ast = comments(result.toString('utf8'), parser);
      scope.emit('ast', ast);
      // update file state
      scope.file = {info: file, buffer: result};
      print.call(scope, ast, opts, next);
    },
    function onComplete(err) {
      if(err) {
        return done(err);
      }

      /* istanbul ignore else: never write to stdout in tests */
      if(output !== process.stdout) {
        output.once('finish', done);
        output.end(); 
      }else{
        done();
      }
    }
  );

  return scope;
}

/**
 *  Register a render function for a given type tag.
 *
 *  Without the `renderer` option attempts to return a render function 
 *  for the specified type.
 *
 *  @function register
 *  @param {String} type The type name for the tag.
 *  @param {Function} [renderer] The render function.
 *
 *  @returns a renderer or the registry.
 */
function register(type, renderer) {
  assert(typeof type === 'string', 'expected type string to register renderer');

  if(renderer !== undefined) {
    assert(renderer instanceof Function, 'expected renderer to be a function');
  }

  // mutated getter
  if(type && !renderer) {
    return registry[type];
  }

  registry[type] = renderer;

  return registry;
}

/**
 *  Adds a tag to the list of known tags.
 *
 *  Use this to create custom tags.
 *
 *  @function tag
 *  @param {String} name The name of the tag, do not include `@`.
 *  @param {Object} [opts] An object whose fields are merged with the tag 
 *  definition.
 *
 *  @returns the tag definition.
 */
function tag(name, opts) {
  assert(typeof name === 'string', 'expected name string to create tag');
  tags[name] = new Tag(name, {synonyms: []});
  for(var k in opts) {
    tags[name][k] = opts[k];
  }
  return tags[name];
}

/**
 *  Encapsulates a tag definition.
 *
 *  @constructor Tag
 *  @property {String} name The tag name.
 *  @property {Array} synonyms List of synonyms for this tag.
 */
function Tag(name, opts) {
  for(var k in opts) {
    this[k] = opts[k];
  }
  this.name = name;
}

/**
 *  Register default renderer mappings.
 *
 *  @private {function} defaults
 *  @param {Function} scope The scope for function calls.
 *  @param {Object} conf The program configuration.
 *  @param {Object} render The map of render functions.
 */
function defaults(scope, conf, render) {
  var k;

  // list of custom tag names
  conf.custom = [];
  for(k in tags) {
    if(tags[k]) {
      conf.custom.push(k);
    }
  }

  // register built-in tags if they are not already set
  conf.names.forEach(function(name) {
    if(!tags[name]) {
      tag(name); 
    } 
  })

  // register tag constants
  for(k in tags) {
    // string constants for names on `conf`
    conf[k.toUpperCase()] = tags[k].name;
  }

  // tag definitions available via conf
  conf.tags = tags;

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
parse.tag = tag;

function stream(files, opts, cb) {
  return parse(files, opts, cb).stream;
}

stream.parse = parse;

module.exports = stream;
