/**
 *  Stream writer helper functions, render functions can access these methods 
 *  using `this`.
 *
 *  @module writers
 */
var repeat = require('string-repeater')
  , conf = require('./conf');

/**
 *  Write a heading at the specified level.
 *
 *  @param {String} str The value for the heading.
 *  @param {Number} level The level for the heading.
 */
function heading(str, level) {
  this.stream.write(repeat('#', level) + ' ' + str); 
  this.newline(2);
}

/**
 *  Write one or more newlines.
 *
 *  @param {Number} num The number of newlines to print, default is 1.
 */
function newline(num) {
  num = num || 1; 
  this.stream.write(repeat('\n', num)); 
}

/**
 *  Write a fenced code block.
 *
 *  @param {String} code The code content for the fenced block.
 *  @parma {String} lang A language for the info string.
 */
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

/**
 *  Write a function signature as a fenced code block.
 *
 *  @param {Array} params List of @param tags.
 *  @param {String} name A name for the function.
 *  @param {String} lang A language for the info string.
 */
function signature(params, name, lang) {
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
  this.fenced(name + sig, lang);
  return params;
}

/**
 *  Write a list of parameters.
 *
 *  Used for writing @param, @option, @throws etc.
 *
 *  @param {Array} params List of tags.
 */
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

/**
 *  Write meta data (@author, @version, @since etc) and handle writing the 
 *  deprected blockquote.
 *
 *  @param {Object} token The current token.
 */
function meta(token) {
  var deprecated = this.tags.findTag(conf.DEPRECATED, token)
    , author = this.tags.findTag(conf.AUTHOR, token)
    , version = this.tags.findTag(conf.VERSION, token)
    , since = this.tags.findTag(conf.SINCE, token)
    , hasMeta = Boolean(author || version || since)
    , list = '* **';

  if(deprecated) {
    this.stream.write('> **Deprecated:** '
      + deprecated.name + ' ' + deprecated.description);
    this.newline(2);
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

/**
 *  Write the list of @see links.
 *
 *  @param {Object} token The current token.
 */
function see(token) {
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
