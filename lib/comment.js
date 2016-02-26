/**
 *  Encapsulates operation on a comment AST token.
 *
 *  @class Comment
 */
function Comment(token) {
  for(var k in token) {
    this[k] = token[k];
  }
}

/**
 *  Get the tag that defines the name for the token.
 */
function getName() {

  return null;
}

/**
 *  Finds a tag in the tag list by tag id.
 *
 *  @function find
 *  @param {String} id The tag identifier.
 *
 *  @returns a tag or `null` if not found.
 */
function find(id) {
  for(var i = 0;i < this.tags.length;i++) {
    if(this.tags[i].tag === id) {
      return this.tags[i]; 
    }
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
  var o = []
    , i;
  for(i = 0;i < this.tags.length;i++) {
    if(this.tags[i].tag === id) {
      o.push(this.tags[i]);
    }
  }
  return o;
}

Comment.prototype.getName = getName;
Comment.prototype.find = find;
Comment.prototype.collect = collect;

module.exports = Comment;
