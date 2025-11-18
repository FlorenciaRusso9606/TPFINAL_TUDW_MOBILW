const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// ⚠️ Extender, NO reemplazar
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  "svg",
];

config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  "svg",
];

module.exports = config;
