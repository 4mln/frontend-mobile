const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts.push(
  // Add any additional asset extensions your app uses
  'db',
  'mp3',
  'ttf',
  'obj',
  'png',
  'jpg'
);

// Configure transformer for better web support
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Web-specific configuration
if (process.env.EXPO_PLATFORM === 'web') {
  config.resolver.platforms = ['web', 'native', 'ios', 'android'];
}

module.exports = config;
