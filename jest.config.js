module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 10000, // Set a timeout to prevent tests hanging
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};
