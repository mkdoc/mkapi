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
  include = {}
  // meta data
  , AUTHOR = 'author'
  , VERSION = 'version'
  , SINCE = 'since'
  , LICENSE = 'license'
  
  // notices
  , DEPRECATED = 'deprecated'
  , TODO = 'todo'
  , USAGE = 'usage'
  , SEE = 'see'

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
  , INHERITS = 'inherits'

  // functions
  , MEMBER = 'member'
  , PARAM = 'param'
  , THROWS = 'throws'
  , OPTION = 'option'
  , RETURNS = 'returns'
  , EVENT = 'event'

  // property
  , DEFAULT = 'default';

// disable include of private variables
include[PRIVATE] = false;
include[PROTECTED] = true;

// export everything
module.exports = {

  /**
   *  List of default tag names.
   *
   *  @property {Array<String>} names
   */
  names : [
      // meta
      AUTHOR,
      VERSION,
      SINCE,
      LICENSE,

      // notices
      DEPRECATED,
      TODO,
      SEE,
      USAGE,

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
      INHERITS,

      // functions
      MEMBER,
      PARAM,
      THROWS,
      OPTION,
      RETURNS,
      EVENT,

      // property
      DEFAULT
    ]

  /**
   *  Variables for headings and notices, eg: `Deprecated`.
   *
   *  @property {Object} title
   */
  , title: {
      OPTIONS: 'Options',
      THROWS: 'Throws',
      // TODO: use @events
      EVENTS: 'Events',
      RETURNS: 'Returns',
      DEPRECATED: 'Deprecated',
      // TODO: use @todo 
      TODO: 'To Do'
    }

  /**
   *  List of tag names that support the shorthand symbol type.
   *
   *  @property {Array} shorthand
   */
  , shorthand: [
      NAME,
      MEMBER,
      STATIC,
      CONSTANT,
      PUBLIC,
      PRIVATE,
      PROTECTED,
      READONLY
    ]

  /**
   *  Map of format functions.
   *
   *  @property {Object} format
   *
   *  @see #formats formats module
   */
  , format: require('./format')

  /**
   *  Map of variables for visual cues.
   *
   *  @property {Object} cues
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
   *
   *  @see #render render module
   */
  , render: require('./render')

  /**
   *  Map of symbol types to include.
   *
   *  @property {Object} include
   */
  , include: include

  /**
   *  Default language for fenced code blocks.
   *
   *  @property {String} LANG
   *  @default javascript
   */
  , LANG: 'javascript'
}
