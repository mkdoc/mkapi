/**
 *  Output writer helper functions.
 *
 *  Responsible for writing to the output output but should **not** perform
 *  any formatting of the output string, their role is to extract the
 *  relevant information; call a format function and write the result to
 *  the output appending newlines where necessary.
 *
 *  Render functions can access these methods using `this`.
 *
 *  These functions call the format functions using `this.format`.
 *
 *  @module writers
 */
var repeat = require('string-repeater')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter
  , EOL = require('os').EOL;

/**
 *  Write a heading at the specified level.
 *
 *  @function heading
 *  @param {String} val The value for the heading.
 *  @param {Number} level The level for the heading.
 */
function heading(val, level) {
  this.output.write(this.format.heading(val, level));
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
  this.output.write(repeat(EOL, num));
}

/**
 *  Write a fenced code block.
 *
 *  @function fenced
 *  @param {String} code The code content for the fenced block.
 *  @parma {String} lang A language for the info string.
 */
function fenced(code, lang) {
  this.output.write(this.format.fenced(code, lang));
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
    this.output.write(this.format.parameter(param));
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
  var deprecated = token.find(this.conf.DEPRECATED)
    , author = token.find(this.conf.AUTHOR)
    , version = token.find(this.conf.VERSION)
    , since = token.find(this.conf.SINCE)
    , license = token.find(this.conf.LICENSE)
    , todo = token.collect(this.conf.TODO)
    , hasMeta = Boolean(author || version || since || license);

  if(deprecated) {
    this.output.write(this.format.deprecated(deprecated));
    this.newline(2);
  }

  if(author) {
    this.output.write(this.format.meta(author, this.conf.AUTHOR));
    this.newline();
  }

  if(version) {
    this.output.write(this.format.meta(version, this.conf.VERSION));
    this.newline();
  }

  if(since) {
    this.output.write(this.format.meta(since, this.conf.SINCE));
    this.newline();
  }

  if(license) {
    this.output.write(this.format.meta(license, this.conf.LICENSE));
    this.newline();
  }

  if(todo.length) {
    this.newline();
    this.output.write(this.format.getTodo(todo));
  }

  if(hasMeta) {
    this.newline();
  }
}

/**
 *  Print the description for a token.
 *
 *  @function describe
 *  @param {Object} type The declaring type tag.
 *  @param {Object} token The current token.
 */
function describe(type, token) {
  var desc = token.describe(type);
  this.output.write(desc);
  if(desc) {
    this.newline(2);
  }
}

/**
 *  Write the list of see also links.
 *
 *  @function see
 *  @param {Object} token The current token.
 *  @param {Number} depth The current heading depth.
 */
function see(token, depth) {
  this.heading('See Also', depth)
  var all = token.collect(this.conf.SEE);
  function onSee(link) {
    if(link.name) {
      this.output.write(this.format.link(link));
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

util.inherits(Writer, EventEmitter);

/**
 *  Writer helper functions, an instance of this class is
 *  the scope for program execution and is decorated with additional
 *  fields when parse is called.
 *
 *  @constructor Writer
 *  @inherits EventEmitter
 */
function Writer() {
  EventEmitter.apply(this, arguments);
}

Writer.prototype.heading = heading;
Writer.prototype.newline = newline;
Writer.prototype.fenced = fenced;
Writer.prototype.signature = signature;
Writer.prototype.parameters = parameters;

Writer.prototype.meta = meta;
Writer.prototype.describe = describe;
Writer.prototype.see = see;
Writer.prototype.usage = usage;

module.exports = Writer;
