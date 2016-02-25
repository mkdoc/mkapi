/**
 *  Every aspect of the program output may be modified by changing the 
 *  configuration variables.
 *
 *  @module conf
 */
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

module.exports.render = require('./render');

/**
 *  Default language for fenced code blocks.
 *
 *  @property {String} LANG
 *  @default javascript
 */
module.exports.LANG = 'javascript';
