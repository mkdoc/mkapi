var util = require('util')
  , EventEmitter = require('events').EventEmitter;

/**
 *  This is mock code to verify the program output.
 *
 *  @module API Documents
 *
 *  @see https://github.com/tmpfs/mdapi mdapi
 *  @see https://github.com/jgm/commonmark.js commonmark
 */

/**
 *  An abstract component.
 *
 *  @constructor Component
 *
 *  @inherits EventEmitter
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
 *  Sets the BAZ variable.
 *
 *  @property BAZ
 *  @default baz
 */
Component.BAZ= 'baz';

/**
 *  An anonymous function, this will be ignored due to missing 
 *  function name.
 *
 *  @function
 */

/* jshint ignore:start */
function anon(){}
/* jshint ignore:end */

/**
 *  Sets the QUX variable.
 *
 *  @property QUX
 */
create.QUX = null;

module.exports = create;
