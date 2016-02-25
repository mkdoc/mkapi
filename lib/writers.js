/**
 *  Stream writer helper functions, render functions can access these methods 
 *  using `this`.
 *
 *  @module writers
 */
var repeat = require('string-repeater')
  , conf = require('./conf')
  , EOL = require('os').EOL;

/**
 *  Writer scope.
 *
 *  @private
 *  @constructor Writer
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

/**
 *  Write a heading at the specified level.
 *
 *  @function heading
 *  @param {String} val The value for the heading.
 *  @param {Number} level The level for the heading.
 */
function heading(val, level) {
  this.stream.write(this.format.heading(val, level));
  this.newline(2);
}

/**
 *  Write one or more newlines.
 *
 *  @function newline
 *  @param {Number} [num] The number of newlines to print, default is 1.
 */
function newline(num) {
  num = num || 1; 
  this.stream.write(repeat(EOL, num)); 
}

/**
 *  Write a fenced code block.
 *
 *  @function fenced
 *  @param {String} code The code content for the fenced block.
 *  @parma {String} lang A language for the info string.
 */
function fenced(code, lang) {
  this.stream.write(this.format.fenced(code, lang)); 
}

/**
 *  Write a function signature as a fenced code block.
 *
 *  @function signature
 *  @param {Array} params List of tags.
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
 *  Used for writing param, option, throws etc.
 *
 *  @function parameters
 *  @param {Array} params List of tags.
 */
function parameters(params) {
  function onParam(param) {
    this.stream.write(this.format.parameter(param));
    this.newline();
  }

  // TODO: optimize this bind(), can be called earlier once
  params.forEach(onParam.bind(this));
}

/**
 *  Write meta data (author, version, since etc) and handle writing the 
 *  deprecated notice.
 *
 *  @function meta
 *  @param {Object} token The current token.
 */
function meta(token) {
  var deprecated = this.tags.findTag(conf.DEPRECATED, token)
    , author = this.tags.findTag(conf.AUTHOR, token)
    , version = this.tags.findTag(conf.VERSION, token)
    , since = this.tags.findTag(conf.SINCE, token)
    , hasMeta = Boolean(author || version || since);

  if(deprecated) {
    this.stream.write(this.format.deprecated(deprecated));
    this.newline(2);
  }

  if(author) {
    this.stream.write(this.format.meta(author, conf.AUTHOR));
    this.newline();
  }

  if(version) {
    this.stream.write(this.format.meta(version, conf.VERSION));
    this.newline();
  }

  if(since) {
    this.stream.write(this.format.meta(since, conf.SINCE));
    this.newline();
  }

  if(hasMeta) {
    this.newline();
  }
}

/**
 *  Write the list of see also links.
 *
 *  @function see
 *  @param {Object} token The current token.
 */
function see(token) {
  var all = this.tags.collect(conf.SEE, token);
  function onSee(link) {
    if(link.name) {
      this.stream.write(this.format.link(link));
      this.newline();
    }
  }
  if(all.length) {
    all.forEach(onSee.bind(this));
    this.newline();
  }
}

module.exports = Writer;
