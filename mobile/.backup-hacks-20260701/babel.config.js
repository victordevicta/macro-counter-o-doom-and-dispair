module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Transform class fields for Hermes in Expo Go (does not support class
      // field syntax natively in this SDK 54 build). No loose mode — loose mode
      // corrupts the class name binding and produces Property 'X' doesn't exist.
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-private-property-in-object',
      'react-native-reanimated/plugin',
    ],
  };
};
