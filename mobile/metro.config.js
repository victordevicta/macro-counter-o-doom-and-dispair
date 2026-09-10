const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Some deps (e.g. zustand) ship an ESM build via "exports" that uses raw
// `import.meta`, which breaks Metro's CommonJS-wrapped web bundle. Force
// resolution to fall back to each package's CJS "main" entry instead.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
