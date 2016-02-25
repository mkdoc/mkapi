/**
 *  Every aspect of the program output may be modified by changing the 
 *  configuration variables.
 *
 *  @module conf
 */
var repeat = require('string-repeater')
  , EOL = require('os').EOL;

/**
 *  Gets a heading string.
 *
 *  @function heading
 *  @param {String} val The value for the heading.
 *  @param {Number} level The level for the heading.
 *
 *  @return formatted string.
 */
function heading(val, level) {
  return repeat('#', level) + ' ' + val; 
}

/**
 *  Gets a list item for the meta data.
 *
 *  @function meta
 *  @param {Object} val The value for the heading.
 *  @param {String} title A prefix for the meta item.
 *
 *  @return formatted string.
 */
function meta(tag, title) {
  return '* **' + title + '** `' + tag.name + '`'
}

/**
 *  Gets a fenced code block.
 *
 *  @function fenced
 *  @param {String} code The content for the code block.
 *  @param {String} info A language info string.
 *
 *  @return formatted string.
 */
function fenced(code, info) {
  var str = '```'; 
  if(typeof info === 'string') {
    str += info;
  }
  str += EOL + code + EOL;
  str += '```'; 
  return str;
}

/**
 *  Gets a deprecated notice.
 *
 *  @function tag
 *  @param {Object} tag The deprecated tag.
 *
 *  @return formatted string.
 */
function deprecated(tag) {
  return '> **Deprecated:** '
    + tag.name + ' ' + tag.description;
}

/**
 *  Gets a function signature.
 *
 *  @function signature
 *  @param {Array} params Collection of param tags.
 *
 *  @return formatted string.
 */
function signature(params) {
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
  return sig;
}

/**
 *  Gets a list item for parameter listings.
 *
 *  @function parameter
 *  @param {tag} tag The param tag.
 *
 *  @return formatted string.
 */
function parameter(tag) {
  var name = tag.name
    , type = '';
  if(tag.type) {
    type = tag.type + ' '; 
  }
  return '* `' + name + '` ' + type + tag.description;
}

/**
 *  Gets a link from a tag.
 *
 *  @function link 
 *  @param {tag} tag The see tag.
 *
 *  @return formatted string.
 */
function link(tag) {
  return '* [' + (tag.description || tag.name) + ']'
    + '(' + tag.name + ')';
}

var list = [
    'private',
    'module',
    'class',
    'constructor',
    'inherits',
    'function',
    'prototype',
    'static',
    'param',
    'return',
    'property',
    'constant',
    'default',
    'deprecated',
    'author',
    'version',
    'since',
    'see',
    'usage',
    'option',
    'throws'
  ]
  , header = {
      OPTIONS: 'Options',
      THROWS: 'Throws',

      // TODO: use these
      EVENTS: 'Events',
      RETURNS: 'Returns',
      DEPRECATED: 'Deprecated'
    }
  , format = {
      heading: heading,
      fenced: fenced,
      meta: meta,
      signature: signature,
      parameter: parameter,
      link: link,
      deprecated: deprecated 
    }
  , cues = {
      CONSTRUCTOR: ' < ',
      MEMBER: '.',
      STATIC: '#'
    };

// expose constants, accessible via: this.conf.CONSTANT
list.forEach(function(tag) {
  var nm = tag.toUpperCase();
  module.exports[nm] = tag;
})

module.exports.header = header;
module.exports.cues = cues;
module.exports.format = format;
module.exports.render = require('./render');

/**
 *  Default language for fenced code blocks.
 *
 *  @property {String} LANG
 *  @default javascript
 */
module.exports.LANG = 'javascript';
