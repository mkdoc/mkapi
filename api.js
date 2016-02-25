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

list.forEach(function(tag) {
  tags[tag.toUpperCase()] = tag;
})

module.exports = {
  header: header,
  cues: cues,
  tags: tags
}
