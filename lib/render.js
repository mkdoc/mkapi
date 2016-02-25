var current;

/**
 *  Render a class (or module) block.
 *
 *  @private
 */
function _class(type, token, opts) {
  var state = this.state
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
 *  @private
 */
function _function(type, token, opts) {
  var name = type.name
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
    , proto = this.tags.findTag(this.conf.PROTOTYPE, token)
    , retval = this.tags.findTag(this.conf.RETURN, token)
    , className;

  if(construct) {
    current = type;
    inherits = this.tags.findTag(this.conf.INHERITS, token); 
  }

  if(!name) {
    return;
  }

  // method inheritance
  if(inherits) {
    nm += this.conf.cues.CONSTRUCTOR + inherits.name;
    if(inherits.description) {
      nm += this.conf.cues.CONSTRUCTOR
        + inherits.description.split(/\s+/).join(this.conf.cues.CONSTRUCTOR);
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
    // TODO: move strings to constants
    val = 'new ' + name; 
  }else if(isStatic) {
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
 *  @private
 */
function _property(type, token, opts) {
  var name = type.name
    , state = this.state
    , value = name
    , defaultValue = this.tags.findTag(this.conf.DEFAULT, token)
    , fixed = (type.tag === this.conf.CONSTANT);

  if(name && defaultValue) {
    value += ' = ' + defaultValue.name + ';'
  }
  if(name) {
    this.heading(name, state.depth);

    if(value) {
      if(fixed) {
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

//render[conf.MODULE] = render[conf.CLASS] = _class;
//render[conf.CONSTRUCTOR] 
  //= render[conf.STATIC]
  //= render[conf.FUNCTION] 
  //= _function;
//render[conf.PROPERTY] = render[conf.CONSTANT] = _property;

module.exports = {
  _class: _class,
  _function: _function,
  _property: _property
}
