/**
 *  Stream writer helper functions.
 *
 *  Responsible for writing to the output stream but should **not** perform 
 *  any formatting of the output string, their role is to extract the 
 *  relevant information; call a format function and write the result to 
 *  the stream appending newlines where necessary.
 *
 *  Render functions can access these methods using `this`.
 *
 *  These functions call the format functions using `this.format`.
 *
 *  @module writers
 */
var repeat = require('string-repeater')
  , conf = require('./conf')
  , EOL = require('os').EOL;

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
  this.fenced(name + this.format.signature(params), lang);
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
  var deprecated = token.find(conf.DEPRECATED)
    , author = token.find(conf.AUTHOR)
    , version = token.find(conf.VERSION)
    , since = token.find(conf.SINCE)
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
 *  Print the description for a token.
 */
function describe(token) {
  var desc = token.describe();
  this.stream.write(desc); 
  if(desc) {
    this.newline(2);
  }
}

/**
 *  Write the list of see also links.
 *
 *  @function see
 *  @param {Object} token The current token.
 */
function see(token) {
  var all = token.collect(conf.SEE);
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

/**
 *  Render a usage code block.
 *
 *  @private
 */
function usage(tokens, lang) {
  function it(token) {
    this.fenced(token.description, lang);
    this.newline(2);
  }
  tokens.forEach(it.bind(this));
}

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
    see: see,
    usage: usage,
    describe: describe
  }
}


module.exports = Writer;
