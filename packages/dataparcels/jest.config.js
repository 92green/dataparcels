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
            statements: 98,
            branches: 93,
            functions: 99,
            lines: 98
        }
    }
};
