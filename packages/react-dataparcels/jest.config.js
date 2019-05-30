// @flow
module.exports = {
    preset: 'blueflag-test',
    collectCoverageFrom: [
        "src/**/*.{js,jsx}",
        "*.{js,jsx}",
        "!jest.config.js"
    ],
    testMatch: ["**/__test__/**/*-test.js?(x)"],
    testURL: 'http://localhost',
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
        }
    }
};
