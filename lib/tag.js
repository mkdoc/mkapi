/**
 *  Helper functions for finding tags.
 *
 *  @module tags
 */
/**
 *  Finds a tag in the tag list by tag id.
 *
 *  @function findTag
 *  @param id {String} The tag identifier.
 *  @param token {Object} The current AST token.
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
 *  @param id {String} The tag identifier.
 *  @param token {Object} The current AST token.
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
