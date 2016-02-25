/**
 *  Stream writer helper functions, render functions can access these methods 
 *  using `this`.
 *
 *  @module writers
 */
var repeat = require('string-repeater')
  , conf = require('./conf');

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
    , deprecated = this.tags.findTag(conf.DEPRECATED, token)
    , author = this.tags.findTag(conf.AUTHOR, token)
    , version = this.tags.findTag(conf.VERSION, token)
    , since = this.tags.findTag(conf.SINCE, token)
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
  var all = this.tags.collect(conf.SEE, token)
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
    see: see
  }
}

module.exports = Writer;
