var current;

/**
 *  Default render functions.
 *
 *  @module render
 */

/**
 *  Render a class (or module) block.
 *
 *  @function _class
 *  @param {Object} type The tag that initiated the render.
 *  @param {Object} token The current comment AST token.
 */
function _class(type, token) {
  var state = this.state
    , opts = this.opts
    , isModule = type.tag === this.conf.MODULE;

  if(isModule) {
    state.depth = this.opts.level + 1;
  }

  if(type.name) {
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
  }

  this.see(token);
}

/**
 *  Render a function block.
 *
 *  @function _function
 *  @param {Object} type The tag that initiated the render.
 *  @param {Object} token The current comment AST token.
 */
function _function(type, token) {
  var name = type.name
    , opts = this.opts
    , state = this.state
    , nm = name
    , params
    , options
    , level = state.depth
    , val = name
    , inherits
    , construct = (type.tag === this.conf.CONSTRUCTOR)
    , isStatic = (type.tag === this.conf.STATIC)
    , throwables
    , proto = this.tags.find(this.conf.PROTOTYPE, token)
    , retval = this.tags.find(this.conf.RETURN, token)
    , className;

  if(construct) {
    current = type;
    inherits = this.tags.find(this.conf.INHERITS, token); 
  }

  if(!name) {
    return;
  }

  // method inheritance
  if(inherits) {
    nm += this.conf.cues.CONSTRUCTOR + inherits.name;
    // multiple levels of inheritance
    if(inherits.description) {
      nm += this.conf.cues.CONSTRUCTOR
        + inherits.description.split(/\s+/)
            .join(this.conf.cues.CONSTRUCTOR);
    }
  }

  if(isStatic) {
    nm = this.conf.cues.STATIC + nm; 
  }else if(proto) {
    nm = this.conf.cues.MEMBER + nm; 
  }

  this.heading(nm, level);

  // method signature
  params = this.tags.collect(this.conf.PARAM, token);
  if(construct) {
    // TODO: move strings to format
    val = 'new ' + name; 
  }else if(isStatic) {
    // TODO: move strings to format
    if(type.description) {
      name = type.description + '.' + name; 
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
  this.signature(params, val, opts.lang);
  this.newline(2);

  this.meta(token);

  // method description
  if(token.description) {
    this.stream.write(token.description);
    this.newline(2);
  }

  if(retval) {
    this.stream.write('Returns ' + retval.name + ' ' + retval.description);
    this.newline(2);
  }

  // parameter list @param
  this.parameters(params);
  if(params.length) {
    this.newline();
  }

  // options list @option
  options = this.tags.collect(this.conf.OPTION, token);
  if(options.length) {
    this.heading(this.conf.header.OPTIONS, level + 1);
    this.parameters(options);
    this.newline();
  }

  throwables = this.tags.collect(this.conf.THROWS, token);

  if(throwables.length) {
    this.heading(this.conf.header.THROWS, level + 1);
    // Errors @throws
    this.parameters(throwables);
    if(params.length) {
      this.newline();
    }
  }

  this.see(token);
}

/**
 *  Render a property block.
 *
 *  @function _property 
 *  @param {Object} type The tag that initiated the render.
 *  @param {Object} token The current comment AST token.
 */
function _property(type, token) {
  var name = type.name
    , opts = this.opts
    , state = this.state
    , value = name
    , defaultValue = this.tags.find(this.conf.DEFAULT, token)
    , fixed = (type.tag === this.conf.CONSTANT);

  if(name && defaultValue) {
    // TODO: move to formatter!
    value += ' = ' + defaultValue.name + ';'
  }
  if(name) {
    this.heading(name, state.depth);

    if(value) {
      if(fixed) {
        // TODO: move to formatter!
        value = 'const ' + value;
      }
      this.fenced(value, opts.lang) 
      this.newline(2);
    }

    this.meta(token);

    if(token.description) {
      this.stream.write(token.description);
      this.newline(2);
    }
  }

  this.see(token);
}

module.exports = {
  _class: _class,
  _function: _function,
  _property: _property
}
