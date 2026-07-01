'use strict';
// Minimal stub for BatchedBridge/MessageQueue.
// The real class crashes in this Hermes build due to Flow-annotated class fields.
// At runtime Expo Go owns the bridge; this stub is only needed if the module is
// somehow included in the bundle despite BatchedBridge being redirected.
var noop = function () {};
var noopNull = function () { return null; };

function MessageQueue() {
  this._lazyCallableModules = {};
  this._queue = [[], [], [], 0];
  this._successCallbacks = new Map();
  this._failureCallbacks = new Map();
  this._callID = 0;
  this._lastFlush = 0;
  this._eventLoopStartTime = Date.now();
  this._reactNativeMicrotasksCallback = null;
}

MessageQueue.prototype.registerCallableModule = noop;
MessageQueue.prototype.registerLazyCallableModule = noop;
MessageQueue.prototype.getCallableModule = noopNull;
MessageQueue.prototype.enqueueNativeCall = noop;
MessageQueue.prototype.callNativeSyncHook = noopNull;
MessageQueue.prototype.createDebugLookup = noop;
MessageQueue.prototype.setReactNativeMicrotasksCallback = noop;
MessageQueue.prototype.getEventLoopRunningTime = function () { return 0; };
MessageQueue.prototype.flushedQueue = noopNull;
MessageQueue.prototype.invokeCallbackAndReturnFlushedQueue = noopNull;
MessageQueue.prototype.callFunctionReturnFlushedQueue = noopNull;
MessageQueue.spy = noop;

module.exports = { __esModule: true, default: MessageQueue };
