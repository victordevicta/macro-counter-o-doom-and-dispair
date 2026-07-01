'use strict';
var noop = function () {};
var LogBox = {
  install: noop,
  uninstall: noop,
  ignoreLogs: noop,
  ignoreAllLogs: noop,
  clearAllLogs: noop,
  addException: noop,
  addLog: noop,
  isVisible: function () { return false; },
};
module.exports = {
  __esModule: true,
  default: LogBox,
  install: noop,
  uninstall: noop,
  ignoreLogs: noop,
  ignoreAllLogs: noop,
  clearAllLogs: noop,
  addException: noop,
};
