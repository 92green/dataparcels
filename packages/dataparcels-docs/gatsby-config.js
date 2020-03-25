// @flow
const {gatsbyConfig} = require('dcme-gatsby/src/gatsby/gatsby-config');

module.exports = {
    siteMetadata: {
        title: 'Dataparcels - A library for editing data structures that works really well with React.'
    },
    pathPrefix: '/dataparcels',
    ...gatsbyConfig({
        compileModules: [`dcme-gatsby`, `dcme-style`]
    })
};
