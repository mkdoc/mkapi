/**
 *  Every aspect of the program output may be modified by changing the 
 *  configuration variables.
 *
 *  @module conf
 */
var repeat = require('string-repeater')
  , EOL = require('os').EOL;

function heading(val, level) {
  return repeat('#', level) + ' ' + val; 
}

function fenced(code, lang) {
  var str = '```'; 
  if(typeof lang === 'string') {
    str += lang;
  }
  str += EOL + code + EOL;
  str += '```'; 
  return str;
}

function deprecated(tag) {
  return '> **Deprecated:** '
    + tag.name + ' ' + tag.description;
}

function parameter(tag) {
  var name = tag.name
    , type = '';
  if(tag.type) {
    type = tag.type + ' '; 
  }
  return '* `' + name + '` ' + type + tag.description;
}

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
      parameter: parameter,
      link: link,
      deprecated: deprecated 
    }
  , cues = {
    CONSTRUCTOR: ' < ',
    MEMBER: '.',
    STATIC: '#'
  };

// expose constants
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
