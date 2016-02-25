var list = [
    'private',
    'module',
    'class',
    'constructor',
    'inherits',
    'function',
    'prototype',
    'static',
    'param',
    'return',
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
  , header = {
    OPTIONS: 'Options',
    THROWS: 'Throws',
    EVENTS: 'Events'
  }
  , cues = {
    CONSTRUCTOR: ' < ',
    MEMBER: '.',
    STATIC: '#'
  },
  tags = {};

// expose constants
list.forEach(function(tag) {
  var nm = tag.toUpperCase();
  tags[nm] = tag;
  module.exports[nm] = tag;
})

module.exports.header = header;
module.exports.cues = cues;
module.exports.tags = tags;
