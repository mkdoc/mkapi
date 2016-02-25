// find a tag
function findTag(name, ast) {
  for(var i = 0;i < ast.tags.length;i++) {
    if(ast.tags[i].tag === name) {
      return ast.tags[i]; 
    }
  }
}

// collect tags
function collect(name, ast) {
  var o = [];
  for(var i = 0;i < ast.tags.length;i++) {
    if(ast.tags[i].tag === name) {
      o.push(ast.tags[i]);
    }
  }
  return o;
}

module.exports = {
  findTag: findTag,
  collect: collect
}
