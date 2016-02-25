/**
 *  Helper functions for working with AST comment tags.
 *
 *  These functions are available via a `tags` property on the scope for 
 *  render functions as well as writer functions which are bound to the 
 *  scope of the stream.
 *
 *  @module tags
 */
/**
 *  Finds a tag in the tag list by tag id.
 *
 *  @function findTag
 *  @param {String} id The tag identifier.
 *  @param {Object} token The current AST token.
 *
 *  @return a tag or `null` if not found.
 */
function findTag(id, token) {
  for(var i = 0;i < token.tags.length;i++) {
    if(token.tags[i].tag === id) {
      return token.tags[i]; 
    }
  }
  return null;
}

/** 
 *  Collects all tags with the specified id.
 *
 *  @function collect
 *  @param {String} id The tag identifier.
 *  @param {Object} token The current AST token.
 *
 *  @return an array of tags.
 */
function collect(id, token) {
  var o = []
    , i;
  for(i = 0;i < token.tags.length;i++) {
    if(token.tags[i].tag === id) {
      o.push(token.tags[i]);
    }
  }
  return o;
}

module.exports = {
  findTag: findTag,
  collect: collect
}
