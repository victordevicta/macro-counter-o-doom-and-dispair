const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Inject our polyfills before react-native's environment setup runs.
const originalGetPolyfills = config.serializer.getPolyfills ?? (() => []);
config.serializer.getPolyfills = (ctx) => [
  path.join(__dirname, 'polyfills.js'),
  ...originalGetPolyfills(ctx),
];

// Only force-transpile react-native ecosystem packages (needed for private class fields).
config.transformer.transformIgnorePatterns = [
  'node_modules/(?!(' + [
    'react-native',
    '@react-native',
    '@react-native-async-storage',
    'expo',
    '@expo',
    'react-native-screens',
    'react-native-safe-area-context',
    'react-native-gesture-handler',
    'react-native-reanimated',
    'react-native-svg',
    'react-native-toast-message',
    'react-native-animatable',
    'react-native-chart-kit',
    'react-native-modal',
    'react-native-skeleton-placeholder',
  ].join('|') + '))',
];

// Stub out RN 0.81.5 New Architecture web API setup modules that crash on Expo Go (Old Architecture).
// These modules reference globals (PerformanceEntry, DOMException, etc.) that don't exist in Hermes/Expo Go.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Stub modules that crash in Expo Go (Old Architecture / limited Hermes).
  // setUpPerformance → imports Performance API chain (PerformanceEntry with # fields)
  // setUpReactDevTools / setUpDeveloperTools → Fusebox/New Arch debugger classes
  // LogBox (entire library) → LogBoxLog has Flow-annotated class fields that crash
  //   in Hermes; Expo Go has its own error overlay.
  //   LogBox/LogBox (main module) needs a proper API stub with install/addException/etc.
  //   All other LogBox internals (LogBoxLog, LogBoxData, …) get the noop.
  if (
    moduleName.includes('/LogBox/LogBox') ||
    moduleName.includes('\\LogBox\\LogBox')
  ) {
    return { type: 'sourceFile', filePath: path.join(__dirname, 'stubs/logbox.js') };
  }
  if (
    moduleName.includes('setUpPerformance') ||
    moduleName.includes('setUpReactDevTools') ||
    moduleName.includes('setUpDeveloperTools') ||
    moduleName.includes('setUpLogBox') ||
    moduleName.includes('/LogBox/') ||
    moduleName.includes('\\LogBox\\') ||
    moduleName.includes('FuseboxSessionObserver') ||
    (moduleName.includes('react-native/src/private/webapis/performance') &&
      !moduleName.includes('NativePerformance'))
  ) {
    return { type: 'sourceFile', filePath: path.join(__dirname, 'stubs/noop.js') };
  }
  // BatchedBridge + MessageQueue crash in this Hermes build (Flow-annotated class fields).
  // Expo Go native side owns the bridge; NativeModules uses nativeModuleProxy.
  if (
    moduleName.includes('BatchedBridge/BatchedBridge') ||
    moduleName.includes('BatchedBridge\\BatchedBridge')
  ) {
    return { type: 'sourceFile', filePath: path.join(__dirname, 'stubs/batched-bridge.js') };
  }
  if (
    moduleName.includes('BatchedBridge/MessageQueue') ||
    moduleName.includes('BatchedBridge\\MessageQueue') ||
    moduleName === './MessageQueue'
  ) {
    return { type: 'sourceFile', filePath: path.join(__dirname, 'stubs/message-queue.js') };
  }
  // Stub createPerformanceLogger — crashes because global.performance isn't
  // set up (setUpPerformance is stubbed above). GlobalPerformanceLogger.js
  // calls our factory and gets a proper no-op logger object.
  if (moduleName.includes('createPerformanceLogger')) {
    return { type: 'sourceFile', filePath: path.join(__dirname, 'stubs/perf-logger.js') };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
