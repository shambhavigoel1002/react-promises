// jest.config.js
module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // Transpile JavaScript files using Babel
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)", // Ensure Jest transforms axios and other ES module-based libraries
  ],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy", // Mock CSS imports for testing
  },
};
