var api = require('./conf')
  , current
  , render = {};

/**
 *  Render a usage code block.
 *
 *  @private
 */
function _usage(tokens, opts) {
  var stream = opts.stream;
  function it(token) {
    this.fenced(stream, token.description, opts.lang);
    this.newline(stream, 2);
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
  var stream = this.stream
    , isModule = type.tag === api.MODULE;

  if(isModule) {
    // reset to default level
    opts.depth = opts.level;
  }

  if(type.name) {
    this.heading(stream, type.name + ' '  + type.description, opts.depth);

    this.meta(token, opts);

    if(opts.usage.length) {
      render.usage.call(this, opts.usage, opts); 
    }

    if(token.description) {
      stream.write(token.description); 
      this.newline(stream, 2);
    }

    opts.depth++;
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
    , nm = name
    , stream = this.stream
    , params
    , options
    , level = opts.depth
    , val = name
    , inherits
    , construct = (type.tag === api.CONSTRUCTOR)
    , isStatic = (type.tag === api.STATIC)
    , throwables
    , proto = this.findTag(api.PROTOTYPE, token)
    , retval = this.findTag(api.RETURN, token)
    , className;

  if(construct) {
    current = type;
    inherits = this.findTag(api.INHERITS, token); 
  }

  if(!name) {
    return;
  }

  // method inheritance
  if(inherits) {
    nm += api.cues.CONSTRUCTOR + inherits.name;
    if(inherits.description) {
      nm += api.cues.CONSTRUCTOR
        + inherits.description.split(/\s+/).join(api.cues.CONSTRUCTOR);
    }
  }

  if(isStatic) {
    nm = api.cues.STATIC + nm; 
  }else if(proto) {
    nm = api.cues.MEMBER + nm; 
  }

  this.heading(stream, nm, level);

  // method signature
  params = this.collect(api.PARAM, token);
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
  this.newline(stream, 2);

  this.meta(token, opts);

  // method description
  if(token.description) {
    stream.write(token.description);
    this.newline(stream, 2);
  }

  if(retval) {
    stream.write('Returns ' + retval.name + ' ' + retval.description);
    this.newline(stream, 2);
  }

  // parameter list @param
  this.parameters(stream, params);
  if(params.length) {
    this.newline(stream);
  }

  // options list @option
  options = this.collect(api.OPTION, token);
  if(options.length) {
    this.heading(stream, api.header.OPTIONS, level + 1);
    this.parameters(stream, options);
    this.newline(stream);
  }

  throwables = this.collect(api.THROWS, token);

  if(throwables.length) {
    this.heading(stream, api.header.THROWS, level + 1);
    // Errors @throws
    this.parameters(stream, throwables);
    if(params.length) {
      this.newline(stream);
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
    , value = name
    , defaultValue = this.findTag(api.DEFAULT, token)
    , stream = this.stream
    , fixed = (type.tag === api.CONSTANT);

  if(name && defaultValue) {
    value += ' = ' + defaultValue.name + ';'
  }
  if(name) {
    this.heading(stream, name, opts.depth);

    if(value) {
      if(fixed) {
        value = 'const ' + value;
      }
      this.fenced(stream, value, opts.lang) 
      this.newline(stream, 2);
    }

    this.meta(token, opts);

    if(token.description) {
      stream.write(token.description);
      this.newline(stream, 2);
    }
  }

  this.see(type, token, opts);
}

render[api.MODULE] = render[api.CLASS] = _class;
render[api.CONSTRUCTOR] = render[api.STATIC] = render[api.FUNCTION] = _function;
render[api.PROPERTY] = render[api.CONSTANT] = _property;

module.exports = render;
