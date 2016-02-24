var util = require('util')
  , EventEmitter = require('events').EventEmitter;

/**
 *  A mock program module, using the @module tag sets the overall 
 *  title at the initial level setting.
 *
 *  @module API Documents
 *
 *  @see https://github.com/tmpfs/mdapi mdapi
 *  @see https://github.com/jgm/commonmark.js commonmark
 */

/**
 *  Mock class, you can add an extended description of the class behaviour here.
 *
 *  @class Component
 */

/**
 *  An abstract component.
 *
 *  @constructor Component
 *  @inherits EventEmitter
 *
 *  @param opts Component options.
 *
 *  @option enabled Whether the component is initially enabled.
 */
function Component(opts){
  opts = opts || {};
}

util.inherits(Component, EventEmitter);

/** 
 *  Do foo thing with bar.
 *
 *  @function foo
 *  @prototype
 *
 *  @param {Object} [opts] An options arguments.
 *  @param {Function} cb Callback function.
 *
 *  @option {Boolean} noop Dry run.
 */
function foo(opts, cb) {
  opts = opts || {};
  return cb();
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
 *  Sets the QUX variable.
 *
 *  @property QUX
 */
create.QUX = null;

/**
 *  Gets the ZAR variable.
 *
 *  @constant ZAR
 *  @default foo
 */
const ZAR = 'foo';

module.exports = create;
