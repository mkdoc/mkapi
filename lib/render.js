var currentClass;

/**
 *  Default render functions.
 *
 *  Render functions are called asynchronously and must invoke the callback 
 *  function to process the next comment.
 *
 *  @module render
 */

/**
 *  Render a class (or module) block.
 *
 *  @function _class
 *  @param {Object} type The tag that initiated the render.
 *  @param {Object} token The current comment AST token.
 *  @param {Function} cb Callback function.
 */
function _class(type, token, cb) {
  // TODO: warn here
  if(!type.name) {
    return;
  }

  var state = this.state
    , opts = this.opts
    , isModule = type.tag === this.conf.MODULE;

  if(isModule) {
    state.depth = this.opts.level + 1;
  }

  this.heading(type.name + ' '  + type.description, state.depth);
  this.meta(token);
  if(opts.usage.length) {
    this.usage(opts.usage, opts.lang);
  }
  if(token.description) {
    this.stream.write(token.description); 
    this.newline(2);
  }
  state.depth++;
  this.see(token);
  cb();
}

/**
 *  Render a function block.
 *
 *  @function _function
 *  @param {Object} type The tag that initiated the render.
 *  @param {Object} token The current comment AST token.
 *  @param {Function} cb Callback function.
 */
function _function(type, token, cb) {
  // TODO: warn here
  if(!type.name) {
    return;
  }

  var opts = this.opts
    , state = this.state
    , level = state.depth
    , params
    , options
    , throwables
    // format options
    , info = token.getInfo(true)
    , format;

  // alias for the moment
  info.member = info.isMember;
  info.currentClass = currentClass;

  if(info.isConstructor) {
    currentClass = type;
  }

  format = this.format.method(type, info);

  this.heading(format.title, level);

  // method signature
  params = token.collect(this.conf.PARAM);

  this.signature(params, format.signature, opts.lang);
  this.newline(2);

  this.meta(token);

  // method description
  if(token.description) {
    this.stream.write(token.description);
    this.newline(2);
  }

  if(info.returns) {
    this.stream.write(this.format.returns(info.returns));
    this.newline(2);
  }

  // parameter list @param
  this.parameters(params);
  if(params.length) {
    this.newline();
  }

  // options list @option
  options = token.collect(this.conf.OPTION);
  if(options.length) {
    this.heading(this.conf.title.OPTIONS, level + 1);
    this.parameters(options);
    this.newline();
  }

  throwables = token.collect(this.conf.THROWS);

  if(throwables.length) {
    this.heading(this.conf.title.THROWS, level + 1);
    this.parameters(throwables);
    if(params.length) {
      this.newline();
    }
  }

  this.see(token);
  cb();
}

/**
 *  Render a property block.
 *
 *  @function _property 
 *  @param {Object} type The tag that initiated the render.
 *  @param {Object} token The current comment AST token.
 *  @param {Function} cb Callback function.
 */
function _property(type, token, cb) {
  // TODO: warn here
  if(!type.name) {
    return;
  }

  var opts = this.opts
    , state = this.state
    , defaultValue = token.find(this.conf.DEFAULT)
    , fixed = (type.tag === this.conf.CONSTANT);

  this.heading(type.name, state.depth);
  this.fenced(
    this.format.property(type, defaultValue, fixed), opts.lang) 
  this.newline(2);
  this.meta(token);
  if(token.description) {
    this.stream.write(token.description);
    this.newline(2);
  }

  this.see(token);
  cb();
}

module.exports = {
  _class: _class,
  _function: _function,
  _property: _property
}
