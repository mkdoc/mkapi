var repeat = require('string-repeater')
  , api = require('./api')
  , tag = require('./tag')
  , findTag = tag.findTag
  , collect = tag.collect;

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
    , deprecated = findTag(api.DEPRECATED, token)
    , author = findTag(api.AUTHOR, token)
    , version = findTag(api.VERSION, token)
    , since = findTag(api.SINCE, token)
    , hasMeta = Boolean(author || version || since)
    , list = '* **';

  if(deprecated) {
    stream.write('> **Deprecated:** '
      + deprecated.name + ' ' + deprecated.description);
    newline(stream, 2);
  }

  if(author) {
    stream.write(list + api.AUTHOR + '** `' + author.name + '`'); 
    newline(stream);
  }

  if(version) {
    stream.write(list + api.VERSION + '** `' + version.name + '`'); 
    newline(stream);
  }

  if(since) {
    stream.write(list + api.SINCE + '** `' + since.name + '`');
    newline(stream);
  }

  if(hasMeta) {
    newline(stream);
  }
}

function see(tag, token, opts) {
  var all = collect(api.SEE, token)
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

// legacy static access
Writer.heading = heading;
Writer.newline = newline;
Writer.fenced = fenced;
Writer.signature = signature;
Writer.parameters = parameters;
Writer.meta = meta;
Writer.see = see;

module.exports = Writer;
