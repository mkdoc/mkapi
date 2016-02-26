/**
 *  Every aspect of the program output may be modified by changing the 
 *  configuration variables.
 *
 *  Constants representing each of the recognised tags are exposed on this 
 *  module, for example: `this.conf.MODULE` yields `module`.
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
 *  @returns formatted string.
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
 *  @returns formatted string.
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
 *  @returns formatted string.
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
 *  @function deprecated
 *  @param {Object} tag The deprecated tag.
 *
 *  @returns formatted string.
 */
function deprecated(tag) {
  return '> **' + this.conf.title.DEPRECATED + ':** '
    + tag.name + ' ' + tag.description;
}

/**
 *  Gets a function signature.
 *
 *  @function signature
 *  @param {Array} params Collection of param tags.
 *
 *  @returns formatted string.
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
 *  @returns formatted string.
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
 *  Gets a returns statement.
 *
 *  @function returns
 *  @param {tag} tag The returns tag.
 *
 *  @returns formatted string.
 */
function returns(tag) {
  return this.conf.title.RETURNS
    + ' ' + tag.name + ' ' + tag.description
}

/**
 *  Gets a link from a tag.
 *
 *  @function link 
 *  @param {tag} tag The see tag.
 *
 *  @returns formatted string.
 */
function link(tag) {
  return '* [' + (tag.description || tag.name) + ']'
    + '(' + tag.name + ')';
}

/**
 *  Gets a property code string.
 *
 *  @function property
 *  @param {tag} tag The declaring tag.
 *  @param {tag} value A tag containing a value for the property.
 *
 *  @returns formatted string.
 */
function property(tag, value, fixed) {
  var str = tag.name;

  // set a default value
  if(value) {
    str += ' = ' + value.name + ';'
    if(fixed) {
      str = 'const ' + value;
    }
  }
  return str;
}

/**
 *  Gets the heading title for a function.
 *
 *  @function method
 *  @param {Object} tag The declaring tag.
 *  @param {Object} opts Format options describing the function.
 */
function method(tag, opts) {
  var title = tag.name
    , sig = tag.name
    , className;

  // method inheritance
  if(opts.inherits) {
    title += this.conf.cues.CONSTRUCTOR + opts.inherits.name;
    // multiple levels of inheritance
    if(opts.inherits.description) {
      title += this.conf.cues.CONSTRUCTOR
        + opts.inherits.description.split(/\s+/)
            .join(this.conf.cues.CONSTRUCTOR);
    }
  }

  // visual cues
  if(opts.isStatic) {
    title = this.conf.cues.STATIC + tag.name; 
  }else if(opts.isMember) {
    title = this.conf.cues.MEMBER + tag.name; 
  }

  // code signature
  if(opts.isConstructor) {
    sig = 'new ' + tag.name; 
  }else if(opts.isStatic) {
    sig = 'static ' + 
      (tag.description ? tag.description + '.' + tag.name : tag.name); 
  }else if(opts.isMember) {
    //if(opts.currentClass) {
      //className = opts.currentClass.name; 
    //}
    if(opts.isMember.name) {
      className = opts.isMember.name; 
    }
    if(className) {
      sig = className + '.prototype.' + tag.name;
    }
  }

  return {title: title, signature: sig};
}

var names = [
    'name',
    'private',
    'public',
    'protected',
    'readonly',
    'module',
    'class',
    'constructor',
    'inherits',
    'function',
    'member',
    'static',
    'param',
    'returns',
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
  , format = {
      heading: heading,
      fenced: fenced,
      meta: meta,
      signature: signature,
      property: property,
      method: method,
      parameter: parameter,
      returns: returns,
      link: link,
      deprecated: deprecated 
    }
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

/**
 *  Default language for fenced code blocks.
 *
 *  @property {String} LANG
 *  @default javascript
 */
module.exports.LANG = 'javascript';
