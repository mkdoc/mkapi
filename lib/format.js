/**
 *  Provides string format functions.
 *
 *  @module format
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
 *  @param {Object} tag The param tag.
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
 *  @param {Object} tag The returns tag.
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
 *  @param {Object} tag The see tag.
 *
 *  @returns formatted string.
 */
function link(tag) {
  return '* [' + (tag.description || tag.name) + ']'
    + '(' + tag.name + ')';
}

/**
 *  Gets the access modifier for a symbol.
 *  
 *  @function getAccess
 *  @param {Object} opts Format options describing the symbol.
 *
 *  @returns {String} the access for the symbol.
 */
function getAccess(opts) {
  var prop = opts.isPublic || opts.isProtected || opts.isPrivate
    , parts = [];

  if(prop) {
    parts.push(prop.tag);
  }

  if(opts.isStatic) {
    parts.push(opts.isStatic.tag);
  }

  if(opts.isReadOnly) {
    parts.push(opts.isReadOnly.tag);
  }

  return parts.join(' ') + ' ';
}

/**
 *  Gets a property code string.
 *
 *  @function property
 *  @param {String} tag The declaring tag.
 *  @param {Object} opts Format options describing the property.
 *
 *  @returns formatted string.
 */
function property(tag, opts) {
  var str = tag.name
    , value = opts.value
    , flag = getAccess(opts);

  // set a default value
  if(value) {
    str += ' = ' + value.name + ';'
  }

  if(opts.isConstant) {
    str = 'const ' + (value || str);
  }

  if(flag) {
    str = flag + str;
  }

  return str;
}

/**
 *  Gets the inheritance string for a class or constructor.
 *
 *  @function inherits
 *  @param {Object} tag The declaring tag.
 *  @param {Object} opts Format options describing the function.
 */
function inherits(tag, opts) {
  var title = tag.name;
  // method inheritance
  title += this.conf.cues.CONSTRUCTOR + opts.inherits.name;
  // multiple levels of inheritance
  if(opts.inherits.description) {
    title += this.conf.cues.CONSTRUCTOR
      + opts.inherits.description.split(/\s+/)
          .join(this.conf.cues.CONSTRUCTOR);
  }
  return title;
}


/**
 *  Gets the heading title for a function.
 *
 *  @function method
 *  @param {Object} tag The declaring tag.
 *  @param {Object} opts Format options describing the function.
 *  @param {String} [title] An existing title for the function.
 */
function method(tag, opts, title) {
  var sig = tag.name
    , flag = getAccess(opts);

  title = title || tag.name

  // visual cues on the heading title
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
  }else if(opts.isMember && opts.isMember.name) {
    sig = opts.isMember.name + '.prototype.' + tag.name;
  }

  if(flag && !opts.isConstructor) {
    sig = flag + sig;
  }

  return {title: title, signature: sig};
}

function getTodo(items) {
  var str = ''
    , i
    , item;

  for(i = 0;i < items.length;i++) {
    item = items[i];
    str += '* `' + (item.type || 'TODO')
      + '` ' + item.name + ' ' + item.description + EOL;
  }
  return str;
}

module.exports = {
  heading: heading,
  fenced: fenced,
  meta: meta,
  signature: signature,
  property: property,
  method: method,
  parameter: parameter,
  returns: returns,
  link: link,
  inherits: inherits,
  deprecated: deprecated,

  getAccess: getAccess,
  getTodo: getTodo
}
