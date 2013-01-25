
var Logger = require('./logger')
  , events = require('events')
  , fs = require('fs');



function FSReporter() {
  events.EventEmitter.call(this);

  /**
   * @type {Array}
   * @private
   */
  this.paths_ = [];

  /**
   * @type {Array}
   * @private
   */
  this.fswatchers_ = [];

  /**
   * @type {Logger}
   * @private
   */
  this.logger_ = new Logger({
    colors: true,
    level: 2
  });
};
FSReporter.super_ = events.EventEmitter;
FSReporter.prototype = Object.create(events.EventEmitter.prototype, {
  constructor: {
    value: FSReporter,
    enumerable: false
  }
});
FSReporter.RED = '\033[31m';
module.exports = FSReporter;


/**
 * Start listening to changes on important files.
 * @param {Array} paths are the paths we need to listen to for changes.
 */
FSReporter.prototype.listen = function(paths) {
  this.paths_ = paths;

  var reporter = this;
  for (var k in paths) {
    var path = paths[k];
    var fswatcher = fs.watch(path, function(e, filename) {
      reporter.logger_.info('[FSReporter] Will report change to file');
      reporter.emit('change', { filename: filename });
    });

    this.fswatchers_.push(fswatcher);
  }
};


/**
 * Stop listening to all file changes.
 */
FSReporter.prototype.unlisten = function() {
  for (var fswatcher in this.fswatchers_) {
    fswatcher.close();
  }

  this.fswatchers_ = [];
};