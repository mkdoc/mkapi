/**
 *  Every aspect of the program output may be modified by changing the 
 *  configuration variables.
 *
 *  Constants representing each of the recognised tags are exposed on this 
 *  module, for example: `this.conf.MODULE` yields `module`.
 *
 *  @module conf
 */
var AUTHOR = 'author'
  , VERSION = 'version'
  , SINCE = 'since'
  , LICENSE = 'license'
  , NAME = 'name'
  , STATIC = 'static'
  , CONSTANT = 'constant'
  , PUBLIC = 'public'
  , PRIVATE = 'private'
  , PROTECTED = 'protected'
  , names = [
      // meta
      AUTHOR,
      VERSION,
      SINCE,
      LICENSE,

      // symbols
      NAME,
      STATIC,
      CONSTANT,
      PUBLIC,
      PRIVATE,
      PROTECTED,
      'readonly',
      'module',
      'class',
      'constructor',
      'inherits',
      'function',
      'member',
      'param',
      'returns',
      'property',
      'default',
      'deprecated',
      'see',
      'usage',
      'option',
      'throws'
    ]
  /**
   *  Variables for headings and notices, eg: `Deprecated`.
   *
   *  @property title
   */
  , title = {
      OPTIONS: 'Options',
      THROWS: 'Throws',
      // TODO: use events
      EVENTS: 'Events',
      RETURNS: 'Returns',
      DEPRECATED: 'Deprecated'
    }
  /**
   *  Map of format functions.
   *
   *  @property format
   */
  , format = require('./format')
  /**
   *  Map of variables for visual cues.
   *
   *  @property cues
   */
  , cues = {
      CONSTRUCTOR: ' < ',
      MEMBER: '.',
      STATIC: '#'
    };

// expose constants, accessible via: this.conf.CONSTANT
//list.forEach(function(tag) {
  //var nm = tag.toUpperCase();
  //module.exports[nm] = tag;
//})

module.exports.names = names;
module.exports.title = title;
module.exports.cues = cues;
module.exports.format = format;
module.exports.render = require('./render');

// default shorthands
module.exports.shorthand = [
  NAME,
  STATIC,
  CONSTANT,
  PUBLIC,
  PRIVATE,
  PROTECTED
];

/**
 *  Default language for fenced code blocks.
 *
 *  @property {String} LANG
 *  @default javascript
 */
module.exports.LANG = 'javascript';
