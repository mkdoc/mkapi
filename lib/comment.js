/**
 *  Encapsulates operation on a comment AST token.
 *
 *  @class Comment
 *
 *  @param {Object} token The comment AST token to wrap.
 *  @param {Function} scope The execution scope.
 */
function Comment(token, scope) {
  // inherit properties from AST
  for(var k in token) {
    this[k] = token[k];
  }
  // tag cache
  this._cache = null;

  this.scope = scope;
  this.conf = scope.conf;
}

/**
 *  Builds a cache map of tags.
 *
 *  @private {Function}
 */
function cache() {
  var i
    , tag
    , id;
  if(!this._cache) {
    this._cache = {};
    // prevent conflict on constructor keyword
    this._cache.constructor = null;
    for(i = 0;i < this.tags.length;i++) {
      tag = this.tags[i];
      id = tag.tag;
      if(!this._cache[id]) {
        this._cache[id] = tag;
      }else if(Array.isArray(this._cache[id])) {
        this._cache[id].push(tag);
      }else{
        this._cache[id] = [this._cache[id], tag];
      }
    }
  }
  return this._cache;
}

/**
 *  Get the details (name, type tag and id) for this comment.
 *
 *  @param {Array} [names] Optional list of tag names to search for.
 *
 *  @returns {Object} an object with `name`, `type` and `id`.
 */
function getDetail(names) {
  var name = this.find(this.conf.NAME)
    , func = this.find(this.conf.FUNCTION)
        || this.find(this.conf.CLASS)
        || this.find(this.conf.CONSTRUCTOR)
    , prop = this.find(this.conf.PROPERTY)
    , mod = this.find(this.conf.MODULE)
    , usage = this.find(this.conf.USAGE)
    , type;

  // allows `@name {function} FunctionName`
  if(name && name.type && this.find(name.type)) {
    type = this.find(name.type);
  }

  type = mod || func || prop || usage;

  if(name && !type && name.type) {
    type = {tag: name.type};
  }

  // inject name into type declaration
  // `@name FunctionName\n@function`
  if(name && type && !type.name) {
    type.name = name.name; 
  }

  // test for custom tag renderer
  if(!type && names) {
    for(var i = 0;i < names.length;i++) {
      if(this.find(names[i])) {
        type = this.find(names[i]);
        break;
      }
    }
  }

  // `@function FunctionName`
  if(!name && type && type.name) {
    name = {name: type.name}; 
  }

  if(name && type) {
    return {name: name, type: type, id: type.tag};
  }
}

/**
 *  Gets an info object containing generic tag lookups.
 *
 *  If the `method` parameter is given the object is decorated with 
 *  fields specific to the `function` type.
 *
 *  @function getInfo
 *  @param {Boolean} method Inject function specific information.
 *
 *  @return an object with tag references.
 */
function getInfo(method) {
  var info = {
    // generic flags
    isModule: this.find(this.conf.MODULE),
    isClass: this.find(this.conf.CLASS),
    isStatic: this.find(this.conf.STATIC),
    isConstant: this.find(this.conf.CONSTANT),
    isPrivate: this.find(this.conf.PRIVATE),
    isPublic: this.find(this.conf.PUBLIC),
    isProtected: this.find(this.conf.PROTECTED),
    isReadOnly: this.find(this.conf.READ_ONLY),
    isMember: this.find(this.conf.MEMBER)
  };

  // method specific tags
  if(method) {
    info.isConstructor =  this.find(this.conf.CONSTRUCTOR);
    info.inherits =  this.find(this.conf.INHERITS);
    info.returns =  this.find(this.conf.RETURNS);
  }

  return info;
}

/**
 *  Finds the first tag in the tag list by tag id.
 *
 *  @function find
 *  @param {String} id The tag identifier.
 *
 *  @returns a tag or `null` if not found.
 */
function find(id) {
  var map = this.cache();
  if(map[id]) {
    return !Array.isArray(map[id]) ? map[id] : map[id][map[id].length - 1];
  }
  return null;
}

/** 
 *  Collects all tags with the specified id.
 *
 *  @function collect
 *  @param {String} id The tag identifier.
 *
 *  @returns an array of tags.
 */
function collect(id) {
  var map = this.cache();
  if(map[id]) {
    return Array.isArray(map[id]) ? map[id] : [map[id]];
  }
  return [];
}

Comment.prototype.cache = cache;

Comment.prototype.getDetail = getDetail;
Comment.prototype.getInfo = getInfo;
Comment.prototype.find = find;
Comment.prototype.collect = collect;

module.exports = Comment;
