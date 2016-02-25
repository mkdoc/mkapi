var writers = require('./writers')
  , api = require('./api')
  , fenced = writers.fenced
  , newline = writers.newline
  , heading = writers.heading
  , signature = writers.signature
  , parameters = writers.parameters
  , meta = writers.meta
  , see = writers.see
  , Tag = require('./tag')
  , findTag = Tag.findTag
  , collect = Tag.collect
  , current
  , render = {};

function _usage(tokens, opts) {
  var stream = opts.stream;
  tokens.forEach(function(token) {
    fenced(stream, token.description, opts.lang);
    newline(stream, 2);
  });
}

render.usage = _usage;

function _class(type, token, opts) {
  var stream = this.stream
    , isModule = type.tag === api.MODULE;

  if(isModule) {
    // reset to default level
    opts.depth = opts.level;
  }

  if(type.name) {
    heading(stream, type.name + ' '  + type.description, opts.depth);

    meta(token, opts);

    if(opts.usage.length) {
      render.usage(opts.usage, opts); 
    }

    if(token.description) {
      stream.write(token.description); 
      newline(stream, 2);
    }

    opts.depth++;
  }

  see(type, token, opts);
}

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
    , proto = findTag(api.PROTOTYPE, token)
    , retval = findTag(api.RETURN, token)
    , className;

  if(construct) {
    current = type;
    inherits = findTag(api.INHERITS, token); 
  }

  if(!name) {
    return;
  }

  // method inheritance
  if(inherits) {
    nm += ' < ' + inherits.name;
    if(inherits.description) {
      nm += ' < ' + inherits.description.split(/\s+/).join(' < ');
    }
  }

  if(isStatic) {
    nm = '#' + nm; 
  }else if(proto) {
    nm = '.' + nm; 
  }

  heading(stream, nm, level);

  // method signature
  params = collect(api.PARAM, token);
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
  signature(params, val, token, opts, {construct: construct});
  newline(stream, 2);

  meta(token, opts);

  // method description
  if(token.description) {
    stream.write(token.description);
    newline(stream, 2);
  }

  if(retval) {
    stream.write('Returns ' + retval.name + ' ' + retval.description);
    newline(stream, 2);
  }

  // parameter list @param
  parameters(stream, params);
  if(params.length) {
    newline(stream);
  }

  // options list @option
  options = collect(api.OPTION, token);
  if(options.length) {
    heading(stream, api.header.OPTIONS, level + 1);
    parameters(stream, options);
    newline(stream);
  }

  throwables = collect(api.THROWS, token);

  if(throwables.length) {
    heading(stream, api.header.THROWS, level + 1);
    // Errors @throws
    parameters(stream, throwables);
    if(params.length) {
      newline(stream);
    }
  }

  see(type, token, opts);
}

function _property(type, token, opts) {
  var name = type.name
    , value = name
    , defaultValue = findTag(api.DEFAULT, token)
    , stream = this.stream
    , fixed = (type.tag === api.CONSTANT);

  if(name && defaultValue) {
    value += ' = ' + defaultValue.name + ';'
  }
  if(name) {
    heading(stream, name, opts.depth);

    if(value) {
      if(fixed) {
        value = 'const ' + value;
      }
      fenced(stream, value, opts.lang) 
      newline(stream, 2);
    }

    meta(token, opts);

    if(token.description) {
      stream.write(token.description);
      newline(stream, 2);
    }
  }

  see(type, token, opts);
}

render[api.MODULE] = render[api.CLASS] = _class;
render[api.CONSTRUCTOR] = render[api.STATIC] = render[api.FUNCTION] = _function;
render[api.PROPERTY] = render[api.CONSTANT] = _property;

module.exports = render;
