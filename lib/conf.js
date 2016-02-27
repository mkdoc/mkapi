/**
 *  Every aspect of the program output may be modified by changing the 
 *  configuration variables.
 *
 *  Constants representing each of the recognised tags are exposed on this 
 *  module, for example: `this.conf.MODULE` yields `module`.
 *
 *  @module conf
 */

var
  // meta data
  AUTHOR = 'author'
  , VERSION = 'version'
  , SINCE = 'since'
  , LICENSE = 'license'
  
  // notices
  , DEPRECATED = 'deprecated'
  , TODO = 'todo'

  // symbols / types
  , NAME = 'name'
  , MODULE = 'module'
  , CLASS = 'class'
  , CONSTRUCTOR = 'constructor'
  , FUNCTION = 'function'
  , PROPERTY = 'property'

  // modifiers
  , STATIC = 'static'
  , CONSTANT = 'constant'
  , PUBLIC = 'public'
  , PRIVATE = 'private'
  , PROTECTED = 'protected'
  , READONLY = 'readonly'

module.exports = {
  names : [
      // meta
      AUTHOR,
      VERSION,
      SINCE,
      LICENSE,

      // notices
      DEPRECATED,
      TODO,

      // symbols / types
      NAME,
      MODULE,
      CLASS,
      CONSTRUCTOR,
      FUNCTION,
      PROPERTY,

      // modifiers
      STATIC,
      CONSTANT,
      PUBLIC,
      PRIVATE,
      PROTECTED,
      READONLY,

      // functions
      'member',
      'param',
      'throws',
      'option',
      'returns',

      // property
      'default',

      'see',
      'usage',

      // class or constructor
      'inherits'
    ]
  /**
   *  Variables for headings and notices, eg: `Deprecated`.
   *
   *  @property title
   */
  , title: {
      OPTIONS: 'Options',
      THROWS: 'Throws',
      // TODO: use events
      EVENTS: 'Events',
      RETURNS: 'Returns',
      DEPRECATED: 'Deprecated',
      TODO: 'To Do'
    }

  /**
   *  List of tag names that support the shorthand symbol type.
   *
   *  @property {Array} shorthand
   */
  , shorthand: [
      NAME,
      STATIC,
      CONSTANT,
      PUBLIC,
      PRIVATE,
      PROTECTED
    ]

  /**
   *  Map of format functions.
   *
   *  @property {Object} format
   */
  , format: require('./format')
  /**
   *  Map of variables for visual cues.
   *
   *  @property cues
   */
  , cues: {
      CONSTRUCTOR: ' < ',
      MEMBER: '.',
      STATIC: '#'
    }
  /**
   *  Map of render functions.
   *
   *  @property {Object} render
   */
  , render: require('./render')

  /**
   *  Default language for fenced code blocks.
   *
   *  @property {String} LANG
   *  @default javascript
   */
  , LANG: 'javascript'
}
