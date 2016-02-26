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
    , info = token.getInfo()
    , title = type.name + ' '  + type.description;

  if(info.inherits) {
    title = this.format.inherits(type, info); 
  }

  if(info.isModule) {
    state.depth = this.opts.level + 1;
  }

  if(info.isClass) {
    currentClass = type;
  }

  this.heading(title, state.depth);
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
    , format
    , title;

  if(info.isConstructor) {
    currentClass = type;
    if(info.inherits) {
      title = this.format.inherits(type, info); 
    }
  }

  // inherit from current class
  if(info.isMember && !info.isMember.name && currentClass) {
    info.isMember.name = currentClass.name; 
  }

  format = this.format.method(type, info);

  if(!title && format) {
    title = format.title;
  }

  this.heading(title, level);

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
    this.newline();
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
    , info = token.getInfo();

  this.heading(type.name, state.depth);
  this.fenced(
    this.format.property(type, defaultValue, info.isConstant), opts.lang) 
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
