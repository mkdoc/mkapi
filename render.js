var writers = require('./writers')
  , api = require('./api')
  , fenced = writers.fenced
  , newline = writers.newline
  , heading = writers.heading
  , signature = writers.signature
  , parameters = writers.parameters
  , meta = writers.meta
  , see = writers.see
  , tag = require('./tag')
  , findTag = tag.findTag
  , collect = tag.collect
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

function _class(tag, token, opts) {
  var stream = opts.stream
    , isModule = tag.tag === api.MODULE;

  if(isModule) {
    // reset to default level
    opts.depth = opts.level;
  }

  if(tag.name) {
    heading(stream, tag.name + ' '  + tag.description, opts.depth);

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

  see(tag, token, opts);
}

function _function(tag, token, opts) {
  var name = tag.name
    , nm = name
    , stream = opts.stream
    , params
    , options
    , level = opts.depth
    , val = name
    , inherits
    , construct = (tag.tag === api.CONSTRUCTOR)
    , isStatic = (tag.tag === api.STATIC)
    , throwables
    , proto = findTag(api.PROTOTYPE, token)
    , retval = findTag(api.RETURN, token)
    , className;

  if(construct) {
    current = tag;
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
    if(tag.description) {
      name = tag.description + '.' + name; 
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

  see(tag, token, opts);
}

function _property(tag, token, opts) {
  var name = tag.name
    , value = name
    , defaultValue = findTag(api.DEFAULT, token)
    , stream = opts.stream
    , fixed = (tag.tag === api.CONSTANT);

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

  see(tag, token, opts);
}

render[api.MODULE] = render[api.CLASS] = _class;
render[api.CONSTRUCTOR] = render[api.STATIC] = render[api.FUNCTION] = _function;
render[api.PROPERTY] = render[api.CONSTANT] = _property;

module.exports = render;
