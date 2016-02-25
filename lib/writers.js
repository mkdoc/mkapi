/**
 *  Stream writer helper functions, render functions can access these methods 
 *  using `this`.
 *
 *  @module writers
 */
var repeat = require('string-repeater')
  , conf = require('./conf');

// print a heading
function heading(str, level) {
  this.stream.write(repeat('#', level) + ' ' + str); 
  this.newline(2);
}

// print newline(s)
function newline(num) {
  num = num || 1; 
  this.stream.write(repeat('\n', num)); 
}

// print a fenced code block
function fenced(code, lang) {
  this.stream.write('```'); 
  if(typeof lang === 'string') {
    this.stream.write(lang); 
  }
  this.newline();
  this.stream.write(code);
  this.newline();
  this.stream.write('```'); 
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

  this.fenced(name + sig, opts.lang);
  return params;
}

// print a list of parameters
function parameters(params) {

  function onParam(param) {
    var name = param.name
      , type = '';

    if(param.type) {
      type = param.type + ' '; 
    }
    this.stream.write('* `' + name + '` ' + type + param.description);
    this.newline();
  }

  // TODO: optimize this bind(), can be called earlier once
  params.forEach(onParam.bind(this));
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
    this.stream.write('> **Deprecated:** '
      + deprecated.name + ' ' + deprecated.description);
    this.newline(stream, 2);
  }

  if(author) {
    this.stream.write(list + conf.AUTHOR + '** `' + author.name + '`'); 
    this.newline();
  }

  if(version) {
    this.stream.write(list + conf.VERSION + '** `' + version.name + '`'); 
    this.newline();
  }

  if(since) {
    this.stream.write(list + conf.SINCE + '** `' + since.name + '`');
    this.newline();
  }

  if(hasMeta) {
    this.newline();
  }
}

function see(tag, token/*, opts*/) {
  var all = this.tags.collect(conf.SEE, token);

  function onSee(link) {
    if(link.name) {
      var val = '* [' + (link.description || link.name) + ']'
        + '(' + link.name + ')';
      this.stream.write(val);
      this.newline();
    }
  }

  if(all.length) {
    all.forEach(onSee.bind(this));
    this.newline();
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
