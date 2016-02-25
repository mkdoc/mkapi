var conf = require('./conf')
  , current
  , render = {};

/**
 *  Render a usage code block.
 *
 *  @private
 */
function _usage(tokens, opts) {
  function it(token) {
    this.fenced(token.description, opts.lang);
    this.newline(2);
  }
  tokens.forEach(it.bind(this));
}

render.usage = _usage;

/**
 *  Render a class (or module) block.
 *
 *  @private
 */
function _class(type, token, opts) {
  var state = this.state

  if(type.name) {
    this.heading(type.name + ' '  + type.description, state.depth);

    this.meta(token, opts);

    if(opts.usage.length) {
      render.usage.call(this, opts.usage, opts); 
    }

    if(token.description) {
      this.stream.write(token.description); 
      this.newline(2);
    }

    state.depth++;
  }

  this.see(type, token, opts);
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
    , construct = (type.tag === conf.CONSTRUCTOR)
    , isStatic = (type.tag === conf.STATIC)
    , throwables
    , proto = this.tags.findTag(conf.PROTOTYPE, token)
    , retval = this.tags.findTag(conf.RETURN, token)
    , className;

  if(construct) {
    current = type;
    inherits = this.tags.findTag(conf.INHERITS, token); 
  }

  if(!name) {
    return;
  }

  // method inheritance
  if(inherits) {
    nm += conf.cues.CONSTRUCTOR + inherits.name;
    if(inherits.description) {
      nm += conf.cues.CONSTRUCTOR
        + inherits.description.split(/\s+/).join(conf.cues.CONSTRUCTOR);
    }
  }

  if(isStatic) {
    nm = conf.cues.STATIC + nm; 
  }else if(proto) {
    nm = conf.cues.MEMBER + nm; 
  }

  this.heading(nm, level);

  // method signature
  params = this.tags.collect(conf.PARAM, token);
  if(construct) {
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
  this.signature(params, val, token, opts, {construct: construct});
  this.newline(2);

  this.meta(token, opts);

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
  options = this.tags.collect(conf.OPTION, token);
  if(options.length) {
    this.heading(conf.header.OPTIONS, level + 1);
    this.parameters(options);
    this.newline();
  }

  throwables = this.tags.collect(conf.THROWS, token);

  if(throwables.length) {
    this.heading(conf.header.THROWS, level + 1);
    // Errors @throws
    this.parameters(throwables);
    if(params.length) {
      this.newline();
    }
  }

  this.see(type, token, opts);
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
    , defaultValue = this.tags.findTag(conf.DEFAULT, token)
    , fixed = (type.tag === conf.CONSTANT);

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

    this.meta(token, opts);

    if(token.description) {
      this.stream.write(token.description);
      this.newline(2);
    }
  }

  this.see(type, token, opts);
}

render[conf.MODULE] = render[conf.CLASS] = _class;
render[conf.CONSTRUCTOR] = render[conf.STATIC] = render[conf.FUNCTION] 
  = _function;
render[conf.PROPERTY] = render[conf.CONSTANT] = _property;

module.exports = render;
