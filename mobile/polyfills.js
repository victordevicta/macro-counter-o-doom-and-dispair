'use strict';

// Polyfill LogBoxLog as a no-op so any module that references it as a global
// (due to Flow-annotated class field mis-compilation) doesn't crash.
if (typeof global.LogBoxLog === 'undefined') {
  global.LogBoxLog = function LogBoxLog() {};
}

// SyntheticError is exported from ExceptionsManager.js but referenced as a global
// in Flow-annotated class fields of other modules (Babel mis-compiles `: SyntheticError`
// type annotation as an initializer that reads `SyntheticError` from global scope).
if (typeof global.SyntheticError === 'undefined') {
  global.SyntheticError = function SyntheticError(message) {
    this.message = message || '';
    this.name = '';
    var err = new Error(this.message);
    this.stack = err.stack;
  };
  global.SyntheticError.prototype = Object.create(Error.prototype);
  global.SyntheticError.prototype.constructor = global.SyntheticError;
}

// Polyfill DOMException for Expo Go Hermes builds that don't expose it globally.
// This runs before react-native's setUpDefaultReactNativeEnvironment.
if (typeof global.DOMException === 'undefined') {
  var DOMExceptionPolyfill = function DOMException(message, name) {
    this.message = message || '';
    this.name = name || 'Error';
    var error = new Error(this.message);
    this.stack = error.stack;
  };
  DOMExceptionPolyfill.prototype = Object.create(Error.prototype);
  DOMExceptionPolyfill.prototype.constructor = DOMExceptionPolyfill;
  global.DOMException = DOMExceptionPolyfill;
}
