var repeat = require('string-repeater')
  , conf = require('./conf');

/**
 *  Helper function to find a tag by name.
 *
 *  @private
 */
function findTag(name, ast) {
  for(var i = 0;i < ast.tags.length;i++) {
    if(ast.tags[i].tag === name) {
      return ast.tags[i]; 
    }
  }
}

/** 
 *  Helper function to collect all tags with a name.
 *
 *  @private
 */
function collect(name, ast) {
  var o = [];
  for(var i = 0;i < ast.tags.length;i++) {
    if(ast.tags[i].tag === name) {
      o.push(ast.tags[i]);
    }
  }
  return o;
}

// print a heading
function heading(stream, str, level) {
  stream.write(repeat('#', level) + ' ' + str); 
  newline(stream, 2);
}

// print newline(s)
function newline(stream, num) {
  num = num || 1; 
  stream.write(repeat('\n', num)); 
}

// print a fenced code block
function fenced(stream, code, lang) {
  stream.write('```'); 
  if(typeof lang === 'string') {
    stream.write(lang); 
  }
  newline(stream);
  stream.write(code);
  newline(stream);
  stream.write('```'); 
}

// print the function signature
function signature(params, name, token, opts) {
  var sig = '('
  params.forEach(function(param, index) {
    if(param.optional) {
      sig += '['; 
    }
    if(index) {
      sig += ', '; 
    }
    sig += param.name;
    if(param.optional) {
      sig += ']'; 
    }
  })

  sig += ')';

  fenced(opts.stream, name + sig, opts.lang);
  return params;
}

// print a list of parameters
function parameters(stream, params) {
  params.forEach(function(param) {
    var name = param.name
      , type = '';

    if(param.type) {
      type = param.type + ' '; 
    }
    stream.write('* `' + name + '` ' + type + param.description);
    newline(stream);
  })
}

function meta(token, opts) {
  var stream = opts.stream
    , deprecated = findTag(conf.DEPRECATED, token)
    , author = findTag(conf.AUTHOR, token)
    , version = findTag(conf.VERSION, token)
    , since = findTag(conf.SINCE, token)
    , hasMeta = Boolean(author || version || since)
    , list = '* **';

  if(deprecated) {
    stream.write('> **Deprecated:** '
      + deprecated.name + ' ' + deprecated.description);
    newline(stream, 2);
  }

  if(author) {
    stream.write(list + conf.AUTHOR + '** `' + author.name + '`'); 
    newline(stream);
  }

  if(version) {
    stream.write(list + conf.VERSION + '** `' + version.name + '`'); 
    newline(stream);
  }

  if(since) {
    stream.write(list + conf.SINCE + '** `' + since.name + '`');
    newline(stream);
  }

  if(hasMeta) {
    newline(stream);
  }
}

function see(tag, token, opts) {
  var all = collect(conf.SEE, token)
    , stream = opts.stream;
  if(all.length) {
    all.forEach(function(link) {
      if(link.name) {
        var val = '* [' + (link.description || link.name) + ']'
          + '(' + link.name + ')';
        stream.write(val);
        newline(stream);
      }
    })
    newline(stream);
  }
}

/**
 *  Writer scope.
 *
 *  @private
 */
function Writer() {
  return {
    heading: heading,
    newline: newline,
    fenced: fenced,
    signature: signature,
    parameters: parameters,
    meta: meta,
    see: see,
    collect: collect,
    findTag: findTag
  }
}

module.exports = Writer;
