/* eslint-disable */
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    "@components/(.*)$": "<rootDir>/src/components/$1",
    "@/(.*)$": "<rootDir>/$1",
    "\\.(css)$": "<rootDir>/__test__/mocks/styleMock.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__test__/mocks/fileMock.js"
  },
  setupFilesAfterEnv: ["../jest.setup.js"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "css"],
  modulePaths: ["<rootDir>"],
  rootDir: "./src",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  testEnvironment: "jsdom",
  transform: {
    "\\.[jt]sx?$": "babel-jest"
  }
};
