'use strict';
// Stub for createPerformanceLogger — replaces the whole chain that crashes
// in Expo Go (Old Architecture) where global.performance / nativeQPLTimestamp
// are not available.
var noop = function () {};
var perfLogger = {
  addTimespan: noop,
  append: noop,
  clear: noop,
  clearCompleted: noop,
  close: noop,
  currentTimestamp: function () { return Date.now(); },
  getExtras: function () { return {}; },
  getPoints: function () { return {}; },
  getPointExtras: function () { return {}; },
  getTimespans: function () { return {}; },
  hasTimespan: function () { return false; },
  isClosed: function () { return false; },
  logEverything: noop,
  markPoint: noop,
  removeExtra: function () { return null; },
  setExtra: noop,
  startTimespan: noop,
  stopTimespan: noop,
};

module.exports = {
  __esModule: true,
  default: function createPerformanceLogger() { return perfLogger; },
  getCurrentTimestamp: function () { return Date.now(); },
};
