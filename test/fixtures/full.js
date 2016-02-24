var util = require('util')
  , EventEmitter = require('events').EventEmitter;

/**
 *  An abstract component.
 *
 *  @constructor Component
 *
 *  @inherits EventEmitter
 *
 *  @see https://github.com/tmpfs/mdapi
 */
function Component(opts){
  opts = opts || {};
}

util.inherits(Component, EventEmitter);

/** 
 *  Do foo thing with bar.
 *
 *  @function foo
 *  @prototype Component
 *
 *  @param {String} bar A bar argument.
 */
function foo(bar) {
  console.log(bar);
}

Component.prototype.foo = foo;

/**
 *  Create a new component.
 *
 *  @function create
 */
function create(opts) {
  return new Component(opts);
}

/**
 *  A property with a default value.
 *
 *  @property FIELD
 *
 *  @default baz
 */
Component.FIELD = 'baz';

/**
 *  An anonymous function, this will be ignored due to missing 
 *  function name.
 *
 *  @function
 */

/* jshint ignore:start */
function anon(){}
/* jshint ignore:end */

module.exports = create;
