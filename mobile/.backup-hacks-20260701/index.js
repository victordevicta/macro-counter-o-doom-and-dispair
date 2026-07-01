// Polyfill globals missing from this Expo Go Hermes build.
// Must use require() — import statements are hoisted and would run AFTER this.
if (typeof global.DOMException === 'undefined') {
  global.DOMException = class DOMException extends Error {
    constructor(message, name) {
      super(message);
      this.name = name || 'DOMException';
    }
  };
}

require('react-native-gesture-handler');
const { registerRootComponent } = require('expo');
const App = require('./App').default;

registerRootComponent(App);
