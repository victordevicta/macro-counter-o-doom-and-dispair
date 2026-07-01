'use strict';
// Stub for BatchedBridge/BatchedBridge.js
// In Expo Go, native modules are accessed via global.nativeModuleProxy (New Architecture)
// or native-side __fbBatchedBridge. The JS-side MessageQueue class crashes due to
// Flow-annotated class fields in this Hermes build. A no-op stub is safe here.
var noop = function () {};
var noopNull = function () { return null; };

var BatchedBridge = {
  registerCallableModule: noop,
  registerLazyCallableModule: noop,
  getCallableModule: noopNull,
  enqueueNativeCall: noop,
  callNativeSyncHook: noopNull,
  createDebugLookup: noop,
  setReactNativeMicrotasksCallback: noop,
  getEventLoopRunningTime: function () { return 0; },
  flushedQueue: noopNull,
  invokeCallbackAndReturnFlushedQueue: noopNull,
  callFunctionReturnFlushedQueue: noopNull,
  spy: noop,
};

// Expose on global so native can find it if needed.
if (typeof global !== 'undefined' && !global.__fbBatchedBridge) {
  global.__fbBatchedBridge = BatchedBridge;
}

module.exports = { __esModule: true, default: BatchedBridge };
